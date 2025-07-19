import React from 'react';
import { supabase } from '../utils/supabaseClient';

const Navbar = ({ session }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-gray-900 text-white ">
      <div className="mycontainer flex justify-between items-center px-4 h-14 py-5">
        <div className="log font-bold text-2xl ">
          <span className="text-blue-800 border-b-2 border-white">Pass</span>
          <span className="text-red-800 border-t-2 border-white">Man</span>
          <span className="text-yellow-400">&#x26BF;</span>
        </div>

        {/* Container for the buttons */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/iasjad"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="text-white bg-gray-700 flex ring-gray-600 ring-1 rounded-full justify-between items-center hover:bg-gray-500 transition-all duration-200">
              <img
                className="invert w-10 p-1"
                src="icons/github-brands.svg"
                alt="Github Logo"
              />
              <span className="font-bold px-4">GitHub</span>
            </button>
          </a>

          {session && (
            <button
              onClick={handleLogout}
              className="text-white bg-gray-700 flex ring-gray-600 ring-1 rounded-full px-4 py-2 font-bold hover:bg-gray-500 transition-all duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
