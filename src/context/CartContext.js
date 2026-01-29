/**
 * CartContext - Cart and checkout state.
 * Cart items with quantity, add/remove/update, toast.
 */

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'coffeecorner_cart';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  const getStorageKey = useCallback(() => {
    if (user?.uid) return `${CART_STORAGE_KEY}_${user.uid}`;
    return CART_STORAGE_KEY;
  }, [user?.uid]);

  useEffect(() => {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [getStorageKey]);

  const saveCart = useCallback(
    (newCart) => {
      const key = getStorageKey();
      localStorage.setItem(key, JSON.stringify(newCart));
      setCart(newCart);
    },
    [getStorageKey]
  );

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addToCart = useCallback(
    (product, quantity = 1) => {
      const existing = cart.find((item) => item.product.uid === product.uid);
      let newCart;
      if (existing) {
        newCart = cart.map((item) =>
          item.product.uid === product.uid
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [
          ...cart,
          { product: { ...product }, quantity: Math.max(1, quantity) },
        ];
      }
      saveCart(newCart);
      showToast(`"${product.title}" added to cart`, 'success');
      return true;
    },
    [cart, saveCart, showToast]
  );

  const removeFromCart = useCallback(
    (productUid) => {
      const item = cart.find((i) => i.product.uid === productUid);
      const newCart = cart.filter((i) => i.product.uid !== productUid);
      saveCart(newCart);
      if (item) showToast(`"${item.product.title}" removed from cart`, 'info');
      return true;
    },
    [cart, saveCart, showToast]
  );

  const updateQuantity = useCallback(
    (productUid, quantity) => {
      if (quantity < 1) return removeFromCart(productUid);
      const newCart = cart.map((item) =>
        item.product.uid === productUid ? { ...item, quantity } : item
      );
      saveCart(newCart);
      return true;
    },
    [cart, saveCart, removeFromCart]
  );

  const clearCart = useCallback(() => {
    saveCart([]);
    showToast('Cart cleared', 'info');
  }, [saveCart, showToast]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toast,
    showToast,
    cartCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
