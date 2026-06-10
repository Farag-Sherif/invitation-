import { useState, useEffect } from 'react';

export default function useCountdown(targetDateString = '2026-10-24T19:00:00+03:00') {
  const targetDate = new Date(targetDateString).getTime();

  const calculateTimeLeft = () => {
    const now = Date.now();
    const difference = Math.max(targetDate - now, 0);

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      totalDifference: difference
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateString]);

  return timeLeft;
}
