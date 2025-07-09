
import React from 'react';

interface ActivityItem {
  id?: string;
  campaign: string;
  status: 'success' | 'scheduled' | 'paused' | 'completed' | 'draft';
  time: string;
  description: string;
}

interface ActivityTableProps {
  activities?: ActivityItem[];
}

const ActivityTable = ({ activities = [] }: ActivityTableProps) => {
  // Default activities - will be replaced with backend data
  const defaultActivities: ActivityItem[] = [
    {
      campaign: 'Summer Sale',
      status: 'success',
      time: 'July 15, 2023 • 10:00 AM',
      description: 'Launched'
    },
    {
      campaign: 'New Product Teaser',
      status: 'scheduled', 
      time: 'July 18, 2023 • 02:00 PM',
      description: 'Scheduled'
    },
    {
      campaign: 'Welcome Series',
      status: 'paused',
      time: 'July 14, 2023 • 05:30 PM', 
      description: 'Paused'
    },
    {
      campaign: 'Feedback Request',
      status: 'completed',
      time: 'July 13, 2023 • 11:00 AM',
      description: 'Completed'
    },
    {
      campaign: 'Q3 Newsletter',
      status: 'draft',
      time: 'July 12, 2023 • 09:15 AM',
      description: 'Drafted'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;
  
  // Log data for debugging when backend is connected
  console.log('ActivityTable data:', displayActivities);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paused':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✓';
      case 'scheduled':
        return '⏰';
      case 'paused':
        return '⏸';
      case 'completed':
        return '✅';
      case 'draft':
        return '📝';
      default:
        return '•';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Campaign Activity</h3>
        <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
          View All Activity →
        </a>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {displayActivities.map((activity, index) => (
          <div key={activity.id || index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${getStatusColor(activity.status)}`}>
                {getStatusIcon(activity.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    "{activity.campaign}" {activity.description}
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTable;
