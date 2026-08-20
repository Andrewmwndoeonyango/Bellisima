import { useState, useEffect } from 'react';

// The start date of your relationship — update this to your real date!
const RELATIONSHIP_START = new Date('2026-07-18');

function buildMilestones() {
  const milestones = [];

  // Day milestones
  [1, 7, 14, 30, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500, 2000].forEach((d) => {
    milestones.push({
      days: d,
      label: `${d} days together`,
      emoji: d <= 30 ? '🌱' : d <= 100 ? '💯' : d <= 500 ? '🏆' : '👑',
      type: 'days',
    });
  });

  // Month milestones
  for (let m = 1; m <= 36; m++) {
    const approxDays = m * 30;
    let emoji = '📅';
    let label = `${m} month${m > 1 ? 's' : ''} together`;
    if (m % 12 === 0) {
      const years = m / 12;
      emoji = years === 1 ? '🎂' : '💎';
      label = `${years} year${years > 1 ? 's' : ''} together`;
    } else if (m === 2) emoji = '🌟';
    else if (m === 3) emoji = '✨';
    else if (m === 6) emoji = '💫';
    else if (m === 9) emoji = '🌈';
    else if (m === 18) emoji = '🎯';
    else if (m === 24) emoji = '💎';

    milestones.push({ days: approxDays, label, emoji, type: m % 12 === 0 ? 'year' : 'month' });
  }

  // Sort by days
  milestones.sort((a, b) => a.days - b.days);

  // Remove duplicates (keep first occurrence of same day count)
  const seen = new Set();
  return milestones.filter((m) => {
    if (seen.has(m.days)) return false;
    seen.add(m.days);
    return true;
  });
}

const MILESTONES = buildMilestones();

export default function Milestones() {
  const [daysSinceStart, setDaysSinceStart] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = Math.floor((now - RELATIONSHIP_START) / (1000 * 60 * 60 * 24));
      setDaysSinceStart(diff);
    };
    tick();
    const timer = setInterval(tick, 60000 * 60);
    return () => clearInterval(timer);
  }, []);

  // Calculate months too
  const months = Math.floor(daysSinceStart / 30);
  const nextMilestone = MILESTONES.find((m) => m.days > daysSinceStart);
  const completed = MILESTONES.filter((m) => m.days <= daysSinceStart);
  const daysToNext = nextMilestone ? nextMilestone.days - daysSinceStart : null;

  // Show upcoming milestones (next 5)
  const upcoming = MILESTONES.filter((m) => m.days > daysSinceStart).slice(0, 5);

  return (
    <section className="card glass-card milestones-section">
      <h3 className="card-title">🏆 Our Milestones</h3>
      <p className="counter-subtitle">
        {daysSinceStart} days · {months} month{months !== 1 ? 's' : ''} of us
      </p>

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

      {upcoming.length > 1 && (
        <div className="milestones-upcoming">
          <p className="milestones-upcoming-title">Coming up</p>
          <div className="milestones-list">
            {upcoming.slice(1).map((m) => (
              <div key={m.days} className="milestone-badge upcoming">
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div className="milestones-completed">
          <p className="milestones-completed-title">Achieved ({completed.length})</p>
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
