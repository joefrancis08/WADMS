import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import useOutsideClick from '../hooks/useOutsideClick';
import MODAL_TYPE from '../constants/modalTypes';
import ConfirmationModal from './Modals/ConfirmationModal';
import { logoutUser } from '../api-calls/Users/userAPI';
import { showErrorToast, showSuccessToast } from '../utils/toastNotification';

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
    <aside className={`sidebar-container ${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white h-screen flex flex-col shadow-lg`}>
      {/* Header */}
      <header className="relative flex items-center justify-between px-2 py-2 border-b border-gray-600 h-20 shadow-lg">
        {!isCollapsed && (
          <div className="h-10 flex items-center transition-all duration-300">
            <img className="h-14 w-auto" src="/cgs-logo.png" alt="Logo" />
            <div className="ml-2 overflow-hidden">
              <p className="text-2xl font-bold whitespace-nowrap">DMS</p>
              <p className="text-[8px] leading-none whitespace-nowrap">Document</p>
              <p className="text-[8px] leading-none whitespace-nowrap">Management System</p>
            </div>
          </div>
        )}
        <button onClick={toggleSidebar} className="text-white hover:text-slate-100 hover:opacity-90 active:opacity:90 cursor-pointer bg-slate-700 transition-all duration-1000">
          {isCollapsed 
            ? <Menu className='absolute top-8 left-7' /> 
            : <X className='absolute top-2 right-2 transition-all' />}
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
                    isActive ? 'bg-slate-700 text-white font-semibold rounded-md' : 'hover:bg-slate-800 rounded-md'
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
                      className={`absolute right-2 transition-all duration-200 ${openDropdowns[item.id] && '-rotate-180'}`} 
                      size={25} />
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
                          {child.hasHR && <hr className='mt-5 mb-2 text-slate-600'></hr>}
                          <Link
                            to={child.link}
                            className={`relative flex items-center space-x-3 px-4 py-2 rounded-md transition ${
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
      <div className='relative px-5 py-4 border-t border-gray-700'>
        <div
          onClick={handleOpenUserMenu}
          className='flex items-center justify-between cursor-pointer hover:opacity-80'
        >
          {/* User Info */}
          <div className={`flex items-center overflow-hidden transition-all ${isCollapsed ? 'gap-0' : 'gap-3'}`}>
            <img className='rounded-full w-8 h-8' src='/sample-profile-picture.webp' alt='User Profile' />
            <div className={`${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'}`}>
              <p className='text-sm font-semibold'>{user?.fullName || 'Sample User'}</p>
              <p className='text-xs text-gray-400'>{user?.role || 'Sample Role'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popover Menu outside sidebar */}
      {openUserMenu && (
        <div
          ref={userMenuRef} 
          className={`fixed bottom-2 ${isCollapsed ? 'left-[6rem]' : 'left-[17rem]'} w-48 px-4 py-3 bg-slate-900 rounded-md shadow-lg z-50 transition-all`}
        >
          <button
            onClick={() => {
              console.log('View Profile clicked');
              setOpenUserMenu(false);
            }}
            className='flex items-center w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-800 rounded-md transition cursor-pointer'
          >
            <UserRound className='w-5 h-5 mr-2' /> View Profile
          </button>
          <hr className='my-2 text-slate-600 w-[90%] mx-auto'></hr>
          <button
            onClick={handleLogoutClick}
            className='flex items-center w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-800 rounded-md transition cursor-pointer'
          >
            <LogOut className='w-5 h-5 mr-2' /> Logout
          </button>
        </div>
      )}
      {modalType === MODAL_TYPE.LOGOUT && (
        <ConfirmationModal 
          onClose={handleCloseModal}
          onCancelClick={handleCloseModal}
          onConfirmClick={handleLogout}
          primaryButton={'Logout'}
          secondaryButton={'Cancel'}
          bodyContent={
            <div className='flex flex-col items-center justify-center gap-y-5 mb-5'>
              <p className='p-8 bg-slate-800 rounded-full'>
                <LogOut className='h-12 w-12 text-slate-100 font-bold'/>
              </p>
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
