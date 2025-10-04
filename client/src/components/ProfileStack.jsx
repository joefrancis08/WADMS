import React from 'react';
import formatAreaName from '../utils/formatAreaName';

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const ProfileStack = ({ 
  data = {}, 
  handlers = {}, 
  scope = 'area' // Can be 'area', 'parameter', or 'subparameter'
}) => {
  const { assignmentData, taskForce } = data;
  const { handleProfileStackClick } = handlers;

  // Mapping for dynamic IDs
  const idMapping = {
    area: 'areaID',
    parameter: 'parameterID',
    subparameter: 'subParameterID'
  };

  const scopeIdKey = idMapping[scope];
  const currentScopeId = data[`${scope}_id`] || data[`${scope}Id`];

  return (
    <div className='absolute bottom-3 left-2 flex hover:bg-slate-200/20 items-center rounded-full p-1'>
      {assignmentData.map((assignment, idx) => {
        const isScopeMatch = assignment[scopeIdKey] === currentScopeId;

        return taskForce.map((tf) => {
          const isTaskForceMatch = assignment.taskForceID === tf.id;

          if (!isScopeMatch || !isTaskForceMatch) return null;

          return (
            <div
              key={`${assignment.id}-${tf.id}-${idx}`}
              title='Assigned Task Force (Click to see details)'
              onClick={(e) => {
                const assignedTaskForces = assignmentData
                  .filter(a => a[scopeIdKey] === currentScopeId) // All assignments for this scope
                  .map(a => {
                    const tfMatch = taskForce.find(tf => tf.id === a.taskForceID);
                    return {
                      uuid: tfMatch?.uuid,
                      id: tfMatch?.id,
                      fullName: tfMatch?.fullName || a.taskForce,
                      role: a.role,
                      profilePic: tfMatch?.profilePicPath || '/default-profile-picture.png',
                    };
                  });

                handleProfileStackClick(e, {
                  accredInfoId: assignment.accredID,
                  levelId: assignment.levelID,
                  programId: assignment.programID,
                  [`${scope}Id`]: currentScopeId,
                  [scope]: assignment[scope],
                  taskForces: assignedTaskForces,
                });
              }}
              className='first:m-0 -ml-2 flex items-center justify-start'
            >
              <img
                src={`${PROFILE_PIC_PATH}/${tf.profilePicPath || '/default-profile-picture.png'}`}
                alt='Task Force Profile Picture'
                className='h-5 w-5 rounded-full border-l border-white/80'
                loading='lazy'
              />
            </div>
          );
        });
      })}
    </div>
  );
};

export default ProfileStack;
