import { useState, useEffect } from 'react';
import SidebarLG from '../../components/SidebarLG';
import SidebarSM from '../../components/SidebarSM';
import MobileHeader from '../../components/MobileHeader';

const AdminUnverifiedUsers = () => {
  const [menuIsClicked, setMenuIsClicked] = useState(false);

  useEffect(() => {
      if (menuIsClicked) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
  
      return () => {
        document.body.style.overflow = '';
      };
    }, [menuIsClicked]);

  return (
    <>
      <div className='min-h-screen flex flex-col md:flex-row'>
        <div className='sm:flex max-md:flex md:hidden'>
          <SidebarSM sideBarOpen={menuIsClicked} setSideBarOpen={setMenuIsClicked} />
        </div>
        <div className='hidden md:block'>
          <SidebarLG />
        </div>

        {/* Mobile Header */}
        <MobileHeader onMenuClick={setMenuIsClicked}/>

        <div>Hello, I'm unverified.</div>
      </div>
      
    </>
  )
}

export default AdminUnverifiedUsers;
