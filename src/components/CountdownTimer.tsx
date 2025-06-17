import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  deadline: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const remainingTime = deadline.getTime() - now.getTime();

      if (remainingTime <= 0) {
        setTimeLeft('');
        return;
      }

      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      let countdownText = '';
      if (days > 0) {
        countdownText = `申し込み締切まで、あと${days}日${hours}時間${minutes}分${seconds}秒`;
      } else if (hours > 0) {
        countdownText = `申し込み締切まで、あと${hours}時間${minutes}分${seconds}秒`;
      } else if (minutes > 0) {
        countdownText = `申し込み締切まで、あと${minutes}分${seconds}秒`;
      } else {
        countdownText = `申し込み締切まで、あと${seconds}秒`;
      }

      setTimeLeft(countdownText);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  if (!timeLeft) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg my-4 text-center font-bold text-lg">
      {timeLeft}
    </div>
  );
};

export default CountdownTimer;