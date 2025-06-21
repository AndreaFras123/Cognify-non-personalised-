import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../TopBar';
import { INTEREST_OPTIONS } from '../../constants';
import { Interest, UserPreferences } from '../../types';
import { getUserPreferences, saveUserPreferences, clearOnboardingData } from '../../services/userService';

const ProfilePage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [selectedInterests, setSelectedInterests] = useState<Set<Interest>>(new Set());
  const [initialInterests, setInitialInterests] = useState<Set<Interest>>(new Set());
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const preferences = getUserPreferences();
    if (preferences) {
      setName(preferences.name);
      const currentInterests = new Set(preferences.interests);
      setSelectedInterests(currentInterests);
      setInitialInterests(new Set(currentInterests)); // Store initial state for comparison
    } else {
      // Should not happen if onboarding is complete, but handle gracefully
      setMessage('Could not load user preferences.');
      // navigate('/'); // Optionally redirect if no prefs
    }
    setIsLoading(false);
  }, [navigate]);

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests(prev => {
      const newInterests = new Set(prev);
      if (newInterests.has(interest)) {
        newInterests.delete(interest);
      } else {
        newInterests.add(interest);
      }
      return newInterests;
    });
    setMessage(''); // Clear any previous messages
  };

  const arraysEqual = (a: Interest[], b: Interest[]) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    for (let i = 0; i < sortedA.length; i++) {
      if (sortedA[i] !== sortedB[i]) return false;
    }
    return true;
  };

  const handleSaveChanges = () => {
    const currentSelectedArray = Array.from(selectedInterests);
    const initialSelectedArray = Array.from(initialInterests);

    if (arraysEqual(currentSelectedArray, initialSelectedArray)) {
      setMessage('No changes to save.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const updatedPreferences: UserPreferences = {
      name: name, // Name is not editable in this version, but included for structure
      interests: currentSelectedArray,
    };
    saveUserPreferences(updatedPreferences);
    setInitialInterests(new Set(selectedInterests)); // Update initial state to current
    setMessage('Preferences updated successfully!');
    console.log('Updated preferences:', updatedPreferences); // For verification
    // Re-log preferences in console for clarity
     const userPrefs = getUserPreferences();
      if (userPrefs) {
        console.log("User Preferences Updated & Reloaded on Profile Page:");
        console.log("Name:", userPrefs.name);
        console.log("Interests:", userPrefs.interests.join(', ') || "No interests selected");
      }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
      clearOnboardingData();
      setMessage('Progress has been reset. The app will now reload.');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-grow bg-[#181818] flex items-center justify-center text-slate-100">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-[#181818] text-slate-100">
      <TopBar title="Profile" showIcons={false} />
      <main className="flex-grow p-4 md:p-6 space-y-6 overflow-y-auto">
        <section className="bg-[#2D2D2D] p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-slate-100 mb-1 font-poppins-semibold"> {/* Applied Poppins Semibold */}
            Name: <span className="font-normal text-sky-400">{name}</span>
          </h2>
          <p className="text-sm text-slate-400">Your registered name.</p>
        </section>

        <section className="bg-[#2D2D2D] p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-slate-100 mb-4 font-poppins-semibold">Your Interests</h2> {/* Applied Poppins Semibold */}
          <p className="text-sm text-slate-400 mb-4">Select the topics you're interested in to personalize your content.</p>
          <div className="space-y-3">
            {INTEREST_OPTIONS.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`w-full p-3 rounded-md text-left transition-all duration-150 ease-in-out border-2
                  ${selectedInterests.has(interest)
                    ? 'bg-sky-500 border-sky-500 text-white font-medium ring-2 ring-sky-300 ring-offset-1 ring-offset-[#2D2D2D]'
                    : 'bg-[#383838] border-[#4A4A4A] text-slate-200 hover:bg-[#4A4A4A] hover:border-sky-600'}`}
                aria-pressed={selectedInterests.has(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </section>

        {message && (
          <div className={`p-3 rounded-md text-sm text-center
            ${message.includes('successfully') ? 'bg-green-600 text-white' : 
            (message.includes('No changes') ? 'bg-yellow-500 text-black' : 'bg-sky-600 text-white')}`}>
            {message}
          </div>
        )}

        <button
          onClick={handleSaveChanges}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#181818] focus:ring-green-500"
        >
          Save Changes
        </button>
         <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#181818] focus:ring-gray-500"
          >
            Back
          </button>
        <button
          onClick={handleResetProgress}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#181818] focus:ring-red-500"
        >
          Reset Progress
        </button>
      </main>
    </div>
  );
};

export default ProfilePage;