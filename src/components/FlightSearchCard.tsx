import React, { useState } from 'react';
import { Plane, Search, Loader2 } from 'lucide-react';

interface FlightSearchCardProps {
  onSearch: () => Promise<void>;
  loading: boolean;
}

export const FlightSearchCard: React.FC<FlightSearchCardProps> = ({ onSearch, loading }) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      await onSearch();
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center shadow-lg">
          <Plane className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Find Flights</h3>
          <p className="text-sm text-gray-600 flex items-center space-x-1">
            <span>✈️</span>
            <span>Search for the perfect flight</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
            <input
              type="text"
              defaultValue="NYC"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
            <input
              type="text"
              defaultValue="Tokyo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Departure</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Return</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span className="text-lg">🛫</span>
            </>
          )}
          <span>{isSearching ? 'Searching...' : 'Find the perfect flight'}</span>
        </button>
      </div>
    </div>
  );
};