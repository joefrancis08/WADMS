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
    <div className="w-full h-screen flex items-center justify-center">
      <LoadSpinner height={'h-16'} width={'w-16'}/>
    </div>
  );
};

export default LandingRedirect;
