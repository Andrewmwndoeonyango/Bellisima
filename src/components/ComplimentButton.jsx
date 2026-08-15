import { useState, useRef, useCallback } from 'react';
import { compliments } from '../data';

export default function ComplimentButton({ onHearts }) {
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);
  const lastIdx = useRef(-1);
  const timeoutRef = useRef(null);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    let idx;
    do {
      idx = Math.floor(Math.random() * compliments.length);
    } while (idx === lastIdx.current);
    lastIdx.current = idx;

    setText(compliments[idx]);
    setShow(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(false), 4500);

    // Burst hearts from button
    const rect = e.currentTarget.getBoundingClientRect();
    onHearts?.(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
  }, [onHearts]);

  return (
    <>
      <button className="compliment-btn" onClick={handleClick} title="Tap for a compliment!">
        <span className="btn-icon">💙</span>
        <span className="btn-pulse" />
        <span className="btn-label">
          <span className="btn-label-word">Bellissima</span>
          <span className="btn-label-meaning">most beautiful</span>
        </span>
      </button>
      <div className={`compliment-popup${show ? ' show' : ''}`}>
        <p className="compliment-text">{text}</p>
      </div>
    </>
  );
}
