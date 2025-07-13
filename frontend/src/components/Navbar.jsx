/**
 * Navbar component for Job Application Tracker.
 * Sticky, mobile responsive, with dark mode toggle and user dropdown.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout, onToggleDark }) => {
  const [open, setOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false); // Hamburger menu state
  const navigate = useNavigate();

  // Handle logout (mock)
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    // Main navigation bar with glassmorphic styling
    <nav className="
      sticky top-0 z-40
      bg-white bg-opacity-5 backdrop-filter backdrop-blur-lg
      border-b border-opacity-10 border-white
      px-4 py-3 shadow-lg
      flex items-center justify-between
      text-white
    ">
      <div className="flex items-center gap-4">
        {/* Application title */}
        <span className="font-bold text-xl text-white">JobTracker</span>
        {/* Hamburger for mobile navigation */}
        {user && (
          <button
            className="md:hidden ml-2 p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
            onClick={() => setNavOpen(v => !v)}
            aria-label="Toggle navigation menu"
          >
            <span className="text-2xl">☰</span>
          </button>
        )}
        {/* Desktop navigation links */}
        {user && (
          <div className="hidden md:flex gap-4">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/applications" className="hover:underline">Applications</Link>
            <Link to="/admin" className="hover:underline">Admin</Link>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {/* Dark mode toggle button */}
        <button
          onClick={onToggleDark}
          className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
          title="Toggle dark mode"
          aria-label="Toggle dark mode"
        >
          <span role="img" aria-label="dark mode">🌓</span>
        </button>
        {/* User dropdown or Login link */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setOpen(o => !o)}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {user.email || 'User'} ▼
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border rounded shadow z-10">
                <button
                  onClick={() => { navigate('/profile'); setOpen(false); }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >Profile</button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="
              px-4 py-2 rounded-lg
              bg-gradient-to-r from-gray-700 to-gray-950
              text-white font-semibold
              hover:from-gray-800 hover:to-black
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600
              transition-all duration-300 ease-in-out
            "
          >
            Login
          </Link>
        )}
      </div>
      {/* Mobile navigation links dropdown */}
      {user && navOpen && (
        <div className="absolute left-0 top-full w-full bg-white dark:bg-gray-900 border-t md:hidden flex flex-col items-start px-4 py-2 gap-2 shadow z-30">
          <Link to="/dashboard" className="hover:underline w-full" onClick={() => setNavOpen(false)}>Dashboard</Link>
          <Link to="/applications" className="hover:underline w-full" onClick={() => setNavOpen(false)}>Applications</Link>
          <Link to="/admin" className="hover:underline w-full" onClick={() => setNavOpen(false)}>Admin</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
