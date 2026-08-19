import { useState, useEffect } from 'react';
import { setMood, listenForMoods } from '../chat';

const MOODS = ['😊', '🥰', '😘', '😍', '🤗', '😌', '🥺', '😴', '😤', '💪', '🎉', '💙'];

export default function MoodCheckin({ userId, otherName }) {
  const [allMoods, setAllMoods] = useState({});
  const [picked, setPicked] = useState(null);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const unsub = listenForMoods((data) => {
      setAllMoods(data);
      // Check if user already picked today
      const todayMoods = data[today];
      if (todayMoods && todayMoods[userId]) {
        setPicked(todayMoods[userId].emoji);
      } else {
        setPicked(null);
      }
    });
    return unsub;
  }, [today, userId]);

  const handlePick = (emoji) => {
    setMood(userId, emoji);
    setPicked(emoji);
  };

  const todayMoods = allMoods[today] || {};
  const otherMood = Object.entries(todayMoods).find(([key]) => key !== userId);

  return (
    <section className="card glass-card mood-section">
      <h3 className="card-title">🎭 How are you feeling today?</h3>
      <p className="counter-subtitle">Pick an emoji — {otherName} will see it too</p>

      {!picked ? (
        <div className="mood-grid">
          {MOODS.map((emoji) => (
            <button
              key={emoji}
              className="mood-btn"
              onClick={() => handlePick(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : (
        <div className="mood-result">
          <div className="mood-mine">
            <span className="mood-emoji">{picked}</span>
            <span className="mood-label">You</span>
          </div>
          {otherMood ? (
            <div className="mood-theirs">
              <span className="mood-emoji">{otherMood[1].emoji}</span>
              <span className="mood-label">{otherName}</span>
            </div>
          ) : (
            <div className="mood-theirs mood-waiting">
              <span className="mood-emoji">⏳</span>
              <span className="mood-label">{otherName} hasn't picked yet</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
