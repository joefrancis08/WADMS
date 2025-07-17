import React from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const AdminHome = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='w-90% bg-sky-300 border-gray-950'>
        <div>
          <p>Hello, I'm an admin</p>
        </div>
      </div>
    </div>
    
  );
};

export default AdminHome;
