import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, User, LogOut, LogIn } from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(true); // For demo purposes

  const handleAuthAction = () => {
    if (isLoggedIn) {
      // Sign out
      setIsLoggedIn(false);
      navigate('/login');
    } else {
      // Sign in
      navigate('/login');
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity group"
          >
            <Plane className="w-8 h-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">TripPlanner</h1>
          </button>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Trip Planner</span>
              </div>
              <button
                onClick={handleAuthAction}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignIn}
                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};