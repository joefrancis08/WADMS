import { X } from "lucide-react";
import MODAL_TYPE from "../../constants/modalTypes";

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const TaskForceModal = ({ refs, modalType, datas, inputs, handlers, scope = 'area' }) => {

  const { user, modalData } = datas;
  const { handleCloseModal } = handlers;

  console.log(user);

  switch (modalType) {
    case MODAL_TYPE.VIEW_ASSIGNED_TASK_FORCE:
      return (
        <>
          <div onClick={handleCloseModal} className="h-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs overflow-hidden">
            <div className="w-full md:max-w-xl min-h-80 max-md:mx-4 bg-white rounded shadow-2xl px-6 pt-4 animate-fadeIn overflow-hidden">
              <div className='flex text-slate-800 justify-between items-center max-md:items-center'>
                <h1 
                  title={`Assigned Task Force for ${modalData?.[scope]}`} 
                  className='font-semibold text-lg w-full truncate'
                >
                  Assigned Task Force for {modalData?.[scope]}
                </h1>
                <button 
                  onClick={handleCloseModal}
                  className='p-2 hover:bg-slate-200 rounded-full cursor-pointer -mr-2'>
                  <X className='h-5 w-5' />
                </button>
              </div>
              {modalData?.taskForces.length > 0 && (
                <p className='text-sm -mt-2'>
                  {modalData?.taskForces.length} {' '} 
                  {modalData?.taskForces.length > 1 ? 'people' : 'person'} {' '}
                  assigned
                </p>
              )}
              <hr className='text-slate-400 mt-3 mx-auto'></hr>
              <div className='flex flex-col gap-2 mb-4 min-h-50 max-h-80 overflow-auto py-4'>
                {modalData?.taskForces?.length > 0 && modalData?.taskForces.map((tf, index) => (
                  <div key={index} className='relative flex justify-between bg-slate-100 px-3 py-2 rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <img 
                        src={
                          tf?.profilePic?.startsWith?.('http')
                            ? tf.profilePic
                            : `${PROFILE_PIC_PATH}/${tf.profilePic || 'default-profile-picture.png'}`
                        }
                        alt="Profile Picture" 
                        loading='lazy' 
                        className='h-10 w-10 border-green-800 border-2 rounded-full'
                      />
                      <div>
                        <p>
                          {user.fullName === tf?.fullName ? `${tf.fullName} (You)` : tf.fullName}
                        </p>
                        <p className='text-xs text-slate-500 italic'>
                          {tf?.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      );

    default:
      return null;
  }
};

export default TaskForceModal;
