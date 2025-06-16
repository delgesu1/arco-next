'use client';

import { useState } from 'react';
import { useFiltersActions } from '@/store/filtersStore';
import { useChatStore } from '@/store/chatStore';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    filtersActions.applySearchQuery('');
  };

  // Handle Enter key press for LLM workflow
  const filtersActions = useFiltersActions();
  const chatActions = useChatStore((s) => s.actions);

  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;

    // Simulate LLM → random filter selection
    filtersActions.applySearchQuery(query);

    // Start a new chat session for this search
    chatActions.startNewChat(query);
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
