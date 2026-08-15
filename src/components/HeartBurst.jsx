import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { heartEmojis } from '../data';

function spawnHeart(x, y) {
  const el = document.createElement('span');
  el.className = 'floating-heart';
  el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  const dx = (Math.random() - 0.5) * 120;
  const dy = -(Math.random() * 150 + 40);
  const rot = (Math.random() - 0.5) * 60;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.setProperty('--dx', dx + 'px');
  el.style.setProperty('--dy', dy + 'px');
  el.style.setProperty('--rot', rot + 'deg');
  el.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
  return el;
}

const HeartBurst = forwardRef(function HeartBurst(_, ref) {
  useImperativeHandle(ref, () => ({
    burst(x, y, count = 5) {
      const container = document.getElementById('heartContainer');
      if (!container) return;
      for (let i = 0; i < count; i++) {
        const heart = spawnHeart(x, y);
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 2100);
      }
    },
  }));

  useEffect(() => {
    const onClick = (e) => {
      if (e.target.closest('button, a, .gallery-item, .gallery-upload, .promise-item, .lightbox, .compliment-btn, .compliment-popup')) return;
      const container = document.getElementById('heartContainer');
      if (!container) return;
      for (let i = 0; i < 5; i++) {
        const heart = spawnHeart(e.clientX, e.clientY);
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 2100);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return <div className="heart-container" id="heartContainer" />;
});

export default HeartBurst;
