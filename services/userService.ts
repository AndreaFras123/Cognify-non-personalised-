import { UserPreferences, UserQuizProgress, UserXPLevel } from '../types';
import { LOCAL_STORAGE_KEYS, XP_FOR_LEVEL_UP } from '../constants';

export const getUserPreferences = (): UserPreferences | null => {
  const storedPrefs = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES);
  if (storedPrefs) {
    try {
      return JSON.parse(storedPrefs) as UserPreferences;
    } catch (error) {
      console.error("Failed to parse user preferences:", error);
      return null;
    }
  }
  return null;
};

export const saveUserPreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save user preferences:", error);
  }
};

export const isOnboardingCompleted = (): boolean => {
  const completed = localStorage.getItem(LOCAL_STORAGE_KEYS.ONBOARDING_COMPLETED);
  return completed === 'true';
};

export const markOnboardingCompleted = (): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
};

export const clearOnboardingData = (): void => { 
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ONBOARDING_COMPLETED);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_QUIZ_PROGRESS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_XP_LEVEL); // Clear XP and level data
    console.log("Onboarding, quiz, and XP data cleared.");
}

// Quiz Progress Management
export const getUserQuizProgress = (): UserQuizProgress => {
  const storedProgress = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_QUIZ_PROGRESS);
  if (storedProgress) {
    try {
      return JSON.parse(storedProgress) as UserQuizProgress;
    } catch (error) { // Corrected syntax for the catch block
      console.error("Failed to parse quiz progress:", error);
      return {};
    }
  }
  return {};
};

export const saveUserQuizProgress = (progress: UserQuizProgress): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_QUIZ_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save quiz progress:", error);
  }
};

export const markQuizAttempt = (reelId: string, quizId: string, correctlyAnswered: boolean): void => {
  const progress = getUserQuizProgress();
  progress[reelId] = {
    quizId,
    correctlyAnswered,
    timestamp: Date.now(),
  };
  saveUserQuizProgress(progress);
};

// Updated to optionally accept progress to avoid stale reads in rapid updates
export const hasQuizBeenAnsweredCorrectly = (
  reelId: string, 
  quizIdToCheck?: string,
  currentProgress?: UserQuizProgress
): boolean => {
  if (!quizIdToCheck) return false;
  const progress = currentProgress || getUserQuizProgress(); // Use provided progress or fetch
  const attempt = progress[reelId];
  return !!attempt && attempt.quizId === quizIdToCheck && attempt.correctlyAnswered;
};

// XP and Level Management
export const getUserXPLevel = (): UserXPLevel => {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_XP_LEVEL);
  if (storedData) {
    try {
      return JSON.parse(storedData) as UserXPLevel;
    } catch (error) {
      console.error("Failed to parse XP/Level data:", error);
    }
  }
  // Default values if nothing stored or parsing fails
  return {
    level: 1,
    currentXP: 0,
    xpToNextLevel: XP_FOR_LEVEL_UP,
  };
};

export const saveUserXPLevel = (xpLevelData: UserXPLevel): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_XP_LEVEL, JSON.stringify(xpLevelData));
  } catch (error) {
    console.error("Failed to save XP/Level data:", error);
  }
};
