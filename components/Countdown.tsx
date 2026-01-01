
import React, { useState, useEffect } from 'react';

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const target = new Date(`January 1, ${new Date().getFullYear() + 1} 00:00:00`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 md:gap-8 justify-center items-center mt-8">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="glass w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-2xl shadow-lg mb-2">
            <span className="text-2xl md:text-4xl font-bold text-yellow-400">{value}</span>
          </div>
          <span className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400 font-semibold">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
