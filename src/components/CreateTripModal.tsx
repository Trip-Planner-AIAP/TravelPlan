import React, { useState } from 'react';
import { X, MapPin, Loader2, Calendar, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import type { TripTemplate } from '../types';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TripTemplate | null>(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { createCustomTrip, createTripFromTemplate, templates } = useTrips();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage('');

    let result;
    
    if (selectedTemplate) {
      // Use template with custom title if provided
      const templateToUse = title.trim() 
        ? { ...selectedTemplate, title: title.trim() }
        : selectedTemplate;
      result = await createTripFromTemplate(templateToUse);
    } else {
      // Create custom trip
      if (!title.trim() || !destination.trim()) {
        setMessage('Please fill in all required fields.');
        setIsSubmitting(false);
        return;
      }
      // Navigate to custom trip builder instead
      onClose();
      navigate('/custom-trip-builder', {
        state: { title: title.trim(), destination: destination.trim() }
      });
      setIsSubmitting(false);
      return;
    }

    if (result.error) {
      setMessage('Error creating trip. Please try again.');
    } else {
      if (result.data) {
        setMessage('Trip created successfully! Redirecting...');
        setTitle('');
        setDestination('');
        setSelectedTemplate(null);
        setTimeout(() => {
          onClose();
          setMessage('');
          navigate(`/planner/${result.data.id}`);
        }, 1000);
      }
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    setTitle('');
    setDestination('');
    setSelectedTemplate(null);
    setShowTemplateDropdown(false);
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative transform transition-all duration-300 scale-100">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Trip</h2>
          <p className="text-gray-600">Start planning your perfect adventure</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose a Template (Optional)
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors flex items-center justify-between text-left"
              >
                <span className={selectedTemplate ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedTemplate ? selectedTemplate.title : 'Select a sample plan or create custom'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showTemplateDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(null);
                      setShowTemplateDropdown(false);
                      setDestination('');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100"
                  >
                    <div className="font-medium text-gray-900">Create Custom Trip</div>
                    <div className="text-sm text-gray-500">Start from scratch</div>
                  </button>
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setDestination(template.destination);
                        setShowTemplateDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-orange-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{template.title}</div>
                          <div className="text-sm text-gray-500">{template.destination}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {template.duration_days} days • ${template.estimated_budget}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Trip Title {!selectedTemplate && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required={!selectedTemplate}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder={selectedTemplate ? `${selectedTemplate.title} (or customize)` : "e.g., Summer Vacation 2024"}
            />
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
              Destination {!selectedTemplate && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required={!selectedTemplate}
                disabled={!!selectedTemplate}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="e.g., Paris, France"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!selectedTemplate && (!title.trim() || !destination.trim()))}
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              selectedTemplate ? 'Create from Template' : 'Create Custom Trip'
            )}
          </button>

          {message && (
            <div className={`text-center p-3 rounded-lg ${
              message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};