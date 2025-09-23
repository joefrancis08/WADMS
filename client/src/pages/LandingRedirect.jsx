import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES, USER_STATUS } from '../constants/user';
import PATH from '../constants/path';
import LoadSpinner from '../components/Loaders/LoadSpinner';

const { EMAIL_CONFIRMATION, NOT_FOUND_URL, REGISTER } = PATH.PUBLIC;
const { UNVERIFIED_USER } = USER_ROLES;
const { PENDING } = USER_STATUS;

const LandingRedirect = () => {
  // 
  const user = { email: "test@test.com", role: "Dean" }; // mock data
  const isLoading = false;
  const navigate = useNavigate();

  useEffect(() => {
  if (!isLoading) {
    if (!user) {
      navigate(EMAIL_CONFIRMATION);
    } else {
      navigate(REGISTER);
    }
  }
}, [user, isLoading, navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {/* <LoadSpinner height={'h-16'} width={'w-16'}/> */}
      <div>Testing Landing Redirect...</div>
    </div>
  );
};

export default LandingRedirect;
