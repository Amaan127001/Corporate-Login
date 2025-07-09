
import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  children: React.ReactNode;
}

const ChartCard = ({ title, subtitle, change, changeType, children }: ChartCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        )}
        {change && (
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-sm font-medium ${
              changeType === 'positive' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {change}
            </span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
