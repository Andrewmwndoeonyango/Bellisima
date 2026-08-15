import { useState, useEffect } from 'react';

function getTimeGreeting(hour) {
  if (hour >= 5 && hour < 12) return 'Good Morning, Grace';
  if (hour >= 12 && hour < 17) return 'Good Afternoon, Grace';
  if (hour >= 17 && hour < 21) return 'Good Evening, Grace';
  return 'Good Night, my Jabber';
}

function getTimeSubtitle(hour) {
  if (hour >= 5 && hour < 12) return 'Rise and shine, beautiful';
  if (hour >= 12 && hour < 17) return 'Hope your day is as stunning as you are';
  if (hour >= 17 && hour < 21) return 'The sunset has nothing on you';
  return 'Sweet dreams are made of you';
}

export default function useRealTimeClock() {
  const [state, setState] = useState(() => compute());

  function compute() {
    const now = new Date();
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    return {
      time: `${h12}:${m}:${s} ${ampm}`,
      greeting: getTimeGreeting(h),
      subtitle: getTimeSubtitle(h),
      date: dateStr,
    };
  }

  useEffect(() => {
    const id = setInterval(() => setState(compute()), 1000);
    return () => clearInterval(id);
  }, []);

  return state;
}
