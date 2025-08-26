import { useState, useEffect } from 'react';
import { USER_ROLES } from '../../../constants/user';

import PATH from '../../../constants/path';
import SidebarLG from '../../SidebarLG';
import SidebarSM from '../../SidebarSM';
import MobileHeader from '../../MobileHeader';
import { Archive, ArchiveRestore, BookCopy, BookTextIcon, Calendar, CalendarDays, FolderArchive, Group, LayoutDashboard, NotepadText, ShieldUser, SquareUserRound, UserRoundCog, UserRoundCogIcon, UsersRound } from 'lucide-react';
import { useUsersBy } from '../../../hooks/useUsers';

const AdminLayout = ({ children }) => {
  const { UNVERIFIED_USER } = USER_ROLES;
  const { DASHBOARD, TASK_FORCE, PROGRAMS_TO_ACCREDIT } = PATH.DEAN;
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
    { id: 'dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      link: DASHBOARD 
    },
    {
      id: 'user-management',
      icon: UsersRound,
      label: 'User Management',
      children: [
        { 
          id: 'task-force', 
          icon: UserRoundCog, 
          label: 'Task Force',
          link: TASK_FORCE
        },
        { 
          id: 'internal-assessor', 
          icon: SquareUserRound, 
          label: 'Internal Assessor',
          link: ''
        },
        { 
          id: 'accreditor', 
          icon: ShieldUser, 
          label: 'Accreditor',
          link: ''
        }
      ]
    },
    {
      id: 'accreditation',
      icon: BookCopy,
      label: 'Accreditation',
      children: [
        { id: 'period-and-level', 
          icon: CalendarDays, 
          label: 'Period & Level', 
          link: '' 
        },
        { id: 'program-to-be-accredited', 
          icon: NotepadText, 
          label: 'Programs to be Accredited', 
          link: PROGRAMS_TO_ACCREDIT 
        },
        { id: 'archive', 
          icon: FolderArchive, 
          label: 'Archive', 
          link: '',
          hasHR: true
        },
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
