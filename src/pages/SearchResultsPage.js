/**
 * SearchResultsPage - Product search results; same structure as CineVerse SearchResultsPage.
 */
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { searchProducts } from '../services/dataService';
import ProductCard from '../components/ProductCard';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const products = searchProducts(query);
    setResults(products);
    setLoading(false);
  }, [query]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Searching...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{query ? `Search: ${query} - CoffeeCorner` : 'Search - CoffeeCorner'}</title>
        <meta name="description" content={`Search results for "${query}" on CoffeeCorner. Found ${results.length} items.`} />
      </Helmet>
      <div className="search-results-page">
        <div className="search-header">
          <h1>Search Results</h1>
          <p className="search-query">Showing results for: <strong>"{query}"</strong></p>
          <p className="search-count">{results.length} item(s) found</p>
        </div>
        {results.length > 0 ? (
          <div className="movies-grid">
            {results.map((product) => (
              <div key={product.uid} className="movie-card-wrapper">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No Results Found</h2>
            <p>We couldn't find any items matching "{query}"</p>
            <p className="search-tips">Try searching by:</p>
            <ul className="search-tips-list">
              <li>Drink name (e.g., "Latte", "Cold Brew")</li>
              <li>Category (e.g., "Hot", "Pastries")</li>
            </ul>
            <Link to="/menu" className="btn btn-primary">View Menu</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResultsPage;
