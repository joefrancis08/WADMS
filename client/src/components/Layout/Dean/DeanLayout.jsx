import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { USER_ROLES } from '../../../constants/user';
import PATH from '../../../constants/path';
import { useUsersBy } from '../../../hooks/fetch-react-query/useUsers';
import useOutsideClick from '../../../hooks/useOutsideClick';
import { useAuth } from '../../../contexts/AuthContext';
import {
  BookCopy,
  UserRoundCog,
  SquareUserRound,
  ShieldUser,
  UserRoundX,
  UsersRound,
  Menu,
  X,
  House,
  ChevronDown,
} from 'lucide-react';

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const DeanLayout = ({ children }) => {
  const { UU } = USER_ROLES;
  const {
    DASHBOARD,
    TASK_FORCE,
    INTERNAL_ASSESSORS,
    UNVERIFIED_USER: UNVERIFIED_USERS,
    PROGRAMS_TO_BE_ACCREDITED,
  } = PATH.DEAN;

  const { users: unverifiedUsers } = useUsersBy({ role: UU });
  const unverifiedUserCount = Array.isArray(unverifiedUsers) ? unverifiedUsers.length : 0;

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // 'user' | null
  const [showProfileOption, setShowProfileOption] = useState(false);

  const profileRef = useRef(null);
  useOutsideClick(profileRef, () => setShowProfileOption(false));

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // ------- Active path helpers -------
  const normalize = (p) => (p || '').replace(/\/+$/, '');
  const curPath = normalize(location.pathname);

  // hierarchical (prefix) match: good for sections
  const isActivePath = (target) => {
    if (!target) return false;
    const t = normalize(target);
    return curPath === t || curPath.startsWith(`${t}/`);
  };

  // exact match: use for Home so it doesn't stay active on subroutes
  const isExactPath = (target) => normalize(target) === curPath;

  // ------- Tabs config (ordered) -------
  const TABS = [
    {
      type: 'link',
      id: 'home',
      label: 'Home',
      icon: House,
      link: DASHBOARD,
    },
    {
      type: 'link',
      id: 'accred',
      label: 'Accreditation',
      icon: BookCopy,
      link: PROGRAMS_TO_BE_ACCREDITED, // single landing page
    },
    {
      type: 'dropdown',
      id: 'user',
      label: 'User Management',
      icon: UsersRound,
      children: [
        { id: 'task-force', icon: UserRoundCog, label: 'Task Force', link: TASK_FORCE },
        { id: 'internal-assessor', icon: SquareUserRound, label: 'Internal Assessor', link: INTERNAL_ASSESSORS },
        { id: 'accreditor', icon: ShieldUser, label: 'Accreditor', link: '' },
        { id: 'unverified', icon: UserRoundX, label: 'Unverified Users', link: UNVERIFIED_USERS, badge: unverifiedUserCount },
      ],
    },
  ];

  const NavBadge = ({ value }) =>
    value > 0 ? (
      <span className='ml-2 rounded-full bg-red-600 px-1.5 py-0.5 text-xs font-semibold text-white'>{value}</span>
    ) : null;

  return (
    <div className='min-h-screen flex flex-col bg-white text-slate-800'>
      {/* Navbar */}
      <nav className='sticky top-0 z-50 bg-white border-b border-slate-300 shadow shadow-slate-200'>
        <div className='w-full px-4 sm:px-6'>
          <div className='relative flex items-center justify-between h-16'>
            {/* Brand */}
            <div
              onClick={() => navigate(DASHBOARD)}
              className='flex items-center gap-x-3 cursor-pointer'
            >
              <img className='h-10 w-10' src='/pit-logo-outlined.png' alt='PIT Logo' />
              <div>
                <h2 className='text-xl font-bold text-yellow-600'>Palompon Institute of Technology</h2>
                <p className='text-xs font-normal text-emerald-700 italic'>College of Graduate Studies</p>
              </div>
            </div>

            {/* Desktop Links (Home → Accreditation → User Management) */}
            <div className='hidden md:flex items-center gap-1 mx-auto'>
              {TABS.map((tab) => {
                if (tab.type === 'link') {
                  // 👇 Home uses exact match; others can use hierarchical
                  const active = tab.id === 'home' ? isExactPath(tab.link) : isActivePath(tab.link);
                  return (
                    <Link
                      key={tab.id}
                      to={tab.link}
                      className={[
                        'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                        active ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100',
                      ].join(' ')}
                      aria-current={active ? 'page' : undefined}
                    >
                      <tab.icon className='h-4 w-4' />
                      <span>{tab.label}</span>
                    </Link>
                  );
                }

                if (tab.type === 'dropdown') {
                  const active = tab.children.some((c) => isActivePath(c.link));
                  const open = openMenu === tab.id;
                  return (
                    <div key={tab.id} className='relative z-50'>
                      <button
                        onMouseEnter={() => setOpenMenu(tab.id)}
                        onFocus={() => setOpenMenu(tab.id)}
                        className={[
                          'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                          active ? 'bg-emerald-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100',
                          open && !active ? 'bg-slate-100' : '',
                        ].join(' ')}
                        aria-expanded={open}
                        aria-haspopup='menu'
                        aria-current={active ? 'page' : undefined}
                        type='button'
                      >
                        <tab.icon className='h-4 w-4' />
                        <span>{tab.label}</span>
                        <ChevronDown
                          className={['h-5 w-5 transition-all', open ? 'rotate-180' : ''].join(' ')}
                          aria-hidden='true'
                        />
                      </button>

                      {open && (
                        <div
                          onMouseLeave={() => setOpenMenu(null)}
                          className='absolute z-50 left-0 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-2 shadow-lg'
                          role='menu'
                        >
                          <ul className='divide-y divide-slate-100'>
                            {tab.children.map((item) => {
                              const itemActive = isActivePath(item.link);
                              const disabled = !item.link;
                              return (
                                <li key={item.id} className='py-1'>
                                  <Link
                                    to={item.link || '#'}
                                    className={[
                                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm',
                                      itemActive ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-700 hover:bg-slate-100',
                                      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                                    ].join(' ')}
                                    aria-current={itemActive ? 'page' : undefined}
                                    onClick={() => !disabled && setOpenMenu(null)}
                                    role='menuitem'
                                  >
                                    <item.icon className='h-4 w-4 text-slate-500' />
                                    <span className='flex-1'>{item.label}</span>
                                    {item.badge != null && <NavBadge value={item.badge} />}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Right: profile + mobile toggle */}
            <div className='flex items-center gap-x-3'>
              <button
                onClick={() => setShowProfileOption((v) => !v)}
                className='flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer'
                type='button'
              >
                <img
                  src={
                    user?.profilePicPath?.startsWith('http')
                      ? user.profilePicPath
                      : `${PROFILE_PIC_PATH}/${user?.profilePicPath || 'default-profile-picture.png'}`
                  }
                  alt='Profile'
                  className='h-8 w-8 rounded-full object-cover border border-slate-200 cursor-pointer'
                />
              </button>
              <button
                className='md:hidden p-2 rounded-md hover:bg-slate-100 cursor-pointer'
                onClick={() => setMobileOpen(true)}
                type='button'
                aria-label='Open menu'
              >
                <Menu className='h-6 w-6 text-slate-700' />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        {showProfileOption && (
          <div ref={profileRef} className='absolute top-[3.5rem] right-[1rem] rounded-lg shadow-lg z-50'>
            <div className='w-[24rem] min-h-[14rem] bg-white p-3 rounded-lg border border-slate-200'>
              <div className='relative flex flex-col gap-y-3 items-center bg-slate-50 border border-slate-200 min-h-[10rem] rounded-lg p-4'>
                <img
                  src={
                    user?.profilePicPath?.startsWith('http')
                      ? user.profilePicPath
                      : `${PROFILE_PIC_PATH}/${user?.profilePicPath || 'default-profile-picture.png'}`
                  }
                  alt='Profile'
                  className='h-20 w-20 rounded-full object-cover'
                />
                <div className='text-center'>
                  <p className='text-slate-900 text-lg font-bold'>{user?.fullName}</p>
                  <p className='text-slate-600 text-sm'>{user?.role}</p>
                  <p className='text-slate-500 text-xs pt-1'>{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className='fixed inset-0 z-50 md:hidden'>
            <div
              className='absolute inset-0 bg-black/30 cursor-pointer'
              onClick={() => setMobileOpen(false)}
            />
            <div className='absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl ring-1 ring-black/5'>
              <div className='flex items-center justify-between border-b border-slate-200 px-4 py-3'>
                <div className='flex items-center gap-2'>
                  <img src='/pit-logo-outlined.png' alt='PIT' className='h-7 w-auto' />
                  <span className='text-base font-semibold text-slate-900'>Dean Portal</span>
                </div>
                <button
                  aria-label='Close menu'
                  className='rounded-md p-2 text-slate-600 hover:bg-slate-100 cursor-pointer'
                  onClick={() => setMobileOpen(false)}
                  type='button'
                >
                  <X className='h-6 w-6' />
                </button>
              </div>

              <nav className='px-2 py-3'>
                {/* Home (exact) */}
                {(() => {
                  const tab = TABS.find((t) => t.id === 'home');
                  const active = isExactPath(tab.link); // 👈 exact on mobile too
                  return (
                    <Link
                      to={tab.link}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                        active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50',
                      ].join(' ')}
                      aria-current={active ? 'page' : undefined}
                    >
                      <tab.icon className='h-4 w-4' />
                      <span>{tab.label}</span>
                    </Link>
                  );
                })()}

                {/* Accreditation (single) */}
                <div className='mt-3'>
                  {(() => {
                    const tab = TABS.find((t) => t.id === 'accred');
                    const active = isActivePath(tab.link);
                    return (
                      <Link
                        to={tab.link}
                        onClick={() => setMobileOpen(false)}
                        className={[
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                          active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50',
                        ].join(' ')}
                        aria-current={active ? 'page' : undefined}
                      >
                        <tab.icon className='h-4 w-4' />
                        <span>{tab.label}</span>
                      </Link>
                    );
                  })()}
                </div>

                {/* User Management as a flat list */}
                <div className='mt-4'>
                  <p className='px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500'>User Management</p>
                  <ul className='mt-1 space-y-1'>
                    {TABS.find((t) => t.id === 'user').children.map((item) => {
                      const itemActive = isActivePath(item.link);
                      const disabled = !item.link;
                      return (
                        <li key={item.id}>
                          <Link
                            to={item.link || '#'}
                            onClick={() => !disabled && setMobileOpen(false)}
                            className={[
                              'flex items-center gap-3 rounded-md px-3 py-2 text-sm',
                              itemActive ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-700 hover:bg-slate-50',
                              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                            ].join(' ')}
                            aria-current={itemActive ? 'page' : undefined}
                          >
                            <item.icon className='h-4 w-4 text-slate-500' />
                            <span className='flex-1'>{item.label}</span>
                            {item.badge != null && (
                              <span className='rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white'>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className='flex-1 bg-white'>{children}</main>
    </div>
  );
};

export default DeanLayout;
