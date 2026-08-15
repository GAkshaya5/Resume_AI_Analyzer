import React from 'react';
import { motion } from 'framer-motion';

const ScoreGauge = ({ score, feedback }) => {
  const getColor = (s) => {
    if (s >= 75) return 'text-green-500';
    if (s >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const circumference = 2 * Math.PI * 45; // r=45
  const progress = (score / 100) * circumference;
  const strokeDasharray = `${progress} ${circumference - progress}`;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Match Score</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="10"
              fill="none"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              className={getColor(score)}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${getColor(score)}`}>
              {score}%
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600 text-center">{feedback}</p>
      </div>
    </div>
  );
};

export default ScoreGauge;