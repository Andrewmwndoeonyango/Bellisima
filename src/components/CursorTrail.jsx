import { useRef, useEffect } from 'react';

export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let trail = [];
    let mouseX = -100, mouseY = -100;
    let isMouseOnPage = false;
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();

    const onMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; isMouseOnPage = true; };
    const onLeave = () => { isMouseOnPage = false; };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isMouseOnPage) {
        trail.push({
          x: mouseX, y: mouseY, life: 1,
          size: Math.random() * 3 + 1.5,
          color: Math.random() > 0.5 ? '79, 195, 247' : '255, 107, 157',
        });
      }

      if (trail.length > 40) trail.splice(0, trail.length - 40);

      trail = trail.filter(p => {
        p.life -= 0.03;
        if (p.life <= 0) return false;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.6})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.15})`;
        ctx.fill();
        return true;
      });

      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="cursorTrail" />;
}
