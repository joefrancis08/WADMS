import { useState } from 'react';
import axios from 'axios';
import SidebarLG from '../../components/SidebarLG';
import SidebarSM from '../../components/SidebarSM';
import MobileHeader from '../../components/MobileHeader';

const AdminHome = () => {
  const [menuIsClicked, setMenuIsClicked] = useState(false);

  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
      <div className='max-sm:flex'>
        <SidebarSM sideBarOpen={menuIsClicked} setSideBarOpen={setMenuIsClicked}/>
      </div>
      <div className='max-md:hidden'>
        <SidebarLG />
      </div>
      <div className='md:hidden'>
        <MobileHeader onMenuClick={setMenuIsClicked}/>
      </div>
      
      <div className='flex-1 bg-sky-300 border-gray-950'>
        <div>
          <p>Hello, I'm an admin</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
