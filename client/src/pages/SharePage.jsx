import React, { useEffect, useState } from 'react'
import { verifyToken } from '../api-calls/Users/userAPI';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES, USER_STATUS } from '../constants/user';
import { useNavigate } from 'react-router-dom';
import PATH from '../constants/path';

const SharePage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');
  const token = new URLSearchParams(window.location.search).get('token');
  console.log(token);

  useEffect(() => {
    const queryFn = async () => {
      try {
        const res = await verifyToken(token);
        const userData = res.data.userData;

        if (userData.status === USER_STATUS.VERIFIED) {
          if (userData.role === USER_ROLES.DEAN) {
            navigate(PATH.DEAN.DASHBOARD);

          } else if (userData.role === USER_ROLES.TASK_FORCE_CHAIR || userData.role === USER_ROLES.TASK_FORCE_MEMBER) {
            navigate(PATH.TASK_FORCE.DASHBOARD);

          } else if (userData.role === USER_ROLES.IA) {
            navigate(null);

          } else if (userData.role === USER_ROLES.ACCREDITOR) {
            navigate(null);
          }
        }
        
      } catch (error) {
        console.error('Error verifying token:', error);
        throw error;
      }
    };

    queryFn();

  }, [token, navigate]);

  return (
    <div>{status}</div>
  )
}

export default SharePage
