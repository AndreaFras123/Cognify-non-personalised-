import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ReelContent, Interest, QuizQuestion, UserQuizProgress, UserXPLevel } from '../../types';
import { getMockReels } from '../../services/mockDataService';
import { 
  getUserQuizProgress, 
  markQuizAttempt,
  getUserXPLevel, 
  saveUserXPLevel  
} from '../../services/userService';
import { XP_PER_CORRECT_ANSWER, XP_FOR_LEVEL_UP } from '../../constants'; 
import LikeIcon from '../icons/LikeIcon';
import CommentIcon from '../icons/CommentIcon';
import ShareIcon from '../icons/ShareIcon';
import MoreOptionsIcon from '../icons/MoreOptionsIcon';
import QuizModal from '../QuizModal'; 
import CheckCircleIcon from '../icons/CheckCircleIcon';
import XPBar from '../XPBar';

interface ReelCardProps {
  reel: ReelContent;
  onTakeQuiz: (quiz: QuizQuestion, reelId: string) => void;
  isQuizPassed: boolean;
  isActive: boolean;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, onTakeQuiz, isQuizPassed, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => console.error("Video play failed:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(error => console.error("Video play failed:", error));
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.currentTarget;
    let errorMessage = "Unknown video error.";
    if (videoElement.error) {
      switch (videoElement.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Video loading was aborted.";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "A network error prevented the video from loading.";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "The video could not be decoded, or the format is unsupported.";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = `The video source could not be found or is not supported. Path: ${videoElement.currentSrc}`;
          break;
        default:
          errorMessage = `An unexpected error occurred with the video. Code: ${videoElement.error.code}`;
      }
    }
    console.error("Video Load Error:", errorMessage, videoElement.error);
  };

  // Helper to determine if the sourceUrl is an iframe embed URL from archive.org
  const isArchiveOrgEmbed = (url: string) => {
    return url.includes('archive.org/embed/');
  };

