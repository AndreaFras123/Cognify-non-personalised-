
import React from 'react';

interface XPBarProps {
  currentXP: number;
  xpToNextLevel: number;
  currentLevel: number;
}

const XPBar: React.FC<XPBarProps> = ({ currentXP, xpToNextLevel, currentLevel }) => {
  const progressPercentage = xpToNextLevel > 0 ? (currentXP / xpToNextLevel) * 100 : 0;

  return (
    <div className="w-full bg-[#2D2D2D] p-3 shadow-md sticky top-0 z-20">
      <div className="flex justify-between items-center mb-1 text-sm">
        <span className="font-semibold text-sky-400">Level: {currentLevel}</span>
        <span className="text-slate-300">
          XP: {currentXP} / {xpToNextLevel}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-sky-500 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          role="progressbar"
          aria-valuenow={currentXP}
          aria-valuemin={0}
          aria-valuemax={xpToNextLevel}
          aria-label={`Experience points progress: ${currentXP} of ${xpToNextLevel} for level ${currentLevel + 1}`}
        ></div>
      </div>
    </div>
  );
};

export default XPBar;
