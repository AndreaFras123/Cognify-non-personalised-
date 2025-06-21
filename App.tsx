import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import ReelsPage from './components/pages/ReelsPage';
import JournalPage from './components/pages/JournalPage';
import ProfilePage from './components/pages/ProfilePage'; // Import ProfilePage
import BottomNavigationBar from './components/BottomNavigationBar';
import OnboardingPage from './components/pages/OnboardingPage';
import { NAV_ITEMS } from './constants';
import { isOnboardingCompleted as checkOnboardingCompleted, getUserPreferences } from './services/userService';

const App: React.FC = () => {
  const [onboardingCompleted, setOnboardingCompleted] = useState(checkOnboardingCompleted());
  const navigate = useNavigate();

  useEffect(() => {
    const userPrefs = getUserPreferences();
    if (onboardingCompleted) {
        if (userPrefs) {
            console.log("User Preferences Loaded:");
            console.log("Name:", userPrefs.name);
            console.log("Interests:", userPrefs.interests.join(', ') || "No interests selected");
        } else {
            console.log("Onboarding completed, but no preferences found. This might indicate an issue or a reset.");
        }
    } else if (userPrefs) {
        console.log("User preferences exist but onboarding is not marked as completed. Showing onboarding.");
    }
  }, [onboardingCompleted]);

  const handleOnboardingComplete = () => {
    setOnboardingCompleted(true);
    const userPrefs = getUserPreferences();
    if (userPrefs) {
        console.log("Onboarding Complete! User Preferences:");
        console.log("Name:", userPrefs.name);
        console.log("Interests:", userPrefs.interests.join(', ') || "No interests selected");
    }
    navigate('/');
  };

  if (!onboardingCompleted) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="h-full flex flex-col bg-[#181818]">
      <div className="flex-grow overflow-hidden flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* Add ProfilePage route */}
        </Routes>
      </div>
      <BottomNavigationBar navItems={NAV_ITEMS} />
    </div>
  );
};

export default App;