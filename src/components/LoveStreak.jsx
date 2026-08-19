import { useState, useEffect } from 'react';
import { updateStreak, listenForStreak } from '../chat';

function calcStreak(data) {
  if (!data) return 0;
  const andyLast = data['Andy_lastVisit'];
  const graceLast = data['Grace_lastVisit'];
  const today = new Date().toISOString().slice(0, 10);

  // Both must have visited today or yesterday for streak to continue
  const todayDate = new Date(today);
  const yesterday = new Date(todayDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const andyActive = andyLast === today || andyLast === yesterdayStr;
  const graceActive = graceLast === today || graceLast === yesterdayStr;

  if (andyActive && graceActive) {
    return (data.count || 0);
  }
  // Streak broken — reset
  return 0;
}

export default function LoveStreak({ userId }) {
  const [streakData, setStreakData] = useState({});

  useEffect(() => {
    const unsub = listenForStreak((data) => setStreakData(data));
    // Record today's visit
    updateStreak(userId);
    return unsub;
  }, [userId]);

  const streak = streakData.count || 0;
  const record = streakData.record || 0;

  // Calculate streak when both visit
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const andyLast = streakData['Andy_lastVisit'];
    const graceLast = streakData['Grace_lastVisit'];

    if (andyLast === today && graceLast === today) {
      const current = (streakData.count || 0);
      const newCount = current + 1;
      // Only update if not already counted today
      if (streakData.lastCounted !== today) {
        import('../chat').then(({ set }) => {
          // Use the streak ref to update atomically
        });
      }
    }
  }, [streakData]);

  return (
    <section className="card glass-card streak-section">
      <h3 className="card-title">🔥 Our Streak</h3>
      <p className="counter-subtitle">Days we've both opened this app</p>

      <div className="streak-display">
        <div className="streak-number">
          <span className="streak-fire">{streak > 0 ? '🔥' : '💤'}</span>
          <span className="streak-count">{streak}</span>
        </div>
        <p className="streak-label">
          {streak === 0
            ? 'Visit today to start a streak!'
            : streak === 1
            ? 'Just getting started!'
            : `${streak} days in a row!`}
        </p>
        {record > 0 && (
          <p className="streak-record">Best streak: {record} days 🏆</p>
        )}
      </div>
    </section>
  );
}
