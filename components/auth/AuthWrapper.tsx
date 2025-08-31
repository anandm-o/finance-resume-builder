'use client';

import { useState } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthWrapper() {
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser, logout } = useFirebase();

  if (currentUser) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg mb-4">
          Welcome back, {currentUser.displayName || currentUser.email}!
        </div>
        <button
          onClick={logout}
          className="btn-outline"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Auth Tabs */}
      <div className="flex mb-8 border-b border-finance-200">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            isLogin
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-finance-500 hover:text-finance-700'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            !isLogin
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-finance-500 hover:text-finance-700'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Auth Forms */}
      {isLogin ? <LoginForm /> : <SignupForm />}

      {/* Switch Form Text */}
      <div className="text-center mt-6">
        <p className="text-sm text-finance-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
