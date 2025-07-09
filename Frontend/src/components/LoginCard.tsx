import { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';


const LoginCard = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  // const signIn = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const email = result.user.email || '';
  //     const personalDomains = ['@gmail.com', '@yahoo.com', '@outlook.com'];
  //     const isPersonal = personalDomains.some((d) => email.endsWith(d));
  //     if (isPersonal) {
  //       setShowAlert(true);
  //       return;
  //     }

  //     localStorage.setItem(
  //       'user',
  //       JSON.stringify({
  //         name: result.user.displayName,
  //         email: result.user.email,
  //       })
  //     );

  //     navigate('/welcome');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const signIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const resp = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
        );
        const user = await resp.json();
        const email: string = user.email || '';
        const isPersonal = ['@gmail.com', '@yahoo.com', '@outlook.com']
          .some(d => email.endsWith(d));

        if (isPersonal) {
          setShowAlert(true);
          return;
        }

        localStorage.setItem('user', JSON.stringify({
          name: user.name,
          email,
          picture: user.picture,
        }));

        // Send access token to backend
        const backendResp = await fetch('http://localhost:4000/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        });
        const { token, profileCompleted, hasSelectedProfileType } = await backendResp.json();
        localStorage.setItem('token', token);
        localStorage.setItem('profileCompleted', profileCompleted);
        localStorage.setItem('hasProfileType', hasSelectedProfileType);

        if (!hasSelectedProfileType) navigate('/welcome');
        else if (!profileCompleted) navigate('/profilecompletion');
        else navigate('/dashboard');
      } catch (err) {
        console.error(err);
      }
    },
    onError: (err) => console.error(err),
  });


  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-8 sm:p-10">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-400/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white">Sign in to your account</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-2">Choose your authentication method</p>
        </div>

        {showAlert && (
          <div className="bg-red-100 dark:bg-red-400/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Access Denied! </strong>
            <span className="block sm:inline">Use a corporate or institutional email.</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setShowAlert(false)}>
              <svg className="fill-current h-6 w-6 text-red-500 dark:text-red-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}

        <div className="space-y-6">
          {/* Google Sign In Button */}
          <button
            onClick={() => signIn()}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-white font-medium hover:shadow-md transition duration-150"
          >
            <div className="mr-3">
              <svg width="18" height="18" viewBox="0 0 488 512" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
            </div>
            Sign in with Google
          </button>

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OR</span>
            </div>
          </div>

          {/* Microsoft Sign In Button */}
          <button
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-white font-medium hover:shadow-md transition duration-150"
          >
            <div className="mr-3">
              <svg width="18" height="18" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                <path fill="#00A4EF" d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z" />
              </svg>
            </div>
            Sign in with Microsoft
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            By signing in, you agree to our{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Terms</a>,{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</a>, and{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Cookie Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
