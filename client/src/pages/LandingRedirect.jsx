import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES, USER_STATUS } from '../constants/user';
import PATH from '../constants/path';
import { LoaderCircle } from 'lucide-react';

const { LOGIN } = PATH.PUBLIC;

const LandingRedirect = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  console.log(user);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate(LOGIN, { replace: true });
        return;

      } else {
        // Pending users
        if (user.status === USER_STATUS.PENDING) {
          if (user.role === USER_ROLES.UU) {
            navigate(PATH.UNVERIFIED_USER.PENDING, { replace: true });
            return;
          }
        }
        
        // Verified user that hasn't seen the welcome page
        if (user.isShowWelcome && user.status === USER_STATUS.VERIFIED) {
          navigate(PATH.VERIFIED_USER.VERIFIED);
          return;
        }
        
         // Logged in user that already seen the verified page
        if (user.status === USER_STATUS.VERIFIED && !user.isShowWelcome) {
          if (user.role === USER_ROLES.DEAN) {
            navigate('/d', { replace: true });

          } else if (user.role === USER_ROLES.TASK_FORCE_CHAIR || user.role === USER_ROLES.TASK_FORCE_MEMBER) {
            navigate('/t', { replace: true });

          } else if (user.role === USER_ROLES.IA) {
            navigate(PATH.INTERNAL_ASSESSOR.DASHBOARD);

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
