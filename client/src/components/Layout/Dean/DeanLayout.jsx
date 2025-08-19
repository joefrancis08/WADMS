import { useState, useEffect } from 'react';
import { USER_ROLES } from '../../../constants/user';
import PATH from '../../../constants/path';
import SidebarLG from '../../SidebarLG';
import SidebarSM from '../../SidebarSM';
import MobileHeader from '../../MobileHeader';
import { BookCopy, BookTextIcon, BookUp2, FileStack, FileText, LayoutDashboard, UserCheck, UserRound, UsersRound, UserX } from 'lucide-react';
import { useUsersBy } from '../../../hooks/useUsers';

const AdminLayout = ({ children }) => {
  const { UNVERIFIED_USER } = USER_ROLES;
  const { TASK_FORCE } = PATH.DEAN;
  const unverifiedUsers = useUsersBy('role', UNVERIFIED_USER).users;
  const [menuIsClicked, setMenuIsClicked] = useState(false);
  const [unverifiedUserCount, setUnverifiedUserCount] = useState(null);

  useEffect(() => {
  // Only run this if users is an array (not loading or error)
  if (Array.isArray(unverifiedUsers?.data)) {
      const count = unverifiedUsers.data.length;
      setUnverifiedUserCount(count);
    }
  }, [unverifiedUsers]);

  useEffect(() => {
    document.body.style.overflow = menuIsClicked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuIsClicked]);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', link: '/d' },
    { 
      id: 'task-force', 
      icon: UsersRound, 
      label: 'Task Force',
      link: TASK_FORCE
    },
    {
      id: 'accreditation',
      icon: BookCopy,
      label: 'Accreditation',
      children: [
        { id: 'program-to-accredit', icon: BookTextIcon, label: 'Programs to be Accredited', link: '/d/accreditation/program-to-accredit' },
      ]
    }
  ];

  return (
    <div className='grid grid-cols-[auto_1fr] h-screen overflow-hidden'>
      <div className='sm:flex max-md:flex md:hidden'>
        <SidebarSM sideBarOpen={menuIsClicked} setSideBarOpen={setMenuIsClicked} />
      </div>
      <div className='hidden md:block h-screen overflow-y-auto'>
        <SidebarLG 
          menuItems={menuItems}
          unverifiedUserCount={unverifiedUserCount}
        />
      </div>
      <div className='overflow-y-auto h-screen'>
        <MobileHeader onMenuClick={setMenuIsClicked}/>
        <div className='flex-1 p-0 space-y-3'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout;
