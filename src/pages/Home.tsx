import Navbar from '../components/Navbar';
import LoginCard from '../components/LoginCard';

const Home = ({ toggleTheme }: { toggleTheme: () => void }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors transition-smooth transition-all duration-300">
      {/* Navbar */}
      <Navbar toggleTheme={toggleTheme} />

      {/* Animated Gradient Blobs */}
      <div className="">
        <div className="absolute top-[20%] left-[5%] w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-30 animate-blob" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[40%] left-[30%] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-30 animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[30%] right-[12%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-30 animate-blob" style={{ animationDelay: "4s" }} />
      </div>

      {/* Main Section */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center container mx-auto py-10 px-4">
        {/* Left Panel */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center mb-14 lg:mb-0 px-6">
          <div className="max-w-lg text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Ingenium
              </span>
            </h1>
            <p className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-1">
              Automate Your Outreach with Ingenium
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              AI-powered email campaigns that get results
            </p>

            <div className="space-y-5 hidden lg:block">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Personalized AI-generated messages
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Performance analytics dashboard
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Automated follow‑ups sequences
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4">
          <LoginCard />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-4 px-4 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm lg:text-md order-2 md:order-1 mt-4 md:mt-0">
            &copy; 2025 Ingenium. All rights reserved.
          </div>
          <div className="order-1 md:order-2 flex flex-wrap justify-center gap-4 md:gap-8 text-sm lg:text-md">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              About Us
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
