import React, { useState } from 'react';
import { Shield, FileText, Loader2 } from 'lucide-react';

interface InsuranceCardProps {
  onGetQuote: () => Promise<void>;
  loading: boolean;
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({ onGetQuote, loading }) => {
  const [isGettingQuote, setIsGettingQuote] = useState(false);

  const handleGetQuote = async () => {
    setIsGettingQuote(true);
    try {
      await onGetQuote();
    } finally {
      setIsGettingQuote(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add Insurance</h3>
          <p className="text-sm text-gray-600 flex items-center space-x-1">
            <span>🛡️</span>
            <span>Protect your trip</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Coverage Type</label>
          <select 
            id="coverage-type"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="basic">Basic Coverage ($25K)</option>
            <option value="premium">Premium Coverage ($75K)</option>
            <option value="comprehensive">Comprehensive Coverage ($150K)</option>
          </select>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center space-x-1">
            <span>✅</span>
            <span>What's Covered:</span>
          </h4>
          <ul className="text-xs text-green-700 space-y-1">
            <li className="flex items-center space-x-1">
              <span>🏥</span>
              <span>Medical emergencies</span>
            </li>
            <li className="flex items-center space-x-1">
              <span>❌</span>
              <span>Trip cancellation</span>
            </li>
            <li className="flex items-center space-x-1">
              <span>🧳</span>
              <span>Lost luggage</span>
            </li>
            <li className="flex items-center space-x-1">
              <span>⏰</span>
              <span>Flight delays</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleGetQuote}
          disabled={isGettingQuote}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
        >
          {isGettingQuote ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span className="text-lg">🛡️</span>
            </>
          )}
          <span>{isGettingQuote ? 'Getting Quote...' : 'Protect your trip'}</span>
        </button>
      </div>
    </div>
  );
};