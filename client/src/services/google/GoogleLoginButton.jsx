// src/services/google/GoogleLoginButton.jsx
import { forwardRef, useImperativeHandle, useEffect } from 'react';
import axios from 'axios';
import { OAuth } from '../../api-calls/auth/otpAPI';
import { showErrorToast } from '../../utils/toastNotification';

axios.defaults.withCredentials = true; // ensure cookies are included globally

const GoogleLoginButton = forwardRef(({ onLogin, mode = 'register' }, ref) => {
  useEffect(() => {
    // Load Google Identity script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Expose signIn() method to parent
  useImperativeHandle(ref, () => ({
    signIn: async () => {
      if (!window.google) {
        alert('Google SDK not loaded yet. Please try again.');
        return;
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          try {
            // Send token to backend WITH CREDENTIALS
            const res = await OAuth(tokenResponse, mode);
            onLogin(res.data);

          } catch (err) {
            console.error('Google login error:', err.response?.data || err.message);
            showErrorToast('Google sign-in failed. Please try again.', 'top-center', 5000);
          }
        },
      });

      client.requestAccessToken();
    },
  }));

  return null;
});

export default GoogleLoginButton;
