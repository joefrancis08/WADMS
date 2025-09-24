import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES, USER_STATUS } from '../constants/user';
import PATH from '../constants/path';
import LoadSpinner from '../components/Loaders/LoadSpinner';
import { LoaderCircle } from 'lucide-react';

const { EMAIL_CONFIRMATION, LOGIN } = PATH.PUBLIC;
const { UNVERIFIED_USER } = USER_ROLES;
const { PENDING } = USER_STATUS;

const LandingRedirect = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate(LOGIN, { replace: true });
      } else {
        // Logged-in users
        switch (user.role) {
          case USER_ROLES.DEAN:
            navigate('/d', { replace: true });
            break;
          case UNVERIFIED_USER:
            navigate(EMAIL_CONFIRMATION, { replace: true });
            break;
          default:
            navigate('/', { replace: true });
        }
      }
    }
  }, [user, isLoading, navigate]);


  return (
    <div className="w-full h-screen flex items-center justify-center">
      <LoaderCircle className='h-16 w-16 animate-spin text-slate-700'/>
    </div>
  );
};

export default LandingRedirect;
