export default function RightSidebar() {
  return (
    <aside className="sidebar right-sidebar bg-gray-50 p-4 w-80">
      {/* Placeholder for original right sidebar (AI Assistant) content */}
      <div className="sidebar-header">
        <h2 className="sidebar-title text-lg font-semibold">
          AI Assistant (Next.js)
        </h2>
      </div>
      <div className="chat-container mt-4">
        <div className="chat-messages">
          <p>Chat messages (placeholder)</p>
        </div>
        <div className="chat-input-container mt-4">
          <textarea
            placeholder="Ask AI... (placeholder)"
            className="w-full p-2 border rounded text-black"
          ></textarea>
        </div>
      </div>
    </aside>
  );
}
