import { useState } from 'react';
import Icons from "../assets/icons";
import { Link } from 'react-router-dom';

const SidebarSM = ({ sideBarOpen, setSideBarOpen }) => {

  const menuItems = [
    { id: 'dashboard', icon: Icons.dashboard, label: 'Dashboard', link: '/admin'},
    { id: 'users', icon: Icons.users, label: 'Users', link: '/admin/users' },
  ];

  return (
    <>
      {
        sideBarOpen && (
          <div
            className="fixed sm:hidden inset-0 bg-gray-500 opacity-50 z-40"
            onClick={() => setSideBarOpen(false)}
          ></div>
        )
      }
      <div className={`fixed max-md:h-full max-sm:w-80 sm:hidden bg-gray-800 z-50 flex flex-col h-full transition-transform duration-300 ease-in-out transform ${sideBarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='relative'>
          <header className="flex items-center justify-between px-4 py-4 border-b-2 border-gray-700 h-18">
            <div className="h-10 flex items-center space-x-2 transition-all duration-300">
              <img className="h-14 w-auto" src="/CGS_Logo.png" alt="Logo" />
              <div
                className='transition-all duration-300 ease-in-out overflow-hidden opacity-100 max-w-[200px]'
              >
                <p className="text-2xl text-white font-bold whitespace-nowrap">WDMS</p>
                <p className="text-[8px] text-white leading-none whitespace-nowrap">Web-Based Document</p>
                <p className="text-[8px] text-white leading-none whitespace-nowrap">Management System</p>
              </div>
            </div>
            <div>
              <button 
                className="text-white cursor-pointer pl-1"
                onClick={() => setSideBarOpen(false)}
              >
                <img className='opacity-100 hover:opacity-85 w-6 h-6 pl-2' src={Icons.close} alt='Close icon' />
              </button>
            </div>
          </header>
        </div>

        <nav className="flex-1 mt-4 px-2">
          <div className='flex flex-col space-y-2'>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.link;
              return (
                <Link key={item.id} to={item.link}>
                  <div
                    onClick={() => setSideBarOpen(false)}
                    className={`flex items-center space-x-5 px-5 py-3 cursor-pointer transition-opacity duration-200 opacity-85 hover:opacity-100
                      ${isActive 
                        ? 'bg-gray-600 text-white font-semibold opacity-100 rounded-full transition-all ease-in-out duration-1000' 
                        : 'hover:bg-gray-700 rounded-full text-white'}
                    `}
                  >
                    <img className='brightness-200 w-7 h-7' src={item.icon} alt="" aria-hidden />
                    <span className='text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out opacity-100 max-w-[200px]'>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
        
        <div className="px-5 py-4 border-t border-gray-700 mt-auto">
          <div className="flex items-center justify-between">
            {/* Left: User Icon + Name/Role */}
            <div className='flex items-center overflow-hidden transition-all duration-300 gap-3'>
              <img className='opacity-100 hover:opacity-85 cursor-pointer rounded-b-full rounded-t-full w-8 h-8' src={Icons.userProfile} alt="User Profile" />
              <div className='transition-all duration-200 ease-in-out overflow-hidden opacity-100 max-w-[300px]'>
                <p className="text-sm text-white font-semibold">Joe Francis</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            {/* Right: Logout Icon */}
            <button className="flex flex-col items-center justify-center transition-colors duration-200 border-l-2 border-gray-400 pl-4 cursor-pointer">
              <img className='opacity-100 hover:opacity-75 w-7 h-7' src={Icons.logout} alt="Logout icon" />
              <p className="text-xs text-gray-400 opacity-100 hover:opacity-75">Logout</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarSM;
