import { pendingIcon } from '../../assets/icons.js';
import { useAuth } from '../../contexts/AuthContext';
import PendingSkeletonLoader from '../Pending/PendingSkeletonLoader.jsx';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle.js';

const Pending = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  usePageTitle('Pending Verification');

  console.log();

  if (isLoading) 
    return (
      <PendingSkeletonLoader />
    )
    
  if (!user) {
    return (
      <div>
        <p>You are not registered. Please register first.</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-200'>
      <div className='w-full max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg'>
        <div className='justify-center flex mb-6'>
          <img className='w-24 md:w-32 h-auto' src={pendingIcon} alt="Pending Icon" />
        </div>
        <div className="content border-2 border-green-500 rounded-3xl pt-4">
          <h1 className="text-2xl font-bold text-center text-green-700">Pending Verification</h1>
          <p className="text-center mt-4 m-2">
            Good day, <strong>{user.fullName}</strong>!
          </p>
          <p className="text-center mt-4 m-2">
            Your registration is currently awaiting verification by the administrator.
          </p>
          <p className="text-center mt-4 m-2">You'll be notified once your account has been reviewed and approved.</p>
          <p className="text-center mt-4 m-2 pb-4">Thank you for your patience!</p>
        </div>
      </div>
    </div>
  );
}

export default Pending;
