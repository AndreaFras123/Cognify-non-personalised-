
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';

interface BottomNavigationBarProps {
  navItems: NavItem[];
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({ navItems }) => {
  const location = useLocation();

  return (
    <nav className="bg-[#202020] shadow-t-lg z-40 relative"> {/* Added z-40 and relative for stacking context */}
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center w-1/3 h-full transition-colors duration-200 group 
                ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <IconComponent className={`h-6 w-6 ${isActive ? 'fill-white stroke-white' : 'fill-current stroke-current'}`} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigationBar;
