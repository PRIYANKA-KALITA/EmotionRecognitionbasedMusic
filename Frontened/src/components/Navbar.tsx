import React, { useState } from 'react';
import { Search, User, Music } from 'lucide-react';

const Navbar = () => {
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <nav className="bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">Thrillbit</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className={`relative ${searchFocus ? 'ring-2 ring-purple-500' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full bg-white/10 border border-transparent rounded-full py-2 pl-10 pr-3 text-white placeholder-gray-400
                         focus:outline-none focus:bg-white/20 transition-all duration-300"
                placeholder="Search for music..."
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
              />
            </div>
          </div>

          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200">
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;