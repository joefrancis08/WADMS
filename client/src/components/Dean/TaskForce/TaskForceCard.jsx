import React, { useEffect, useRef, useState } from 'react';
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
import { USER_ROLES } from '../../../constants/user';

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
    { icon: <FolderTree size={18} />, label: 'Assign Area or Parameter' },
    { icon: <LinkIcon size={18} />, label: 'View Access Link' },
    { icon: <FileUser size={18} />, label: 'View Details' },
    { icon: <UserRoundPen size={18} />, label: 'Update' },
    { icon: <Trash2 size={18} color='red' />, label: 'Delete' },
  ];

  const containerRef = useRef(null);
  const addCardRef = useRef(null);
  const cardsObserverRef = useRef(null);
  const [addMinHeight, setAddMinHeight] = useState(null);

  // measure tallest user card and sync the Add card min-height to it
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const cards = Array.from(container.querySelectorAll('.tf-card'));
      const heights = cards.map((el) => el.offsetHeight || 0);
      const max = heights.length ? Math.max(...heights) : 0;
      setAddMinHeight(max > 0 ? max : null);
    };

    // initial measure after layout
    const raf = requestAnimationFrame(measure);

    // observe size changes of cards
    if ('ResizeObserver' in window) {
      cardsObserverRef.current?.disconnect?.();
      const ro = new ResizeObserver(() => measure());
      cardsObserverRef.current = ro;
      const cards = Array.from(container.querySelectorAll('.tf-card'));
      cards.forEach((el) => ro.observe(el));

      // observe container width changes (grid reflow)
      ro.observe(container);
    } else {
      // fallback to window resize
      window.addEventListener('resize', measure);
    }

    return () => {
      cancelAnimationFrame(raf);
      if (cardsObserverRef.current) {
        cardsObserverRef.current.disconnect();
        cardsObserverRef.current = null;
      } else {
        window.removeEventListener('resize', measure);
      }
    };
  }, [taskForce, label]);

  const renderDropdown = (user) => {
    const id = getUserId(user);
    if (activeDropdownId !== id) return null;

    return (
      <div ref={dropdownRef} className='absolute top-10 right-2 z-50'>
        <Dropdown width='w-60' border='border border-slate-200 rounded-md bg-white shadow-lg'>
          {menu.map((m, idx) => (
            <React.Fragment key={idx}>
              {m.label === 'Delete' && <hr className='m-1 border-slate-200' />}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdown(e, m, user);
                  setActiveDropdownId(null);
                }}
                className={[
                  'flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer transition',
                  m.label === 'Delete' ? 'hover:bg-red-50' : 'hover:bg-slate-50',
                ].join(' ')}
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
                <i className='shrink-0 text-slate-600'>{m.icon}</i>
                <p className={m.label === 'Delete' ? 'text-red-600 font-medium' : 'text-slate-700'}>
                  {m.label}
                </p>
              </div>
            </React.Fragment>
          ))}
        </Dropdown>
      </div>
    );
  };

  return (
    <div className='relative'>
      {/* grid container: items stretch to tallest in the row */}
      <div
        ref={containerRef}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch justify-center'
      >
        {taskForce?.map((user) => {
          const id = getUserId(user);
          const isChair = label === 'Task Force Chair';
          const roleBadge =
            user.role === USER_ROLES.TASK_FORCE_CHAIR ? 'Chair' :
            user.role === USER_ROLES.TASK_FORCE_MEMBER ? 'Member' : '';

          return (
            <div
              key={id}
              onClick={() => navigation(user)}
              className={[
                'tf-card', // mark for measurement
                'relative w-full max-w-[20rem] justify-self-center',
                'bg-white border border-slate-200 rounded-xl',
                'shadow-sm hover:shadow-md hover:border-emerald-400/60 transition overflow-visible cursor-pointer',
                'focus-within:ring-2 focus-within:ring-emerald-400',
                'h-full flex flex-col',
              ].join(' ')}
            >
              {/* screen overlay to catch outside clicks when dropdown is open */}
              {activeDropdownId === id && <div className='fixed inset-0 z-40' />}

              {/* actions (ellipsis) */}
              <button
                type='button'
                aria-label='Open actions'
                onClick={(e) => handleEllipsisClick(e, user)}
                className='absolute top-2 right-2 p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-95 z-40'
              >
                <EllipsisVertical size={18} />
              </button>

              {renderDropdown(user)}

              {/* content */}
              <div className='px-4 pt-6 pb-5 flex-1'>
                <div className='flex items-center gap-3'>
                  <ProfilePicture
                    name={user.fullName}
                    profilePic={profilePic(user)}
                    height={isChair ? 'h-14' : 'h-12'}
                    width={isChair ? 'w-14' : 'w-12'}
                    border='rounded-full ring-2 ring-green-600'
                  />

                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-semibold text-slate-900 truncate'>
                      {user.fullName}
                    </p>
                    {user.email && (
                      <p className='text-xs text-slate-500 truncate'>{user.email}</p>
                    )}
                    <div className='mt-2'>
                      <span
                        className={[
                          'inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md border',
                          isChair
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        ].join(' ')}
                      >
                        {roleBadge}
                      </span>
                    </div>
                  </div>
                </div>

                {user.department && (
                  <div className='mt-4 flex items-center justify-between'>
                    <p className='text-xs text-slate-500 truncate'>
                      {user.department}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Add card: matches tallest user card height */}
        <button
          ref={addCardRef}
          type='button'
          onClick={() => handleAddCardClick({ role: label, from: `${label}-section` })}
          className={[
            'w-full max-w-[20rem] justify-self-center',
            'rounded-xl border border-slate-200 hover:border-emerald-400/60',
            'bg-white text-slate-600 shadow-sm hover:shadow-md',
            'transition active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
            'h-full flex items-center justify-center',
          ].join(' ')}
          style={addMinHeight ? { minHeight: `${addMinHeight}px` } : undefined}
          aria-label={`Add ${label}`}
        >
          <div className='flex items-center gap-2 py-6'>
            <PlusCircle className='h-5 w-5 text-emerald-600' />
            <span className='text-sm font-medium text-slate-700'>
              Add {label === 'Task Force Chair' ? 'Chair' : 'Member'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TaskForceCard;
