import React from 'react';
import {
  EllipsisVertical,
  FileUser,
  FolderTree,
  Link as LinkIcon,
  PlusCircle,
  Trash2,
  UserRoundPen,
} from 'lucide-react';
import Dropdown from '../../../components/Dropdown/Dropdown';
import ProfilePicture from '../../../components/ProfilePicture';

const getUserId = (u) => u.uuid;

const TaskForceCard = ({
  dropdownRef,
  activeDropdownId,
  setActiveDropdownId,
  label,
  taskForce,
  navigation,
  profilePic,
  handleDropdown,
  handleEllipsisClick,
  handleAddCardClick,
}) => {
  const menu = [
    { icon: <FolderTree size={20} />, label: 'Assign Program, Area, & Parameter' },
    { icon: <LinkIcon size={20} />, label: 'Generate Access Link' },
    { icon: <FileUser size={20} />, label: 'View Details' },
    { icon: <UserRoundPen size={20} />, label: 'Update' },
    { icon: <Trash2 size={20} color='red' />, label: 'Delete' },
  ];

  const renderDropdown = (user) => {
    const id = getUserId(user);
    if (activeDropdownId !== id) return null;

    return (
      <div ref={dropdownRef} className='absolute top-10 left-15 z-50'>
        <Dropdown width='w-56' border='border border-slate-300 rounded-md bg-white shadow-lg'>
          {menu.map((m, idx) => (
            <React.Fragment key={idx}>
              {m.label === 'Delete' && <hr className='m-1 text-slate-200' />}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdown(e, m, user);
                  setActiveDropdownId(null);
                }}
                className={`flex items-center gap-2 text-sm p-2 rounded-md cursor-pointer transition ${m.label === 'Delete' ? 'hover:bg-red-200' : 'hover:bg-slate-200'}`}
                role='menuitem'
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDropdown(e, m, user);
                    setActiveDropdownId(null);
                  }
                }}
              >
                <i className='shrink-0'>{m.icon}</i>
                <p className={m.label === 'Delete' ? 'text-red-500' : ''}>{m.label}</p>
              </div>
            </React.Fragment>
          ))}
        </Dropdown>
      </div>
    );
  };

  return (
    <div className='relative'>
      {/* switched to flex + wrap + justify-center */}
      <div className='flex flex-wrap justify-center gap-5'>
        {taskForce?.map((user) => {
          const id = getUserId(user);
          const isChair = label === 'Chair';
          return (
            <div
              key={id}
              onClick={() => navigation(user)}
              className='relative w-full max-w-[18rem]
                         bg-gradient-to-b from-slate-800 to-slate-700
                         border border-slate-600 rounded-xl
                         shadow hover:shadow-lg hover:border-slate-500
                         transition overflow-visible cursor-pointer'
            >
              {activeDropdownId === id && <div className="fixed inset-0 z-40"></div>}
              {/* ellipsis button */}
              <button
                type='button'
                aria-label='Open actions'
                onClick={(e) => handleEllipsisClick(e, user)}
                className='absolute top-2 right-2 p-2 rounded-full
                           text-slate-200 hover:text-white hover:bg-slate-700
                           cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-600
                           active:scale-95'
              >
                <EllipsisVertical size={18} />
              </button>

              {renderDropdown(user)}

              {/* content */}
              <div className='px-4 pt-6 pb-5 flex flex-col items-center text-center'>
                <ProfilePicture
                  name={user.fullName}
                  profilePic={profilePic(user)}
                  height={isChair ? 'h-28' : 'h-24'}
                  width={isChair ? 'w-28' : 'w-24'}
                  border={`rounded-full border-4 ${isChair ? 'border-amber-500' : 'border-green-700'}`}
                />

                <div className='mt-4 space-y-2 w-full'>
                  <p className='mx-auto max-w-[220px] px-2 py-1 rounded bg-slate-900 text-slate-100 text-sm font-semibold truncate'>
                    {user.fullName}
                  </p>

                  <div className='flex items-center justify-center'>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded border ${
                        isChair ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-green-100 text-green-800 border-green-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* add card */}
        <button
          type='button'
          onClick={() => handleAddCardClick({ role: label, from: `${label}-section` })}
          className='w-full max-w-[18rem] flex items-center justify-center rounded-xl
                     border-2 border-dashed border-slate-600 hover:border-slate-500
                     bg-slate-800/60 hover:bg-slate-800 text-slate-200 shadow-inner
                     min-h-[220px] transition active:scale-95 cursor-pointer'
          aria-label={`Add ${label}`}
        >
          <div className='flex flex-col items-center gap-2'>
            <PlusCircle className='h-10 w-10' />
            <p className='text-sm font-medium'>Add {label === 'Chair' ? 'Chair' : 'Member'}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TaskForceCard;
