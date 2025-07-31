import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logoutIcon, userProfileIcon } from '../assets/icons.js';
import { LayoutDashboard, Menu, X, UsersRound } from 'lucide-react';

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
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', link: '/admin'},
    { id: 'verified-users', icon: UsersRound, label: 'Verified Users', link: '/admin/verified-users' },
  ];

  return (
    <aside className={`sidebar-container ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <header className="flex items-center justify-between px-2 py-2 border-b-1 border-gray-800 bg-gray-900 h-20 shadow-lg">
        {!isCollapsed && (
          <div className="h-10 flex items-center space-x- transition-all duration-300">
            <img className="h-14 w-auto" src="/CGS_Logo.png" alt="Logo" />
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'
              }`}
            >
              <p className="text-2xl font-bold whitespace-nowrap">DMS</p>
              <p className="text-[8px] leading-none whitespace-nowrap">Document</p>
              <p className="text-[8px] leading-none whitespace-nowrap">Management System</p>
            </div>
          </div>
        )}
        <div>
          <button onClick={toggleSidebar} className="text-white cursor-pointer pl-1">
            {
              isCollapsed 
                ? <Menu className='opacity-100 hover:opacity-85 ml-4'/>
                : <X className='opacity-100 hover:opacity-85 ml-2'/>
            } 
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-2">
        <div className='flex flex-col space-y-2'>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.link;
            const Icon = item.icon;
            return (
              <Link key={item.id} to={item.link}>
                <div
                  className={`flex items-center space-x-5 px-5 py-3 cursor-pointer transition opacity-85 hover:opacity-100 hover:transition
                    ${isActive 
                      ? 'bg-gray-600 text-white font-semibold opacity-100 rounded-full transition' 
                      : 'hover:bg-gray-700 rounded-full'}
                  `}
                >
                  <Icon
                    fill={isActive ? 'white' : 'none'}
                    className={`flex-shrink-0 transition${
                      isCollapsed ? 'w-6 h-6' 
                      : 'w-7 h-7'
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-sm whitespace-nowrap overflow-hidden transition ${
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
      <div className="px-5 py-4 border-t border-gray-700 bg-gray-900">
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