  return (
    <div className="h-full w-full bg-black relative flex flex-col items-center justify-center text-white" role="article" aria-labelledby={`reel-user-${reel.id}`} onClick={handleVideoClick}>
      {/* Conditional Rendering Based on Reel Type/Source */}
      {reel.type === 'video' && isArchiveOrgEmbed(reel.sourceUrl) ? (
        <iframe
          src={reel.sourceUrl}
          className="absolute inset-0 w-full h-full" // Make iframe fill the container
          frameBorder="0"
          allowFullScreen
          title={`Embedded content: ${reel.description.substring(0, 50)}`}
          // Consider sandbox attribute for security if needed, but it might break some embeds:
          // sandbox="allow-scripts allow-same-origin allow-presentation"
        ></iframe>
      ) : reel.type === 'video' ? ( // This is now for direct video files
        <video
          ref={videoRef}
          key={reel.sourceUrl}
          src={reel.sourceUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          playsInline
          onError={handleVideoError}
        >
          Your browser does not support the video tag.
        </video>
      ) : ( // Fallback to image
        <img
          src={reel.sourceUrl}
          alt={reel.description.substring(0, 100)}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
        />
      )}
      
      {/* Overlay UI - pointer-events-none on background, pointer-events-auto on interactive elements */}
      <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-between p-4 pointer-events-none">
        <div className="absolute top-4 left-4 z-10 pointer-events-auto">
            {reel.quiz && isQuizPassed && (
                 <div className="flex items-center bg-green-600 text-white text-xs px-2 py-1 rounded-full shadow">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Quiz Passed
                </div>
            )}
        </div>
        <div></div> {/* Top spacer */}
        <div className="z-10 text-shadow pointer-events-auto">
          <div className="flex items-center mb-2">
            <img src={reel.user.avatarUrl} alt={`${reel.user.name}'s avatar`} className="w-10 h-10 rounded-full border-2 border-white mr-3" />
            <div>
              <p id={`reel-user-${reel.id}`} className="font-semibold text-sm">{reel.user.name}</p>
              <button className="text-xs bg-sky-500 px-2 py-0.5 rounded hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400">Follow</button>
            </div>
          </div>
          <p className="text-sm leading-tight mb-2">{reel.description}</p>
          {reel.quiz && !isQuizPassed && (
            <button
              onClick={() => reel.quiz && onTakeQuiz(reel.quiz, reel.id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-semibold py-2 px-3 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Take Quick Quiz
            </button>
          )}
        </div>
      </div>

      <div className="absolute right-2 bottom-1/4 z-10 flex flex-col space-y-5 items-center pointer-events-auto">
        <button className="flex flex-col items-center text-white group" aria-label={`Like reel by ${reel.user.name}, ${reel.likes} likes`}>
          <LikeIcon className="w-8 h-8 group-hover:fill-red-500 group-focus:fill-red-500 transition-colors" />
          <span className="text-xs mt-1">{reel.likes > 1000 ? (reel.likes/1000).toFixed(1)+'k' : reel.likes}</span>
        </button>
        <button className="flex flex-col items-center text-white group" aria-label={`Comment on reel by ${reel.user.name}, ${reel.comments} comments`}>
          <CommentIcon className="w-8 h-8 group-hover:fill-sky-300 group-focus:fill-sky-300 transition-colors" />
          <span className="text-xs mt-1">{reel.comments}</span>
        </button>
        <button className="flex flex-col items-center text-white group" aria-label={`Share reel by ${reel.user.name}`}>
          <ShareIcon className="w-8 h-8 group-hover:fill-green-400 group-focus:fill-green-400 transition-colors" />
        </button>
        <button className="text-white group" aria-label={`More options for reel by ${reel.user.name}`}>
          <MoreOptionsIcon className="w-8 h-8 group-hover:fill-gray-400 group-focus:fill-gray-400 transition-colors" />
        </button>
         <img src={reel.user.avatarUrl} alt="" className="w-10 h-10 rounded-full border-2 border-white mt-2" aria-hidden="true" />
      </div>
    </div>
  );
};

const ReelsPage: React.FC = () => {
  const [allFetchedReels, setAllFetchedReels] = useState<ReelContent[]>([]);
  const [displayedReels, setDisplayedReels] = useState<ReelContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string>('Loading reels...');
  
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState<{ quiz: QuizQuestion; reelId: string } | null>(null);
  const [userQuizProgressVersion, setUserQuizProgressVersion] = useState(0); 
  
  const [incorrectReelsQueue, setIncorrectReelsQueue] = useState<ReelContent[]>([]);
  const [readyToAdvance, setReadyToAdvance] = useState<boolean>(false);
  const [lastQuizOutcomeIsCorrect, setLastQuizOutcomeIsCorrect] = useState<boolean | null>(null);

  const [userXPLevel, setUserXPLevel] = useState<UserXPLevel>(getUserXPLevel());
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log(
      "Reels Queue Updated:",
      displayedReels.map(reel => reel.id)
    );
    console.log(
      "Incorrect Queue:",
      incorrectReelsQueue.map(reel => reel.id)
    );
  }, [displayedReels, incorrectReelsQueue]);

  useEffect(() => {
    setUserXPLevel(getUserXPLevel()); 
  }, []);

  const refreshReelsListFromSource = useCallback(() => {
    const shuffledReels = [...allFetchedReels].sort(() => Math.random() - 0.5);
    
    const currentProgressData = getUserQuizProgress(); 
    const masteredReelIds = Object.keys(currentProgressData).filter(reelId => 
        currentProgressData[reelId]?.correctlyAnswered
    );

    const unmasteredReels = shuffledReels.filter(reel => 
        !reel.quiz || !masteredReelIds.includes(reel.id)
    );

    return unmasteredReels;
  }, [allFetchedReels]);


  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setStatusMessage('Loading reels...');
      try {
        const fetchedReels = await getMockReels();
        setAllFetchedReels(fetchedReels);
      } catch (error) {
        console.error("Failed to fetch initial reels:", error);
        setStatusMessage('Could not load reels. Please try again later.');
        setAllFetchedReels([]);
      } 
    };
    fetchInitialData();
  }, []);

  // Effect to update displayedReels
  useEffect(() => {
    // console.log("LOG: EFFECT (Update DisplayedReels) triggered. LastQuizCorrect:", lastQuizOutcomeIsCorrect, "AllFetchedReels Length:", allFetchedReels.length, "isLoading:", isLoading, "UserQuizProgressVersion:", userQuizProgressVersion);

    if (isLoading && allFetchedReels.length === 0) { 
        // console.log("LOG: EFFECT (Update DisplayedReels) - Waiting for initial allFetchedReels.");
        return;
    }
    
    let finalQueueCandidate: ReelContent[];
    let needsIndexAdjustment = false;
    let oldCurrentReelIdForAdjustment: string | undefined;

    if (lastQuizOutcomeIsCorrect === false) {
      // console.log('LOG: EFFECT (Update DisplayedReels) - SKIPPING standard rebuild, last quiz was incorrect. Using current displayedReels (should be spliced). IDs:', displayedReels.map(r=>r.id));
      finalQueueCandidate = displayedReels; 
    } else if (lastQuizOutcomeIsCorrect === true) {
        // console.log('LOG: EFFECT (Update DisplayedReels) - Quiz correct. Filtering current displayedReels. Prev displayedReels IDs:', displayedReels.map(r=>r.id));
        const currentProgressData = getUserQuizProgress();
        const masteredReelIdsThisCycle = Object.keys(currentProgressData).filter(reelId => 
            currentProgressData[reelId]?.correctlyAnswered
        );
        oldCurrentReelIdForAdjustment = displayedReels[currentReelIndex]?.id;
        finalQueueCandidate = displayedReels.filter(reel => 
            !reel.quiz || !masteredReelIdsThisCycle.includes(reel.id)
        );
        // console.log('LOG: EFFECT (Update DisplayedReels) - Queue after filtering mastered reel:', finalQueueCandidate.map(r=>r.id));
        setDisplayedReels(finalQueueCandidate); // Update state before adjusting index
        needsIndexAdjustment = true;
    } else { 
        // console.log('LOG: EFFECT (Update DisplayedReels) - Initial construction or major refresh from allFetchedReels.');
        oldCurrentReelIdForAdjustment = displayedReels[currentReelIndex]?.id;
        finalQueueCandidate = refreshReelsListFromSource();
        setDisplayedReels(finalQueueCandidate); // Update state before adjusting index
        needsIndexAdjustment = true;
    }
    
    if (needsIndexAdjustment) {
        const tempCurrentIndex = currentReelIndex; 
        setCurrentReelIndex(prevIdx => {
            let newCalculatedIdx = 0;
            if (finalQueueCandidate.length > 0) {
                const targetReelId = oldCurrentReelIdForAdjustment;
                if (targetReelId) {
                    const newPosOfOldReel = finalQueueCandidate.findIndex(r => r.id === targetReelId);
                    if (newPosOfOldReel !== -1) {
                        newCalculatedIdx = newPosOfOldReel;
                    } else { 
                        newCalculatedIdx = Math.min(tempCurrentIndex, finalQueueCandidate.length - 1);
                        if (newCalculatedIdx < 0) newCalculatedIdx = 0;
                    }
                } else { 
                    newCalculatedIdx = Math.min(tempCurrentIndex, finalQueueCandidate.length - 1);
                    if (newCalculatedIdx < 0) newCalculatedIdx = 0;
                }
            }
            // console.log(`LOG: EFFECT (Update DisplayedReels) - Adjusting currentReelIndex from ${tempCurrentIndex} (Old ID: ${oldCurrentReelIdForAdjustment || 'N/A'}) to ${newCalculatedIdx}. New Queue Length: ${finalQueueCandidate.length}`);
            return newCalculatedIdx;
        });
    }

    if (finalQueueCandidate.length === 0 && !isLoading) {
      setStatusMessage('You\'ve seen all available reels! 🎉');
    } else if (finalQueueCandidate.length > 0) {
      setStatusMessage('');
    }
    
    if(isLoading && (allFetchedReels.length > 0 || finalQueueCandidate.length > 0 || statusMessage !== 'Loading reels...')) {
      setIsLoading(false);
    }

  }, [allFetchedReels, userQuizProgressVersion, lastQuizOutcomeIsCorrect, refreshReelsListFromSource, isLoading]); // Removed displayedReels & currentReelIndex


  useEffect(() => {
    if (readyToAdvance) {
      if (displayedReels.length > 0) {
        let nextIndex = (currentReelIndex + 1);
        
        if (incorrectReelsQueue.length > 0 && nextIndex < displayedReels.length) {
            const nextReel = displayedReels[nextIndex];
            const isReelInIncorrectQueue = incorrectReelsQueue.some(ir => ir.id === nextReel.id);

            if (!isReelInIncorrectQueue) {
                const incorrectReelToInsert = incorrectReelsQueue[0];
                
                // Avoid inserting a duplicate if it's already the next item
                if (nextReel.id !== incorrectReelToInsert.id) {
                    setDisplayedReels(prevReels => {
                        const newReels = [...prevReels];
                        newReels.splice(nextIndex + 1, 0, incorrectReelToInsert);
                        return newReels;
                    });
                    setIncorrectReelsQueue(prevQueue => prevQueue.slice(1));
                }
            }
        } else if (incorrectReelsQueue.length > 0) {
            setDisplayedReels(prevReels => [...prevReels, ...incorrectReelsQueue]);
            setIncorrectReelsQueue([]);
        }

        if (nextIndex >= displayedReels.length) {
            nextIndex = 0; // Loop back to the start
        }

        setCurrentReelIndex(nextIndex);
      } else {
        if (incorrectReelsQueue.length > 0) {
            setDisplayedReels(incorrectReelsQueue);
            setIncorrectReelsQueue([]);
            setCurrentReelIndex(0);
        }
      }

      setReadyToAdvance(false);
      if (lastQuizOutcomeIsCorrect === true || lastQuizOutcomeIsCorrect === false) { 
        setLastQuizOutcomeIsCorrect(null);
      }
    }
  }, [readyToAdvance, displayedReels, currentReelIndex, lastQuizOutcomeIsCorrect, incorrectReelsQueue]);


  const handleTakeQuiz = (quiz: QuizQuestion, reelId: string) => {
    setActiveQuiz({ quiz, reelId });
  };

  const handleQuizFinished = (isCorrect: boolean) => {
    if (!activeQuiz) return;

    const reelIdAttempted = activeQuiz.reelId;
    const quizIdAttempted = activeQuiz.quiz.id;
    const localCurrentIndex = currentReelIndex; 

    // console.log(`LOG: HANDLE QUIZ FINISHED (Reel ID: ${reelIdAttempted}, Correct: ${isCorrect}) - Current Index at call: ${localCurrentIndex}`);
    
    markQuizAttempt(reelIdAttempted, quizIdAttempted, isCorrect);
    
    if (isCorrect) {
      setUserXPLevel(prevXPLevel => {
        let newXP = prevXPLevel.currentXP + XP_PER_CORRECT_ANSWER; 
        let newLevel = prevXPLevel.level;
        let xpRequiredForThisLevelUp = prevXPLevel.xpToNextLevel;
        let newXPToNextForNextLevel = prevXPLevel.xpToNextLevel;
        
        if (newXP >= xpRequiredForThisLevelUp) {
          newLevel++;
          newXP = newXP - xpRequiredForThisLevelUp; 
          newXPToNextForNextLevel = xpRequiredForThisLevelUp * 2; 
          
          setLevelUpMessage(`Level Up! You reached Level ${newLevel}!`);
          setTimeout(() => setLevelUpMessage(null), 3000);
        }
        const updatedXPData = { level: newLevel, currentXP: newXP, xpToNextLevel: newXPToNextForNextLevel };
        saveUserXPLevel(updatedXPData);
        // console.log("LOG: XP Awarded. New XP Data:", updatedXPData);
        return updatedXPData;
      });
    }

    setLastQuizOutcomeIsCorrect(isCorrect); 
    setUserQuizProgressVersion(v => v + 1); 

    if (!isCorrect) {
        const failedReelData = allFetchedReels.find(r => r.id === reelIdAttempted);
        if (failedReelData) {
            setIncorrectReelsQueue(prevQueue => [...prevQueue, failedReelData]);
        }
    }
        
    setActiveQuiz(null); 
    setReadyToAdvance(true); 
  };
  
  if (isLoading) {
    return <div className="flex-grow bg-[#181818] flex items-center justify-center text-slate-100 p-4 text-center" role="status" aria-live="polite">{statusMessage || 'Loading reels...'}</div>;
  }

  let contentToRender;
  if (displayedReels.length === 0) {
      contentToRender = <div className="flex-grow bg-[#181818] flex items-center justify-center text-slate-100 p-4 text-center">{statusMessage || 'No reels available. Check back later!'}</div>;
  } else {
      const safeCurrentReelIndex = currentReelIndex % displayedReels.length;
      const currentReel = displayedReels[safeCurrentReelIndex];

      if (!currentReel) {
          // console.error("LOG: RENDER - currentReel is undefined! Safe Index:", safeCurrentReelIndex, "Raw Index:", currentReelIndex, "Queue Length:", displayedReels.length);
          if (displayedReels.length > 0 && safeCurrentReelIndex !== 0 && currentReelIndex >= displayedReels.length) {
               // console.warn("LOG: RENDER - Attempting to reset currentReelIndex to 0 due to undefined currentReel and out of bounds index.");
               setCurrentReelIndex(0); 
               contentToRender = <div className="flex-grow bg-[#181818] flex items-center justify-center text-slate-100 p-4 text-center">Correcting reel display...</div>;
          } else {
              contentToRender = <div className="flex-grow bg-[#181818] flex items-center justify-center text-slate-100 p-4 text-center">Error loading current reel. Please refresh.</div>;
          }
      } else {
          // console.log("LOG: RENDER - Displaying reel:", currentReel.id, "at index:", safeCurrentReelIndex);
          contentToRender = (
              <section 
                key={currentReel.id + '-' + safeCurrentReelIndex + '-' + (currentReel as any).__requeuedMarker} 
                id={`reel-section-${currentReel.id}`}
                className="h-full w-full shrink-0" 
                aria-roledescription="current-reel"
              >
                 <ReelCard 
                    reel={currentReel} 
                    onTakeQuiz={handleTakeQuiz}
                    isQuizPassed={!!(currentReel.quiz && getUserQuizProgress()[currentReel.id]?.correctlyAnswered && getUserQuizProgress()[currentReel.id]?.quizId === currentReel.quiz.id)}
                    isActive={safeCurrentReelIndex === currentReelIndex}
                 />
              </section>
          );
      }
  }

  return (
    <>
      <XPBar 
        currentXP={userXPLevel.currentXP}
        xpToNextLevel={userXPLevel.xpToNextLevel}
        currentLevel={userXPLevel.level}
      />
      {levelUpMessage && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-lg z-50 animate-bounce">
          {levelUpMessage}
        </div>
      )}
      <div 
        className="flex-grow bg-black w-full flex flex-col relative" 
        aria-label="Personalized Reels feed"
        role="region" 
      >
        {contentToRender}
      </div>
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz.quiz}
          onQuizFinished={handleQuizFinished} 
        />
      )}
    </>
  );
};

export default ReelsPage;
