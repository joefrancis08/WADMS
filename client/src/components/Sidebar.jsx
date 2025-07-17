import React, { useState, useEffect } from 'react';
import Icons from '../assets/icons.js';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    { icon: Icons.dashboard, label: 'Dashboard' },
    { icon: Icons.users, label: 'Users' },
  ];

  return (
    <div
      className={`h-screen bg-gray-800 text-white flex flex-col justify-between
        transition-[width] duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b-2 border-gray-700  h-20">
        {!isCollapsed && (
          <div className="h-10 flex items-center space-x-2">
            <img className="h-10 w-auto" src="CGS_Logo.png" alt="Logo" />
            <div className="leading-tight">
              <p className="text-lg font-bold">WDMS</p>
              <p className="text-[10px] leading-none">Web-Based Document</p>
              <p className="text-[10px] leading-none">Management System</p>
            </div>
          </div>
        )}
        <button onClick={toggleSidebar} className="text-white cursor-pointer pl-2">
          {
            isCollapsed 
              ? <img className='opacity-100 hover:opacity-85 w-8 h-8' src={Icons.menu} alt='Menu icon' />
              : <img className='opacity-100 hover:opacity-85 w-4 h-4' src={Icons.close} alt='Close icon' />
          } 
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 space-y-1 px-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 hover:bg-gray-700 px-5 py-2 rounded-md cursor-pointer transition-opacity duration-200 opacity-85 hover:opacity-100"
          >
            <img className='w-8 h-8' src={item.icon} alt="" />
            <span
              className={`text-sm transition-all duration-300 ease-in-out ${
                isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="px-5 py-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          {/* Left: User Icon + Name/Role */}
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="text-2xl">👤</span>
            {!isCollapsed && (
              <div className="leading-tight">
                <p className="text-sm font-semibold">John Francis Casinillo Doe</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            )}
          </div>

          {/* Right: Logout Icon */}
          {!isCollapsed && (
            <button className="flex flex-col items-center justify-center transition-colors duration-200 border-l-2 border-gray-400 pl-5 cursor-pointer">
              <img className='opacity-100 hover:opacity-75 w-8 h-8' src={Icons.logout} alt="Logout icon" />
              <p className="text-xs text-gray-100 opacity-100 hover:opacity-75">Logout</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
