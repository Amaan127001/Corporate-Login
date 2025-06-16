import Navbar from '../components/Navbar';
import LoginCard from '../components/LoginCard';

const Home = ({ toggleTheme }: { toggleTheme: () => void }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-200 dark:from-gray-900 dark:to-gray-800 transition-colors">

      <div
        className="absolute top-[20%] left-[10%] w-[500px] h-[500px] z-0"
        style={{
          background: 'radial-gradient(circle, rgba(151, 186, 250, 0.4) 0%, rgba(135, 173, 250, 0.3) 45%, transparent 80%)',
          filter: 'blur(20px)',
        }}
      />
      <div
        className="absolute top-[30%] left-[25%] w-[500px] h-[500px] z-0"
        style={{
          background: 'radial-gradient(circle, rgba(114, 160, 252, 0.4) 0%, rgba(101, 139, 253, 0.3) 45%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <Navbar toggleTheme={toggleTheme} />

      <main className="relative z-10 flex-1 w-full flex flex-col md:flex-row justify-center items-center px-4 sm:px-6 lg:px-20 py-10 sm:py-16 lg:py-24 max-w-screen-xl mx-auto gap-[10vw] text-base sm:text-lg lg:text-2xl">

        <div className="w-full md:w-3/5 px-2 sm:px-4 text-center md:text-left whitespace-nowrap relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-800 dark:text-gray-100">Welcome to</span>{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Ingenium
            </span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-3xl text-gray-600 dark:text-gray-300">
            <span className="font-bold">Automate Your Outreach with Ingenium</span> <br />
            AI-powered email campaigns that get results
          </p>

          <ul className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 lg:space-y-4 text-left text-gray-700 dark:text-gray-200 text-md lg:text-2xl sm:text-base">
            <li>✅ Personalized AI-generated messages</li>
            <li>📊 Performance analytics dashboard</li>
            <li>📧 Automated follow-ups sequences</li>
          </ul>
        </div>

        <div className="w-full py-8 min-w-[30vw] px-2 sm:px-4 relative z-10">
          <LoginCard />
        </div>
      </main>

      <footer className="relative font-bold z-10 w-full px-4 sm:px-8 py-4 sm:py-4 text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

          <div className="text-center sm:text-left">
            © 2025 Ingenium. All rights reserved.
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-end text-center">
            <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition">About Us</a>
            <a href="#" className="hover:text-blue-600 transition">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
