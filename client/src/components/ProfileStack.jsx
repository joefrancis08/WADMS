const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const ProfileStack = ({
  data = {},
  handlers = {},
  scope = 'area', // 'area' | 'parameter' | 'subParameter' | 'indicator'
  showBorder = false,
  ui = 'dean'
}) => {
  const { assignmentData = [], taskForce = [], accredInfoId, levelId, programId } = data;
  const { handleProfileStackClick } = handlers;

  // Mapping for dynamic IDs
  const idMapping = {
    area: 'areaID',
    parameter: 'parameterID',
    subParameter: 'subParameterID',
    indicator: 'indicatorID'
  };

  const scopeIdKey = idMapping[scope];
  const currentScopeId =
    data[`${scope}ID`] ??
    data[`${scope}_ID`] ??
    data[`${scope}_id`] ??
    data[`${scope}Id`];

  // Filter assignments for current context (accred + level + program) and scope
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
        return a.areaID === currentScopeId;
      case 'parameter':
        return a.parameterID === currentScopeId;
      case 'subParameter':
        return a.subParameterID === currentScopeId;
      case 'indicator':
        return a.indicatorID === currentScopeId;
      default:
        return false;
    }
  });

  // Deduplicate by Task Force ID, then map to TF objects
  const uniqueTaskForceIds = [...new Set(filteredAssignments.map((a) => a.taskForceID))];

  const assignedTaskForces = uniqueTaskForceIds
    .map((id) => taskForce.find((tf) => tf.id === id))
    .filter(Boolean);

  if (assignedTaskForces.length === 0) return null;

  return (
    <div className='relative flex items-center rounded-full p-0.5 hover:bg-slate-100/60'>
      <div className='flex -space-x-2'>
        {assignedTaskForces.map((tf, idx) => (
          <button
            key={`${tf.id}-${idx}`}
            type='button'
            title='Assigned Task Force (click to see details)'
            aria-label='Assigned Task Force'
            onClick={(e) => {
              const taskForcesForScope = filteredAssignments.map((a) => {
                const match = taskForce.find((t) => t.id === a.taskForceID);
                return {
                  uuid: match?.uuid,
                  id: match?.id,
                  fullName: match?.fullName || a.taskForce,
                  role: a.role,
                  profilePic: match?.profilePicPath || '/default-profile-picture.png'
                };
              });

              handleProfileStackClick?.(e, {
                accredInfoId,
                levelId,
                programId,
                [`${scope}Id`]: currentScopeId,
                [scope]: filteredAssignments[0]?.[scope],
                taskForces: taskForcesForScope
              });
            }}
            className='relative inline-flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-slate-200 hover:ring-emerald-300 transition cursor-pointer bg-white'
          >
            <img
              src={
                tf?.profilePicPath?.startsWith?.('http')
                  ? tf.profilePicPath
                  : `${PROFILE_PIC_PATH}/${tf?.profilePicPath || 'default-profile-picture.png'}`
              }
              alt={tf?.fullName ? `${tf.fullName}'s profile picture` : 'Task force profile picture'}
              className={[
                'h-6 w-6 rounded-full object-cover',
                showBorder ? 'ring ring-emerald-400' : ''
              ].join(' ')}
              loading='lazy'
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileStack;
