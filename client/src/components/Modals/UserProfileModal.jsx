import ModalLayout from '../Layout/ModalLayout';
import { ShieldCheck, Trash2, X } from 'lucide-react';
import TimeAgo from '../TimeAgo';
import ProfilePicture from '../ProfilePicture';
import { gmailIcon } from '../../assets/icons';

const UserProfileModal = ({ selectedUser, onClose, onVerifyClick, onDeleteClick }) => {
  const actions = [
    { id: 'delete', label: 'Delete', icon: Trash2, onDeleteClick },
    { id: 'verify', label: 'Verify', icon: ShieldCheck, onVerifyClick},
  ];
  return (
    <div onClick={onClose} className="h-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs overflow-hidden">
      <div className="w-full md:max-w-2xl max-md:mx-4 bg-white rounded shadow-2xl px-6 py-4 animate-fadeIn">
        <div className='relative w-full flex flex-col rounded-lg items-center justify-center py-5 border border-gray-200'>
          <div className='flex items-center justify-center pb-10'>
            <div>
              <ProfilePicture 
                profilePic={selectedUser?.profile_pic_path}
                height={'md:h-36 h-32'} 
                width={'md:w-36 w-32'} 
                border={'border-3 border-green-700 rounded-full'}
              />
            </div>
            <div className='relative p-4 flex flex-col items-center justify-center'>
              <div className="flex flex-col items-center justify-center border border-gray-200 shadow-sm bg-gray-100 rounded-lg">
                <p className='min-w-90 text-center py-4 text-xl md:text-2xl font-bold text-slate-900'>
                  {selectedUser?.full_name}
                </p>
                <p className='flex items-center justify-start pb-3 -ml-3'>
                  <img src={gmailIcon} alt="Gmail Logo" loading='lazy' className='h-4' />
                  {selectedUser?.email}
                </p>
              </div>
            </div>
          </div>
          <div className='absolute bottom-2 right-14 mt-3 flex gap-x-2'>
            {actions.map(action => {
              const Icon = action.icon;

              return (
                <button 
                  key={action.id} 
                  onClick={(e) => action.label === 'Verify' 
                    ? action.onVerifyClick(e, { selectedUser, from: { profileCard: true } }) 
                    : action.onDeleteClick(e, { selectedUser, from: { profileCard: true } })}
                  className={`flex items-center justify-center gap-1 py-1 px-3 border rounded-full cursor-pointer
                              active:scale-98 transition hover:shadow ${action.label === 'Delete' ? 'hover:bg-red-100 border-red-200 text-red-600' : 'hover:bg-slate-100 border-slate-200 text-green-600'}`
                  }
                >
                  <Icon className={`${action.label === 'Delete' ? 'text-red-600' : 'text-green-600'} h-5 w-5`}/>
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
