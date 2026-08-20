import { useState, useEffect } from 'react';
import { getAllMessages } from '../chat';

export default function MemoryReplay() {
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMemory = async () => {
    setLoading(true);
    try {
      const messages = await getAllMessages();
      if (messages.length > 0) {
        const random = messages[Math.floor(Math.random() * messages.length)];
        setMemory(random);
      }
    } catch (e) {
      // silently fail
    }
    setLoading(false);
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  return (
    <section className="card glass-card memory-section">
      <h3 className="card-title">🔮 Remember This?</h3>
      <p className="counter-subtitle">A random memory from our chat</p>

      {memory ? (
        <div className="memory-card">
          <div className="memory-header">
            <span className="memory-sender">{memory.sender}</span>
            <span className="memory-date">{formatDate(memory.timestamp)}</span>
          </div>
          <p className="memory-text">{memory.text}</p>
        </div>
      ) : (
        <div className="memory-empty">
          <span className="memory-empty-icon">💭</span>
          <p>No memories yet — start chatting to build them!</p>
        </div>
      )}

      <button className="memory-btn" onClick={fetchMemory} disabled={loading}>
        {loading ? '...' : memory ? 'Show another' : 'Show a memory'}
      </button>
    </section>
  );
}
