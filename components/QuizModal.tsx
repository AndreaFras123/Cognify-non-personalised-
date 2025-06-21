
import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizOption } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';

interface QuizModalProps {
  quiz: QuizQuestion;
  onQuizFinished: (isCorrect: boolean) => void; // Called when the "Close" button (after feedback) is clicked
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, onQuizFinished }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);

  // Reset state if quiz changes
  useEffect(() => {
    setSelectedOptionId(null);
    setFeedback(null);
    setSubmitted(false);
    setIsCorrectAnswer(false);
  }, [quiz]);

  const handleOptionSelect = (optionId: string) => {
    if (submitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || submitted) return;

    const correct = selectedOptionId === quiz.correctOptionId;
    setIsCorrectAnswer(correct);
    setSubmitted(true);

    if (correct) {
      setFeedback({ type: 'correct', message: 'Correct!' });
    } else {
      const correctOptionText = quiz.options.find(opt => opt.id === quiz.correctOptionId)?.text;
      setFeedback({ type: 'incorrect', message: `Incorrect. The correct answer was: ${correctOptionText}` });
    }
    // Do not call onQuizFinished here; wait for the user to click "Close"
  };

  const handleCloseAfterFeedback = () => {
    onQuizFinished(isCorrectAnswer);
  };

  const getButtonClass = (option: QuizOption) => {
    let baseClass = "w-full text-left p-3 my-2 rounded-md transition-colors duration-150 border-2 ";
    if (submitted) {
      if (option.id === quiz.correctOptionId) {
        return baseClass + "bg-green-500 border-green-700 text-white";
      }
      if (option.id === selectedOptionId && option.id !== quiz.correctOptionId) {
        return baseClass + "bg-red-500 border-red-700 text-white";
      }
      return baseClass + "bg-[#2D2D2D] border-transparent text-slate-400 cursor-not-allowed";
    }
    if (option.id === selectedOptionId) {
      return baseClass + "bg-sky-500 border-sky-600 text-white ring-2 ring-sky-300 ring-offset-1 ring-offset-[#202020]";
    }
    return baseClass + "bg-[#383838] border-[#4A4A4A] hover:bg-[#4A4A4A] text-slate-200";
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-title"
    >
      <div className="bg-[#2D2D2D] p-6 rounded-lg shadow-xl w-full max-w-md text-slate-100">
        <h2 id="quiz-title" className="text-xl font-semibold mb-4 font-poppins-semibold">{quiz.questionText}</h2> {/* Applied Poppins Semibold */}
        
        <div role="radiogroup" aria-labelledby="quiz-title">
          {quiz.options.map((option) => (
            <button
              key={option.id}
              role="radio"
              aria-checked={selectedOptionId === option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={submitted}
              className={getButtonClass(option)}
            >
              {option.text}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`mt-4 p-3 rounded-md flex items-center text-sm ${feedback.type === 'correct' ? 'bg-green-600' : 'bg-red-600'}`}>
            {feedback.type === 'correct' ? 
              <CheckCircleIcon className="w-5 h-5 mr-2 text-white" /> : 
              <XCircleIcon className="w-5 h-5 mr-2 text-white" />}
            {feedback.message}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOptionId}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
             <button
              onClick={handleCloseAfterFeedback} // This button now triggers onQuizFinished
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Next Reel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;