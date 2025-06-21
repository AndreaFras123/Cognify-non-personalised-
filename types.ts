
import React from 'react';

export interface NavItem {
  path: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  activeIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type Interest = 'History' | 'Science' | 'Technology & Programming' | 'Mathematics';

export interface QuizOption {
  id: string;
  text: string;
}
export interface QuizQuestion {
  id: string; // Unique ID for the quiz question itself
  questionText: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface ReelContent {
  id: string; // Unique ID for the reel
  type: 'image' | 'video'; // Changed to include 'video'
  sourceUrl: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  description: string;
  likes: number;
  comments: number;
  tags?: Interest[];
  quiz?: QuizQuestion; // Optional quiz associated with the reel
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface UserPreferences {
  name: string;
  interests: Interest[];
}

// Stores progress for quizzes associated with reels
// Key is reelId, value indicates if the specific quiz was answered and if correctly
export interface UserQuizProgress {
  [reelId: string]: {
    quizId: string; // ID of the quiz taken for this reel
    correctlyAnswered: boolean;
    timestamp: number; // When the quiz was last attempted
  };
}

export interface UserXPLevel {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
}