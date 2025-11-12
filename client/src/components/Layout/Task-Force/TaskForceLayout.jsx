import React, { useRef, useState } from "react";
import { Menu, X, Bell, Pen, LogOut, Sun, Moon, ClipboardPenLine, CheckCheck, RefreshCw } from "lucide-react";
import PATH from "../../../constants/path";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { logoutUser } from "../../../api-calls/users/userAPI";
import { useAuth } from "../../../contexts/AuthContext";
import { showErrorToast, showSuccessToast } from "../../../utils/toastNotification";
import useFetchNotifications from "../../../hooks/fetch-react-query/useFetchNotifications";
import usePageTitle from "../../../hooks/usePageTitle";
import formatAreaName from "../../../utils/formatAreaName";
import { formatClock, humanizeCalendarDay } from "../../../utils/notifData";
import { patchNotification } from "../../../api-calls/notification/notificationAPI";

const { DASHBOARD, ACCREDITATION } = PATH.TASK_FORCE;
const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const navItems = [
  { id: "home", label: "Home", link: ACCREDITATION },
  { id: "about-us", label: "About Us", link: "/reports" },
];

const TaskForceLayout = ({ children }) => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const { email, fullName, profilePicPath, role } = user;
  const { 
    notificationsData,
    notifLoading,
    notifError,
    notifRefetch
  } = useFetchNotifications(user.userId);

  const notifications = notificationsData.notificationData ?? [];

  const notifRef = useRef();
  const profileOptionRef = useRef();
  const location = useLocation();

  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileOption, setShowProfileOption] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  usePageTitle('Home');
  useOutsideClick(profileOptionRef, () => setShowProfileOption(false));
  useOutsideClick(notifRef, () => setShowNotif(false));

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const handleBellClick = () => {
    setShowNotif(!showNotif);
  };

  const handleProfileClick = () => {
    setShowProfileOption(!showProfileOption);
  };

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
      console.log('Error updating notification:', error);
      throw error;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-800 border-b border-slate-600 z-50">
        <div className="w-full px-4 sm:px-6">
          <div className="relative flex items-center justify-evenly h-16">
            {/* Left: Logo/Brand */}
            <div 
              onClick={() => navigate(PATH.TASK_FORCE.ACCREDITATION)}
              className="flex items-center gap-x-4 text-xl font-bold text-yellow-400 cursor-pointer">
              <img
                className="h-10 w-10"
                src="/pit-logo-outlined.png"
                alt="PIT Logo"
              />
              <p className="flex flex-col">
                <span>Palompon Institute of Technology</span>
                <span className="text-slate-100 text-xs font-normal italic">College of Graduate Studies</span>
              </p>
            </div>

            {/* Middle: Links (Desktop) */}
            <div className="hidden md:flex justify-center space-x-6 mx-auto">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`py-2 px-4 rounded-md transition 
                    ${
                      location.pathname === item.link
                        ? "bg-slate-600 text-slate-100 font-semibold"
                        : "text-slate-100 hover:bg-slate-700"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-x-3">
              {/* <button
                title={isDark ? 'Light Mode' : 'Dark Mode'}
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-700 cursor-pointer"
              >
                {isDark 
                  ? <Sun className="h-6 w-6 text-slate-100"/> 
                  : <Moon className="h-6 w-6 text-slate-100"/>
                }
              </button> */}
              <button 
                title={`${notifications.filter(n => Number(n?.isRead) === 0).length} unread notifications`}
                onClick={handleBellClick}
                className="relative p-2 rounded-full hover:bg-slate-700 cursor-pointer"
              >
                <Bell className="h-6 w-6 text-slate-100" />
                {notifications.filter(n => Number(n?.isRead) === 0).length > 0 && (
                  <span className="absolute top-0 -right-1 bg-red-500 px-2 rounded-full text-slate-100 text-sm">
                    {notifications.filter(n => Number(n?.isRead) === 0).length}
                  </span>
                )}
              </button>
              <button
                onClick={handleProfileClick}
                title={"My Profile"}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-700 cursor-pointer"
              >
                <img
                  src={
                  profilePicPath?.startsWith('http')
                    ? profilePicPath
                    : `${PROFILE_PIC_PATH}/${user.profilePicPath || 'default-profile-picture.png'}`
                  }
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </button>
              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-slate-700"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-slate-100" />
                ) : (
                  <Menu className="h-6 w-6 text-slate-100" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Options */}
        {showProfileOption && (
          <div
            ref={profileOptionRef}
            className="absolute top-[3.5rem] right-[1rem] rounded-lg shadow-md Z-50"
          >
            <div className="w-[24rem] min-h-[20rem] bg-slate-900 p-3 rounded-lg outline outline-slate-700">
              <div className="relative flex flex-col gap-y-4 justify-center items-center bg-slate-800 outline outline-slate-700 min-w-[5rem] min-h-[12rem] rounded-lg ">
                <img
                  src={
                  profilePicPath?.startsWith('http')
                    ? profilePicPath
                    : `${PROFILE_PIC_PATH}/${user.profilePicPath || 'default-profile-picture.png'}`
                  }
                  alt="Profile"
                  className="h-20 w-20 rounded-full"
                />
                <div className="flex flex-col items-center justify-center">
                  <p className="text-slate-100 text-xl font-bold">{user.fullName}</p>
                  <p className="text-slate-200 text-sm">{user.role}</p>
                  <p className="text-slate-200 text-xs font-light pt-2">{user.email}</p>
                </div>
                <button
                  title="Update info"
                  className="absolute top-1 right-1 text-slate-100 p-2 hover:bg-slate-700 rounded-full cursor-pointer active:opacity-80 active:scale-95 transition"
                >
                  <Pen className="h-5 w-5" />
                </button>
              </div>
              <hr className="text-slate-700 my-5" />
              <div className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg active:opacity-80 active:scale-95 cursor-pointer transition flex justify-center">
                <button
                  onClick={handleLogout} 
                  className="flex gap-x-2 items-center justify-center text-slate-100 cursor-pointer">
                  <LogOut />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        {showNotif && (
          <div
            ref={notifRef}
            className='absolute top-[3.5rem] right-[4rem] rounded-xl shadow-xl z-[999]'
            aria-live='polite'
          >
            <div className='flex flex-col w-[32rem] max-h-[32rem] overflow-auto min-h-[30rem] bg-slate-900 p-0 rounded-xl outline outline-slate-700 scrollbar-hide'>

              {/* header */}
              <div className='sticky top-0 z-10 px-4 py-3 bg-slate-900/95 backdrop-blur border-b border-slate-700 rounded-t-xl flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-slate-100 font-semibold text-xl'>Notifications</h2>
                  <span className='text-xs text-slate-400'>{notifications.length} total</span>
                  <span className='text-xs text-slate-400'>
                    • {notifications.filter(n => Number(n?.isRead) === 0).length} unread
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  {notifLoading && <span className='text-xs text-slate-400 animate-pulse'>Loading…</span>}
                  <button
                    onClick={notifRefetch}
                    className='text-xs px-3 py-1 rounded-full cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-100 active:opacity-80 active:scale-95 transition'
                    title='Refresh notifications'
                  >
                    <span className="flex gap-x-1">
                      <RefreshCw size={16}/> Refresh
                    </span>
                  </button>
                </div>
              </div>

              {/* error */}
              {notifError && (
                <div className='m-4 px-3 py-3 rounded-lg bg-red-900/30 text-red-200 border border-red-700'>
                  <p className='text-sm'>We couldn’t load notifications. Please try again.</p>
                  <button
                    onClick={notifRefetch}
                    className='mt-2 text-xs px-2 py-1 rounded bg-red-800/60 hover:bg-red-800/80 transition'
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* loading skeletons */}
              {notifLoading && !notifError && (
                <ul role='list' className='p-4 space-y-3'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className='border border-slate-700 rounded-lg p-3 animate-pulse'>
                      <div className='flex items-start gap-3'>
                        <div className='h-10 w-10 rounded-full bg-slate-700' />
                        <div className='flex-1 space-y-2'>
                          <div className='h-4 w-1/3 bg-slate-700 rounded' />
                          <div className='h-3 w-1/2 bg-slate-800 rounded' />
                          <div className='h-3 w-2/3 bg-slate-800 rounded' />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* empty */}
              {!notifLoading && !notifError && notifications.length === 0 && (
                <div className='flex flex-col items-center justify-center flex-1 text-center py-12 text-slate-300'>
                  <div className='bg-slate-800 p-4 rounded-full mb-4'>
                    <Bell className='h-8 w-8 text-slate-200' />
                  </div>
                  <p className='font-medium'>You’re all caught up</p>
                  <p className='text-sm text-slate-400 mt-1'>We’ll let you know when there’s something new.</p>
                </div>
              )}

              {/* list (grouped by day via utils) */}
              {!notifLoading && !notifError && notifications.length > 0 && (
                (() => {
                  const toDate = n => new Date(n?.notifDate || n?.createdAt || Date.now());
                  const sorted = [...notifications].sort((a, b) => {
                    // unread first
                    if (Number(a.isRead) !== Number(b.isRead)) {
                      return Number(a.isRead) - Number(b.isRead);
                    }
                    // then newest first
                    return toDate(b) - toDate(a);
                  });

                  // group by humanized calendar day in Asia/Manila
                  const groups = sorted.reduce((acc, item) => {
                    const d = toDate(item);
                    const label = humanizeCalendarDay(d); // 'Today' | 'Yesterday' | 'Oct 21, 2025'
                    (acc[label] ||= []).push({ item, d });
                    return acc;
                  }, {});

                  // --- helpers updated for 'unassign' ---
                  const typeText = t =>
                    (t === 'assignment' && 'Assignment') ||
                    (t === 'unassign'   && 'Unassigned') ||
                    (t === 'reminder'   && 'Reminder') ||
                    (t === 'deadline'   && 'Deadline') ||
                    'Update';

                  const typeChipClass = t =>
                    t === 'unassign'
                      ? 'bg-red-700'
                      : t === 'deadline'
                      ? 'bg-orange-700'
                      : t === 'reminder'
                      ? 'bg-blue-700'
                      : 'bg-green-700'; // default for assignment/others

                  return (
                    <div className='p-4 space-y-6'>
                      {Object.entries(groups).map(([label, entries]) => (
                        <section key={label}>
                          <h4 className='px-1 text-xs font-semibold tracking-wide text-slate-400 uppercase'>{label}</h4>
                          <ul role='list' className='mt-2 space-y-2'>
                            {entries.map(({ item, d }, index) => {
                              const isUnread = Number(item?.isRead) === 0;
                              const timeStr = formatClock(d); // e.g., '6:00 AM' in Manila

                              return (
                                <li
                                  key={`${label}-${index}`}
                                  className={`group border border-slate-700 rounded-lg px-3 py-2.5 transition hover:border-slate-600 hover:bg-slate-800/40 ${
                                    isUnread ? 'bg-slate-800/60' : 'bg-slate-900'
                                  }`}
                                >
                                  <div className='flex items-start gap-3'>
                                    <div className='relative bg-slate-700 p-2 rounded-full shrink-0'>
                                      <ClipboardPenLine size={20} className='text-slate-100 t' />
                                      {isUnread && <span className='absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500' aria-label='Unread' />}
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                      {/* chips */}
                                      <div className='flex flex-wrap items-center justify-between gap-2'>
                                        <span
                                          className={`inline-flex items-center text-[12px] uppercase tracking-wide rounded-full px-3 py-0.5 text-slate-100 font-semibold ${typeChipClass(item?.notifType)}`}
                                        >
                                          {typeText(item?.notifType)}
                                        </span>
                                        {item.isRead === 0 && (
                                          <button 
                                            onClick={() => handleMarkAsRead(item.notifId, user.userId)}
                                            className="flex items-center gap-x-1 text-slate-200 text-[10px] cursor-pointer rounded-full hover:bg-slate-700 px-2 py-0.5 active:scale-99">
                                            <CheckCheck size={16}/>
                                            Mark as read
                                          </button>
                                        )}
                                      </div>
                                      <hr className="text-slate-600 my-2"></hr>
                                      <div className="flex flex-wrap items-center gap-2 mt-1">
                                        {(item?.accredTitle || item?.accredYear) && (
                                          <span className='inline-flex items-center text-[10px] rounded-full bg-yellow-600 px-2 py-0.5 text-white'>
                                            {(item?.accredTitle ?? '').trim()}
                                            {item?.accredTitle && item?.accredYear && ' '}
                                            {item?.accredYear ?? ''}
                                          </span>
                                        )}
                                        {(item?.program || item?.level) && (
                                          <span className='inline-flex items-center text-[10px] rounded-full bg-white px-2 py-0.5 text-slate-900'>
                                            {(item?.program ?? '').trim()}
                                            {item?.program && item?.level ? ' – ' : ''}
                                            {item?.level ?? ''}
                                          </span>
                                        )}
                                      </div>

                                      {/* message */}
                                      <p className={`text-[13px] mt-1.5 leading-snug ${isUnread ? 'text-slate-50' : 'text-slate-100'}`}>
                                        <span className='text-slate-300'>
                                          {item?.notifType === 'unassign' ? 'You are unassigned from' : 'You are assigned to'}
                                        </span>{' '}
                                        <span className='font-semibold'>{formatAreaName(item?.area)}</span>
                                        {item?.parameter ? ` · Parameter ${item.parameter}` : ''}
                                        {item?.subparameter ? ` · ${item.subparameter}` : ''}.
                                      </p>

                                      {/* footer */}
                                      <div className='mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400'>
                                        <time dateTime={(item?.notifDate || item?.createdAt) ?? ''} title={d.toLocaleString()}>
                                          {timeStr}
                                        </time>
                                        {item?.fullName && (
                                          <>
                                            <span>•</span>
                                            <span title='Notified user'>{item.fullName}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </section>
                      ))}
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t shadow-sm">
            <div className="space-y-1 px-4 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`block px-3 py-2 rounded-md transition 
                    ${
                      location.pathname === item.link
                        ? "bg-yellow-500 text-black font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default TaskForceLayout;
