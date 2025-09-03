import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-emerald-500 text-white p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🦜</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">AskSarawak</h1>
          <p className="text-gray-600 mt-2">Tourism Assistant for Booth Staff</p>
        </div>

        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignUpForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}