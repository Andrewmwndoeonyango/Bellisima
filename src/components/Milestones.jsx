import { useState, useEffect } from 'react';

// The start date of your relationship — update this!
const RELATIONSHIP_START = new Date('2024-01-01');

const MILESTONES = [
  { days: 100, label: '100 days together', emoji: '💯' },
  { days: 200, label: '200 days together', emoji: '🌟' },
  { days: 300, label: '300 days together', emoji: '🎯' },
  { days: 365, label: '1 year together', emoji: '🎂' },
  { days: 400, label: '400 days together', emoji: '💫' },
  { days: 500, label: '500 days together', emoji: '🏆' },
  { days: 600, label: '600 days together', emoji: '🌈' },
  { days: 700, label: '700 days together', emoji: '✨' },
  { days: 730, label: '2 years together', emoji: '💎' },
  { days: 1000, label: '1000 days together', emoji: '👑' },
  { days: 1095, label: '3 years together', emoji: '🎉' },
];

export default function Milestones() {
  const [daysSinceStart, setDaysSinceStart] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = Math.floor((now - RELATIONSHIP_START) / (1000 * 60 * 60 * 24));
      setDaysSinceStart(diff);
    };
    tick();
    const timer = setInterval(tick, 60000 * 60); // every hour
    return () => clearInterval(timer);
  }, []);

  const nextMilestone = MILESTONES.find((m) => m.days > daysSinceStart);
  const completed = MILESTONES.filter((m) => m.days <= daysSinceStart);
  const daysToNext = nextMilestone ? nextMilestone.days - daysSinceStart : null;

  return (
    <section className="card glass-card milestones-section">
      <h3 className="card-title">🏆 Our Milestones</h3>
      <p className="counter-subtitle">{daysSinceStart} days of us</p>

      {nextMilestone && (
        <div className="milestone-next">
          <span className="milestone-next-emoji">{nextMilestone.emoji}</span>
          <div>
            <p className="milestone-next-label">Next milestone</p>
            <p className="milestone-next-text">{nextMilestone.label}</p>
            <p className="milestone-next-countdown">
              {daysToNext} {daysToNext === 1 ? 'day' : 'days'} to go!
            </p>
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div className="milestones-completed">
          <p className="milestones-completed-title">Achieved</p>
          <div className="milestones-list">
            {completed.map((m) => (
              <div key={m.days} className="milestone-badge">
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
