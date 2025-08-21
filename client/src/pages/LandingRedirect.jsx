import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES, USER_STATUS } from '../constants/user';
import PATH from '../constants/path';
import LoadSpinner from '../components/Loaders/LoadSpinner';

const { EMAIL_CONFIRMATION, NOT_FOUND_URL } = PATH.PUBLIC;
const { UNVERIFIED_USER } = USER_ROLES;
const { PENDING } = USER_STATUS;

const LandingRedirect = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    if (!user) {
      navigate(EMAIL_CONFIRMATION); // If user not logged in
    } else {
      navigate(NOT_FOUND_URL);
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <LoadSpinner height={'h-16'} width={'w-16'}/>
    </div>
  );
};

export default LandingRedirect;
