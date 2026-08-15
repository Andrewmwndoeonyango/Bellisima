import { useState, useEffect } from 'react';
import { GRACE } from '../data';

function computeLife() {
  const now = new Date();
  const birth = new Date(GRACE.birthday);
  let diff = now - birth;

  const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  diff -= years * 365.25 * 24 * 60 * 60 * 1000;
  const months = Math.floor(diff / (30.44 * 24 * 60 * 60 * 1000));
  diff -= months * 30.44 * 24 * 60 * 60 * 1000;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  diff -= days * 24 * 60 * 60 * 1000;
  const hours = Math.floor(diff / (60 * 60 * 1000));
  diff -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(diff / (60 * 1000));
  diff -= minutes * 60 * 1000;
  const seconds = Math.floor(diff / 1000);

  return { years, months, days, hours, minutes, seconds };
}

function computeBirthday() {
  const now = new Date();
  const thisYear = now.getFullYear();
  let nextBirthday = new Date(thisYear, GRACE.birthdayMonth, GRACE.birthdayDay);

  if (now > nextBirthday) {
    nextBirthday = new Date(thisYear + 1, GRACE.birthdayMonth, GRACE.birthdayDay);
  }

  const isBirthday = now.getMonth() === GRACE.birthdayMonth && now.getDate() === GRACE.birthdayDay;

  if (isBirthday) {
    return {
      days: '🎉', hours: '🎂', minutes: '💙', seconds: '🥳',
      message: 'Happy Birthday, Grace! You are the most beautiful gift this world ever received! 🎉💙',
    };
  }

  const diff = nextBirthday - now;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  let message;
  if (days <= 7) {
    message = `Only ${days} day${days !== 1 ? 's' : ''} until your special day, my Jabber! 💙`;
  } else if (days <= 30) {
    message = `Your birthday is getting closer, Grace! ${days} days to go 🎉`;
  } else {
    message = `${days} days until the world celebrates YOU, Grace 💫`;
  }

  return { days, hours, minutes, seconds, message };
}

export default function useCounters() {
  const [life, setLife] = useState(computeLife);
  const [birthday, setBirthday] = useState(computeBirthday);

  useEffect(() => {
    const id = setInterval(() => {
      setLife(computeLife());
      setBirthday(computeBirthday());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return { life, birthday };
}
