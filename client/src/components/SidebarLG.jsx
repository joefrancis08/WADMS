import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import useOutsideClick from '../hooks/useOutsideClick';
import MODAL_TYPE from '../constants/modalTypes';
import ConfirmationModal from './Modals/ConfirmationModal';
import { logoutUser } from '../api-calls/Users/userAPI';
import { showErrorToast, showSuccessToast } from '../utils/toastNotification';
import { logoutIcon } from '../assets/icons';

const profileOptions = [
  { id: 'view-profile', label: 'View Profile', icon: UserRound },
  { id: 'logout', label: 'Logout', icon: LogOut },
];

const ProfileAction = ({ onViewProfile, onLogout }) => (
  profileOptions.map((item) => {
    const Icon = item.icon;

    const handleClick = () => {
      if (item.id === 'view-profile') {
        onViewProfile();
      } else if (item.id === 'logout') {
        onLogout();
      }
    };

    return (
      <>
        {item.id === 'logout' && <hr className='text-slate-700 my-1 w-[90%] mx-auto'></hr>}
        <button
          key={item.id}
          onClick={handleClick}
          className='flex items-center w-full px-4 py-3 text-sm text-slate-100 hover:bg-slate-800 rounded-md transition cursor-pointer'
        >
          <Icon className='w-5 h-5 mr-2'/>
          {item.label}
        </button>
      </>
    );
  })
);


