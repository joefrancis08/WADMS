import { useState, useEffect } from 'react';
import SidebarLG from '../../components/SidebarLG';
import SidebarSM from '../../components/SidebarSM';
import MobileHeader from '../../components/MobileHeader';
import { ArrowLeft } from 'lucide-react';

const AdminUnverifiedUsers = () => {
  const [menuIsClicked, setMenuIsClicked] = useState(false);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = menuIsClicked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuIsClicked]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <SidebarSM sideBarOpen={menuIsClicked} setSideBarOpen={setMenuIsClicked} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarLG />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Mobile Header */}
        <MobileHeader onMenuClick={setMenuIsClicked} />

        <main className="px-4 py-6 md:px-8 w-full max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <ArrowLeft className="w-5 h-5" />
            <h1 className="text-lg font-semibold">Unverified Users</h1>
          </div>

          {/* Table-like Grid */}
          <div className="grid grid-cols-5 gap-4 font-semibold text-gray-700 border-b pb-2 mb-2">
            <p className="col-span-2">Full Name</p>
            <p>Email</p>
            <p>Date Registered</p>
            <p className="text-center">Actions</p>
          </div>

          {/* Sample User */}
          <ul className="grid grid-cols-5 gap-4 items-center py-2 border-b">
            <li className="col-span-2">John Doe</li>
            <li>john@gmail.com</li>
            <li>July 23, 2025</li>
            <li className="text-center">
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Assign Role
              </button>
            </li>
          </ul>
        </main>
      </div>
    </div>
  );
};

export default AdminUnverifiedUsers;
