import { CirclePlus, EllipsisVertical, FolderTree, Link, SquareUserRound, Trash2, UserRoundPen } from 'lucide-react';
import Dropdown from '../Dropdown/Dropdown';
import ProfilePicture from '../ProfilePicture';

const TaskForceCard = ({ 
  containerRef,
  activeDropdownId, 
  label,
  taskForce, 
  navigation, 
  profilePic, 
  handleDropdown, 
  handleEllipsisClick 
}) => {
  const renderDropdown = (user) => {
    const dropDownMenu = [
      { icon: <FolderTree size={20} />, label: 'Assign Program, Area, & Parameter' },
      { icon: <Link size={20} />, label: 'Generate Access Link' },
      { icon: <SquareUserRound size={20} />, label: 'View Details' },
      { icon: <UserRoundPen size={20} />, label: 'Update' },
      { icon: <Trash2 size={20} color='red'/>, label: 'Delete' }
    ];

    return (
      activeDropdownId === user.user_uuid && (
        <div className='absolute top-8 left-15 max-sm:left-10 transition'>
          <Dropdown width={'w-50'} border={'border border-gray-300 rounded-md'}>
            {dropDownMenu.map((menu, index) => (
              <div
                onClick={(e) => {
                  e.stopPropagation(); // This code prevent card click.
                  handleDropdown(e, menu, user)
                }}
                key={index}
                className={`flex items-center gap-2 text-gray-700 text-sm p-2 hover:first:rounded-t hover:last:rounded-b hover:font-medium hover:shadow transition-all ${menu.label === 'Delete' ? 'border-t border-gray-300 hover:bg-red-300/50' : 'hover:bg-slate-300'}`}
              >
                <i>{menu.icon}</i>
                <p className={menu.label === 'Delete' ? 'text-red-500' : ''}>{menu.label}</p>
              </div>
            ))}
          </Dropdown>
        </div>
      )
    );
  };

  return (
    <div>
      <div className='flex flex-wrap gap-10 pb-6 justify-center'>
        {taskForce?.map(user => (
          <div
            onClick={() => navigation(user)}
            key={user.user_uuid} 
            className={`relative p-4 bg-gradient-to-b from-green-700 to-amber-300 rounded-xl shadow hover:shadow-xl cursor-pointer transition
              ${label === 'Chair' && 'w-45 sm:w-50 md:w-55 lg:w-60 xl:w-65'}
              ${label === 'Member' && 'w-36 sm:w-40 md:w-44 lg:w-48 xl:w-52'}
            `}
          >
            <div 
              onClick={(e) => {
                handleEllipsisClick(e, user);
              }} 
              className='absolute top-0 p-2 right-0 text-slate-100 rounded-bl-xl rounded-tr-lg hover:shadow hover:text-slate-200 hover:bg-slate-100/20 active:opacity-50 transition'>
              <EllipsisVertical size={20}/>
            </div>
            {renderDropdown(user)}
            <div className='flex flex-col items-center text-center'>
              {label === 'Chair' && (
                <ProfilePicture
                  name={user.full_name} 
                  profilePic={profilePic(user)}
                  height='h-36' width='w-36' 
                  border='rounded-full border-3 border-green-800' 
                />
              )}

              {label === 'Member' && (
                <ProfilePicture
                  name={user.full_name} 
                  profilePic={profilePic(user)}
                  height='h-28' width='w-28' 
                  border='rounded-full border-3 border-green-700' 
                />
              )}
              
              <p className='bg-gradient-to-b from-green-800 to-green-600 w-full text-sm max-md:text-md md:text-lg text-slate-100 shadow font-semibold mt-3 py-0.5'>
                {user.full_name}
              </p>
              <p className='w-1/2 text-neutral-900 shadow max-md:text-xs md:text-sm'>
                {user.role}
              </p>
            </div>
          </div>
        ))}
        <div className={`flex items-center justify-center bg-slate-50 p-4 rounded-xl shadow hover:shadow-xl cursor-pointer transition active:shadow
        ${label === 'Chair' && 'w-45 sm:w-50 md:w-55 lg:w-60 xl:w-65'}
        ${label === 'Member' && 'w-36 sm:w-40 md:w-44 lg:w-48 xl:w-52'}`}>
          <div className='flex flex-col items-center justify-center gap-2'>
            <CirclePlus className='text-slate-500' size={80}/>
            <p className='text-slate-500 font-medium text-xl text-center'>
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

