
import { NavItem, Interest } from './types';
import HomeIcon from './components/icons/HomeIcon';
import ReelsIcon from './components/icons/ReelsIcon';
import JournalIcon from './components/icons/JournalIcon';

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/reels', label: 'Reels', icon: ReelsIcon },
  { path: '/journal', label: 'Journal', icon: JournalIcon },
];

// Placeholder for Fibonacci Spiral SVG. A real one would be more complex.
// This is a very simplified abstract geometric pattern.
export const FibonacciSpiralIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 62" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      {/* Simplified representation of golden ratio spiral */}
      <path d="M0,61.8C0,61.8 38.2,61.8 38.2,38.2C38.2,14.6 61.8,14.6 61.8,0" />
      <rect x="0" y="0" width="38.2" height="38.2" strokeDasharray="2 2" strokeOpacity="0.5"/>
      <rect x="38.2" y="0" width="23.6" height="23.6" strokeDasharray="2 2" strokeOpacity="0.5"/>
      <rect x="38.2" y="23.6" width="14.6" height="14.6" strokeDasharray="2 2" strokeOpacity="0.5"/>
      <rect x="23.6" y="38.2" width="9" height="9" strokeDasharray="2 2" strokeOpacity="0.5"/>
       <path d="M0 38.2 A 38.2 38.2 0 0 1 38.2 0 M38.2 0 A 23.6 23.6 0 0 1 61.8 23.6 M61.8 23.6 A 14.6 14.6 0 0 1 47.2 38.2 M47.2 38.2 A 9 9 0 0 1 38.2 47.2"/>
    </svg>
  );

export const INTEREST_OPTIONS: Interest[] = ['History', 'Science', 'Technology & Programming', 'Mathematics'];

export const LOCAL_STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'cognify_onboarding_completed',
  USER_PREFERENCES: 'cognify_user_preferences',
  USER_QUIZ_PROGRESS: 'cognify_user_quiz_progress',
  USER_XP_LEVEL: 'cognify_user_xp_level', // Added for XP and level
};

export const XP_PER_CORRECT_ANSWER = 50; // Changed from 15 to 50
export const XP_FOR_LEVEL_UP = 100; // Base XP needed to go from Level 1 to Level 2
