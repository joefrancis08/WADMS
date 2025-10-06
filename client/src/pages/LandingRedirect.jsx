import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES, USER_STATUS } from '../constants/user';
import PATH from '../constants/path';
import LoadSpinner from '../components/Loaders/LoadSpinner';
import { LoaderCircle } from 'lucide-react';

const { EMAIL_CONFIRMATION, LOGIN } = PATH.PUBLIC;
const { UU } = USER_ROLES;
const { PENDING: PENDING_STATUS } = USER_STATUS;

const LandingRedirect = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  console.log(user);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate(LOGIN, { replace: true });

      } else {
        if (user.status === USER_STATUS.PENDING) {
          if (user.role === USER_ROLES.UU) {
            navigate(PATH.UNVERIFIED_USER.PENDING, { replace: true });
          }
        }
        
         // Logged in user
        if (user.status === USER_STATUS.VERIFIED) {
          if (user.role === USER_ROLES.DEAN) {
            navigate('/d', { replace: true });

          } else if (user.role === USER_ROLES.TASK_FORCE_CHAIR || USER_ROLES.TASK_FORCE_MEMBER) {
            navigate('/t', { replace: true });

          } else {
            navigate('/', { replace: true });
          }
        }
      }
    }
  }, [user, isLoading, navigate]);


  return (
    <div className="w-full h-screen flex items-center justify-center">
      <LoaderCircle className='h-10 w-10 animate-spin text-slate-700'/>
    </div>
  );
};

export default LandingRedirect;
