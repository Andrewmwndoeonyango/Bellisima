import { useState, useEffect } from 'react';
import { addJournalEntry, listenForAllJournal } from '../chat';

export default function Journal({ userName }) {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = listenForAllJournal((data) => {
      setEntries(data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
    });
    return unsub;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    await addJournalEntry(userName, text);
    setText('');
    setLoading(false);
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <section className="card glass-card journal-section">
      <h3 className="card-title">📖 Our Journal</h3>
      <p className="counter-subtitle">Write memories together — both can read and add</p>

      <form className="journal-form" onSubmit={handleSubmit}>
        <textarea
          className="journal-input"
          placeholder="Write a memory, a thought, or anything on your mind..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
          rows={3}
        />
        <button className="journal-btn" type="submit" disabled={!text.trim() || loading}>
          {loading ? '...' : 'Add entry'}
        </button>
      </form>

      <div className="journal-entries">
        {entries.length === 0 && (
          <p className="journal-empty">No entries yet — be the first to write something!</p>
        )}
        {entries.map((entry) => {
          const isMe = entry.author === userName;
          return (
            <div key={entry.id} className={`journal-entry ${isMe ? 'mine' : 'theirs'}`}>
              <div className="journal-entry-header">
                <span className="journal-entry-author">{entry.author}</span>
                <span className="journal-entry-date">{formatDate(entry.timestamp)}</span>
              </div>
              <p className="journal-entry-text">{entry.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
