import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES, USER_STATUS } from '../constants/user';
import PATH from '../constants/path';
import LoadSpinner from '../components/Loaders/LoadSpinner';

const { DEFAULT, REGISTER } = PATH.PUBLIC;
const { PENDING_VERIFICATION } = PATH.UNVERIFIED_USER;
const { DEFAULT } = USER_ROLES;
const { PENDING } = USER_STATUS;

const LandingRedirect = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate(REGISTER); // user not logged in
    } else if (user.status === PENDING && user.role === DEFAULT) {
      navigate(PENDING_VERIFICATION);
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
