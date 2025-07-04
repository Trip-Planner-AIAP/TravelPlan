import React, { useState } from 'react';
import { X, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { signInWithEmail, signUpWithEmail, continueAsGuest } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const { error } = isSignUp 
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);

    if (error) {
      setMessage(error.message || 'Authentication failed. Please try again.');
    } else {
      setMessage(isSignUp ? 'Account created successfully!' : 'Signed in successfully!');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 1000);
    }

    setIsSubmitting(false);
  };

  const handleGuestMode = () => {
    continueAsGuest();
    // Close modal and let the navigation happen via useEffect in LandingPage
    setTimeout(() => {
      onClose();
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account to start planning' : 'Sign in to continue planning your trips'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage('');
              }}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
          {message && (
            <div className={`text-center p-3 rounded-lg ${
              message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleGuestMode}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
          >
            Continue as Guest
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Explore features without creating an account
          </p>
        </div>
      </div>
    </div>
  );
};