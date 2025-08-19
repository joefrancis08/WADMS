import { EllipsisVertical, FolderTree, Link, SquareUserRound, Trash2, UserRoundPen } from 'lucide-react';
import Dropdown from '../../Dropdown/Dropdown';
import ProfilePicture from '../../ProfilePicture';

const TaskForceCard = ({ 
  activeDropdownId, 
  taskForce, 
  navigation, 
  profilePic, 
  handleDropdown, 
  handleEllipsisClick 
}) => {
  const renderDropdown = (user) => {
    const dropDownMenu = [
      { icon: <FolderTree size={20} />, label: 'Assign Program and Area' },
      { icon: <Link size={20} />, label: 'Generate Access Link' },
      { icon: <SquareUserRound size={20} />, label: 'View Details' },
      { icon: <UserRoundPen size={20} />, label: 'Update' },
      { icon: <Trash2 size={20} color='red'/>, label: 'Delete' }
    ];

    return (
      activeDropdownId === user.id && (
        <div className='absolute top-8 left-15 max-sm:left-10 transition'>
          <Dropdown width={'w-50'} border={'border border-gray-300 rounded-md'}>
            {dropDownMenu.map((menu, index) => (
              <div
                onClick={(e) => {
                  e.stopPropagation(); // This code prevent card click.
                  handleDropdown(e, menu, user)
                }}
                key={index}
                className={`flex items-center text-gray-700 text-sm p-2 hover:first:rounded-t hover:last:rounded-b hover:bg-slate-200 hover:font-medium hover:shadow transition-all ${menu.label === 'Delete' && 'border-t border-gray-300 mt-2'}`}
              >
                <i className='mr-2'>{menu.icon}</i>
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
      <div className='flex justify-center'>
        <h2 className='flex items-center justify-center w-full lg:w-[75%] gap-2 p-2 text-2xl bg-gradient-to-l from-slate-900 to-green-600 shadow-md max-lg:text-center text-slate-50 rounded font-bold mb-3'>
          {taskForce?.length > 1 ? 'CHAIRS' : 'CHAIR'}
        </h2>
      </div>
      <div className='flex flex-wrap gap-10 pb-6 justify-center'>
        {taskForce?.map(user => (
          <div
            onClick={() => navigation(user)}
            key={user.user_uuid} 
            className='relative w-45 sm:w-50 md:w-55 lg:w-60 xl:w-65 p-4 bg-gray-50 rounded-xl border border-slate-300 shadow hover:shadow-xl cursor-pointer transition'
          >
            <div 
              onClick={(e) => {
                e.stopPropagation(); // This code also prevents card click which result to navigation to a page.
                handleEllipsisClick(e, user);
              }} 
              className='absolute top-0 p-2 right-0 text-slate-900 rounded-bl-xl rounded-tr-lg hover:shadow hover:text-slate-600 hover:bg-gray-200 active:opacity-50 transition'>
              <EllipsisVertical size={20}/>
            </div>
            {renderDropdown(user)}
            <div className='flex flex-col items-center text-center'>
              <ProfilePicture
                name={user.full_name} 
                profilePic={profilePic(user)}
                height='h-36' width='w-36' 
                border='rounded-full border-3 border-green-700' />
              <p className='bg-gradient-to-r from-green-800 to-green-600 w-full max-md:text-md md:text-lg text-slate-100 shadow font-semibold mt-3'>
                {user.full_name}
              </p>
              <p className='bg-gradient-to-l from-green-600 to-green-500 w-[50%] shadow-md text-slate-100 max-md:text-xs md:text-sm font-medium'>
                {user.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskForceCard;

