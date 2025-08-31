'use client';

import { useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { User, LogOut, Settings, Menu, X } from 'lucide-react';

export default function Navigation() {
  const { currentUser, logout } = useFirebase();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-soft border-b border-finance-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-finance-800">Finance Resume Builder</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-finance-600 hover:text-finance-800 transition-colors">
              Home
            </a>
            {currentUser && (
              <a href="/dashboard" className="text-finance-600 hover:text-finance-800 transition-colors">
                Dashboard
              </a>
            )}
            <a href="/builder" className="text-finance-600 hover:text-finance-800 transition-colors">
              Builder
            </a>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-finance-700 hover:text-finance-900 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-finance-200 py-1 z-50">
                    <a
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-finance-700 hover:bg-finance-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-finance-700 hover:bg-finance-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </a>
                    <hr className="my-1 border-finance-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-finance-700 hover:bg-finance-50 text-left"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/auth"
                className="btn-primary"
              >
                Sign In
              </a>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-finance-600 hover:text-finance-800 hover:bg-finance-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-finance-200 py-4">
            <div className="space-y-2">
              <a
                href="/"
                className="block px-4 py-2 text-finance-600 hover:text-finance-800 hover:bg-finance-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              {currentUser && (
                <a
                  href="/dashboard"
                  className="block px-4 py-2 text-finance-600 hover:text-finance-800 hover:bg-finance-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </a>
              )}
              <a
                href="/builder"
                className="block px-4 py-2 text-finance-600 hover:text-finance-800 hover:bg-finance-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Builder
              </a>
              {currentUser && (
                <>
                  <hr className="border-finance-200" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-finance-600 hover:text-finance-800 hover:bg-finance-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
