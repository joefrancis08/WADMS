import React, { useRef, useState } from "react";
import { Menu, X, Bell, Pen, LogOut, Sun, Moon } from "lucide-react";
import PATH from "../../../constants/path";
import { Link, useLocation } from "react-router-dom";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { logoutUser } from "../../../api-calls/Users/userAPI";
import { useAuth } from "../../../contexts/AuthContext";
import { showErrorToast, showSuccessToast } from "../../../utils/toastNotification";

const { DASHBOARD, ACCREDITATION } = PATH.TASK_FORCE;

const navItems = [
  { id: "home", label: "Home", link: DASHBOARD },
  { id: "accreditation", label: "Accreditation", link: ACCREDITATION },
  { id: "reports", label: "Reports", link: "/reports" },
];

const TaskForceLayout = ({ children }) => {
  const { logout } = useAuth();
  const profileOptionRef = useRef();
  const location = useLocation();

  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileOption, setShowProfileOption] = useState(false);

  useOutsideClick(profileOptionRef, () => setShowProfileOption(false));

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const handleProfileClick = () => {
    setShowProfileOption(!showProfileOption);
  };

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.data.success) {
        logout();
        showSuccessToast('Logged out successfully!', 'top-center');
        
      } else {
        showErrorToast('Logout failed. Try again.');
      }
    } catch (error) {
      showErrorToast('Something went wrong. Try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-800 border-b border-slate-600 sticky top-0 z-50">
        <div className="max-w-7xl px-2 sm:px-6">
          <div className="relative flex items-center h-16">
            {/* Left: Logo/Brand */}
            <div className="flex items-center gap-x-4 text-xl font-bold text-yellow-400">
              <img
                className="h-10 w-10"
                src="/pit-logo-outlined.png"
                alt="PIT Logo"
              />
              <p>Palompon Institute of Technology</p>
            </div>

            {/* Middle: Links (Desktop) */}
            <div className="hidden md:flex justify-center space-x-6 mx-auto">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`py-2 px-4 rounded-md transition 
                    ${
                      location.pathname === item.link
                        ? "bg-slate-600 text-slate-100 font-semibold"
                        : "text-slate-100 hover:bg-slate-700"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="absolute -right-24 flex items-center space-x-4">
              <button
                title={isDark ? 'Light Mode' : 'Dark Mode'}
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-700 cursor-pointer"
              >
                {isDark 
                  ? <Sun className="h-6 w-6 text-slate-100"/> 
                  : <Moon className="h-6 w-6 text-slate-100"/>
                }
              </button>
              <button 
                title="3 notifications"
                className="relative p-2 rounded-full hover:bg-slate-700 cursor-pointer"
              >
                <Bell className="h-6 w-6 text-slate-100" />
                <span className="absolute top-0 -right-1 bg-red-500 px-2 rounded-full text-slate-100 text-sm">
                  3
                </span>
              </button>
              <button
                onClick={handleProfileClick}
                title={"My Profile"}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-700 cursor-pointer"
              >
                <img
                  src="/sample-profile-picture.webp"
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </button>
              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-slate-700"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-slate-100" />
                ) : (
                  <Menu className="h-6 w-6 text-slate-100" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Options */}
        {showProfileOption && (
          <div
            ref={profileOptionRef}
            className="absolute top-[3.5rem] right-[2rem] rounded-lg shadow-md"
          >
            <div className="w-[24rem] min-h-[20rem] bg-slate-900 p-3 rounded-lg outline outline-slate-700">
              <div className="relative flex flex-col gap-y-4 justify-center items-center bg-slate-800 outline outline-slate-700 min-w-[5rem] min-h-[12rem] rounded-lg ">
                <img
                  src="/sample-profile-picture.webp"
                  alt="Profile"
                  className="h-20 w-20 rounded-full"
                />
                <div className="flex flex-col items-center justify-center">
                  <p className="text-slate-100 text-xl font-bold">Stephen Curry</p>
                  <p className="text-slate-200 text-sm">Task Force</p>
                  <p className="text-slate-200 text-xs font-light pt-2">stephencurry@test.com</p>
                </div>
                <button
                  title="Update info"
                  className="absolute top-1 right-1 text-slate-100 p-2 hover:bg-slate-700 rounded-full cursor-pointer active:opacity-80 active:scale-95 transition"
                >
                  <Pen className="h-5 w-5" />
                </button>
              </div>
              <hr className="text-slate-700 my-5" />
              <div className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg active:opacity-80 active:scale-95 cursor-pointer transition flex justify-center">
                <button
                  onClick={handleLogout} 
                  className="flex gap-x-2 items-center justify-center text-slate-100 cursor-pointer">
                  <LogOut />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t shadow-sm">
            <div className="space-y-1 px-4 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`block px-3 py-2 rounded-md transition 
                    ${
                      location.pathname === item.link
                        ? "bg-yellow-500 text-black font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default TaskForceLayout;
