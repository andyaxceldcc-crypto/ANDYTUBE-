import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-gray-900 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-600">
          🎬 ANDYTUBE
        </Link>

        <div className="flex gap-4">
          {user ? (
            <>
              <span className="text-gray-300">{user.name}</span>
              {user.isAdmin && (
                <Link to="/admin" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={onLogout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                Login
              </Link>
              <Link to="/register" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
