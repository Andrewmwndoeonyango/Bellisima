import { useState, useEffect, useRef, useCallback } from 'react';
import { sendMessage, listenForMessages } from '../chat';

const USERS = { me: 'Andy', grace: 'Grace' };

export default function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [who, setWho] = useState('me'); // Toggle who you are
  const [unread, setUnread] = useState(0);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Listen for real-time messages
  useEffect(() => {
    const unsub = listenForMessages(
      (msg) => {
        setMessages((prev) => [...prev, msg]);
      },
      (id) => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    );
    return unsub;
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    // Track unread when closed
    if (!open) {
      setUnread((prev) => prev + 1);
    }
  }, [messages.length, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    sendMessage(who === 'me' ? USERS.me : USERS.grace, text);
    setText('');
    inputRef.current?.focus();
  }, [text, who]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        title="Open Us chat"
      >
        <span className="chat-fab-icon">💬</span>
        <span className="chat-fab-label">Us</span>
        {unread > 0 && !open && (
          <span className="chat-fab-badge">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {/* Chat panel */}
      <div className={`chat-panel${open ? ' open' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <span className="chat-header-icon">💙</span>
            <div>
              <h4 className="chat-header-title">Us</h4>
              <p className="chat-header-sub">our little world</p>
            </div>
          </div>
          <div className="chat-header-right">
            <button
              className="chat-who-btn"
              onClick={() => setWho((w) => (w === 'me' ? 'grace' : 'me'))}
              title="Switch sender"
            >
              I'm {who === 'me' ? 'Andy' : 'Grace'}
            </button>
            <button className="chat-close-btn" onClick={() => setOpen(false)}>
              &times;
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages" ref={listRef}>
          {messages.length === 0 && (
            <div className="chat-empty">
              <span className="chat-empty-icon">💙</span>
              <p>Say hi to each other!</p>
              <p className="chat-empty-sub">Messages appear here in real time</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isMe = msg.sender === USERS.me;
            const showAvatar =
              i === 0 || messages[i - 1].sender !== msg.sender;
            return (
              <div
                key={msg.id}
                className={`chat-bubble-row ${isMe ? 'me' : 'them'}${showAvatar ? ' show-avatar' : ''}`}
              >
                {showAvatar && (
                  <span className="chat-avatar">{isMe ? '🤵' : '👩'}</span>
                )}
                {!showAvatar && <span className="chat-avatar-spacer" />}
                <div className={`chat-bubble ${isMe ? 'bubble-me' : 'bubble-them'}`}>
                  <p className="chat-bubble-text">{msg.text}</p>
                  <span className="chat-bubble-time">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="chat-input-bar">
          <input
            ref={inputRef}
            className="chat-input"
            type="text"
            placeholder={who === 'me' ? 'Type a message, Andy...' : "Grace's reply..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!text.trim()}
          >
            💙
          </button>
        </div>
      </div>
    </>
  );
}
