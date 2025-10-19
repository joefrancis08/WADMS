const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const ProfileStack = ({ 
  data = {}, 
  handlers = {}, 
  scope = 'area' // Can be 'area', 'parameter', or 'subparameter'
}) => {
  const { assignmentData = [], taskForce = [], accredInfoId, levelId, programId } = data;
  const { handleProfileStackClick } = handlers;

  // Mapping for dynamic IDs
  const idMapping = {
    area: 'areaID',
    parameter: 'parameterID',
    subParameter: 'subParameterID',
  };

  const scopeIdKey = idMapping[scope];
  const currentScopeId = data[`${scope}ID`] || data[`${scope}_ID`] || data[`${scope}_id`] || data[`${scope}Id`];

  const filteredAssignments = assignmentData.filter((a) => {
  const aProgramId = a.programID ?? a.programId;
  const aLevelId = a.levelID ?? a.levelId;
  const aAccredId = a.accredID ?? a.accredInfoId;

  const sameContext =
    Number(aProgramId) === Number(programId) &&
    Number(aLevelId) === Number(levelId) &&
    Number(aAccredId) === Number(accredInfoId);

  if (!sameContext) return false;

    switch (scope) {
      case 'area':
        // Include everything under same area
        return a.areaID === currentScopeId;

      case 'parameter':
        // Include parameter + any assignments that belong to its subparameters/indicators
        return (
          a.parameterID === currentScopeId ||
          a.subParameterID !== null ||
          a.indicatorID !== null
        );

      case 'subParameter':
        // Include subparameter + any assignments tied to its indicators
        return (
          a.subParameterID === currentScopeId ||
          a.indicatorID !== null
        );

      case 'indicator':
        return a.indicatorID === currentScopeId;

      default:
        return false;
    }
  });

  console.log({
    scope,
    currentScopeId,
    programId,
    levelId,
    accredInfoId,
    filteredAssignments,
  });

  // Deduplicate by Task Force ID
  const uniqueTaskForceIds = [
    ...new Set(filteredAssignments.map(a => a.taskForceID))
  ];

  const assignedTaskForces = uniqueTaskForceIds
    .map(id => taskForce.find(tf => tf.id === id))
    .filter(Boolean); // remove nulls

  if (assignedTaskForces.length === 0) return null;

  return (
    <div className='flex hover:bg-slate-200/20 items-center rounded-full p-1'>
      {assignedTaskForces.map((tf, idx) => (
        <div
          key={`${tf.id}-${idx}`}
          title='Assigned Task Force (Click to see details)'
          onClick={(e) => {
            const taskForcesForScope = filteredAssignments.map(a => {
              const match = taskForce.find(tf => tf.id === a.taskForceID);
              return {
                uuid: match?.uuid,
                id: match?.id,
                fullName: match?.fullName || a.taskForce,
                role: a.role,
                profilePic: match?.profilePicPath || '/default-profile-picture.png',
              };
            });

            handleProfileStackClick(e, {
              accredInfoId,
              levelId,
              programId,
              [`${scope}Id`]: currentScopeId,
              [scope]: filteredAssignments[0]?.[scope],
              taskForces: taskForcesForScope,
            });
          }}
          className='first:m-0 -ml-2 flex items-center justify-start cursor-pointer'
        >
          <img
            src={`${PROFILE_PIC_PATH}/${tf.profilePicPath || 'default-profile-picture.png'}`}
            alt='Task Force Profile Picture'
            className='h-5 w-5 rounded-full border-l border-white/80'
            loading='lazy'
          />
        </div>
      ))}
    </div>
  );
};

export default ProfileStack;
