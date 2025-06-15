'use client';

import { useState, useEffect } from 'react';

export default function RightSidebar() {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {isMinimized ? (
        /* Minimized state - show only a small expand button */
        <button
          className="sidebar-expand-btn right"
          title="Show AI Assistant"
          onClick={toggleMinimize}
        >
          <i className="fas fa-angle-left" aria-hidden="true"></i>
        </button>
      ) : (
        /* Full sidebar */
        <aside className="sidebar right-sidebar">
          <div className="sidebar-header">
            <div className="ai-header-content">
              <h2 className="sidebar-title">AI Assistant</h2>
              {/* Chat history button - functionality to be added later */}
              <button
                className="chat-history-btn"
                title="Chat History"
                aria-label="Chat History"
              >
                <i className="fas fa-history"></i>
              </button>
            </div>
            <button
              className="minimize-btn"
              title="Minimize"
              aria-label="Minimize AI Assistant"
              onClick={toggleMinimize}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className="chat-container">
            <div className="chat-messages" id="chatMessages">
              {/* Modern empty state */}
              <div className="ai-empty-state">
                <div className="ai-robot-icon">
                  <i className="fas fa-robot"></i>
                </div>
                <h3 className="ai-welcome-title">AI Practice Assistant</h3>
                <p className="ai-welcome-text">
                  Ask questions about violin techniques, get practice advice, or
                  describe what you'd like to work on.
                </p>
              </div>
            </div>

            <div className="modern-chat-input">
              <div className="chat-input-wrapper">
                <textarea
                  className="chat-input-field"
                  placeholder="Ask about violin techniques..."
                  rows={1}
                  aria-label="Message input"
                ></textarea>
                <button
                  className="chat-submit-btn"
                  title="Send message"
                  aria-label="Send message"
                >
                  <i className="fas fa-arrow-up"></i>
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
