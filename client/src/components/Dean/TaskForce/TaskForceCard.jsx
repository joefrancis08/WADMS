import { EllipsisVertical, FileUser, FolderTree, Link, Plus, Trash2, UserRoundPen } from 'lucide-react';
import Dropdown from '../../Dropdown/Dropdown';
import ProfilePicture from '../../ProfilePicture';
import React from 'react';

const TaskForceCard = ({ 
  dropdownRef,
  activeDropdownId, 
  label,
  taskForce, 
  navigation, 
  profilePic, 
  handleDropdown, 
  handleEllipsisClick,
  handleAddCardClick 
}) => {
  const renderDropdown = (user) => {
    
    const dropDownMenu = [
      { icon: <FolderTree size={22} />, label: 'Assign Program, Area, & Parameter' },
      { icon: <Link size={22} />, label: 'Generate Access Link' },
      { icon: <FileUser size={22} />, label: 'View Details' },
      { icon: <UserRoundPen size={22} />, label: 'Update' },
      { icon: <Trash2 size={22} color='red'/>, label: 'Delete' }
    ];

    return (
      activeDropdownId === user.uuid && (
        <div ref={dropdownRef} className='absolute top-8 left-15 max-sm:left-10 transition'>
          <Dropdown width='w-50' border='border border-gray-300 rounded-md'>
            {dropDownMenu.map((menu, index) => (
              <React.Fragment key={index}>
                {menu.label === 'Delete' && (
                  <hr className='m-1 text-slate-300'></hr>
                )}
                <div
                  onClick={(e) => {
                    e.stopPropagation(); // This code prevent card click.
                    handleDropdown(e, menu, user)
                  }}
                  className={`flex items-center gap-x-2 text-gray-700 text-sm p-2 rounded-md hover:shadow transition-all active:opacity-60 ${menu.label === 'Delete' ? 
                  'hover:bg-red-200' : 'hover:bg-slate-200'}`}
                >
                  <i>{menu.icon}</i>
                  <p className={menu.label === 'Delete' ? 'text-red-500' : ''}>{menu.label}</p>
                </div>
              </React.Fragment>
            ))}
          </Dropdown>
        </div>
      )
    );
  };

  return (
    <div>
      <div className='flex flex-wrap gap-10 pb-6 justify-center'>
        {taskForce?.map((user, index) => (
          <div
            onClick={() => navigation(user)}
            key={index} 
            className={`relative p-4 h-65 bg-gradient-to-b from-green-700 to-amber-300 rounded-xl shadow hover:shadow-md hover:shadow-slate-700 active:shadow cursor-pointer transition
              ${label === 'Chair' && 'w-70'}
              ${label === 'Member' && 'w-60'}
            `}
          >
            <div 
              onClick={(e) => {
                handleEllipsisClick(e, user);
              }} 
              className='absolute top-1 p-2 right-1 text-slate-100 rounded-full hover:shadow hover:text-slate-200 hover:bg-slate-100/20 active:opacity-50 transition'>
              <EllipsisVertical size={20}/>
            </div>
            {renderDropdown(user)}
            <div className='flex flex-col items-center text-center'>
              {label === 'Chair' && (
                <ProfilePicture
                  name={user.fullName} 
                  profilePic={profilePic(user)}
                  height='h-36' width='w-36' 
                  border='rounded-full border-3 border-green-800' 
                />
              )}

              {label === 'Member' && (
                <ProfilePicture
                  name={user.fullName} 
                  profilePic={profilePic(user)}
                  height='h-28' width='w-28' 
                  border='rounded-full border-3 border-green-700' 
                />
              )}
              <div className='flex flex-col gap-y-1 items-center justify-center'>
                <p className='bg-slate-900 rounded-md min-w-50 text-sm max-md:text-md md:text-lg text-slate-100 shadow font-semibold mt-3 py-1.5 leading-6'>
                  {user.fullName}
                </p>
                <p className='w-1/2 bg-slate-100 p-1 border border-green-700 rounded text-green-700 font-semibold shadow max-md:text-xs md:text-sm'>
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div 
          onClick={() => handleAddCardClick({ role: label, from: `${label}-section`})}
          className={`flex items-center justify-center bg-slate-700 p-4 rounded-xl shadow hover:shadow-md hover:shadow-slate-700 cursor-pointer transition active:shadow active:scale-95 border border-slate-600
        ${label === 'Chair' && 'w-70 h-65'}
        ${label === 'Member' && 'w-60 h-65'}`}>
          <div className='flex flex-col items-center justify-center gap-2'>
            <Plus className='text-white' size={60}/>
            <p className='text-white font-medium text-lg text-center'>
              Add
              {
                label === 'Chair' ? ' Chair' : ' Member'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForceCard;

