import { useState, useEffect, useCallback } from 'react';
import { getSetting, putSetting } from '../db';
import { promises } from '../data';

const SETTINGS_KEY = 'promises_checked';

export default function usePromises() {
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSetting(SETTINGS_KEY).then((val) => {
      setChecked(val || []);
      setLoading(false);
    });
  }, []);

  const toggle = useCallback((index) => {
    setChecked((prev) => {
      const next = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];
      putSetting(SETTINGS_KEY, next);
      return next;
    });
    // Return whether it was just checked (for celebration effect)
    return !checked.includes(index);
  }, [checked]);

  const count = checked.length;
  const total = promises.length;
  const pct = total > 0 ? (count / total) * 100 : 0;

  return { checked, loading, toggle, count, total, pct };
}
