
import React from 'react';

interface CampaignChartProps {
  data?: any[];
}

const CampaignChart = ({ data = [] }: CampaignChartProps) => {
  // Default campaigns data - will be replaced with backend data
  const campaigns = [
    { name: 'Campaign Alpha', percentage: 50, color: 'bg-sky-500' },
    { name: 'Campaign Beta', percentage: 70, color: 'bg-blue-500' },
    { name: 'Campaign Gamma', percentage: 40, color: 'bg-indigo-500' },
    { name: 'Campaign Delta', percentage: 85, color: 'bg-purple-500' },
    { name: 'Campaign Epsilon', percentage: 60, color: 'bg-pink-500' },
  ];

  // Use backend data if available, otherwise use default
  const chartData = data.length > 0 ? data : campaigns;
  
  // Log data for debugging when backend is connected
  console.log('CampaignChart data:', chartData);

  return (
    <div className="space-y-4">
      {chartData.map((campaign, index) => (
        <div key={campaign.name || campaign.id || index} className="grid grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {campaign.name}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {campaign.percentage}%
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${campaign.color} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${campaign.percentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignChart;
