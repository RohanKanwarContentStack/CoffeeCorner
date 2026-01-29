/**
 * ChatBot - Minimal product assistant for CoffeeCorner.
 * Ask about drinks/pastries, categories, recommendations, or search.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getAllProducts,
  getProductsByCategory,
  getAllCategories,
  searchProducts,
} from '../services/dataService';

const AUTOMATIONS_API_URL = process.env.REACT_APP_AUTOMATIONS_API_URL || '';
const FALLBACK_TEXT = 'I didn\'t understand. Try: "Tell me about Espresso", "Recommend hot drinks", or "What categories are there?"';

const STOP_WORDS = ['recommend', 'suggest', 'drink', 'drinks', 'pastry', 'pastries', 'item', 'items', 'about', 'on', 'a', 'an', 'the', 'with', 'in', 'for', 'to'];

const extractKeywords = (message) => {
  const words = message.toLowerCase().split(' ');
  return words.filter((word) => word.length > 2 && !STOP_WORDS.includes(word));
};

const searchByTopic = (keywords) => {
  const products = getAllProducts();
  const scored = products.map((product) => {
    let score = 0;
    const text = `${product.title} ${product.description || ''}`.toLowerCase();
    keywords.forEach((keyword) => {
      if (product.title?.toLowerCase().includes(keyword)) score += 10;
      if (product.description?.toLowerCase().includes(keyword)) score += 5;
    });
    return { ...product, score };
  });
  return scored.filter((p) => p.score > 0).sort((a, b) => b.score - a.score);
};

/** True only when we can answer from local data (categories, recommend by category, tell me about product, or direct product name). */
const isInRequiredFormat = (message) => {
  const lower = message.toLowerCase().trim();
  if (!lower) return false;

  if ((lower.includes('categor') || lower.includes('available') || lower.includes('what') || lower.includes('list')) && (lower.includes('categor') || lower.includes('available') || lower.includes('there') || lower.includes('list'))) {
    return true;
  }
  if (lower.includes('recommend') || lower.includes('suggest')) {
    const categories = getAllCategories();
    for (const cat of categories) {
      if (lower.includes(cat.name.toLowerCase()) || lower.includes(cat.slug)) return true;
    }
    const keywords = extractKeywords(lower);
    if (keywords.length > 0 && searchByTopic(keywords).length > 0) return true;
    if (lower.includes('similar')) return true;
    return false;
  }
  if (lower.includes('tell me about') || lower.includes('what is') || lower.includes('about ')) {
    let term = message;
    if (lower.includes('tell me about')) term = message.split(/tell me about/i)[1]?.trim() || message;
    else if (lower.includes('what is')) term = message.split(/what is/i)[1]?.trim() || message;
    else if (lower.includes('about ')) term = message.split(/about/i)[1]?.trim() || message;
    if (searchProducts(term).length > 0) return true;
    return false;
  }
  if (searchProducts(message).length > 0) return true;
  return false;
};

