import { useState, useEffect } from 'react';
import { setNextDate, listenForNextDate } from '../chat';

export default function DateCountdown({ userName }) {
  const [dateData, setDateData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [days, setDays] = useState(null);

  useEffect(() => {
    const unsub = listenForNextDate((data) => setDateData(data));
    return unsub;
  }, []);

  // Update countdown every minute
  useEffect(() => {
    const tick = () => {
      if (dateData?.date) {
        const target = new Date(dateData.date + 'T00:00:00');
        const now = new Date();
        const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
        setDays(diff >= 0 ? diff : 0);
      }
    };
    tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, [dateData]);

  const handleSave = () => {
    if (newDate && newTitle.trim()) {
      setNextDate(newDate, newTitle.trim());
      setEditing(false);
      setNewDate('');
      setNewTitle('');
    }
  };

  if (editing) {
    return (
      <section className="card glass-card countdown-section">
        <h3 className="card-title">📅 Set Next Date</h3>
        <div className="countdown-form">
          <input
            className="countdown-input"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
          />
          <input
            className="countdown-input"
            type="text"
            placeholder="What's the occasion?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            maxLength={50}
          />
          <div className="countdown-btns">
            <button className="countdown-save-btn" onClick={handleSave}>Save</button>
            <button className="countdown-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      </section>
    );
  }

  if (!dateData?.date) {
    return (
      <section className="card glass-card countdown-section">
        <h3 className="card-title">📅 Next Date</h3>
        <p className="counter-subtitle">Set a date to count down to together</p>
        <button className="countdown-set-btn" onClick={() => setEditing(true)}>
          Set a date
        </button>
      </section>
    );
  }

  return (
    <section className="card glass-card countdown-section">
      <h3 className="card-title">📅 {dateData.title}</h3>
      <div className="countdown-display">
        <span className="countdown-number">{days}</span>
        <span className="countdown-label">{days === 1 ? 'day' : 'days'} to go</span>
      </div>
      <p className="countdown-date">
        {new Date(dateData.date + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        })}
      </p>
      <button className="countdown-edit-btn" onClick={() => setEditing(true)}>
        Change date
      </button>
    </section>
  );
}
