import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadSpinner from '../components/Loaders/LoadSpinner';

const LandingRedirect = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/register'); // user not logged in
    } else if (user.status === 'Pending' && user.role === 'Unverified User') {
      navigate('/pending-verification');
    } else {
      navigate('*');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className='w-full absolute'>
      <div className='relative flex items-center justify-center top-100'>
        <LoadSpinner height={'6'} width={'6'}/>
      </div>
    </div>
    
  );
};

export default LandingRedirect;
