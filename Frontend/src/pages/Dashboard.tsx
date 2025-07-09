
import React, { useState, useEffect } from 'react';
import { Menu, ChevronDown, Send, Eye, MousePointer, Shield, Clock, Inbox } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import ChartCard from '../components/ChartCard';
import PerformanceChart from '../components/PerformanceChart';
import CampaignChart from '../components/CampaignChart';
import EmailFunnel from '../components/EmailFunnel';
import ActivityTable from '../components/ActivityTable';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Button } from "../components/ui/button";

interface DashboardData {
  metrics: {
    emailsSent: number;
    responseRate: number;
    openRate: number;
    clickThroughRate: number;
    mailboxHealth: number;
    pendingApproval: number;
    inQueue: number;
  };
  performanceData: any[];
  campaignData: any[];
  funnelData: {
    sent: number;
    opened: number;
    clicked: number;
  };
  activities: any[];
}

interface DashboardProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Dashboard = ({ toggleTheme, isDarkMode }: DashboardProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState('All Campaigns');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 Days');
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    metrics: {
      emailsSent: 12345,
      responseRate: 15,
      openRate: 20,
      clickThroughRate: 5,
      mailboxHealth: 98,
      pendingApproval: 5,
      inQueue: 100
    },
    performanceData: [], // Will be populated from backend
    campaignData: [], // Will be populated from backend
    funnelData: {
      sent: 12345,
      opened: 2469,
      clicked: 617
    },
    activities: [] // Will be populated from backend
  });

  // Function to fetch dashboard data from backend
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching dashboard data...', { selectedCampaign, selectedTimeframe });
      // TODO: Replace with actual API call
      // const response = await fetch('/api/dashboard', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ campaign: selectedCampaign, timeframe: selectedTimeframe })
      // });
      // const data = await response.json();
      // setDashboardData(data);

      // Simulated delay for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Dashboard data fetched successfully');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchDashboardData();
  }, [selectedCampaign, selectedTimeframe]);

  // Function to refresh data
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Function to export data
  const handleExport = () => {
    console.log('Exporting dashboard data...', dashboardData);
    // TODO: Implement actual export functionality
  };

  const campaigns = ['All Campaigns', 'Campaign A', 'Campaign B', 'Campaign C', 'Campaign D'];
  const timeframes = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year'];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowCampaignDropdown(false);
      setShowTimeDropdown(false);
    };

    if (showCampaignDropdown || showTimeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showCampaignDropdown, showTimeDropdown]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
              >
                <Menu className="w-5 h-5 text-gray-500" />
              </button>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                Ingenium Dashboard
              </h1>
              {isLoading && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Refresh and Export buttons */}
              <div className="hidden sm:flex items-center gap-2 dark:text-gray-300">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                >
                  Export
                </Button>
              </div>

              {/* Desktop Dropdowns */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCampaignDropdown(!showCampaignDropdown);
                      setShowTimeDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150"
                  >
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{selectedCampaign}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  </button>
                  {showCampaignDropdown && (
                    <div className="absolute top-full mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
                      {campaigns.map((campaign) => (
                        <button
                          key={campaign}
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowCampaignDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {campaign}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTimeDropdown(!showTimeDropdown);
                      setShowCampaignDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150"
                  >
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{selectedTimeframe}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  </button>
                  {showTimeDropdown && (
                    <div className="absolute top-full mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
                      {timeframes.map((timeframe) => (
                        <button
                          key={timeframe}
                          onClick={() => {
                            setSelectedTimeframe(timeframe);
                            setShowTimeDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {timeframe}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="sm:hidden dark:text-gray-300">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-white dark:bg-gray-800">
                  <SheetHeader>
                    <SheetTitle className="text-gray-900 dark:text-white">Filters & Actions</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4 dark:text-gray-300">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Refresh
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="flex-1"
                      >
                        Export
                      </Button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Campaign</label>
                      <select
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                      >
                        {campaigns.map((campaign) => (
                          <option key={campaign} value={campaign}>{campaign}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Period</label>
                      <select
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                      >
                        {timeframes.map((timeframe) => (
                          <option key={timeframe} value={timeframe}>{timeframe}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-red-600 dark:text-red-400 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Emails Sent"
              value={dashboardData.metrics.emailsSent.toLocaleString()}
              change="+2.5% from last month"
              changeType="positive"
              icon={<Send className="w-5 h-5" />}
            />
            <MetricCard
              title="Response Rate"
              value={`${dashboardData.metrics.responseRate}%`}
              change="+1.2%"
              changeType="positive"
              icon={<Eye className="w-5 h-5" />}
            />
            <MetricCard
              title="Open Rate"
              value={`${dashboardData.metrics.openRate}%`}
              change="-0.5% from last month"
              changeType="negative"
              icon={<MousePointer className="w-5 h-5" />}
            />
            <MetricCard
              title="Click-Through Rate"
              value={`${dashboardData.metrics.clickThroughRate}%`}
              change="+0.8%"
              changeType="positive"
              icon={<MousePointer className="w-5 h-5" />}
            />
            <MetricCard
              title="Overall Mailbox Health"
              value={`${dashboardData.metrics.mailboxHealth}%`}
              valueColor="text-green-600 dark:text-green-400"
              icon={<Shield className="w-5 h-5" />}
            />
            <MetricCard
              title="Emails Pending Approval"
              value={dashboardData.metrics.pendingApproval.toString()}
              valueColor="text-orange-600 dark:text-orange-400"
              icon={<Clock className="w-5 h-5" />}
            />
            <MetricCard
              title="Emails in Queue"
              value={dashboardData.metrics.inQueue.toString()}
              valueColor="text-blue-600 dark:text-blue-400"
              icon={<Inbox className="w-5 h-5" />}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Campaign Performance Over Time" subtitle={selectedTimeframe} change="+15%" changeType="positive">
              <PerformanceChart data={dashboardData.performanceData} />
            </ChartCard>

            <ChartCard title="Response Rate by Campaign" subtitle={selectedTimeframe} change="+15%" changeType="positive">
              <CampaignChart data={dashboardData.campaignData} />
            </ChartCard>
          </div>

          {/* Email Funnel */}
          <div className="mb-8">
            <EmailFunnel data={dashboardData.funnelData} />
          </div>

          {/* Activity Table */}
          <div className="mb-8">
            <ActivityTable activities={dashboardData.activities} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;