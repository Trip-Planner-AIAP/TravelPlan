import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, User, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // For demo purposes, just navigate to login
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

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Trip Planner</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};