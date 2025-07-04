import React from 'react';
import { Plus, Calendar, MapPin } from 'lucide-react';

export const TripGrid: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Trips</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create and manage your travel plans all in one place. Start planning your next adventure today.
        </p>
      </div>

      {/* Empty State */}
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
        <p className="text-gray-600 mb-8">Start planning your first adventure and create unforgettable memories</p>
        
        <button className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto">
          <Plus className="w-5 h-5" />
          <span>Create Your First Trip</span>
        </button>
      </div>

      {/* Trip Grid (for future trips) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {/* This will be populated with actual trips later */}
      </div>
    </div>
  );
};