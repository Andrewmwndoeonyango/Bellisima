export default function BirthdayCountdown({ birthday }) {
  const blocks = [
    { value: birthday.days, label: 'Days' },
    { value: birthday.hours, label: 'Hours' },
    { value: birthday.minutes, label: 'Minutes' },
    { value: birthday.seconds, label: 'Seconds', pulse: true },
  ];

  return (
    <section className="card glass-card birthday-section">
      <h3 className="card-title">🎂 Birthday Countdown</h3>
      <p className="counter-subtitle">{"September 1st can't come fast enough"}</p>
      <div className="birthday-countdown">
        {blocks.map((b) => (
          <div key={b.label} className={`counter-block${b.pulse ? ' pulse' : ''}`}>
            <span>{b.value}</span>
            <label>{b.label}</label>
          </div>
        ))}
      </div>
      <p className="birthday-msg">{birthday.message}</p>
    </section>
  );
}
