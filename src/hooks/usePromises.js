import { useState, useEffect, useCallback } from 'react';
import { listenForPromises, setPromises } from '../chat';
import { promises } from '../data';

export default function usePromises() {
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenForPromises((data) => {
      setChecked(Array.isArray(data) ? data : []);
      setLoading(false);
    });
    return unsub;
  }, []);

  const toggle = useCallback((index) => {
    setChecked((prev) => {
      const next = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];
      setPromises(next);
      return next;
    });
    return !checked.includes(index);
  }, [checked]);

  const count = checked.length;
  const total = promises.length;
  const pct = total > 0 ? (count / total) * 100 : 0;

  return { checked, loading, toggle, count, total, pct };
}
