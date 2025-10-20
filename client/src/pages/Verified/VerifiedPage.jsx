import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PendingSkeletonLoader from '../Pending/PendingSkeletonLoader.jsx';
import { useNavigate } from 'react-router-dom';
import PATH from '../../constants/path.js';
import usePageTitle from '../../hooks/usePageTitle.js';
import { checkIcon } from '../../assets/icons.js';

/**
 * Verified Page
 * -------------------------------------------------------
 * Behaviour
 * 1) Shown the FIRST TIME after the Dean/Admin verifies the account.
 * 2) On mount:
 *    - If user is not verified yet, redirect back to Pending page.
 *    - If user already saw this page on this device (localStorage flag), skip to Dashboard.
 * 3) When user clicks Continue, we persist a localStorage flag so this page
 *    won't show again on the same browser, and (optionally) inform the backend.
 */
const VerifiedPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  usePageTitle('Account Verified');

  // Gatekeeping + first-load decisions
  useEffect(() => {
    if (isLoading) return;

    // Not logged in / no user
    if (!user) return; // We render a small message below

    // If somehow the user hits this page but isn't verified yet, send back to Pending
    if (user?.status !== 'verified') {
      navigate(PATH.PENDING, { replace: true });
      return;
    }

    // If they have already seen the Verified screen on this device, go straight to dashboard
    const hasSeen = localStorage.getItem('hasSeenVerified') === 'true';
    if (hasSeen) {
      navigate(PATH.PUBLIC.LOGIN, { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleContinue = async () => {
    try {
      // Optional: Let the backend know this user has acknowledged the verified screen
      // If you maintain an `isFirst` flag server-side, you can flip it here.
      await fetch('/api/set-isFirst-false', { method: 'POST' });
    } catch (err) {
      // Silently ignore if endpoint doesn't exist yet
      // console.warn('set-isFirst-false endpoint not available:', err);
    }

    // Persist locally so this page won’t appear again on this browser
    localStorage.setItem('hasSeenVerified', 'true');

    // Continue to the main app area
    navigate(PATH.DASHBOARD, { replace: true });
  };

  if (isLoading) return <PendingSkeletonLoader />;

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-200'>
        <div className='w-full max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg text-center'>
          <p>You are not logged in. Please sign in first.</p>
        </div>
      </div>
    );
  }

  // If user exists but is not verified, the effect above will redirect to Pending.
  // Render the Verified UI when we have a verified user and they haven't seen the page yet on this device.
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-200'>
      <div className='w-full max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg'>
        <div className='justify-center flex mb-6'>
          <img className='w-24 md:w-32 h-32' src={checkIcon} alt='Verified Icon' />
        </div>

        <div className='content border-2 border-green-500 rounded-3xl pt-4'>
          <h1 className='text-2xl font-bold text-center text-green-700'>Account Verified</h1>

          <p className='text-center mt-4 m-2'>
            Welcome, <strong>{user.fullName}</strong>!
          </p>

          <p className='text-center mt-4 m-2'>
            Your account has been reviewed and approved by the administrator.
          </p>

          <p className='text-center mt-4 m-2'>
            You can now login to the system.
          </p>

          <div className='flex justify-center mt-6 pb-6'>
            <button
              onClick={handleContinue}
              className='px-6 py-2 rounded-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium shadow-md active:scale-98 hover:shadow-slate-200'
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedPage;
