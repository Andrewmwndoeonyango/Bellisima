import { useState, useEffect, useRef } from 'react';
import { sendPing, listenForPings } from '../chat';

export default function ThinkingOfYou({ userName }) {
  const [pinged, setPinged] = useState(false);
  const [incoming, setIncoming] = useState(null);
  const [count, setCount] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const unsub = listenForPings((ping) => {
      if (ping.sender !== userName) {
        setIncoming(ping.sender);
        setCount((c) => c + 1);
        // Vibrate if supported
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        // Auto-dismiss after 5s
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIncoming(null), 5000);
      }
    });
    return () => {
      unsub();
      clearTimeout(timerRef.current);
    };
  }, [userName]);

  const handlePing = () => {
    if (pinged) return;
    sendPing(userName);
    setPinged(true);
    setTimeout(() => setPinged(false), 10000);
  };

  return (
    <>
      {/* Floating ping button */}
      <button
        className="ping-fab"
        onClick={handlePing}
        disabled={pinged}
        title="Send a thinking of you ping"
      >
        <span className={`ping-fab-icon${pinged ? ' sent' : ''}`}>
          {pinged ? '💙' : '💭'}
        </span>
      </button>

      {/* Incoming ping overlay */}
      {incoming && (
        <div className="ping-overlay" onClick={() => setIncoming(null)}>
          <div className="ping-toast">
            <span className="ping-toast-icon">💙</span>
            <p className="ping-toast-text">
              <strong>{incoming}</strong> is thinking of you
            </p>
            <p className="ping-toast-sub">tap to dismiss</p>
          </div>
        </div>
      )}
    </>
  );
}
