import React from 'react';
import { MapPin, Clock, DollarSign, Sparkles } from 'lucide-react';
import { useTrips } from '../hooks/useTrips';
import type { TripTemplate } from '../types';
import { useState } from 'react';

interface TripTemplateCardProps {
  template: TripTemplate;
}

export const TripTemplateCard: React.FC<TripTemplateCardProps> = ({ template }) => {
  const { createTripFromTemplate } = useTrips();
  const [isCreating, setIsCreating] = useState(false);

  const handleUseTemplate = async () => {
    setIsCreating(true);
    try {
      const result = await createTripFromTemplate(template);
      if (result.error) {
        console.error('Error creating trip:', result.error);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video relative">
        <img 
          src={template.image_url} 
          alt={template.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
          <Sparkles className="w-3 h-3 mr-1" />
          Popular
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-1 text-sm">{template.title}</h4>
        <p className="text-xs text-gray-600 mb-3 flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {template.destination}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {template.duration_days} days
          </div>
          <div className="flex items-center">
            <DollarSign className="w-3 h-3 mr-1" />
            ${template.estimated_budget}
          </div>
        </div>
        
        <button
          onClick={handleUseTemplate}
          disabled={isCreating}
          className="w-full bg-orange-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? 'Creating...' : 'Use This Template'}
        </button>
      </div>
    </div>
  );
};