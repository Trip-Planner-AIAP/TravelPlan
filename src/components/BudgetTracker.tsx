import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface BudgetTrackerProps {
  totalCost: number;
  estimatedBudget: number;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({ totalCost, estimatedBudget }) => {
  const percentage = (totalCost / estimatedBudget) * 100;
  const isOverBudget = totalCost > estimatedBudget;
  const difference = Math.abs(totalCost - estimatedBudget);

  const getColorClasses = () => {
    if (isOverBudget) {
      return {
        bg: 'bg-red-500',
        text: 'text-red-600',
        icon: 'text-red-500'
      };
    } else if (percentage > 80) {
      return {
        bg: 'bg-yellow-500',
        text: 'text-yellow-600',
        icon: 'text-yellow-500'
      };
    } else {
      return {
        bg: 'bg-green-500',
        text: 'text-green-600',
        icon: 'text-green-500'
      };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-w-80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <DollarSign className={`w-5 h-5 ${colors.icon}`} />
          <h3 className="font-semibold text-gray-900">Budget Tracker</h3>
        </div>
        <div className="flex items-center space-x-1">
          {isOverBudget ? (
            <TrendingUp className="w-4 h-4 text-red-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-green-500" />
          )}
          <span className={`text-sm font-medium ${colors.text}`}>
            {isOverBudget ? '+' : '-'}${difference}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Spent: ${totalCost.toFixed(2)}</span>
          <span className="text-gray-600">Budget: ${estimatedBudget.toFixed(2)}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${colors.bg}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="text-center">
          <p className={`text-sm font-medium ${colors.text}`}>
            {isOverBudget 
              ? `You're $${difference} over budget! 😰`
              : `You're $${difference} under budget! 🎉`
            }
          </p>
        </div>
      </div>
    </div>
  );
};