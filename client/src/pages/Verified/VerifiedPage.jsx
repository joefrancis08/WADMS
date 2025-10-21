import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PendingSkeletonLoader from '../Pending/PendingSkeletonLoader.jsx';
import { useNavigate } from 'react-router-dom';
import PATH from '../../constants/path.js';
import usePageTitle from '../../hooks/usePageTitle.js';
import { checkIcon } from '../../assets/icons.js';
import { updateUserStatus } from '../../api-calls/users/userAPI.js';

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

  console.log(user);

  const handleContinue = async () => {
    try {
      const res = await updateUserStatus(user.userUUID, 'Verified');

      console.log(res);
      if (res?.data?.success) {
        navigate(PATH.PUBLIC.LOGIN, { replace: true });
      }

    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <PendingSkeletonLoader />;

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-200'>
        <div className='w-full max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg text-center'>
          <p>You are not registered. Please registered first.</p>
        </div>
      </div>
    );
  }

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
