import { promises } from '../data';
import usePromises from '../hooks/usePromises';

export default function PromisesList({ onHeartBurst }) {
  const { checked, loading, toggle, count, total, pct } = usePromises();

  if (loading) return null;

  const handleClick = (i, e) => {
    const wasChecked = !checked.includes(i);
    toggle(i);
    if (wasChecked && onHeartBurst) {
      const rect = e.currentTarget.getBoundingClientRect();
      onHeartBurst(rect.left + 20, rect.top, 6);
    }
  };

  return (
    <section className="card glass-card promises-section">
      <h3 className="card-title">💍 {"Things I Promise We'll Do"}</h3>
      <p className="counter-subtitle">Our forever bucket list — tap to check them off together</p>
      <div className="promises-list">
        {promises.map((p, i) => (
          <div
            key={i}
            className={`promise-item${checked.includes(i) ? ' checked' : ''}`}
            onClick={(e) => handleClick(i, e)}
          >
            <span className="promise-check">✓</span>
            <span className="promise-icon">{p.icon}</span>
            <span className="promise-text">{p.text}</span>
          </div>
        ))}
      </div>
      <p className="promises-progress">
        <span>{count}</span> of <span>{total}</span> dreams unlocked
      </p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </section>
  );
}
