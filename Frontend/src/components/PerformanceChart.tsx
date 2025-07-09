
import React from 'react';

interface PerformanceChartProps {
  data?: any[];
}

const PerformanceChart = ({ data = [] }: PerformanceChartProps) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  // Log data for debugging when backend is connected
  console.log('PerformanceChart data:', data);
  
  return (
    <div className="relative">
      <div className="h-48 flex items-end justify-between px-2">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 400 150" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d="M 0 100 Q 50 60 100 80 T 200 70 T 300 40 T 400 60 L 400 150 L 0 150 Z"
            fill="url(#gradient)"
          />
          
          {/* Line */}
          <path
            d="M 0 100 Q 50 60 100 80 T 200 70 T 300 40 T 400 60"
            stroke="rgb(59, 130, 246)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-4 px-2">
        {months.map((month) => (
          <span key={month} className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {month}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PerformanceChart;