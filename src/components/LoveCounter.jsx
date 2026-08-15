export default function LoveCounter({ life }) {
  const blocks = [
    { value: life.years, label: 'Years' },
    { value: life.months, label: 'Months' },
    { value: life.days, label: 'Days' },
    { value: life.hours, label: 'Hours' },
    { value: life.minutes, label: 'Minutes' },
    { value: life.seconds, label: 'Seconds', pulse: true },
  ];

  return (
    <section className="card glass-card love-counter">
      <h3 className="card-title">✨ Every Second With You</h3>
      <p className="counter-subtitle">Time since you made the world beautiful</p>
      <div className="alive-counter">
        {blocks.map((b) => (
          <div key={b.label} className={`counter-block${b.pulse ? ' pulse' : ''}`}>
            <span>{b.value}</span>
            <label>{b.label}</label>
          </div>
        ))}
      </div>
      <p className="counter-note">...of making the world stop just by being in it 🌍💫</p>
    </section>
  );
}
