import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Smartphone, DollarSign, Shield, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { useAIFeatures } from '../hooks/useAIFeatures';
import type { Trip } from '../types';

interface LocalEssentialsCardProps {
  trip: Trip;
}

interface LocalEssentials {
  id: string;
  trip_id: string;
  sim_info: {
    provider: string;
    cost: string;
    coverage: string;
    purchase_location: string;
  };
  forex_info: {
    currency: string;
    exchange_rate: string;
    best_exchange_locations: string[];
    cash_recommendations: string;
  };
  safety_notes: {
    emergency_numbers: { [key: string]: string };
    safety_tips: string[];
    cultural_notes: string[];
    health_recommendations: string[];
  };
  created_at: string;
}

export const LocalEssentialsCard: React.FC<LocalEssentialsCardProps> = ({ trip }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [essentials, setEssentials] = useState<LocalEssentials | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<{ remaining: number; canMakeCall: boolean }>({ remaining: 6000, canMakeCall: true });

  const { 
    loading, 
    error, 
    getLocalEssentials, 
    getEssentials,
    checkTokenUsage 
  } = useAIFeatures(trip.id);

  useEffect(() => {
    loadExistingEssentials();
    loadTokenInfo();
  }, []);

  const loadExistingEssentials = async () => {
    const existing = await getEssentials();
    if (existing) {
      setEssentials(existing);
      setHasLoaded(true);
    }
  };

  const loadTokenInfo = async () => {
    const info = await checkTokenUsage();
    setTokenInfo(info);
  };

  const handleLoadEssentials = async () => {
    if (essentials) {
      setIsExpanded(!isExpanded);
      return;
    }

    setIsLoading(true);
    
    // Extract currency from destination (basic logic)
    let currency = 'USD';
    const dest = trip.destination.toLowerCase();
    if (dest.includes('japan')) currency = 'JPY';
    else if (dest.includes('europe') || dest.includes('france') || dest.includes('paris')) currency = 'EUR';
    else if (dest.includes('indonesia') || dest.includes('bali')) currency = 'IDR';

    const result = await getLocalEssentials(
      trip.destination,
      currency,
      `${trip.start_date} to ${trip.end_date}`
    );

    if (result.success && result.data) {
      setEssentials(result.data);
      setHasLoaded(true);
      setIsExpanded(true);
      await loadTokenInfo(); // Refresh token info
    }
    
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Essential Local Tips</h3>
              <p className="text-sm text-gray-600">Stay connected, safe & smart in {trip.destination}</p>
            </div>
          </div>
          
          <button
            onClick={handleLoadEssentials}
            disabled={isLoading || (!tokenInfo.canMakeCall && !hasLoaded)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              hasLoaded
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : hasLoaded ? (
              <>
                <span>{isExpanded ? 'Hide' : 'Show'} Local Essentials</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Get Local Tips</span>
              </>
            )}
          </button>
        </div>

        {/* Token Warning */}
        {!tokenInfo.canMakeCall && !hasLoaded && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
            <span>Token limit reached. Local essentials unavailable.</span>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && essentials && (
        <div className="p-6 space-y-6">
          {/* SIM Card Info */}
          <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
            <div className="flex items-center space-x-2 mb-3">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">📱 Stay Connected</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Provider:</span>
                <span className="text-blue-900">{essentials.sim_info.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Cost:</span>
                <span className="text-blue-900">{essentials.sim_info.cost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Coverage:</span>
                <span className="text-blue-900">{essentials.sim_info.coverage}</span>
              </div>
              <div className="pt-2 border-t border-blue-200">
                <span className="text-blue-700 font-medium">Where to buy:</span>
                <p className="text-blue-900 mt-1">{essentials.sim_info.purchase_location}</p>
              </div>
            </div>
          </div>

          {/* Forex Info */}
          <div className="border border-green-200 rounded-xl p-4 bg-green-50">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">💴 Money Matters</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700 font-medium">Currency:</span>
                <span className="text-green-900">{essentials.forex_info.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 font-medium">Exchange Rate:</span>
                <span className="text-green-900">{essentials.forex_info.exchange_rate}</span>
              </div>
              <div className="pt-2 border-t border-green-200">
                <span className="text-green-700 font-medium">Best exchange locations:</span>
                <ul className="text-green-900 mt-1 space-y-1">
                  {essentials.forex_info.best_exchange_locations.map((location, index) => (
                    <li key={index} className="flex items-center space-x-1">
                      <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                      <span>{location}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-green-200">
                <span className="text-green-700 font-medium">Cash tips:</span>
                <p className="text-green-900 mt-1">{essentials.forex_info.cash_recommendations}</p>
              </div>
            </div>
          </div>

          {/* Safety Notes */}
          <div className="border border-red-200 rounded-xl p-4 bg-red-50">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-red-900">🛡️ Stay Safe & Smart</h4>
            </div>
            
            <div className="space-y-4 text-sm">
              {/* Emergency Numbers */}
              <div>
                <span className="text-red-700 font-medium">Emergency Numbers:</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {Object.entries(essentials.safety_notes.emergency_numbers).map(([service, number]) => (
                    <div key={service} className="bg-white rounded-lg p-2 border border-red-200">
                      <div className="font-medium text-red-900">{service}</div>
                      <div className="text-red-700 font-mono">{number}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Tips */}
              <div>
                <span className="text-red-700 font-medium">Safety Tips:</span>
                <ul className="text-red-900 mt-2 space-y-1">
                  {essentials.safety_notes.safety_tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cultural Notes */}
              <div>
                <span className="text-red-700 font-medium">Cultural Notes:</span>
                <ul className="text-red-900 mt-2 space-y-1">
                  {essentials.safety_notes.cultural_notes.map((note, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Health Recommendations */}
              <div>
                <span className="text-red-700 font-medium">Health Recommendations:</span>
                <ul className="text-red-900 mt-2 space-y-1">
                  {essentials.safety_notes.health_recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Token Usage Info */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
            <p>AI-powered local insights • Tokens remaining: {tokenInfo.remaining} / 6000</p>
          </div>
        </div>
      )}
    </div>
  );
};