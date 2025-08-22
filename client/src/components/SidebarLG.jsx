import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const SidebarLG = ({ menuItems, unverifiedUserCount }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar collapsed state (stored in localStorage)
  const savedState = localStorage.getItem('sidebar-collapsed');
  const [isCollapsed, setIsCollapsed] = useState(() => savedState === 'true');
  const savedDropdowns = JSON.parse(localStorage.getItem('sidebar-open-dropdowns') || '{}');
  const [openDropdowns, setOpenDropdowns] = useState(savedDropdowns);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
  }, [isCollapsed]);

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

  return (
    <aside className={`sidebar-container ${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white h-screen flex flex-col shadow-lg border-r border-slate-600`}>
      {/* Header */}
      <header className="relative flex items-center justify-between px-2 py-2 border-b border-gray-600 h-20 shadow-lg">
        {!isCollapsed && (
          <div className="h-10 flex items-center transition-all duration-300">
            <img className="h-14 w-auto" src="/CGS_Logo.png" alt="Logo" />
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
                              className="w-6 h-6"
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
      <div className="px-5 py-4 border-t border-gray-700 cursor-pointer">
        <div className="flex items-center justify-between hover:opacity-80">
          <div className={`flex items-center overflow-hidden transition-all ${isCollapsed ? 'gap-0' : 'gap-3'}`}>
            <img className='rounded-full w-8 h-8' src={'/sample-profile-picture.webp'} alt="User Profile" />
            <div className={`${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[300px]'}`}>
              <p className="text-sm font-semibold">Sample User</p>
              <p className="text-xs text-gray-400">Dean</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarLG;
