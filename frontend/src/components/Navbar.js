import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-black gradient-text">🎬 ANDYTUBE</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 items-center">
            <Link to="/about" className="text-gray-300 hover:text-purple-400 transition">About</Link>
            <Link to="/contact" className="text-gray-300 hover:text-purple-400 transition">Contact</Link>
            
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-300 font-medium">Profile</span>
                </Link>

                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="btn-gradient px-6 py-2 rounded-lg text-white transform hover:scale-105 transition"
                  >
                    ⚙️ Admin
                  </Link>
                )}

                <button
                  onClick={onLogout}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-red-500/50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-green-500/50 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-purple-400 hover:text-purple-300 transition"
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-purple-500/20 pt-4">
            <Link to="/about" className="block px-4 py-2 text-gray-300 hover:text-purple-400">
              About
            </Link>
            <Link to="/contact" className="block px-4 py-2 text-gray-300 hover:text-purple-400">
              Contact
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="block px-4 py-2 text-purple-400 hover:text-purple-300">
                  Profile
                </Link>
                {user.isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 text-purple-400 hover:text-purple-300">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-blue-400 hover:text-blue-300">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 text-green-400 hover:text-green-300">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
