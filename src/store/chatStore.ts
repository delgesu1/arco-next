// /src/store/chatStore.ts
// Zustand store to manage chat messages. This will be replaced by real backend/LLM integration later.

'use client';

import { create } from 'zustand';
import { nanoid } from 'nanoid';

type ChatRole = 'user' | 'assistant';

export interface ChatSession {
  id: string;
  title: string; // usually the initial user query
  messages: ChatMessage[];
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: ChatRole | 'typing';
  text: string;
  initial?: boolean; // preliminary assistant reply
}

interface ChatState {
  messages: ChatMessage[]; // current session messages
  chats: ChatSession[]; // archived chats in current page session
  actions: {
    addUserMessage: (text: string) => void;
    addAssistantMessage: (text: string, initial?: boolean) => void;
    startNewChat: (initialQuery: string) => void;
    loadChat: (sessionId: string) => void;
    addTyping: () => string; // returns id of typing message
    removeMessage: (id: string) => void;
    requestInDepth: (initialId: string) => void;
    clearMessages: () => void;
  };
}

export const useChatStore = create<ChatState>()((set, get) => ({
  messages: [],
  chats: [],
  actions: {
    addUserMessage: (text) =>
      set((state) => ({
        messages: [...state.messages, { id: nanoid(), role: 'user', text }],
      })),
    addAssistantMessage: (text, initial = false) =>
      set((state) => ({
        messages: [
          ...state.messages,
          { id: nanoid(), role: 'assistant', text, initial },
        ],
      })),
    startNewChat: (initialQuery: string) => {
      const { messages, chats } = get();

      // Save current conversation as a session if it has messages
      if (messages.length > 0) {
        const existingSession = chats.find(
          (chat) =>
            chat.messages.length === messages.length &&
            chat.messages.every(
              (msg, idx) =>
                msg.id === messages[idx]?.id && msg.text === messages[idx]?.text
            )
        );

        if (!existingSession) {
          const firstUserMessage = messages.find((m) => m.role === 'user');
          const title = firstUserMessage?.text
            ? firstUserMessage.text.slice(0, 50) +
              (firstUserMessage.text.length > 50 ? '...' : '')
            : 'Untitled Chat';

          const newSession: ChatSession = {
            id: nanoid(),
            title,
            messages: [...messages],
            createdAt: Date.now(),
          };

          chats.push(newSession);
        }
      }

      // If no initial query, just reset messages to start a fresh blank chat
      if (!initialQuery.trim()) {
        set({ messages: [], chats: [...chats] });
        return;
      }

      // Create new conversation
      const newUserMsg = {
        id: nanoid(),
        role: 'user' as ChatRole,
        text: initialQuery,
      };

      const newAssistantMsg = {
        id: nanoid(),
        role: 'assistant' as ChatRole,
        text: 'Here are some practice materials to get you started. Would you like a more in-depth explanation?',
        initial: true,
      };

      set({ messages: [newUserMsg, newAssistantMsg], chats: [...chats] });
    },
    loadChat: (sessionId) => {
      const { messages, chats } = get();

      // Save current conversation if it has messages and isn't already saved
      if (messages.length > 0) {
        const alreadyExists = chats.find(
          (chat) =>
            chat.messages.length === messages.length &&
            chat.messages.every(
              (msg, idx) =>
                msg.id === messages[idx]?.id && msg.text === messages[idx]?.text
            )
        );

        if (!alreadyExists) {
          const firstUser = messages.find((m) => m.role === 'user');
          const title = firstUser?.text
            ? firstUser.text.slice(0, 50) +
              (firstUser.text.length > 50 ? '...' : '')
            : 'Untitled Chat';
          chats.push({
            id: nanoid(),
            title,
            messages: [...messages],
            createdAt: Date.now(),
          });
        }
      }

      // Load selected chat
      const session = chats.find((c) => c.id === sessionId);
      if (session) {
        // Clone messages array to avoid mutating saved session
        const clonedMessages = session.messages.map((m) => ({ ...m }));
        set({ messages: clonedMessages, chats: [...chats] });
      }
    },

    addTyping: () => {
      const id = nanoid();
      set((state) => ({
        messages: [...state.messages, { id, role: 'typing', text: '' }],
      }));
      return id;
    },
    removeMessage: (id) =>
      set((state) => ({ messages: state.messages.filter((m) => m.id !== id) })),
    requestInDepth: (initialId) => {
      // replace button with typing indicator then long answer
      const { messages, actions } = get();
      const initialMsg = messages.find((m) => m.id === initialId);
      if (!initialMsg) return;
      // remove initial button flag so it's not shown again
      initialMsg.initial = false;
      set({ messages: [...messages] });
      const typingId = actions.addTyping();
      setTimeout(() => {
        actions.removeMessage(typingId);
        const detail = generateInDepthResponse();
        actions.addAssistantMessage(detail);
      }, 1800);
    },
    clearMessages: () => set({ messages: [] }),
  },
}));

function generateInDepthResponse() {
  return `
    <div class="comprehensive-analysis">
      <h3 class="analysis-title">🎯 Practice Analysis</h3>
      
      <h4 class="section-heading">Technical Foundation</h4>
      <ul class="analysis-list">
        <li><strong>Posture:</strong> Violin parallel, chin rest <em>gentle but secure</em></li>
        <li><strong>Bow Grip:</strong> <span class="highlight">Flexible contact</span> - thumb curved, fingers relaxed</li>
        <li><strong>Left Hand:</strong> Thumb opposite 1st/2nd finger, wrist straight</li>
      </ul>

      <h4 class="section-heading">Practice Strategy</h4>
      <p><strong>Slow Practice (50% tempo):</strong></p>
      <ul class="analysis-list">
        <li>Focus on <strong>intonation accuracy</strong></li>
        <li>Listen for <em>resonant tone quality</em></li>
        <li>Use metronome for <span class="accent">rhythmic precision</span></li>
      </ul>
      
      <p><strong>Integration (75% tempo):</strong></p>
      <ul class="analysis-list">
        <li>Combine bow and finger coordination</li>
        <li>Work on <strong>smooth transitions</strong></li>
        <li>Develop <em>dynamic control</em></li>
      </ul>

      <h4 class="section-heading">Key Techniques</h4>
      <p><strong>Vibrato:</strong> Start with <em>arm motion</em>, practice slow-fast patterns</p>
      <p><strong>Shifting:</strong> Use <span class="highlight">guide fingers</span>, consistent thumb position</p>
      <p><strong>Bow Control:</strong> Map segments to phrases, practice <strong>long tones</strong></p>

      <div class="key-insight">
        <p><strong>💡 Key Insight:</strong> <em>Quality over quantity</em> - 30 minutes of focused practice beats hours of mindless repetition. Listen actively and trust the process.</p>
      </div>
      
      <p class="closing-text">Need a <span class="highlight">practice schedule</span> or specific technique help?</p>
    </div>
  `;
}