const SidebarLG = ({ menuItems, unverifiedUserCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef();

  const { user, isLoading } = useAuth();
  const { logout } = useAuth();

  // Sidebar collapsed state (stored in localStorage)
  const savedState = localStorage.getItem('sidebar-collapsed');
  const [isCollapsed, setIsCollapsed] = useState(() => savedState === 'true');
  const savedDropdowns = JSON.parse(localStorage.getItem('sidebar-open-dropdowns') || '{}');
  const [openDropdowns, setOpenDropdowns] = useState(savedDropdowns);
  const [openUserMenu, setOpenUserMenu] = useState(false); // State for logged in user
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  useOutsideClick(userMenuRef, () => setOpenUserMenu(false));

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    
    localStorage.setItem('sidebar-collapsed', newState.toString());
  };

  const toggleDropdown = (id) => {
    const newState = {
      ...openDropdowns,
      [id]: !openDropdowns[id],
    };
    setOpenDropdowns(newState);
    localStorage.setItem('sidebar-open-dropdowns', JSON.stringify(newState));
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked');
    setOpenUserMenu(false);
    setModalType(MODAL_TYPE.LOGOUT);
  };

  const handleOpenUserMenu = () => {
    setOpenUserMenu(!openUserMenu);
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.data.success) {
        logout();
        showSuccessToast('Logged out successfully!', 'top-center');
        
      } else {
        showErrorToast('Logout failed. Try again.');
      }
    } catch (error) {
      showErrorToast('Something went wrong. Try again.');
      console.error(error);
    }
  };

  return (
    <aside className={`sidebar-container ${isCollapsed ? 'w-20' : 'w-65'} bg-slate-900 text-white h-screen flex flex-col shadow-lg`}>
      {/* Header */}
      <header className="relative flex items-center justify-between px-2 py-2 border-b border-slate-700 h-14 shadow-lg">
        {!isCollapsed && (
          <div className="h-8 flex items-center transition-all duration-300">
            <img className="h-10 w-auto z-10" src="/pit-logo-outlined.png" alt="Logo" loading='lazy'/>
            <img className="h-10 w-auto -ml-8" src="/cgs-logo.png" alt="Logo" loading='lazy'/>
            <div className="ml-2 overflow-hidden">
              <p className="text-xl font-bold whitespace-nowrap">DMS</p>
              <p className="text-[6px] leading-none whitespace-nowrap">Document</p>
              <p className="text-[6px] leading-none whitespace-nowrap">Management System</p>
            </div>
          </div>
        )}
        <button onClick={toggleSidebar} className="text-white hover:text-slate-100 active:opacity:90 cursor-pointer bg-slate-700 transition-all duration-1000">
          {isCollapsed 
            ? (
              <span
                title='Expand Sidebar' 
                className='absolute top-1/2 left-1/2 -translate-1/2 p-2 hover:bg-slate-700 rounded-full cursor-pointer'>
                <Menu />
              </span>
            )
            : (
              <span 
                title='Collapse Sidebar'
                className='absolute top-1 right-1 p-2 hover:bg-slate-700 rounded-full cursor-pointer'>
                <X className='h-5 w-5' />
              </span>
            )
          }
        </button>
      </header>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-2 overflow-y-auto">
        <div className="flex flex-col space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.link && location.pathname === item.link;
            const hasChildren = !!item.children;

            return (
              <div key={item.id}>
                <div
                  onClick={() => {
                    if (hasChildren) {
                      toggleDropdown(item.id);

                      if (isCollapsed) {
                        setIsCollapsed(false);
                        localStorage.setItem('sidebar-collapsed', 'false'); // ensure persistence on next mount
                      }
                    } else {
                      navigate(item.link);
                    }
                  }}
                  className={`relative flex items-center space-x-5 px-5 py-3 cursor-pointer transition-all ${
                    isActive ? 'bg-slate-700 text-white font-semibold rounded-md' : 'hover:bg-slate-700 rounded-md'
                  }`}
                >
                  <Icon
                    fill={isActive ? '#64748b' : 'none'}
                    className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-7 h-7'}`}
                  />
                  <span
                    className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-1000${
                      isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'
                    }`}
                  >
                    {item.label}
                  </span>
                  {hasChildren && !isCollapsed && (
                    <ChevronDown 
                      className={`absolute right-2 transition-all duration-200 h-5 w-5 ${openDropdowns[item.id] && '-rotate-180'}`} 
                    />
                  )}
                </div>

                {/* Dropdown items */}
                {hasChildren && openDropdowns[item.id] && !isCollapsed && (
                  <div 
                    className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = location.pathname === child.link;
                      return (
                        <React.Fragment key={child.id}>
                          {child.hasHR && <hr className='my-2 text-slate-600'></hr>}
                          <Link
                            to={child.link}
                            className={`relative text-sm flex items-center space-x-3 px-4 py-2 rounded-md transition ${
                              childActive ? 'bg-slate-700 text-white' : 'hover:bg-slate-800'
                            }`}
                          >
                            <ChildIcon
                              fill={childActive ? '#64748b' : 'none'}
                              className="flex-shrink-0 w-6 h-6"
                            />
                            <span className="text-sm">{child.label}</span>
                            {child.hasNotif && 
                              unverifiedUserCount && (
                                <p className='absolute text-xs font-semibold text-slate-600 top-2 right-3 bg-slate-200 px-2 py-1 rounded-full'>{unverifiedUserCount}</p>
                              )
                            }
                          </Link>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Logged-in User Info */}
      <div className='relative' ref={userMenuRef}>
        <hr className='text-slate-600 w-[94%] mx-auto mt-2'></hr>
        <div className='relative p-2'>
          <div
            onClick={handleOpenUserMenu}
            className='flex items-center justify-between cursor-pointer active:opacity-80 hover:bg-slate-800 py-2 pl-2 rounded-md overflow-hidden'
          >
            {/* User Info */}
            <div className={`flex items-center overflow-hidden transition-all ${isCollapsed ? 'gap-0' : 'gap-3'}`}>
              <img className='rounded-full w-8 h-8' src='/sample-profile-picture.webp' alt='User Profile' />
              <div className={`${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'}`}>
                <p className='text-sm font-semibold'>{'Sample User'}</p>
                <p className='text-xs text-gray-400'>{'Sample Role'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popover Menu outside sidebar */}
        {openUserMenu && (
          <div
            onClick={() => setOpenUserMenu(false)} 
            className={`fixed bottom-2 ${isCollapsed ? 'left-[6rem]' : 'left-[17rem]'} p-2 bg-slate-900 rounded-md shadow-lg z-50 transition-all outline outline-slate-700`}
          >
            <ProfileAction 
              onViewProfile={() => {
                console.log('View Profile clicked');
                setOpenUserMenu(false);
              }}
              onLogout={handleLogoutClick}
            />
          </div>
        )}
      </div>
      {modalType === MODAL_TYPE.LOGOUT && (
        <ConfirmationModal 
          onClose={handleCloseModal}
          onCancelClick={handleCloseModal}
          onConfirmClick={handleLogout}
          primaryButton={'Logout'}
          secondaryButton={'Cancel'}
          bodyContent={
            <div className='flex flex-col items-center justify-center gap-y-5 mb-5'>
              <img src={logoutIcon} alt="Log out Icon" className='h-28 w-28 text-white opacity-50' loading='lazy' />
              <p className='text-lg text-black'>
                Are you sure you want to logout?
              </p>
            </div>
          }
        />
      )}
    </aside>
  );
};

export default SidebarLG;
