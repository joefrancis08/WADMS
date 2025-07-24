import { useState, useEffect } from 'react';
import SidebarLG from '../SidebarLG';
import SidebarSM from '../SidebarSM';
import MobileHeader from '../MobileHeader';

const AdminLayout = ({ children }) => {
  const [menuIsClicked, setMenuIsClicked] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuIsClicked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuIsClicked]);

  return (
    <div className='grid grid-cols-[auto_1fr] h-screen overflow-hidden'>
      <div className='sm:flex max-md:flex md:hidden'>
        <SidebarSM sideBarOpen={menuIsClicked} setSideBarOpen={setMenuIsClicked} />
      </div>
      <div className='hidden md:block h-screen overflow-y-auto'>
        <SidebarLG />
      </div>
      <div className='overflow-y-auto h-screen'>
        <MobileHeader onMenuClick={setMenuIsClicked}/>
        <div className='flex-1 p-0 space-y-3'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout;
