import React, { useEffect } from 'react'
import MODAL_TYPE from '../../constants/modalTypes';

const AreaAssignmentModal = ({ modalType, handleCloseModal }) => {
  useEffect(() => {
    if (modalType !== MODAL_TYPE.TASK_FORCE_AREA_ASSIGNMENT) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  })
  switch (modalType) {
    case MODAL_TYPE.TASK_FORCE_AREA_ASSIGNMENT:
      return (
        <>
          <div
            onClick={handleCloseModal}
            className="h-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs overflow-hidden"
          >
            <div className="w-full md:max-w-5xl min-h-130 max-md:mx-4 bg-white rounded shadow-2xl px-6 pt-4 animate-fadeIn z-50 overflow-hidden">
              <div className="flex text-slate-800 justify-between items-center max-md:items-center">
        
              </div>
            </div>
          </div>
        </>
      );

    default:
      return null;
  };
};

export default AreaAssignmentModal;
