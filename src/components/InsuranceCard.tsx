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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add Insurance</h3>
          <p className="text-sm text-gray-600">Protect your trip</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Coverage Type</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="basic">Basic Coverage</option>
            <option value="premium">Premium Coverage</option>
            <option value="comprehensive">Comprehensive Coverage</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Coverage Amount</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="25000">$25,000</option>
            <option value="50000">$50,000</option>
            <option value="100000">$100,000</option>
          </select>
        </div>

        <button
          onClick={handleGetQuote}
          disabled={isGettingQuote}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isGettingQuote ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>{isGettingQuote ? 'Getting Quote...' : 'Protect your trip'}</span>
        </button>
      </div>
    </div>
  );
};