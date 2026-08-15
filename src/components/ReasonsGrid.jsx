import { reasons } from '../data';

export default function ReasonsGrid() {
  return (
    <section className="card glass-card reasons-section">
      <h3 className="card-title">🌟 Why The World Stops</h3>
      <div className="reasons-grid">
        {reasons.map((r, i) => (
          <div key={i} className="reason-card">
            <span className="reason-icon">{r.icon}</span>
            <p className="reason-text" dangerouslySetInnerHTML={{ __html: r.text }} />
          </div>
        ))}
      </div>
    </section>
  );
}
