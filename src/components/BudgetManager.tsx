import React, { useState, useEffect } from 'react';
import { DollarSign, Users, AlertTriangle, TrendingUp, TrendingDown, Settings, Lightbulb, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Trip, Activity } from '../types';

interface BudgetManagerProps {
  trip: Trip;
  activities: Activity[];
  onTripUpdate: (updatedTrip: Trip) => void;
}

interface BudgetSuggestion {
  id: string;
  type: 'reduce' | 'optimize' | 'warning';
  title: string;
  description: string;
  potentialSavings?: number;
  affectedActivities?: string[];
  category?: string;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({ trip, activities, onTripUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [numberOfTravelers, setNumberOfTravelers] = useState(trip.number_of_travelers || 1);
  const [budgetPerPerson, setBudgetPerPerson] = useState(trip.budget_per_person || trip.estimated_budget);
  const [budgetBreakdown, setBudgetBreakdown] = useState(trip.budget_breakdown || {
    accommodation: 30,
    food: 25,
    activities: 25,
    transport: 15,
    misc: 5
  });
  const [budgetAlerts, setBudgetAlerts] = useState(trip.budget_alerts_enabled ?? true);
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  const totalBudget = budgetPerPerson * numberOfTravelers;
  const currentSpend = activities.reduce((sum, activity) => sum + (activity.estimated_cost * numberOfTravelers), 0);
  const remainingBudget = totalBudget - currentSpend;
  const budgetUsedPercentage = totalBudget > 0 ? (currentSpend / totalBudget) * 100 : 0;

  // Calculate spending by category
  const spendingByCategory = activities.reduce((acc, activity) => {
    const category = getCategoryFromActivityType(activity.activity_type);
    const cost = activity.estimated_cost * numberOfTravelers;
    acc[category] = (acc[category] || 0) + cost;
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    generateBudgetSuggestions();
  }, [activities, numberOfTravelers, budgetPerPerson, budgetBreakdown]);

  const getCategoryFromActivityType = (activityType: string): string => {
    switch (activityType) {
      case 'hotel': return 'accommodation';
      case 'meal': return 'food';
      case 'flight':
      case 'transport': return 'transport';
      case 'attraction': return 'activities';
      default: return 'misc';
    }
  };

  const generateBudgetSuggestions = () => {
    const newSuggestions: BudgetSuggestion[] = [];

    // Check if over budget
    if (currentSpend > totalBudget) {
      const overage = currentSpend - totalBudget;
      newSuggestions.push({
        id: 'over-budget',
        type: 'warning',
        title: '💸 Over Budget Alert!',
        description: `You're $${overage.toFixed(2)} over your total budget of $${totalBudget.toFixed(2)}. Consider reducing some expenses.`,
        potentialSavings: overage
      });
    }

    // Check category allocations
    Object.entries(budgetBreakdown).forEach(([category, percentage]) => {
      const allocatedAmount = (totalBudget * percentage) / 100;
      const spentAmount = spendingByCategory[category] || 0;
      
      if (spentAmount > allocatedAmount * 1.5) {
        const overage = spentAmount - allocatedAmount;
        newSuggestions.push({
          id: `category-overage-${category}`,
          type: 'reduce',
          title: `📊 ${category.charAt(0).toUpperCase() + category.slice(1)} Over Budget`,
          description: `You've spent $${spentAmount.toFixed(2)} on ${category}, which is ${Math.round((spentAmount / allocatedAmount) * 100)}% of your allocated budget ($${allocatedAmount.toFixed(2)}).`,
          potentialSavings: overage,
          category
        });
      }
    });

    // Suggest expensive activities to reduce
    const expensiveActivities = activities
      .map(a => ({ ...a, totalCost: a.estimated_cost * numberOfTravelers }))
      .filter(a => a.totalCost > (totalBudget * 0.1)) // More than 10% of total budget
      .sort((a, b) => b.totalCost - a.totalCost);

    if (expensiveActivities.length > 0 && currentSpend > totalBudget * 0.9) {
      expensiveActivities.slice(0, 3).forEach((activity, index) => {
        newSuggestions.push({
          id: `expensive-activity-${activity.id}`,
          type: 'reduce',
          title: `💰 Consider Cheaper Alternative`,
          description: `"${activity.title}" costs $${activity.totalCost.toFixed(2)} for ${numberOfTravelers} traveler${numberOfTravelers > 1 ? 's' : ''}. This is ${Math.round((activity.totalCost / totalBudget) * 100)}% of your total budget.`,
          potentialSavings: activity.totalCost * 0.5, // Assume 50% savings with alternative
          affectedActivities: [activity.id]
        });
      });
    }

    // Optimization suggestions
    if (budgetUsedPercentage < 70) {
      newSuggestions.push({
        id: 'under-budget',
        type: 'optimize',
        title: '✨ Budget Optimization Opportunity',
        description: `You're only using ${Math.round(budgetUsedPercentage)}% of your budget. Consider upgrading some experiences or adding more activities!`,
        potentialSavings: -(remainingBudget) // Negative because it's additional spending opportunity
      });
    }

    // Group travel savings suggestions
    if (numberOfTravelers > 1) {
      const accommodationCost = spendingByCategory.accommodation || 0;
      const potentialSavings = accommodationCost * 0.3; // Assume 30% savings with shared accommodation
      
      if (accommodationCost > 0) {
        newSuggestions.push({
          id: 'group-accommodation',
          type: 'optimize',
          title: '👥 Group Travel Savings',
          description: `With ${numberOfTravelers} travelers, you could save money by sharing accommodation or booking group rates.`,
          potentialSavings,
          category: 'accommodation'
        });
      }
    }

    setSuggestions(newSuggestions.filter(s => !dismissedSuggestions.includes(s.id)));
  };

  const handleSaveBudgetSettings = async () => {
    try {
      const updatedTrip = {
        ...trip,
        number_of_travelers: numberOfTravelers,
        budget_per_person: budgetPerPerson,
        estimated_budget: budgetPerPerson * numberOfTravelers,
        budget_breakdown: budgetBreakdown,
        budget_alerts_enabled: budgetAlerts
      };

      const { error } = await supabase
        .from('trips')
        .update({
          number_of_travelers: numberOfTravelers,
          budget_per_person: budgetPerPerson,
          estimated_budget: budgetPerPerson * numberOfTravelers,
          budget_breakdown: budgetBreakdown,
          budget_alerts_enabled: budgetAlerts
        })
        .eq('id', trip.id);

      if (error) throw error;

      onTripUpdate(updatedTrip);
      setIsExpanded(false);
    } catch (error) {
      console.error('Error updating budget settings:', error);
    }
  };

  const dismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions(prev => [...prev, suggestionId]);
  };

  const getStatusColor = () => {
    if (budgetUsedPercentage > 100) return 'text-red-600 bg-red-50';
    if (budgetUsedPercentage > 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getProgressBarColor = () => {
    if (budgetUsedPercentage > 100) return 'bg-red-500';
    if (budgetUsedPercentage > 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Smart Budget Manager</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{numberOfTravelers} traveler{numberOfTravelers > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${budgetPerPerson}/person</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Budget Overview */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Budget Usage: ${currentSpend.toFixed(2)} / ${totalBudget.toFixed(2)}
            </span>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor()}`}>
              {Math.round(budgetUsedPercentage)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
              style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="text-gray-600">
              {remainingBudget >= 0 ? (
                <span className="flex items-center space-x-1">
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <span>${remainingBudget.toFixed(2)} remaining</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span>${Math.abs(remainingBudget).toFixed(2)} over budget</span>
                </span>
              )}
            </span>
            <span className="text-gray-500">
              ${(currentSpend / numberOfTravelers).toFixed(2)}/person
            </span>
          </div>
        </div>
      </div>

      {/* Budget Settings Panel */}
      {isExpanded && (
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Budget Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Travelers and Budget */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Travelers
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setNumberOfTravelers(Math.max(1, numberOfTravelers - 1))}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{numberOfTravelers}</span>
                  <button
                    onClick={() => setNumberOfTravelers(Math.min(20, numberOfTravelers + 1))}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget per Person ($)
                </label>
                <input
                  type="number"
                  value={budgetPerPerson}
                  onChange={(e) => setBudgetPerPerson(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  min="0"
                  step="50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Total budget: ${(budgetPerPerson * numberOfTravelers).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="budget-alerts"
                  checked={budgetAlerts}
                  onChange={(e) => setBudgetAlerts(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="budget-alerts" className="text-sm text-gray-700">
                  Enable budget alerts
                </label>
              </div>
            </div>

            {/* Budget Breakdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Budget Allocation (%)
              </label>
              <div className="space-y-3">
                {Object.entries(budgetBreakdown).map(([category, percentage]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize w-24">
                      {category}:
                    </span>
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={percentage}
                        onChange={(e) => setBudgetBreakdown(prev => ({
                          ...prev,
                          [category]: parseInt(e.target.value)
                        }))}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-8 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total: {Object.values(budgetBreakdown).reduce((sum, val) => sum + val, 0)}%
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveBudgetSettings}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Save Budget Settings
            </button>
          </div>
        </div>
      )}

      {/* AI Budget Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span>AI Budget Suggestions</span>
          </h4>
          
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 rounded-lg border ${
                  suggestion.type === 'warning' ? 'border-red-200 bg-red-50' :
                  suggestion.type === 'reduce' ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 mb-1">{suggestion.title}</h5>
                    <p className="text-sm text-gray-700 mb-2">{suggestion.description}</p>
                    {suggestion.potentialSavings && suggestion.potentialSavings > 0 && (
                      <p className="text-sm font-medium text-green-600">
                        💰 Potential savings: ${suggestion.potentialSavings.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => dismissSuggestion(suggestion.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};