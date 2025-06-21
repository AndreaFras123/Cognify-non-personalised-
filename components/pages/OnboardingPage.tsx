import React, { useState } from 'react';
import { UserPreferences } from '../../types';
import { saveUserPreferences, markOnboardingCompleted } from '../../services/userService';
import { FibonacciSpiralIcon } from '../../constants';


interface OnboardingPageProps {
  onComplete: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      setNameError('');
    }
  };

  const handleFinishOnboarding = () => {
    if (name.trim() === '') {
      setNameError('Please enter your name.');
      return;
    }
    setNameError('');

    const preferences: UserPreferences = {
      name: name.trim(),
      interests: [], // Interests are no longer collected
    };
    saveUserPreferences(preferences);
    markOnboardingCompleted();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#181818] text-slate-100 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <FibonacciSpiralIcon className="w-24 h-auto text-sky-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-slate-100 mb-2 font-poppins-semibold">Welcome to Cognify</h1> {/* Main title also semibold */}
            <p className="text-slate-300">Your learning journey starts now.</p>
        </div>

        <div className="bg-[#2D2D2D] p-6 sm:p-8 rounded-xl shadow-2xl space-y-6">
          <h2 className="text-2xl font-semibold text-center text-slate-100 font-poppins-semibold">What should we call you?</h2> {/* Applied Poppins Semibold */}
          <div>
            <label htmlFor="name" className="sr-only">Your Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              className={`w-full p-3 bg-[#383838] text-slate-100 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 ${nameError ? 'border-red-500 ring-red-500' : 'border-transparent'}`}
              aria-describedby={nameError ? "name-error" : undefined}
              aria-invalid={!!nameError}
            />
            {nameError && <p id="name-error" className="text-red-400 text-sm mt-1">{nameError}</p>}
          </div>
          <button
            onClick={handleFinishOnboarding}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2D2D2D] focus:ring-sky-500"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;