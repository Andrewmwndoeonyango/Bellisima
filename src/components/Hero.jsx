export default function Hero({ greeting, subtitle, date, time }) {
  return (
    <section className="hero">
      <div className="greeting-glow" />
      <p className="top-label">{date}</p>
      <h1 className="greeting">{greeting}</h1>
      <h2 className="subtitle">
        {subtitle}, <span className="jabber">my Jabber</span> 💙
      </h2>
      <div className="live-clock">
        <span className="clock-icon">◷</span>
        <span className="clock-time">{time}</span>
      </div>
    </section>
  );
}
