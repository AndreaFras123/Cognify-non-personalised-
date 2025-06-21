
import React from 'react';
import UserIcon from './icons/UserIcon';
import NotificationIcon from './icons/NotificationIcon';

interface TopBarProps {
  title: string;
  showIcons?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ title, showIcons = true }) => {
  return (
    <header className="bg-[#181818] p-4 flex justify-between items-center sticky top-0 z-10 h-16"> {/* Updated background */}
      <h1 className="text-xl font-bold text-slate-100 font-poppins-semibold">{title}</h1> {/* Applied Poppins Semibold */}
      {showIcons && (
        <div className="flex items-center space-x-4">
          <UserIcon className="w-6 h-6 text-slate-300 hover:text-slate-100 cursor-pointer" aria-label="User profile" />
          <NotificationIcon className="w-6 h-6 text-slate-300 hover:text-slate-100 cursor-pointer" aria-label="Notifications" />
        </div>
      )}
    </header>
  );
};

export default TopBar;