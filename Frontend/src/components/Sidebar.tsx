import React from 'react';
import {
  BarChart3,
  Mail,
  Users,
  Megaphone,
  User,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { Logo } from '../assets/logo';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Sidebar = ({ isCollapsed, setIsCollapsed, toggleTheme, isDarkMode }: SidebarProps) => {
  const { pathname } = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { name: 'Mails', icon: Mail, path: '/mail' },
    { name: 'Lists', icon: Users, path: '/lists' },
    { name: 'Campaigns', icon: Megaphone, path: '/campaigns' },
  ];

  const isActiveRoute = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        lg:w-64 flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Logo />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Ingenium</h1>
          </div>
          <div className="flex items-center sm:gap-0 lg:gap-1 md:gap-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <button
              onClick={() => setIsCollapsed(true)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150
                ${isActiveRoute(item.path)
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            key={'profile'}
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          >
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">Profile</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
