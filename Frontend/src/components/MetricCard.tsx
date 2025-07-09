
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon?: React.ReactNode;
  valueColor?: string;
}

const MetricCard = ({ title, value, change, changeType, icon, valueColor }: MetricCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-2">
        <p className={`text-3xl font-bold ${valueColor || 'text-gray-900 dark:text-white'}`}>
          {value}
        </p>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            changeType === 'positive' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {changeType === 'positive' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {change}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;