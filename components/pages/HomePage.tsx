import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import UserIcon from '../icons/UserIcon';
import NotificationIcon from '../icons/NotificationIcon';
import { FibonacciSpiralIcon } from '../../constants';
import { ReelContent, UserPreferences } from '../../types';
import { getUserPreferences } from '../../services/userService';
import { getMockReels } from '../../services/mockDataService';

// Helper function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const QuickPickCard: React.FC<{ reel: ReelContent | null }> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.error("Preview play failed", e));

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }, 2000);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  if (!reel) {
    return (
      <div className="bg-[#2D2D2D] rounded-lg shadow-lg aspect-[2/3] flex items-center justify-center p-3">
        <p className="text-slate-400 text-center text-sm">No pick available</p>
      </div>
    );
  }

  return (
    <Link
      to="/reels"
      className="relative bg-[#2D2D2D] rounded-lg shadow-lg aspect-[2/3] overflow-hidden group block"
      aria-label={`View reel: ${reel.description.substring(0, 30)}...`}
      onMouseEnter={reel.type === 'video' ? handleMouseEnter : undefined}
      onMouseLeave={reel.type === 'video' ? handleMouseLeave : undefined}
    >
      {reel.type === 'video' ? (
        <video
          ref={videoRef}
          src={reel.sourceUrl}
          muted
          playsInline
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <img
          src={reel.sourceUrl}
          alt={reel.description.substring(0, 50)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      {reel.tags && reel.tags.length > 0 && (
        <span className="absolute bottom-2 left-2 bg-sky-500 text-white text-xs px-2 py-1 rounded shadow">
          {reel.tags[0]}
        </span>
      )}
    </Link>
  );
};


const HomePage: React.FC = () => {
  const [quickPick1, setQuickPick1] = useState<ReelContent | null>(null);
  const [quickPick2, setQuickPick2] = useState<ReelContent | null>(null);
  const [isLoadingPicks, setIsLoadingPicks] = useState(true);
  const [picksMessage, setPicksMessage] = useState<string>('Loading quick picks...');

  useEffect(() => {
    const fetchQuickPicks = async () => {
      setIsLoadingPicks(true);
      setPicksMessage('Loading quick picks...');

      try {
        const allReels = await getMockReels();
        const reel6 = allReels.find(r => r.id === '6');
        const reel7 = allReels.find(r => r.id === '7');

        if (reel6 && reel7) {
          setQuickPick1(reel7);
          setQuickPick2(reel6);
          setPicksMessage('');
        } else {
          setPicksMessage('Could not find the specified quick picks.');
          setQuickPick1(null);
          setQuickPick2(null);
        }
      } catch (error) {
        console.error("Failed to fetch reels for quick picks:", error);
        setPicksMessage('Could not load quick picks. Please try again later.');
        setQuickPick1(null);
        setQuickPick2(null);
      } finally {
        setIsLoadingPicks(false);
      }
    };

    fetchQuickPicks();
  }, []); // Re-run if user preferences could change elsewhere and trigger a re-render, or add a refresh mechanism

  return (
    <div className="flex-grow bg-[#181818] text-slate-100 overflow-y-auto">
      <header className="p-4 flex justify-between items-center sticky top-0 z-10 bg-[#181818] h-20">
        <h1 className="text-3xl font-bold text-slate-100 font-poppins-semibold">Cognify</h1> {/* Applied Poppins Semibold */}
        <div className="flex items-center space-x-4">
          <Link to="/profile" aria-label="User profile"> {/* Updated UserIcon to be a Link */}
            <UserIcon className="w-7 h-7 text-slate-300 hover:text-slate-100 cursor-pointer" />
          </Link>
          <NotificationIcon className="w-7 h-7 text-slate-300 hover:text-slate-100 cursor-pointer" aria-label="Notifications" />
        </div>
      </header>

      <main className="p-4 space-y-8 pb-8">
        <section className="flex flex-col items-center justify-center my-6 p-6">
           <FibonacciSpiralIcon className="w-40 h-auto sm:w-48 text-sky-400 mb-4" aria-label="Decorative Fibonacci Spiral"/>
          <p className="text-md sm:text-lg text-slate-300 text-center">Explore. Learn. Grow.</p>
        </section>

        <section>
          <h2 className="text-xl text-center font-poppins-medium text-[#C1C1C1] mb-4">Today's quick picks:</h2>
          {isLoadingPicks && (
            <div className="text-center text-slate-400 p-4">{picksMessage}</div>
          )}
          {!isLoadingPicks && picksMessage && (
            <div className="text-center text-slate-400 p-4 bg-[#2D2D2D] rounded-md">{picksMessage}</div>
          )}
          {!isLoadingPicks && !picksMessage && (quickPick1 || quickPick2) && (
            <div className="grid grid-cols-2 gap-4">
              <QuickPickCard reel={quickPick1} />
              <QuickPickCard reel={quickPick2} />
            </div>
          )}
           {!isLoadingPicks && !picksMessage && !quickPick1 && !quickPick2 && (
             <div className="text-center text-slate-400 p-4 bg-[#2D2D2D] rounded-md">No quick picks available right now. Check back later or update your interests!</div>
           )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;