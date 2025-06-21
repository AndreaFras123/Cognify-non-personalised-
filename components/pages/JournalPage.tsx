
import React, { useState } from 'react';
import TopBar from '../TopBar';

const JournalPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    // In a real app, you would save this to local storage or a backend
    console.log('Journal Entry Saved:', { title, content });
    alert('Journal entry saved (check console)!');
  };

  return (
    <div className="flex-grow flex flex-col bg-[#181818] text-slate-100"> {/* Updated background */}
      <TopBar title="Journal" />
      <main className="flex-grow p-4 space-y-6 overflow-y-auto">
        <div>
          <label htmlFor="journalTitle" className="block text-sm font-medium text-slate-300 mb-1 font-poppins-regular"> {/* Applied Poppins Regular */}
            Title
          </label>
          <input
            type="text"
            id="journalTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title..."
            className="w-full p-3 bg-[#2D2D2D] text-slate-100 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400" /* Updated background */
          />
        </div>

        <div>
          <label htmlFor="journalContent" className="block text-sm font-medium text-slate-300 mb-1 font-poppins-regular"> {/* Applied Poppins Regular */}
            Notes
          </label>
          <textarea
            id="journalContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="The Fourier Transform is a..."
            rows={10}
            className="w-full p-3 bg-[#2D2D2D] text-slate-100 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 resize-none" /* Updated background */
          />
        </div>
        
        <button
          onClick={handleSave}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#181818] focus:ring-sky-500" /* Updated ring offset color */
        >
          Save Entry
        </button>
      </main>
    </div>
  );
};

export default JournalPage;