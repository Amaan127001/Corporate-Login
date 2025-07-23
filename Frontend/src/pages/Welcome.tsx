import React, { useState, useEffect } from 'react';
import { Users, User, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface ProfileSelectionProps {
  toggleTheme: () => void;
}

const ProfileSelection = ({ toggleTheme }: ProfileSelectionProps) => {
  const [selectedOption, setSelectedOption] = useState<'organization' | 'individual' | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navigate = useNavigate();

  const handleContinue = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Not authenticated');

    const resp = await fetch('https://ingeniumai.onrender.com/user/type', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, profileType: selectedOption })
    });
    const json = await resp.json();
    if (json.success) {
      localStorage.setItem('hasProfileType', 'true');
      if (!json.profileCompleted) navigate('/profilecompletion');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors transition-smooth transition-all duration-300">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow">
        <Navbar toggleTheme={toggleTheme} />
      </div>
      {/* Animated Gradient Blobs */}
      <div className="">
        <div className="absolute top-[20%] left-[5%] w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-30 animate-blob" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[40%] left-[30%] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-30 animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[30%] right-[12%] w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-30 animate-blob" style={{ animationDelay: "4s" }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center container mx-auto py-6 lg:py-10 px-4">
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">

          {/* Mobile/Tablet Layout */}
          <div className="block lg:hidden p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Welcome, {user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">How will you be using Ingenium?</p>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden mb-4 shadow-[0_0_0_3px_white,_0_0_0_6px_#2563eb] dark:shadow-[0_0_0_3px_#1f2937,_0_0_0_6px_#3b82f6]">
                <img
                  src={user.picture}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">{user.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center max-w-md">
                Please select how you intend to use our platform. This will help us tailor your experience.
              </p>
            </div>

            {/* Selection Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Organization Option */}
              <div
                className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${selectedOption === 'organization'
                  ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                  }`}
                onClick={() => setSelectedOption('organization')}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-800 dark:text-white mb-2">
                    Register as an Organization
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    For teams and companies who want to collaborate and manage campaigns together.
                  </p>
                </div>
              </div>

              {/* Individual Option */}
              <div
                className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${selectedOption === 'individual'
                  ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                  }`}
                onClick={() => setSelectedOption('individual')}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-800 dark:text-white mb-2">
                    Register as an Individual
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    For solo professionals and freelancers who want to manage their own outreach.
                  </p>
                </div>
              </div>
            </div>

            {/* Info Link */}
            {/* Info Link with hover tooltip */}
            <div className="text-center mb-6">
              <div className="relative inline-block group">
                <a
                  href="#"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium inline-flex items-center transition-colors duration-200"
                  onClick={(e) => e.preventDefault()}
                >
                  Why do we ask this?
                  <ArrowRight className="h-4 w-4 ml-1" />
                </a>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-[500px] p-2 bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 rounded shadow-lg opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
                  This helps us tailor your experience: registering as an <b>Organisation</b> grants you multi-user license management for your team, while registering as an <b>Individual</b> provides you with a single license for personal use.
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!selectedOption}
            >
              Continue
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex min-h-[600px]">
            {/* Left Side - Welcome & Profile Info */}
            <div className="w-1/2 p-20 flex flex-col justify-center">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
                  Welcome, {user.name}!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">How will you be using Ingenium?</p>
              </div>

              {/* Profile Info */}
              <div className="flex flex-col items-start">
                <div className="flex items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden mr-6 shadow-[0_0_0_3px_white,_0_0_0_6px_#2563eb] dark:shadow-[0_0_0_3px_#1f2937,_0_0_0_6px_#3b82f6]">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-1">{user.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
                  Please select how you intend to use our platform. This will help us tailor your experience and provide you with the most relevant features and tools.
                </p>
              </div>
            </div>

            {/* Right Side - Selection Options */}
            <div className="w-1/2 p-20 flex flex-col justify-center">
              {/* Selection Options */}
              <div className="space-y-6 mb-8">
                {/* Organization Option */}
                <div
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${selectedOption === 'organization'
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                    }`}
                  onClick={() => setSelectedOption('organization')}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                        Register as an Organization
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        For teams and companies who want to collaborate and manage campaigns together.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Individual Option */}
                <div
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${selectedOption === 'individual'
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                    }`}
                  onClick={() => setSelectedOption('individual')}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                        Register as an Individual
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        For solo professionals and freelancers who want to manage their own outreach.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Link */}
              {/* Info Link with hover tooltip */}
              <div className="text-center mb-6">
                <div className="relative inline-block group">
                  <a
                    href="#"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium inline-flex items-center transition-colors duration-200"
                    onClick={(e) => e.preventDefault()}
                  >
                    Why do we ask this?
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-[500px] p-2 bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 rounded shadow-lg opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
                    This helps us tailor your experience: registering as an <b>Organisation</b> grants you multi-user license management for your team, while registering as an <b>Individual</b> provides you with a single license for personal use.
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!selectedOption}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-4 px-4 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm lg:text-md order-2 md:order-1 mt-4 md:mt-0">
            &copy; 2025 Ingenium. All rights reserved.
          </div>
          <div className="order-1 md:order-2 flex flex-wrap justify-center gap-4 md:gap-8 text-sm lg:text-md">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              About Us
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfileSelection;