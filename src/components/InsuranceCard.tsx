import React, { useState } from 'react';
import { Shield, FileText, Loader2, Check, X } from 'lucide-react';
import type { Insurance } from '../types';

interface InsuranceCardProps {
  onGetQuote: () => Promise<void>;
  loading: boolean;
  availableInsurance?: Insurance[];
  selectedInsurance?: Insurance[];
  onSelectInsurance?: (insurance: Insurance) => Promise<void>;
  onDeselectInsurance?: (insuranceId: string) => Promise<void>;
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({ 
  onGetQuote, 
  loading,
  availableInsurance = [],
  selectedInsurance = [],
  onSelectInsurance,
  onDeselectInsurance
}) => {
  const [isGettingQuote, setIsGettingQuote] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);

  const handleGetQuote = async () => {
    setIsGettingQuote(true);
    try {
      await onGetQuote();
      setShowQuotes(true);
    } finally {
      setIsGettingQuote(false);
    }
  };

  const handleSelectInsurance = async (insurance: Insurance) => {
    if (onSelectInsurance) {
      try {
        await onSelectInsurance(insurance);
      } catch (error) {
        console.error('Error selecting insurance:', error);
      }
    }
  };

  const handleDeselectInsurance = async (insuranceId: string) => {
    if (onDeselectInsurance) {
      try {
        await onDeselectInsurance(insuranceId);
      } catch (error) {
        console.error('Error deselecting insurance:', error);
      }
    }
  };

  const isInsuranceSelected = (insuranceId: string) => {
    return selectedInsurance.some(i => i.id === insuranceId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Travel Insurance</h3>
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
            <span>{isGettingQuote ? 'Getting Quote...' : 'Get Insurance Quote'}</span>
          </button>
        </div>
      </div>

      {/* Insurance Quotes */}
      {showQuotes && availableInsurance.length > 0 && (
        <div className="p-6 bg-green-50 border-t border-green-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <span className="text-lg">🛡️</span>
            <span>Available Insurance Plans</span>
          </h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {availableInsurance.map((insurance) => (
              <div
                key={insurance.id}
                className={`border rounded-xl p-4 transition-all hover:shadow-md ${
                  isInsuranceSelected(insurance.id)
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">🛡️</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{insurance.provider}</p>
                        <p className="text-sm text-gray-600 capitalize">{insurance.policy_type} Coverage</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <span>💰</span>
                        <span>Premium: ${insurance.premium_cost}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>🛡️</span>
                        <span>Coverage: ${insurance.coverage_amount?.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${insurance.premium_cost}</p>
                      <p className="text-xs text-gray-500">premium</p>
                    </div>
                    
                    <button
                      onClick={() => handleSelectInsurance(insurance)}
                      disabled={isInsuranceSelected(insurance.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                        isInsuranceSelected(insurance.id)
                          ? 'bg-green-600 text-white cursor-default'
                          : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                      }`}
                    >
                      {isInsuranceSelected(insurance.id) ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
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

      {/* Selected Insurance Summary */}
      {selectedInsurance.length > 0 && (
        <div className="p-6 bg-green-50 border-t border-green-200">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
            <span className="text-lg">✅</span>
            <span>Selected Insurance ({selectedInsurance.length})</span>
          </h4>
          <div className="space-y-2">
            {selectedInsurance.map((insurance) => (
              <div key={insurance.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
                <div className="flex items-center space-x-3">
                  <span className="text-sm">🛡️</span>
                  <div>
                    <p className="font-medium text-gray-900">{insurance.provider}</p>
                    <p className="text-xs text-gray-600 capitalize">{insurance.policy_type} Coverage</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-green-600">${insurance.premium_cost}</p>
                  <button
                    onClick={() => handleDeselectInsurance(insurance.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full p-1 transition-all"
                    title="Remove insurance"
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
                Total Premium: ${selectedInsurance.reduce((sum, i) => sum + (i.premium_cost || 0), 0)}
              </p>
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                ✅ Insurance Confirmed
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};