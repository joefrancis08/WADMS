import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../../components/Layout/Dean-and-Chairman/AdminLayout';
import { ChevronLeft, Mail, Pen, ShieldCheck, Trash2 } from 'lucide-react';
import PATH from '../../constants/path';
import { useUsersBy } from '../../hooks/useUsers';
import { USER_STATUS } from '../../constants/user';
import { useEffect, useMemo, useState } from 'react';
import ProfileAvatar from '../../components/ProfileAvatar';
import TimeAgo from '../../components/TimeAgo';
import LoadSpinner from '../../components/Loaders/LoadSpinner';
import VerifiedUserDetailSkeletonLoader from '../../components/Loaders/VerifiedUserDetailSkeletonLoader';

const VerifiedUserDetail = () => {
  const { id } = useParams();
  const { VERIFIED_USERS } = PATH.ADMIN;
  const { VERIFIED } = USER_STATUS;
  const { users, loading } = useUsersBy('status', VERIFIED);
  const verifiedUsers = useMemo(() => users.data ?? [], [users.data]);

  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    if (!verifiedUsers.length) return;
    const matchedUser = verifiedUsers.find(user => String(user.user_uuid) === String(id));
    setSelectedUser(matchedUser);
  }, [id, verifiedUsers]);

  return (
    <AdminLayout>
      <main className="px-4 py-6 md:px-8 w-full max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link to={VERIFIED_USERS} className="text-gray-700">
            <ChevronLeft className='hover:opacity-65 active:opacity-50' size={32}/>
          </Link>
          <p className='text-lg md:text-2xl transition'>
            {selectedUser?.full_name ?? 'User'}'s Details
          </p>
        </div>
        {loading 
          ? (
              <div className='flex items-center justify-center'>
                <VerifiedUserDetailSkeletonLoader />
              </div>
            )
          : (
            <div className='flex flex-col w-full h-full bg-gray-50 p-4 rounded-xl border border-gray-100 transition-all duration-300 shadow hover:shadow-lg hover:shadow-gray-300 hover:drop-shadow-sm'>
              <div className='flex justify-end p-2 gap-4 md:p-4'>
                <button>
                  <Pen />
                </button>
                <button>
                  <Trash2 />
                </button>
              </div>
              <div className='flex max-lg:flex-col items-center px-5 pb-5 lg:flex-row md:px-20 md:pb-20 justify-evenly'>
                <div className='rounded-full shadow-md'>
                  <ProfileAvatar 
                    name={selectedUser?.full_name} 
                    textSize={'text-5xl'}
                    height={'h-40 md:h-65 lg:h-70'} 
                    width={'w-40 md:w-65 lg:w-70'} 
                    border={'rounded-full'}/>
                </div>
                <div className='flex flex-col items-center gap-y-2'>
                  <div className='flex items-center w-auto text-wrap text-center h-auto pt-8'>
                    <p className='max-sm:text-4xl max-lg:text-5xl lg:text-7xl text-gray-900 font-bold'>{selectedUser?.full_name}</p>
                  </div>
                  <div className='flex justify-center w-auto h-auto pb-4 lg:pb-8'>
                    <p className='max-sm:text-xl max-lg:text-2xl lg:text-3xl font-bold text-gray-600'>{selectedUser?.role}</p>
                  </div>
                </div>
              </div>
              <hr className='w-[50%] m-auto text-gray-400'></hr>
              <div className='px-5 py-5'>
                <div className='flex flex-col py-5 justify-center lg:flex-row items-center  max-lg:gap-6 lg:justify-between'>
                  <div className='flex max-md:flex-col items-center text-gray-500'>
                    <Mail size={32}/>
                    <p className='ml-1 text-sm text-center md:text-xl text-gray-800 font-medium'>
                      {selectedUser?.email}
                    </p>
                  </div>
                  <div className='flex max-md:flex-col items-center'>
                    <ShieldCheck color='green' size={34}/>
                    <p className='text-sm md:text-xl text-center text-gray-800 font-medium '>
                      {selectedUser?.created_at && (
                        <TimeAgo date={selectedUser?.created_at} action='Verified'/>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <hr className='border-1 text-gray-400'></hr>
            </div>
          )
        }
        
      </main>
    </AdminLayout>
  );
};

export default VerifiedUserDetail;
