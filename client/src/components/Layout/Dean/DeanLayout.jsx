import { useState, useEffect } from 'react';
import { USER_ROLES } from '../../../constants/user';

import PATH from '../../../constants/path';
import SidebarLG from '../../SidebarLG';
import SidebarSM from '../../SidebarSM';
import MobileHeader from '../../MobileHeader';
import { BookCopy, CalendarDays, FolderArchive, LayoutDashboard, NotepadText, ShieldUser, SquareUserRound, UserRoundCog, UserRoundX, UsersRound } from 'lucide-react';
import { useUsersBy } from '../../../hooks/fetch-react-query/useUsers';

const DeanLayout = ({ children, ref }) => {
  const { UNVERIFIED_USER } = USER_ROLES;
  const { 
    DASHBOARD, 
    TASK_FORCE, 
    INTERNAL_ASSESSORS,
    UNVERIFIED_USER: UNVERIFIED_USERS, 
    ARCHIVE,
    PROGRAMS_TO_BE_ACCREDITED 
  } = PATH.DEAN;
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
          link: INTERNAL_ASSESSORS
        },
        { 
          id: 'accreditor', 
          icon: ShieldUser, 
          label: 'Accreditor',
          link: ''
        },
        {
          id: 'unverified',
          icon: UserRoundX,
          label: 'Unverified',
          link: UNVERIFIED_USERS,
          hasHR: true
        }
      ]
    },
    {
      id: 'accreditation',
      icon: BookCopy,
      label: 'Accreditation',
      children: [
        { id: 'assignment', 
          icon: CalendarDays, 
          label: 'Assignments', 
          link: '' 
        },
        { id: 'programs', 
          icon: NotepadText, 
          label: 'Programs', 
          link: PROGRAMS_TO_BE_ACCREDITED 
        },
        { id: 'archive', 
          icon: FolderArchive, 
          label: 'Archive', 
          link: ARCHIVE,
          hasHR: true
        },
      ]
    }
  ];

  return (
    <div ref={ref} className='grid grid-cols-[auto_1fr] h-screen overflow-hidden'>
      <div className='sm:flex max-md:flex md:hidden'>
        <SidebarSM sideBarOpen={menuIsClicked} setSideBarOpen={setMenuIsClicked} />
      </div>
      <div className='hidden md:block h-screen overflow-y-auto'>
        <SidebarLG 
          menuItems={menuItems}
          unverifiedUserCount={unverifiedUserCount}
        />
      </div>
      <div className='overflow-y-auto min-h-screen bg-slate-800'>
        <MobileHeader onMenuClick={setMenuIsClicked}/>
        <div className='flex-1 p-0 space-y-3'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default DeanLayout;
