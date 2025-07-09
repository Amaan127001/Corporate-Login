
import React from 'react';
import { Send, Eye, MousePointer } from 'lucide-react';

interface EmailFunnelProps {
  data?: {
    sent: number;
    opened: number;
    clicked: number;
  };
}

const EmailFunnel = ({ data }: EmailFunnelProps) => {
  // Default data - will be replaced with backend data
  const defaultData = {
    sent: 12345,
    opened: 2469,
    clicked: 617
  };

  const funnelData = data || defaultData;
  
  // Calculate rates
  const openRate = ((funnelData.opened / funnelData.sent) * 100).toFixed(1);
  const clickRate = ((funnelData.clicked / funnelData.sent) * 100).toFixed(1);
  
  // Log data for debugging when backend is connected
  console.log('EmailFunnel data:', funnelData);

  const funnelSteps = [
    {
      icon: Send,
      label: 'Emails Sent',
      value: funnelData.sent.toLocaleString(),
      subtext: 'Total sent',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Eye,
      label: 'Emails Opened',
      value: funnelData.opened.toLocaleString(),
      subtext: `(${openRate}% Open Rate)`,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: MousePointer,
      label: 'Clicked Through',
      value: funnelData.clicked.toLocaleString(),
      subtext: `(${clickRate}% CTR)`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Email Funnel</h3>
      
      <div className="flex justify-between items-center mb-6">
        {funnelSteps.map((item, index) => (
          <React.Fragment key={item.label}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center mb-3`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtext}</p>
            </div>
            
            {index < funnelSteps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className="h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
                <div className="flex justify-center mt-1">
                  <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Sent</span>
        <span>Opened</span>
        <span>Clicked</span>
      </div>
    </div>
  );
};

export default EmailFunnel;
