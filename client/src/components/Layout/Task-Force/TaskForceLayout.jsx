import React, { useRef, useState } from 'react';
import {
  Menu,
  X,
  Bell,
  Pen,
  LogOut,
  ClipboardPenLine,
  CheckCheck,
  RefreshCw,
} from 'lucide-react';
import PATH from '../../../constants/path';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useOutsideClick from '../../../hooks/useOutsideClick';
import { logoutUser } from '../../../api-calls/users/userAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { showErrorToast, showSuccessToast } from '../../../utils/toastNotification';
import useFetchNotifications from '../../../hooks/fetch-react-query/useFetchNotifications';
import usePageTitle from '../../../hooks/usePageTitle';
import formatAreaName from '../../../utils/formatAreaName';
import { formatClock } from '../../../utils/notifData';
import { patchNotification } from '../../../api-calls/notification/notificationAPI';

const { ACCREDITATION } = PATH.TASK_FORCE;
const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const navItems = [
  { id: 'home', label: 'Home', link: '/' },
  { id: 'accreditation', label: 'Accreditation', link: ACCREDITATION },
];

const TaskForceLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { notificationsData, notifLoading, notifError, notifRefetch } =
    useFetchNotifications(user.userId);
  const notifications = notificationsData.notificationData ?? [];

  const notifRef = useRef();
  const profileOptionRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [showProfileOption, setShowProfileOption] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  usePageTitle('Task Force');
  useOutsideClick(profileOptionRef, () => setShowProfileOption(false));
  useOutsideClick(notifRef, () => setShowNotif(false));

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.data.success) {
        logout();
        showSuccessToast('Logged out successfully!', 'top-center');
        localStorage.removeItem('token');
      } else {
        showErrorToast('Logout failed. Try again.');
      }
    } catch (error) {
      showErrorToast('Something went wrong. Try again.');
      console.error(error);
    }
  };

  const handleMarkAsRead = async (notifId, userId) => {
    try {
      await patchNotification(notifId, userId);
      notifRefetch();
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const unreadCount = notifications.filter((n) => Number(n?.isRead) === 0).length;

  return (
    <div className='min-h-screen flex flex-col bg-slate-50 text-slate-800'>
      {/* ===== Navbar ===== */}
      <nav className='sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3'>
          {/* Left: Brand */}
          <div
            onClick={() => navigate('/')}
            className='flex items-center gap-3 cursor-pointer'
          >
            <img
              className='h-10 w-10'
              src='/pit-logo-outlined.png'
              alt='PIT Logo'
            />
            <div className='flex flex-col'>
              <span className='text-yellow-600 font-bold text-lg'>
                Palompon Institute of Technology
              </span>
              <span className='text-emerald-600 text-xs italic'>
                College of Graduate Studies
              </span>
            </div>
          </div>

          {/* Middle: Navigation (Desktop) */}
          <div className='hidden md:flex items-center gap-2'>
            {navItems.map((item) => {
              const active = location.pathname === item.link;
              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Notifications & Profile */}
          <div className='flex items-center gap-3'>
            {/* Notifications */}
            <button
              title={`${unreadCount} unread notifications`}
              onClick={() => setShowNotif(!showNotif)}
              className='relative p-2 rounded-full hover:bg-slate-100 cursor-pointer transition'
            >
              <Bell className='h-6 w-6 text-slate-600' />
              {unreadCount > 0 && (
                <span className='absolute top-0 -right-1 bg-red-500 px-2 rounded-full text-white text-xs'>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => setShowProfileOption(!showProfileOption)}
              className='flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 transition'
              title='My Profile'
            >
              <img
                src={
                  user.profilePicPath?.startsWith('http')
                    ? user.profilePicPath
                    : `${PROFILE_PIC_PATH}/${user.profilePicPath || 'default-profile-picture.png'}`
                }
                alt='Profile'
                className='h-9 w-9 rounded-full object-cover'
              />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className='md:hidden p-2 rounded-full hover:bg-slate-100'
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className='h-6 w-6 text-slate-700' />
              ) : (
                <Menu className='h-6 w-6 text-slate-700' />
              )}
            </button>
          </div>
        </div>

        {/* ===== Mobile Nav ===== */}
        {isOpen && (
          <div className='md:hidden bg-white border-t border-slate-200 shadow-sm'>
            <div className='px-4 py-3 space-y-1'>
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition ${
                    location.pathname === item.link
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ===== Profile Dropdown ===== */}
      {showProfileOption && (
        <div
          ref={profileOptionRef}
          className='absolute top-[4.5rem] right-4 z-[999] w-72 bg-white border border-slate-200 shadow-lg rounded-xl p-4'
        >
          <div className='flex flex-col items-center'>
            <img
              src={
                user.profilePicPath?.startsWith('http')
                  ? user.profilePicPath
                  : `${PROFILE_PIC_PATH}/${user.profilePicPath || 'default-profile-picture.png'}`
              }
              alt='Profile'
              className='h-20 w-20 rounded-full mb-3 object-cover'
            />
            <p className='font-semibold text-slate-800 text-lg'>
              {user.fullName}
            </p>
            <p className='text-slate-500 text-sm'>{user.role}</p>
            <p className='text-slate-400 text-xs mt-1'>{user.email}</p>
            <button
              title='Edit profile'
              className='absolute top-4 right-4 p-2 text-slate-500 hover:text-emerald-600 rounded-full transition'
            >
              <Pen className='h-5 w-5' />
            </button>
          </div>

          <hr className='my-4 border-slate-200' />

          <button
            onClick={handleLogout}
            className='flex w-full items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-full py-2 hover:bg-red-100 transition'
          >
            <LogOut className='h-5 w-5' />
            Log Out
          </button>
        </div>
      )}

      {/* ===== Notifications Dropdown ===== */}
      {showNotif && (
        <div
          ref={notifRef}
          className='absolute top-[4.5rem] right-[6rem] w-[28rem] max-h-[32rem] overflow-auto bg-white border border-slate-200 shadow-xl rounded-xl z-[999]'
        >
          <div className='sticky top-0 flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 rounded-t-xl'>
            <h2 className='text-lg font-semibold text-slate-800'>Notifications</h2>
            <button
              onClick={notifRefetch}
              className='flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition'
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Notifications List */}
          {!notifLoading && notifications.length > 0 ? (
            <ul className='p-3 space-y-2'>
              {notifications.map((item) => {
                const isUnread = Number(item?.isRead) === 0;
                const d = new Date(item?.notifDate || item?.createdAt || Date.now());
                return (
                  <li
                    key={item.notifId}
                    className={`border border-slate-200 rounded-lg p-3 transition hover:bg-emerald-50 ${
                      isUnread ? 'bg-emerald-50/70' : 'bg-white'
                    }`}
                  >
                    <div className='flex items-start gap-3'>
                      <ClipboardPenLine className='text-emerald-600 shrink-0' size={20} />
                      <div className='flex-1'>
                        <p className='text-sm text-slate-800'>
                          {item?.notifType === 'unassign'
                            ? 'You were unassigned from'
                            : 'You were assigned to'}{' '}
                          <strong>{formatAreaName(item?.area)}</strong>
                          {item?.parameter ? ` · Parameter ${item.parameter}` : ''}
                          {item?.subparameter ? ` · ${item.subparameter}` : ''}.
                        </p>
                        <div className='mt-1 text-xs text-slate-500'>
                          <time>{formatClock(d)}</time> • {item.fullName || 'System'}
                        </div>
                        {isUnread && (
                          <button
                            onClick={() => handleMarkAsRead(item.notifId, user.userId)}
                            className='mt-2 inline-flex items-center gap-1 text-xs text-emerald-700 hover:underline'
                          >
                            <CheckCheck size={14} /> Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className='flex flex-col items-center justify-center py-10 text-slate-500'>
              <Bell className='h-8 w-8 text-slate-400 mb-2' />
              <p>No new notifications</p>
            </div>
          )}
        </div>
      )}

      {/* ===== Main Content ===== */}
      <main className=''>
        {children}
      </main>
    </div>
  );
};

export default TaskForceLayout;
