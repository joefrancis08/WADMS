// src/services/google/GoogleLoginButton.jsx
import { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import axios from 'axios';
import { OAuth } from '../../api-calls/auth/otpAPI';
import { showErrorToast } from '../../utils/toastNotification';

axios.defaults.withCredentials = true;

const GoogleLoginButton = forwardRef(({ onLogin, mode = 'register' }, ref) => {
  const isGoogleReady = useRef(false);
  const pendingSignIn = useRef(false); // in case signIn is called before ready

  useEffect(() => {
    // Check if already loaded (e.g. during fast refresh)
    if (window.google) {
      isGoogleReady.current = true;
      if (pendingSignIn.current) {
        pendingSignIn.current = false;
        ref.current?.signIn(); // retry
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client'; // removed trailing spaces!
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isGoogleReady.current = true;
      if (pendingSignIn.current) {
        pendingSignIn.current = false;
        ref.current?.signIn(); // retry queued sign-in
      }
    };

    // script.onerror = () => {
    //   console.error('Failed to load Google Identity Services SDK');
    //   showErrorToast('Failed to load Google OAuth. Please check your internet connection and refresh the page.', 'top-center', 5000);
    // };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [ref]);

  useImperativeHandle(ref, () => ({
    signIn: async () => {
      if (!isGoogleReady.current) {
        console.warn('Google SDK not ready yet. Queuing sign-in.');
        pendingSignIn.current = true;
        // Optionally show a loading state or disable button in parent
        return;
      }

      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            try {
              const res = await OAuth(tokenResponse, mode);
              onLogin(res.data);
            } catch (err) {
              console.error('Google login error:', err.response?.data || err.message);
              showErrorToast('Google sign-in failed. Please try again.', 'top-center', 5000);
            }
          },
        });

        client.requestAccessToken();
        
      } catch (error) {
        console.error('Error initializing Google sign-in:', error);
        showErrorToast('Unable to start Google sign-in. Please try again.', 'top-center', 5000);
      }
    },
  }));

  return null;
});

export default GoogleLoginButton;