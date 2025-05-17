import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, UserCog, Sliders, LogOut } from 'lucide-react';
import type { UserPreferences } from '../types/emotion';

interface UserMenuProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ preferences, onUpdatePreferences, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
      >
        <User className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <MenuItem
              icon={<UserCog className="w-4 h-4" />}
              text="Profile Settings"
              onClick={() => {}}
            />
            <MenuItem
              icon={<Settings className="w-4 h-4" />}
              text="Account Management"
              onClick={() => {}}
            />
            <MenuItem
              icon={<Sliders className="w-4 h-4" />}
              text="Preferences"
              onClick={() => {}}
            />
            <div className="border-t border-gray-700 my-1" />
            <MenuItem
              icon={<LogOut className="w-4 h-4" />}
              text="Logout"
              onClick={onLogout}
              className="text-red-400 hover:text-red-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  className?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, onClick, className = '' }) => (
  <button
    className={`w-full px-4 py-2 text-sm flex items-center space-x-2 hover:bg-white/5 ${className}`}
    onClick={onClick}
  >
    {icon}
    <span>{text}</span>
  </button>
);



export default UserMenu;