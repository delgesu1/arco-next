'use client';

import { useState, useEffect } from 'react';

// Sample demo chat history data
const demoHistoryConversations = [
  {
    id: 1,
    title: 'Vibrato Techniques',
    preview: 'How do I improve my vibrato consistency?',
    timestamp: '2 hours ago',
    messages: 3,
  },
  {
    id: 2,
    title: 'Scale Practice',
    preview: 'Best exercises for improving intonation',
    timestamp: 'Yesterday',
    messages: 5,
  },
  {
    id: 3,
    title: 'Bow Technique',
    preview: 'Tips for smoother legato passages',
    timestamp: '3 days ago',
    messages: 7,
  },
  {
    id: 4,
    title: 'Shifting Practice',
    preview: 'Exercises for clean position changes',
    timestamp: '1 week ago',
    messages: 4,
  },
];

export default function RightSidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleChatHistory = () => {
    setShowChatHistory(!showChatHistory);
  };

  return (
    <>
      {/* Chat History Modal */}
      {showChatHistory && (
        <div className="chat-history-modal" onClick={toggleChatHistory}>
          <div
            className="chat-history-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="chat-history-header">
              <h3>Chat History</h3>
              <button
                className="modal-close-btn"
                onClick={toggleChatHistory}
                title="Close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="chat-history-list">
              {demoHistoryConversations.map((convo) => (
                <div key={convo.id} className="chat-history-item">
                  <div className="chat-history-content">
                    <h4 className="chat-history-title">{convo.title}</h4>
                    <p className="chat-history-preview">{convo.preview}</p>
                    <div className="chat-history-meta">
                      <span className="chat-timestamp">{convo.timestamp}</span>
                      <span className="chat-message-count">
                        {convo.messages} messages
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
              {/* Chat history button */}
              <button
                className="chat-history-btn"
                title="Chat History"
                aria-label="Chat History"
                onClick={toggleChatHistory}
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
