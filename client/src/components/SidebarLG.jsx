import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  closeIcon, 
  dashboardIcon, 
  logoutIcon,  
  menuIconLight, 
  userProfileIcon, 
  usersIcon } from '../assets/icons.js';

const SidebarLG = () => {
  const savedState = localStorage.getItem('sidebar-collapsed');
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return savedState === 'true';
  });

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState === 'true') setIsCollapsed(true);
  }, []);

  // Save to localStorage on toggle
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', newState.toString());
  };
  const menuItems = [
    { id: 'dashboard', icon: dashboardIcon, label: 'Dashboard', link: '/admin'},
    { id: 'users', icon: usersIcon, label: 'Users', link: '/admin/users' },
  ];

  return (
    <aside className={`sidebar-container ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b-2 border-gray-700  h-20">
        {!isCollapsed && (
          <div className="h-10 flex items-center space-x-2 transition-all duration-300">
            <img className="h-14 w-auto" src="/CGS_Logo.png" alt="Logo" />
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'
              }`}
            >
              <p className="text-2xl font-bold whitespace-nowrap">WDMS</p>
              <p className="text-[8px] leading-none whitespace-nowrap">Web-Based Document</p>
              <p className="text-[8px] leading-none whitespace-nowrap">Management System</p>
            </div>
          </div>
        )}
        <div>
          <button onClick={toggleSidebar} className="text-white cursor-pointer pl-1">
            {
              isCollapsed 
                ? <img className='opacity-100 hover:opacity-85 w-8 h-8 pl-2' src={menuIconLight} alt='Menu icon' />
                : <img className='opacity-100 hover:opacity-85 w-3 h-auto ' src={closeIcon} alt='Close icon' />
            } 
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-2">
        <div className='flex flex-col space-y-2'>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.link;
            return (
              <Link key={item.id} to={item.link}>
                <div
                  className={`flex items-center space-x-5 px-5 py-3 cursor-pointer transition-opacity duration-200 opacity-85 hover:opacity-100
                    ${isActive 
                      ? 'bg-gray-600 text-white font-semibold opacity-100 rounded-full transition-all ease-in-out duration-1000' 
                      : 'hover:bg-gray-700 rounded-full'}
                  `}
                >
                  <img className='brightness-200 w-7 h-7' src={item.icon} alt="" aria-hidden />
                  <span
                    className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                      isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Info & Logout */}
      <div className="px-5 py-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          {/* Left: User Icon + Name/Role */}
          <div
            className={`flex items-center overflow-hidden transition-all duration-300 ${
              isCollapsed ? 'gap-0' : 'gap-3'
            }`}
          >
            <img className='opacity-100 hover:opacity-85 cursor-pointer rounded-b-full rounded-t-full w-8 h-8' src={userProfileIcon} alt="User Profile" />
            <div
              className={`transition-all duration-200 ease-in-out overflow-hidden ${
                isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[300px]'
              }`}
            >
              <p className="text-sm font-semibold">Joe Francis</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          {/* Right: Logout Icon */}
          {!isCollapsed && (
            <button className="flex flex-col items-center justify-center transition-colors duration-200 border-l-2 border-gray-400 pl-4 cursor-pointer">
              <img className='opacity-100 hover:opacity-75 w-7 h-7' src={logoutIcon} alt="Logout icon" />
              <p className="text-xs text-gray-400 opacity-100 hover:opacity-75">Logout</p>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidebarLG;
