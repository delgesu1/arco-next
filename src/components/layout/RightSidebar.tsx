'use client';

import { useState, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import type { ChatSession } from '@/store/chatStore';

// Fallback demo data if no store chats exist
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
  const [inputValue, setInputValue] = useState('');
  const { messages, chats, actions } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handleSubmit = () => {
    const message = inputValue.trim();
    if (!message) return;

    // Check if this is the first message (clean slate)
    const isFirstMessage = messages.length === 0;

    // Add user message to chat
    actions.addUserMessage(message);

    // Clear input and reset height
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate AI response after a short delay
    setTimeout(() => {
      const typingId = actions.addTyping();
      setTimeout(() => {
        actions.removeMessage(typingId);

        if (isFirstMessage) {
          // First message: Use same response as main search bar with in-depth analysis option
          actions.addAssistantMessage(
            'Here are some practice materials to get you started. Would you like a more in-depth explanation?',
            true // initial flag to show "Get In-Depth Analysis" button
          );
        } else {
          // Subsequent messages: Use contextual responses
          actions.addAssistantMessage(generateAIResponse(message));
        }
      }, 1500);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    adjustTextareaHeight();
  };

  // Generate AI response based on user input
  const generateAIResponse = (userMessage: string): string => {
    // Simple response logic - replace with actual LLM integration later
    const message = userMessage.toLowerCase();

    if (message.includes('scales') || message.includes('scale')) {
      return 'Scales are fundamental to violin technique! I recommend starting with major scales, focusing on proper finger placement and bow control. Would you like specific fingering patterns for any particular scale?';
    } else if (message.includes('bow') || message.includes('bowing')) {
      return 'Bowing technique is crucial for good violin sound. Focus on straight bow strokes, consistent pressure, and smooth bow changes. Practice long bows with a metronome to develop control.';
    } else if (message.includes('vibrato')) {
      return 'Vibrato adds warmth and expression to your playing. Start with arm vibrato, then develop hand and finger vibrato. Practice slowly at first, focusing on evenness and control.';
    } else if (message.includes('intonation') || message.includes('tuning')) {
      return 'Good intonation comes from ear training and muscle memory. Practice scales slowly, listen carefully, and use a tuner for reference. Focus on consistent finger placement.';
    } else {
      return "That's a great question about violin technique! I can help you with scales, bowing, vibrato, intonation, and practice strategies. What specific aspect would you like to work on?";
    }
  };

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
        <div className={`chat-history-modal open`} onClick={toggleChatHistory}>
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
              {(() => {
                // Helper function to generate consistent chat titles
                const generateChatTitle = (
                  messages: { role: string; text: string }[]
                ): string => {
                  const firstUserMessage = messages.find(
                    (m) => m.role === 'user'
                  );
                  if (!firstUserMessage?.text) return 'Untitled Chat';
                  return firstUserMessage.text.length > 50
                    ? firstUserMessage.text.slice(0, 50) + '...'
                    : firstUserMessage.text;
                };

                // Determine if current in-memory conversation already exists in saved chats
                const matchingSession = chats.find(
                  (chat) =>
                    chat.messages.length === messages.length &&
                    chat.messages.every(
                      (msg, idx) =>
                        msg.id === messages[idx]?.id &&
                        msg.text === messages[idx]?.text
                    )
                );

                // Placeholder for unsaved current conversation
                const unsavedConversation: ChatSession | null =
                  !matchingSession && messages.length > 0
                    ? {
                        id: 'current',
                        title: generateChatTitle(messages),
                        messages: messages,
                        createdAt: Date.now(),
                      }
                    : null;

                // Get saved chats sorted by creation time (newest first)
                const sortedSavedChats = [...chats].sort(
                  (a, b) => b.createdAt - a.createdAt
                );

                // Build final list: unsaved current conversation (if any) + saved chats
                const finalChatList: ChatSession[] = [
                  ...(unsavedConversation ? [unsavedConversation] : []),
                  ...sortedSavedChats,
                ];

                // If no real chats exist, show demo data
                const chatsToShow =
                  finalChatList.length > 0
                    ? finalChatList
                    : demoHistoryConversations;

                return chatsToShow.map(
                  (
                    item:
                      | ChatSession
                      | (typeof demoHistoryConversations)[number]
                  ) => {
                    // Handle real chat sessions
                    if ('messages' in (item as ChatSession)) {
                      const session = item as ChatSession;
                      const isCurrent = session.id === 'current';

                      return (
                        <div
                          key={session.id}
                          className={`chat-history-item ${isCurrent ? 'current-chat' : ''}`}
                          onClick={() => {
                            if (!isCurrent) {
                              actions.loadChat(session.id);
                            }
                            setShowChatHistory(false);
                          }}
                        >
                          <div className="chat-history-title">
                            {isCurrent ? '• ' : ''}
                            {session.title}
                          </div>
                          <div className="chat-history-time">
                            {isCurrent
                              ? 'Active now'
                              : new Date(
                                  session.createdAt
                                ).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    }

                    // Handle demo conversations (fallback)
                    else {
                      const demoItem =
                        item as (typeof demoHistoryConversations)[number];
                      return (
                        <div key={demoItem.id} className="chat-history-item">
                          <div className="chat-history-title">
                            {demoItem.title}
                          </div>
                          <div className="chat-history-time">
                            {demoItem.timestamp}
                          </div>
                        </div>
                      );
                    }
                  }
                );
              })()}
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

              {/* New chat button */}
              <button
                className="chat-history-btn new-chat-btn"
                title="New Chat"
                aria-label="Start New Chat"
                onClick={() => actions.startNewChat('')}
              >
                <i className="fas fa-plus"></i>
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
              {messages.length === 0 && (
                <div className="ai-empty-state">
                  <div className="ai-robot-icon">
                    <i className="fas fa-robot"></i>
                  </div>
                  <h3 className="ai-welcome-title">AI Practice Assistant</h3>
                  <p className="ai-welcome-text">
                    Ask questions about violin techniques, get practice advice,
                    or describe what you&apos;d like to work on.
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.role}`}>
                  {msg.role === 'typing' ? (
                    <div className="typing-indicator">
                      <span>AI is thinking</span>
                      <div className="typing-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="message-bubble"
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                      {msg.role === 'assistant' && msg.initial && (
                        <button
                          className="in-depth-btn"
                          onClick={() => actions.requestInDepth(msg.id)}
                        >
                          <i className="fas fa-brain"></i> Get In-Depth Analysis
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="modern-chat-input">
              <div className="chat-input-wrapper">
                <textarea
                  ref={textareaRef}
                  className="chat-input-field"
                  value={inputValue}
                  placeholder="Ask about violin techniques..."
                  rows={1}
                  aria-label="Message input"
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onInput={adjustTextareaHeight}
                ></textarea>
                <button
                  className="chat-submit-btn"
                  title="Send message"
                  aria-label="Send message"
                  onClick={handleSubmit}
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
