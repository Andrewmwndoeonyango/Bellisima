import { useState, useEffect } from 'react';
import { listenForBucketList, setBucketList } from '../chat';

export default function BucketList({ userName }) {
  const [items, setItems] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [newIcon, setNewIcon] = useState('🌟');

  useEffect(() => {
    const unsub = listenForBucketList((data) => {
      setItems(Array.isArray(data) ? data : []);
    });
    return unsub;
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const next = [...items, { text: newText.trim(), icon: newIcon, done: false, addedBy: userName }];
    setBucketList(next);
    setNewText('');
    setNewIcon('🌟');
    setAdding(false);
  };

  const handleToggle = (i) => {
    const next = items.map((item, idx) =>
      idx === i ? { ...item, done: !item.done } : item
    );
    setBucketList(next);
  };

  const handleRemove = (i) => {
    const next = items.filter((_, idx) => idx !== i);
    setBucketList(next);
  };

  const done = items.filter((item) => item.done).length;
  const pct = items.length > 0 ? (done / items.length) * 100 : 0;

  const ICONS = ['🌟', '✈️', '🏖️', '🎬', '🍽️', '🎵', '🏔️', '💑', '🎨', '📸', '🎮', '🏠', '🐾', '🎂', '💎'];

  return (
    <section className="card glass-card bucketlist-section">
      <h3 className="card-title">🗒️ Our Bucket List</h3>
      <p className="counter-subtitle">Dreams we want to make reality together</p>

      <div className="bucketlist-items">
        {items.length === 0 && (
          <p className="bucketlist-empty">Add your first dream below!</p>
        )}
        {items.map((item, i) => (
          <div
            key={i}
            className={`bucketlist-item${item.done ? ' done' : ''}`}
            onClick={() => handleToggle(i)}
          >
            <span className="bucketlist-check">{item.done ? '✓' : '○'}</span>
            <span className="bucketlist-icon">{item.icon}</span>
            <span className="bucketlist-text">{item.text}</span>
            {item.addedBy && (
              <span className="bucketlist-by">+{item.addedBy}</span>
            )}
            <button
              className="bucketlist-remove"
              onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <>
          <p className="bucketlist-progress">
            <span>{done}</span> of <span>{items.length}</span> dreams checked off
          </p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </>
      )}

      {adding ? (
        <form className="bucketlist-add-form" onSubmit={handleAdd}>
          <div className="bucketlist-icon-picker">
            {ICONS.map((ic) => (
              <button
                key={ic}
                type="button"
                className={`bucketlist-icon-btn${newIcon === ic ? ' active' : ''}`}
                onClick={() => setNewIcon(ic)}
              >
                {ic}
              </button>
            ))}
          </div>
          <input
            className="bucketlist-add-input"
            placeholder="What do you want to do together?"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            maxLength={200}
            required
          />
          <div className="bucketlist-add-btns">
            <button className="bucketlist-save-btn" type="submit">Add</button>
            <button className="bucketlist-cancel-btn" type="button" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="bucketlist-add-btn" onClick={() => setAdding(true)}>
          + Add a dream
        </button>
      )}
    </section>
  );
}
