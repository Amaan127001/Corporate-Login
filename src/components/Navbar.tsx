import { Logo } from '../assets/logo';

const Navbar = ({ toggleTheme }: { toggleTheme: () => void }) => {
  return (
    <nav className="w-full bg-white dark:bg-gray-900 dark:text-white shadow text-base sm:text-lg lg:text-2xl">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
        <Logo />
        <button
          onClick={toggleTheme}
          className="text-sm sm:text-base lg:text-xl bg-gray-200 dark:bg-gray-700 px-3 sm:px-5 lg:px-6 py-1 sm:py-2 lg:py-3 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Toggle Theme
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
