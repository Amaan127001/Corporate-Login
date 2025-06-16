import { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginCard = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email || '';
      const personalDomains = ['@gmail.com', '@yahoo.com', '@outlook.com'];
      const isPersonal = personalDomains.some(d => email.endsWith(d));
      if (isPersonal) {
        setShowAlert(true);
        return;
      }

      localStorage.setItem('user', JSON.stringify({
        name: result.user.displayName,
        email: result.user.email
      }));

      navigate('/welcome');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl px-12 sm:px-12 py-8 sm:py-8 w-full max-w-4xl min-h-[15vh] text-center mx-auto flex flex-col justify-center">
      <p className="flex justify-center">
        <img src="https://img.icons8.com/?size=100&id=7rhqrO588QcU&format=png&color=000000" alt="Mail" className="w-24 h-24" />
      </p>
      <h2 className="text-2xl sm:text-md md:text-2xl lg:text-4xl font-bold mb-3 md:mb-4 text-gray-800 dark:text-white">
        Sign in to your account
      </h2>
      <p className="text-gray-500 dark:text-gray-300 mb-6 md:mb-8 text-base lg:text-xl sm:text-sm md:text-md">
        Choose your authentication method
      </p>

      {showAlert && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Access Denied! </strong>
          <span className="block sm:inline">Please use a corporate or institutional email.</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setShowAlert(false)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        <button
          onClick={signIn}
          className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition"
        >
          <img
            src="https://img.icons8.com/color/48/google-logo.png"
            alt="Google"
            className="mr-3 sm:mr-4 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
          />
          <span className="text-sm lg:text-lg sm:text-sm md:text-md">Sign in with Google</span>
        </button>

        <div className="relative my-4 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-gray-800 px-3 sm:px-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              OR
            </span>
          </div>
        </div>

        <button
          className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition"
        >
          <img
            src="https://img.icons8.com/?size=100&id=108792&format=png&color=000000"
            alt="Microsoft"
            className="mr-3 sm:mr-4 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 object-contain"
          />
          <span className="text-sm sm:text-base md:text-lg">Sign in with Microsoft</span>
        </button>
      </div>

      <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 mt-6 sm:mt-8">
        By signing in, you agree to our{" "}
        <a href="#" className="text-blue-600 hover:underline">Terms</a>,{" "}
        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>, and{" "}
        <a href="#" className="text-blue-600 hover:underline">Cookie Policy</a>.
      </p>
    </div>
  );
};

export default LoginCard;
