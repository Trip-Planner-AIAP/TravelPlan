import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, User } from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();

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

          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Trip Planner</span>
          </div>
        </div>
      </div>
    </header>
  );
};