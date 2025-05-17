// src/components/Header.tsx
import React, { useState } from 'react';
import { Search, User, Settings, Bell, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom'; // NEW: Import useNavigate

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // NEW: State for search query
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMenuOption, setSelectedMenuOption] = useState<string | null>(null);

  const { user, isSignedIn } = useUser();
  const { openSignIn, signOut } = useClerk();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate(); // NEW: useNavigate hook

  // NEW: Handler for search – navigates to /player with the search query in location state
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate("/player", { state: { searchQuery } });
    }
  };

  // NEW: Trigger search on Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleProfileClick = () => {
    if (!isSignedIn) {
      openSignIn();
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const userName =
    isSignedIn && user
      ? user.fullName || user.firstName || 'User'
      : 'Sign In';

  return (
    <header className="h-16 bg-[#1B1B1B]/95 backdrop-blur-md fixed top-0 right-0 left-0 z-50 pl-24 md:pl-72">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
        <div className="flex-1 max-w-2xl mx-auto relative">
          {/* NEW: Search bar integrated in the header */}
          <div
            className={`relative rounded-full transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-orange-500' : ''}`}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for songs, artists, or albums..."
              className="w-full bg-white/5 text-white pl-10 pr-4 py-2 rounded-full outline-none placeholder-gray-400 transition-all duration-300 focus:bg-white/10"
              value={searchQuery} // NEW: Controlled input for search query
              onChange={(e) => setSearchQuery(e.target.value)} // NEW: Update search query state
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyPress={handleKeyPress} // NEW: Listen for Enter key
            />
            
            <button
              onClick={handleSearch} // NEW: Search button click handler
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-full bg-orange-500 text-white transition-colors duration-300 shadow-md"
            >
              Search
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-accent text-white rounded transition-colors duration-300"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors duration-300">
            <Bell className="h-5 w-5" />
          </button>
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleProfileClick}
              className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-white/5 transition-colors duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:block text-white">{userName}</span>
            </motion.button>
            <AnimatePresence>
              {isProfileOpen && isSignedIn && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-[#252525] rounded-lg shadow-lg py-1 z-50"
                >
                  <ProfileMenuItem
                    icon={<User size={16} />}
                    text="Profile"
                    onClick={() => {
                      setSelectedMenuOption("profile");
                      setIsProfileOpen(false);
                    }}
                  />
                  <ProfileMenuItem
                    icon={<Settings size={16} />}
                    text="Settings"
                    onClick={() => {
                      setSelectedMenuOption("settings");
                      setIsProfileOpen(false);
                    }}
                  />
                  <div className="border-t border-white/10 my-1" />
                  <ProfileMenuItem
                    text="Logout"
                    className="text-red-400"
                    onClick={() => signOut()}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {selectedMenuOption === "profile" && (
              <AnimatePresence>
                <motion.div
                  initial={{ x: 400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0 }}
                  className="fixed inset-y-0 right-0 w-full max-w-md md:max-w-lg bg-gradient-to-b from-blue-800 to-blue-900 shadow-2xl z-50"
                  onClick={() => setSelectedMenuOption(null)}
                >
                  <div className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                        alt="User Avatar"
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-blue-400">
                          {user?.fullName || user?.firstName || "User"}
                        </h2>
                        <p className="text-blue-200">
                          {user?.primaryEmailAddress?.emailAddress || "Email not available"}
                        </p>
                      </div>
                    </div>
                    <div className="mb-6 space-y-2">
                      <p className="text-blue-200">
                        <strong>Roll No:</strong> {user?.publicMetadata?.rollNo || "Not set"}
                      </p>
                      <p className="text-blue-200">
                        <strong>Favorite Genre:</strong> {user?.publicMetadata?.favoriteGenre || "Not set"}
                      </p>
                      <p className="text-blue-200">
                        <strong>Member Since:</strong> {user?.publicMetadata?.memberSince || "N/A"}
                      </p>
                      <p className="text-blue-200">
                        <strong>Account Type:</strong> {user?.publicMetadata?.accountType || "Free"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedMenuOption(null)}
                      className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
            {selectedMenuOption === "settings" && (
              <AnimatePresence>
                <motion.div
                  initial={{ x: 400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0 }}
                  className="fixed inset-y-0 right-0 w-full max-w-md md:max-w-lg bg-gradient-to-b from-blue-800 to-blue-900 shadow-2xl z-50"
                  onClick={() => setSelectedMenuOption(null)}
                >
                  <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-blue-400">Settings</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-blue-200 mb-1">Notification Preferences</label>
                        <select className="w-full p-2 rounded border border-blue-600 bg-blue-700 text-white">
                          <option>All Notifications</option>
                          <option>Email Only</option>
                          <option>None</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-blue-200 mb-1">Theme</label>
                        <select className="w-full p-2 rounded border border-blue-600 bg-blue-700 text-white">
                          <option>Dark</option>
                          <option>Light</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-blue-200 mb-1">Privacy Settings</label>
                        <select className="w-full p-2 rounded border border-blue-600 bg-blue-700 text-white">
                          <option>Public</option>
                          <option>Friends Only</option>
                          <option>Private</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-blue-200 mb-1">Language</label>
                        <select className="w-full p-2 rounded border border-blue-600 bg-blue-700 text-white">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMenuOption(null)}
                      className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

interface ProfileMenuItemProps {
  icon?: React.ReactNode;
  text: string;
  className?: string;
  onClick?: () => void;
}

const ProfileMenuItem = ({
  icon,
  text,
  className = '',
  onClick,
}: ProfileMenuItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 ${className}`}
  >
    {icon && <span>{icon}</span>}
    <span>{text}</span>
  </button>
);

export default Header;
