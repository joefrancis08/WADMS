import React, { useEffect, useState } from 'react'
import { verifyToken } from '../api-calls/Users/userAPI';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES, USER_STATUS } from '../constants/user';
import { useNavigate, useParams } from 'react-router-dom';
import PATH from '../constants/path';

const SharePage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('Verifying...');
  const { token } = useParams();
  console.log(token);

  useEffect(() => {
    const queryFn = async () => {
      try {
        const res = await verifyToken(token);
        console.log(res);
        const userData = res.data.userData;
        const { email, fullName, profilePicPath, role, status } = userData;
        login(email, fullName, profilePicPath, role, status);

        if (userData.status === USER_STATUS.VERIFIED) {
          if (userData.role === USER_ROLES.DEAN) {
            navigate(PATH.DEAN.DASHBOARD, { replace: true });

          } else if (userData.role === USER_ROLES.TASK_FORCE_CHAIR || userData.role === USER_ROLES.TASK_FORCE_MEMBER) {
            navigate(PATH.TASK_FORCE.DASHBOARD, { replace: true });

          } else if (userData.role === USER_ROLES.IA) {
            navigate(null);

          } else if (userData.role === USER_ROLES.ACCREDITOR) {
            navigate(null);

          } else {
            navigate('/');
          }
        }
        
      } catch (error) {
        const errorData = error.response.data;
        console.log(errorData);
        if (errorData.isUsed) {
          setStatus('Invalid link.');
        }
        console.error('Error verifying token:', error);
        throw error;
      }
    };

    queryFn();

  });

  return (
    <div>{status}</div>
  )
}

export default SharePage
