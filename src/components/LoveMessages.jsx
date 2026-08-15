import { useState, useEffect, useRef } from 'react';
import { loveMessages } from '../data';

export default function LoveMessages() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef(null);

  function resetInterval() {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % loveMessages.length);
    }, 6000);
  }

  useEffect(() => {
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, [index]);

  const goTo = (i) => {
    setIndex(i);
    resetInterval();
  };

  return (
    <section className="card glass-card messages-section">
      <h3 className="card-title">💌 A Little Reminder</h3>
      <div className="message-container">
        <p className="love-message" style={{ opacity: visible ? 1 : 0 }}>
          {loveMessages[index]}
        </p>
      </div>
      <div className="message-dots">
        {loveMessages.map((_, i) => (
          <span
            key={i}
            className={`dot${i === index ? ' active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
