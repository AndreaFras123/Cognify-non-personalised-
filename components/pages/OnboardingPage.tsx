
import React, { useState } from 'react';
import { INTEREST_OPTIONS, LOCAL_STORAGE_KEYS } from '../../constants';
import { Interest, UserPreferences } from '../../types';
import { saveUserPreferences, markOnboardingCompleted } from '../../services/userService';
import { FibonacciSpiralIcon } from '../../constants';


interface OnboardingPageProps {
  onComplete: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<Set<Interest>>(new Set());
  const [nameError, setNameError] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      setNameError('');
    }
  };

  const handleNextStep = () => {
    if (name.trim() === '') {
      setNameError('Please enter your name.');
      return;
    }
    setNameError('');
    setStep(2);
  };

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
  };

  const handleFinishOnboarding = () => {
    const preferences: UserPreferences = {
      name: name.trim(),
      interests: Array.from(selectedInterests),
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
            <p className="text-slate-300">Let's personalize your learning journey.</p>
        </div>

        {step === 1 && (
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
              onClick={handleNextStep}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2D2D2D] focus:ring-sky-500"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-[#2D2D2D] p-6 sm:p-8 rounded-xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-semibold text-center text-slate-100 font-poppins-semibold"> {/* Applied Poppins Semibold */}
              What are you interested in, <span className="text-sky-400">{name.trim()}</span>?
            </h2>
            <p className="text-sm text-center text-slate-400">Select all that apply.</p>
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
            <button
              onClick={handleFinishOnboarding}
              disabled={selectedInterests.size === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2D2D2D] focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Get Started
            </button>
             <button
              onClick={() => setStep(1)}
              className="w-full mt-2 text-sky-400 hover:text-sky-300 text-sm text-center"
            >
              Back to name
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;