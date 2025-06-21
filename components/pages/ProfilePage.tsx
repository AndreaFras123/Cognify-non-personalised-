import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../TopBar';
import { UserPreferences } from '../../types';
import { getUserPreferences, clearOnboardingData } from '../../services/userService';

const ProfilePage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const preferences = getUserPreferences();
    if (preferences) {
      setName(preferences.name);
    } else {
      // Should not happen if onboarding is complete, but handle gracefully
      setMessage('Could not load user preferences.');
    }
    setIsLoading(false);
  }, []);

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

        {message && (
          <div className={`p-3 rounded-md text-sm text-center
            ${message.includes('successfully') ? 'bg-green-600 text-white' : 
            (message.includes('No changes') ? 'bg-yellow-500 text-black' : 'bg-sky-600 text-white')}`}>
            {message}
          </div>
        )}

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