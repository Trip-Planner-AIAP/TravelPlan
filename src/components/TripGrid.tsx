import React from 'react';
import { Plus, Calendar, MapPin, Clock, DollarSign, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import { TripTemplateCard } from './TripTemplateCard';
import { CreateTripModal } from './CreateTripModal';
import { useState } from 'react';

export const TripGrid: React.FC = () => {
  const { trips, loading, templates, clearAllTrips } = useTrips();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const navigate = useNavigate();

  const handleClearAllTrips = async () => {
    setIsClearing(true);
    try {
      await clearAllTrips();
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Error clearing trips:', error);
    } finally {
      setIsClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Trips</h2>
            <p className="text-gray-600">
              Create and manage your travel plans all in one place.
            </p>
          </div>

          {trips.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for your next adventure?</h3>
              <p className="text-gray-600 mb-8">Start planning your perfect trip and create unforgettable memories</p>
              
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Start Planning</span>
              </button>
            </div>
          ) : (
            /* Trip Grid */
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">My Trips ({trips.length})</h3>
                <div className="flex items-center space-x-3">
                  {trips.length > 0 && (
                    <button 
                      onClick={() => setShowClearConfirm(true)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear All</span>
                    </button>
                  )}
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Trip</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trips.map((trip) => (
                  <div 
                    key={trip.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/planner/${trip.id}`)}
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      <img 
                        src={trip.image_url} 
                        alt={trip.destination}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
                        {trip.duration_days} days
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{trip.title}</h4>
                      <p className="text-gray-600 mb-4 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {trip.destination}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(trip.start_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${trip.estimated_budget}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Destinations</h3>
            <p className="text-sm text-gray-600 mb-6">Get inspired by these curated itineraries</p>
            
            <div className="space-y-4">
              {templates.map((template) => (
                <TripTemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <CreateTripModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Clear All Trips Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Clear All Trips?</h3>
              <p className="text-gray-600">
                This will permanently delete all {trips.length} trip{trips.length !== 1 ? 's' : ''} and their associated data. 
                This action cannot be undone.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={isClearing}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllTrips}
                disabled={isClearing}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isClearing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Clearing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Trips</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};