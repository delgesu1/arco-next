'use client';

import { useState } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Handle Enter key press for LLM workflow
  const handleSearchSubmit = async (query: string) => {
    if (!query.trim()) return;

    console.log('Submitting search query to LLM:', query);

    // TODO: Implement LLM API call workflow:
    // 1. Send query to LLM for interpretation
    // 2. Update left sidebar filters based on LLM response
    // 3. Send query to AI chat for preliminary reply
    // 4. Clear search input after processing

    // Placeholder for now
    alert(
      `Search submitted: "${query}"\n\nThis will:\n1. Send to LLM for interpretation\n2. Update sidebar filters\n3. Send to AI chat for preliminary reply`
    );

    // Clear search after submission
    setSearchQuery('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit(searchQuery);
    }
  };

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
              onKeyPress={handleKeyPress}
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
