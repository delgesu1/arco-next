'use client';

import { useState, useEffect, useCallback } from 'react';
import { debounce } from '../../lib/utils';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Placeholder for actual search logic
  const performSearch = (query: string) => {
    console.log('Debounced search for:', query);
    // In later phases, this will interact with a global state / data fetching
  };

  // Memoize the debounced version of performSearch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(performSearch, 300), // 300ms debounce delay
    [] // No dependencies, so the debounced function is created once
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    }
    // Optionally, handle the case where searchQuery is empty (e.g., clear results)
    // else {
    //   console.log('Search query cleared');
    // }
  }, [searchQuery, debouncedSearch]);

  return (
    <header className="header">
      <a href="#" className="logo">
        Arco
      </a>

      <div className="search-container">
        <div className="search-wrapper">
          <div className="search-input-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search techniques, ask questions, or describe what you want to practice..."
              maxLength={200}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              className="search-btn"
              id="resetSearchBtn"
              title="Clear search"
              type="button"
              style={{ display: searchQuery ? 'inline-block' : 'none' }}
              onClick={clearSearch}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="header-actions">
        <button className="icon-btn" title="Settings">
          <i className="fas fa-cog"></i>
        </button>
        <button className="icon-btn" title="Profile">
          <i className="fas fa-user"></i>
        </button>
      </div>
    </header>
  );
}
