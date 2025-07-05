import React, { useState } from 'react';
import { Plane, Search, Loader2, Check, Plus } from 'lucide-react';
import { X } from 'lucide-react';
import type { Flight } from '../types';

interface FlightSearchCardProps {
  onSearch: () => Promise<void>;
  loading: boolean;
  flights: Flight[];
  onSelectFlight: (flight: Flight) => Promise<void>;
  onDeselectFlight: (flightId: string) => Promise<{ success: boolean; error?: any }>;
  selectedFlights: Flight[];
}

export const FlightSearchCard: React.FC<FlightSearchCardProps> = ({ 
  onSearch, 
  loading, 
  flights, 
  onSelectFlight, 
  onDeselectFlight,
  selectedFlights 
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      await onSearch();
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectFlight = async (flight: Flight) => {
    try {
      const result = await onSelectFlight(flight);
      if (result && result.success) {
        console.log('Flight selected successfully');
      }
    } catch (error) {
      console.error('Error selecting flight:', error);
    }
  };

  const handleDeselectFlight = async (flightId: string) => {
    try {
      const result = await onDeselectFlight(flightId);
      if (result.success) {
      if (response.error) {
        throw new Error(response.error.message);
      } else {
      } else {
        console.error('Failed to remove flight:', result.error);
      }
    } catch (error) {
      console.error('Error removing flight:', error);
      // Show user-friendly error message
      alert('Failed to remove flight. Please try again.');
    }
  };

  const isFlightSelected = (flightId: string) => {
    return selectedFlights.some(f => f.id === flightId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center shadow-lg">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Flight Booking</h3>
            <p className="text-sm text-gray-600 flex items-center space-x-1">
              <span>✈️</span>
              <span>Search and select flights</span>
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
            <span>{isSearching ? 'Searching...' : 'Search Flights'}</span>
          </button>
        </div>
      </div>

      {/* Flight Results */}
      {showResults && flights.length > 0 && (
        <div className="p-6 bg-blue-50 border-t border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <span className="text-lg">🛫</span>
            <span>Available Flights</span>
          </h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {flights.map((flight) => (
              <div
                key={flight.id}
                className={`border rounded-xl p-4 transition-all hover:shadow-md ${
                  isFlightSelected(flight.id)
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">✈️</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{flight.airline}</p>
                        <p className="text-sm text-gray-600">{flight.flight_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <span>🛫</span>
                        <span>{flight.origin}</span>
                      </span>
                      <span>→</span>
                      <span className="flex items-center space-x-1">
                        <span>🛬</span>
                        <span>{flight.destination}</span>
                      </span>
                    </div>
                    {flight.departure_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Departure: {new Date(flight.departure_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">${flight.price}</p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                    
                    <button
                      onClick={() => handleSelectFlight(flight)}
                      disabled={isFlightSelected(flight.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                        isFlightSelected(flight.id)
                          ? 'bg-green-600 text-white cursor-default'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                      }`}
                    >
                      {isFlightSelected(flight.id) ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Select</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Flights Summary */}
      {selectedFlights.length > 0 && (
        <div className="p-6 bg-green-50 border-t border-green-200">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
            <span className="text-lg">✅</span>
            <span>Selected Flights ({selectedFlights.length})</span>
          </h4>
          <div className="space-y-2">
            {selectedFlights.map((flight) => (
              <div key={flight.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
                <div className="flex items-center space-x-3">
                  <span className="text-sm">✈️</span>
                  <div>
                    <p className="font-medium text-gray-900">{flight.airline} {flight.flight_number}</p>
                    <p className="text-xs text-gray-600">{flight.origin} → {flight.destination}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-green-600">${flight.price}</p>
                  <button
                    onClick={() => handleDeselectFlight(flight.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full p-1 transition-all"
                    title="Remove flight"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-green-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-green-800">
                Total Flight Cost: ${selectedFlights.reduce((sum, f) => sum + (f.price || 0), 0)}
              </p>
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                ✅ Flights Confirmed
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};