const ChatBot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Need help? Ask for a drink or pastry, or say what you\'re in the mood for.\n\n• Tell me about [name]\n• Recommend a [Hot Drinks / Cold Drinks / Pastries]\n• Suggest something [chocolate / espresso / etc.]\n• What categories are there?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastProductRef = useRef(null);

  const hideOnPaths = ['/', '/login', '/signup', '/forgot-password'];
  const isHidden = hideOnPaths.some((p) => location.pathname === p);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const callAutomationsApi = async (message) => {
    if (!AUTOMATIONS_API_URL) return FALLBACK_TEXT;
    try {
      const res = await fetch(AUTOMATIONS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) return FALLBACK_TEXT;
      const text = await res.text();
      let result = null;
      try {
        const data = JSON.parse(text);
        result = data?.result;
      } catch {
        result = text;
      }
      if (result && typeof result === 'string' && !result.includes('currently being tested or not activated')) {
        return result;
      }
    } catch (err) {
      console.warn('Automations API fallback failed:', err);
    }
    return FALLBACK_TEXT;
  };

  const processMessage = async (message) => {
    if (!isInRequiredFormat(message)) {
      return callAutomationsApi(message);
    }

    const lower = message.toLowerCase().trim();

    if ((lower.includes('categor') || lower.includes('available') || lower.includes('what') || lower.includes('list')) && (lower.includes('categor') || lower.includes('available') || lower.includes('there') || lower.includes('list'))) {
      const categories = getAllCategories();
      if (categories.length > 0) {
        const list = categories.map((c) => c.name).join(', ');
        return `**Categories**\n\n${list}\n\nAsk for a recommendation in any category.`;
      }
      return 'Unable to load categories. Try again.';
    }

    if (lower.includes('recommend') || lower.includes('suggest')) {
      if (lower.includes('similar')) {
        const last = lastProductRef.current;
        if (last?.category?.slug) {
          const same = getProductsByCategory(last.category.slug).filter((p) => p.uid !== last.uid);
          if (same.length > 0) {
            const top = same.slice(0, 5);
            let out = `**Similar to ${last.title}**\n\n`;
            top.forEach((p, i) => {
              out += `${i + 1}. **${p.title}** — $${p.price?.toFixed(2) ?? '—'}\n`;
            });
            out += '\nAsk for details on any item above.';
            return out;
          }
          return `No similar items found for ${last.title}.`;
        }
        return 'Ask about a specific item first (e.g. "Tell me about Espresso"), then ask for similar recommendations.';
      }

      const categories = getAllCategories();
      for (const cat of categories) {
        if (lower.includes(cat.name.toLowerCase()) || lower.includes(cat.slug)) {
          const products = getProductsByCategory(cat.slug);
          if (products.length > 0) {
            const top = products.slice(0, 5);
            let out = `**${cat.name}**\n\n`;
            top.forEach((p, i) => {
              out += `${i + 1}. **${p.title}** — $${p.price?.toFixed(2) ?? '—'}\n`;
            });
            out += '\nAsk for details on any item above.';
            return out;
          }
          return `No ${cat.name} available right now.`;
        }
      }

      const keywords = extractKeywords(lower);
      if (keywords.length > 0) {
        const results = searchByTopic(keywords);
        if (results.length > 0) {
          const top = results.slice(0, 5);
          let out = `**Results for "${keywords.join(', ')}"**\n\n`;
          top.forEach((p, i) => {
            out += `${i + 1}. **${p.title}** — $${p.price?.toFixed(2) ?? '—'}\n`;
          });
          out += '\nAsk for details on any item above.';
          return out;
        }
        return `No results for "${keywords.join(', ')}". Try another term.`;
      }
      return 'Try: "Recommend a hot drink" or "Suggest something chocolate".';
    }

    if (lower.includes('tell me about') || lower.includes('what is') || lower.includes('about ')) {
      let term = message;
      if (lower.includes('tell me about')) term = message.split(/tell me about/i)[1]?.trim() || message;
      else if (lower.includes('what is')) term = message.split(/what is/i)[1]?.trim() || message;
      else if (lower.includes('about ')) term = message.split(/about/i)[1]?.trim() || message;

      const results = searchProducts(term);
      if (results.length > 0) {
        const product = results[0];
        lastProductRef.current = product;
        let out = `**${product.title}** — $${product.price?.toFixed(2) ?? '—'}\n\n`;
        out += product.description ? `${product.description}\n\n` : '';
        if (product.category?.name) out += `Category: ${product.category.name}\n\n`;
        out += '**Follow-up**\nAsk for "similar" or "recommend a [category]".';
        return out;
      }
      return `No product found for "${term}". Check the name or try the menu.`;
    }

    const results = searchProducts(message);
    if (results.length > 0) {
      const top = results.slice(0, 5);
      let out = `**Search** (${results.length} found)\n\n`;
      top.forEach((p, i) => {
        out += `${i + 1}. **${p.title}** — $${p.price?.toFixed(2) ?? '—'}\n`;
      });
      out += '\nAsk for details on any item above.';
      return out;
    }

    return FALLBACK_TEXT;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    setInputValue('');
    setIsTyping(true);

    const response = await processMessage(userMessage);
    setIsTyping(false);
    setMessages((prev) => [...prev, { type: 'bot', text: response }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isHidden) return null;

  return (
    <div className={`cc-chat-widget ${isOpen ? 'cc-chat-open' : ''}`}>
      {!isOpen && (
        <button type="button" className="cc-chat-toggle" onClick={() => setIsOpen(true)} aria-label="Open suggestions">
          ?
        </button>
      )}
      {isOpen && (
        <div className="cc-chat-panel">
          <div className="cc-chat-header">
            <span className="cc-chat-title">Suggestions</span>
            <button type="button" className="cc-chat-close" onClick={() => setIsOpen(false)} aria-label="Close">×</button>
          </div>
          <div className="cc-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`cc-chat-message cc-chat-message-${msg.type}`}>
                <div className="cc-chat-message-content">
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.split('**').map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part))}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="cc-chat-message cc-chat-message-bot">
                <div className="cc-chat-typing">...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="cc-chat-input-wrap">
            <input
              ref={inputRef}
              type="text"
              className="cc-chat-input"
              placeholder="Ask for a drink or pastry..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Message"
            />
            <button type="button" className="cc-chat-send" onClick={handleSend} disabled={!inputValue.trim()} aria-label="Send">→</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
