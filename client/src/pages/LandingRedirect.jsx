import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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

  return <div>Loading...</div>; // optional loader
};

export default LandingRedirect;
