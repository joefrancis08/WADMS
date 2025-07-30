import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutIcon, userProfileIcon } from '../assets/icons';
import { LayoutDashboard, Users, UsersRound, X } from 'lucide-react';

const SidebarSM = ({ sideBarOpen, setSideBarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', link: '/admin' },
    { id: 'users', icon: UsersRound, label: 'Users', link: '/admin/verified-users' }
  ];

  return (
    <>
      {/* Backdrop */}
      {sideBarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 sm:hidden"
          onClick={() => setSideBarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-50 top-0 left-0 h-full w-72 max-w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white transform transition-transform duration-300 ease-in-out
        ${sideBarOpen ? 'translate-x-0' : '-translate-x-full'}
        sm:hidden flex flex-col`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center space-x-2">
            <img src="/CGS_Logo.png" alt="Logo" className="h-14 w-auto" />
            <div>
              <p className="text-2xl font-bold">DMS</p>
              <p className="text-[8px] leading-none">Document</p>
              <p className="text-[8px] leading-none">Management System</p>
            </div>
          </div>
          <button className='opacity-100 hover:opacity-85 ml-2 cursor-pointer' onClick={() => setSideBarOpen(false)}>
            <X />
          </button>
        </header>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-3 ml-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.link;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <div
                    onClick={() => {
                      setSideBarOpen(false);
                      navigate(item.link);
                    }}
                    className={`flex items-center space-x-4 px-4 py-3 rounded-full cursor-pointer transition-all
                      ${isActive
                        ? 'bg-gray-600 font-semibold'
                        : 'hover:bg-gray-700 text-white opacity-85 hover:opacity-100'}`}
                  >
                    <Icon
                      fill={isActive ? 'white' : 'none'}
                      className={`flex-shrink-0 transition-all duration-300`}
                      aria-hidden="true"
                    />
                    <span className="text-sm ml-2">{item.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info Bottom Section */}
        <div className="px-5 py-4 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={userProfileIcon}
                alt="User"
                className="w-8 h-8 rounded-full cursor-pointer hover:opacity-85"
              />
              <div>
                <p className="text-sm font-semibold">Joe Francis</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            <button className="flex flex-col items-center justify-center pl-4 border-l border-gray-500">
              <img src={logoutIcon} alt="Logout" className="w-6 h-6 hover:opacity-75" />
              <p className="text-xs text-gray-400 hover:opacity-75">Logout</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarSM;
