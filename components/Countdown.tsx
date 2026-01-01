import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetYear?: number;
}

const Countdown: React.FC<CountdownProps> = ({ targetYear = 2026 }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const target = new Date(`January 1, ${targetYear} 00:00:00`).getTime();

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
  }, [targetYear]);

  return (
    <div className="flex gap-4 md:gap-10 justify-center items-center mt-12 px-4">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center group">
          <div className="glass w-20 h-20 md:w-32 md:h-32 flex items-center justify-center rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] mb-4 transition-transform group-hover:scale-110 duration-500 border-white/5">
            <span className="text-3xl md:text-5xl font-black text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">
              {value}
            </span>
          </div>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-slate-500 font-bold ml-[0.4em]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;