import { useState, useMemo } from 'react';
import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  EllipsisVertical,
  Folder,
  FolderOpen,
  LoaderCircle,
  Mail,
  Pen,
  Trash2,
} from 'lucide-react';
import TimeAgo from '../../components/TimeAgo';
import VerifiedUserDetailSkeletonLoader from '../../components/Loaders/VerifiedUserDetailSkeletonLoader';
import useTaskForceDetail from '../../hooks/Dean/useTaskForceDetail';
import { useTaskForce } from '../../hooks/Dean/useTaskForce';
import ProfilePicture from '../../components/ProfilePicture';
import getProfilePicPath from '../../utils/getProfilePicPath';
import TaskForceModal from '../../components/Dean/TaskForce/TaskForceModal';
import { notAssignedDM, toga } from '../../assets/icons';

const AssignmentCard = ({ children }) => {
  return (
    <section className='w-full md:w-[880px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
      {children}
    </section>
  );
};

const TaskForceDetail = () => {
  const { states: TFStates, datas: TFDatas, handlers: TFHandlers } = useTaskForce();
  const { toggleDropdown, setUpdatedProfilePic } = TFStates;
  const { updatedValue, modalType, isUpdateBtnDisabled } = TFDatas;
  const {
    handleChevronClick,
    handleConfirmDelete,
    handleDropdownMenuClick,
    handleChange,
    handleCloseModal,
    handleProfilePicUpdate,
    handleDelete,
    handleUpdate,
    handleSaveUpdate,
  } = TFHandlers;

  const { states, datas, handlers } = useTaskForceDetail();
  const { loading, loadingAssignments } = states;
  const { selectedUser, assignmentData } = datas;
  const { handleBack } = handlers;

  const profilePicPath = getProfilePicPath(selectedUser?.profilePicPath);

  // Build a nested structure for clean rendering
  const grouped = useMemo(() => {
    return assignmentData.reduce((acc, item) => {
      if (item.taskForceID !== selectedUser?.id) return acc;

      const accredKey = `${item.accredTitle} ${item.accredYear}`;
      const levelKey = item.level;
      const programKey = item.programUUID;

      acc[accredKey] ||= {};
      acc[accredKey][levelKey] ||= {};
      acc[accredKey][levelKey][programKey] ||= {
        program: item.program,
        accredTitle: item.accredTitle,
        accredYear: item.accredYear,
        level: item.level,
        accredUUID: item.accredUUID,
        areas: {},
      };

      const programObj = acc[accredKey][levelKey][programKey];

      if (item.areaID) {
        programObj.areas[item.areaID] ||= {
          areaID: item.areaID,
          area: item.area,
          parameters: {},
        };
        const areaObj = programObj.areas[item.areaID];

        if (item.parameterID) {
          areaObj.parameters[item.parameterID] ||= {
            parameterID: item.parameterID,
            parameter: item.parameter,
            subParameters: {},
          };
          const paramObj = areaObj.parameters[item.parameterID];

          if (item.subParameterID) {
            paramObj.subParameters[item.subParameterID] ||= {
              subParameterID: item.subParameterID,
              subParameter: item.subParameter,
              indicators: {},
            };
            const subObj = paramObj.subParameters[item.subParameterID];

            if (item.indicatorID) {
              subObj.indicators[item.indicatorID] ||= {
                indicatorID: item.indicatorID,
                indicator: item.indicator,
                taskForces: [],
              };
              const indObj = subObj.indicators[item.indicatorID];

              if (!indObj.taskForces.some((tf) => tf.assignmentID === item.assignmentID)) {
                indObj.taskForces.push({
                  taskForceID: item.taskForceID,
                  taskForce: item.taskForce,
                  role: item.role,
                  assignmentID: item.assignmentID,
                });
              }
            }
          }
        }
      }

      return acc;
    }, {});
  }, [assignmentData, selectedUser?.id]);

  // Disclosure state (clean + per-item)
  const [openAreas, setOpenAreas] = useState(() => new Set());
  const [openParams, setOpenParams] = useState(() => new Set());
  const [openSubs, setOpenSubs] = useState(() => new Set());

  const toggleSet = (setFn, key) => {
    setFn((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <AdminLayout>
      <main className='mx-auto w-full max-w-screen-xl px-4 py-6'>
        {/* Header */}
        <div className='mb-4 flex items-center gap-3'>
          <button
            onClick={handleBack}
            className='rounded-full border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 active:scale-95'
            aria-label='Go back'
            type='button'
          >
            <ArrowLeft />
          </button>
          <h1 className='text-xl font-semibold text-slate-900 md:text-2xl'>
            {selectedUser?.fullName ?? 'User'}&rsquo;s Info
          </h1>
        </div>

        {/* Profile card */}
        {loading ? (
          <div className='flex items-center justify-center'>
            <VerifiedUserDetailSkeletonLoader />
          </div>
        ) : (
          <section className='w-full rounded-xl border border-slate-200 bg-white px-6 pb-6 shadow-sm'>
            <header className='flex items-center justify-between gap-2 py-4'>
              <h2 className='text-2xl font-semibold text-slate-900'>Profile</h2>
              <div className='flex items-center gap-1'>
                <button
                  title='Update info'
                  onClick={(e) => handleUpdate(e, selectedUser)}
                  className='rounded-full p-2 text-slate-700 transition hover:bg-slate-100 active:scale-95'
                  type='button'
                >
                  <Pen size={18} />
                </button>
                <button
                  title='Delete'
                  onClick={(e) => handleDelete(e, selectedUser)}
                  className='rounded-full p-2 text-red-600 transition hover:bg-red-50 active:scale-95'
                  type='button'
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </header>

            <div className='rounded-xl border border-emerald-200 bg-emerald-50/40'>
              <div className='flex items-center justify-evenly px-6 pb-8 pt-8 max-lg:flex-col'>
                <div className='rounded-full'>
                  <ProfilePicture
                    name={selectedUser?.fullName}
                    profilePic={profilePicPath}
                    textSize='text-5xl'
                    height='h-40 md:h-56'
                    width='w-40 md:w-56'
                    border='rounded-full ring-4 ring-emerald-600'
                  />
                </div>

                <div className='mt-8 flex flex-col items-center gap-5 lg:mt-0'>
                  <h3 className='text-center text-3xl font-bold text-slate-900 md:text-4xl lg:text-5xl'>
                    {selectedUser?.fullName}
                  </h3>
                  <span className='rounded-full bg-white px-4 py-2 text-lg font-semibold text-emerald-700 ring-1 ring-emerald-200'>
                    {selectedUser?.role}
                  </span>
                </div>
              </div>

              <hr className='mx-auto w-1/3 border-slate-200 max-lg:block' />

              <div className='px-6 py-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-slate-700'>
                    <Mail className='text-emerald-600' size={22} />
                    <p className='text-base font-medium md:text-lg'>{selectedUser?.email}</p>
                  </div>
                  <div className='flex items-center gap-2 text-slate-700'>
                    <CalendarDays className='text-emerald-600' size={22} />
                    <p className='text-base font-medium md:text-lg'>
                      {selectedUser?.created_at && <TimeAgo date={selectedUser?.created_at} action='Created' />}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Assignments */}
        <section className='mt-6 w-full rounded-xl border border-slate-200 bg-white px-6 pb-6 shadow-sm'>
          <header className='flex items-center justify-between py-4'>
            <h2 className='text-2xl font-semibold text-slate-900'>Assignments</h2>
            <button
              title='More'
              onClick={() => {}}
              className='rounded-full p-2 text-slate-700 transition hover:bg-slate-100 active:scale-95'
              type='button'
            >
              <EllipsisVertical />
            </button>
          </header>

          <div className='border-t border-slate-200 pt-6 gap-y-8'>
            {loadingAssignments ? (
              <div className='flex w-full flex-col items-center justify-center gap-4 py-10'>
                <LoaderCircle className='h-16 w-16 animate-spin text-slate-400' />
                <p className='text-slate-600'>Loading assignment data...</p>
              </div>
            ) : Object.keys(grouped).length > 0 ? (
              Object.entries(grouped).map(([accredKey, levels]) => (
                <div key={accredKey} className='mx-auto flex max-w-[920px] flex-col items-center gap-6 px-2 md:px-4 mb-15'>
                  {/* Accred Title + Year */}
                  <div className='text-center'>
                    <h3 className='text-2xl font-bold tracking-wide text-slate-900 md:text-3xl'>
                      {accredKey}
                    </h3>
                  </div>

                  {/* Levels */}
                  {Object.entries(levels).map(([levelKey, programs]) => (
                    <div key={levelKey} className='flex flex-col items-center gap-5'>
                      <span className='rounded-full bg-slate-100 px-4 py-1 text-base font-bold text-emerald-700 ring-1 ring-emerald-200 -mt-4'>
                        {levelKey}
                      </span>

                      {/* Programs */}
                      {Object.values(programs).map((program) => (
                        <AssignmentCard key={program.program}>
                          <div className='flex flex-col items-center gap-4 mb-4'>
                            {/* Program */}
                            <div className='overflow-hidden rounded-lg border border-slate-200 bg-white'>
                              <div className='h-1 w-full bg-gradient-to-r from-emerald-600 to-amber-400' />
                              <div className='px-4 py-3'>
                                <h5 className='text-lg font-semibold text-slate-900'>{program.program}</h5>
                              </div>
                            </div>


                            {/* Areas */}
                            <div className='w-full space-y-3'>
                              {Object.values(program.areas).map((area) => {
                                const areaKey = `area:${area.areaID}`;
                                const areaOpen = openAreas.has(areaKey);
                                const hasParams = Object.values(area.parameters).length > 0;

                                return (
                                  <div key={area.areaID} className='rounded-lg border border-slate-200 bg-white'>
                                    <button
                                      type='button'
                                      onClick={() => hasParams && toggleSet(setOpenAreas, areaKey)}
                                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left ${
                                        hasParams ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-default'
                                      }`}
                                      aria-expanded={hasParams ? areaOpen : undefined}
                                      disabled={!hasParams}
                                    >
                                      <span className='inline-flex items-center gap-2'>
                                        <FolderOpen className='text-amber-600' />
                                        <span className='text-sm font-semibold text-slate-900'>{area.area}</span>
                                      </span>
                                      {hasParams && (
                                        <ChevronDown
                                          className={`h-5 w-5 text-slate-600 transition ${
                                            areaOpen ? 'rotate-180' : ''
                                          }`}
                                        />
                                      )}
                                    </button>

                                    {hasParams && areaOpen && (
                                      <div className='space-y-2 border-t border-slate-200 p-3 pl-5'>
                                        {Object.values(area.parameters).map((param) => {
                                          const paramKey = `param:${area.areaID}:${param.parameterID}`;
                                          const paramOpen = openParams.has(paramKey);
                                          const hasSubs = Object.values(param.subParameters).length > 0;

                                          return (
                                            <div key={param.parameterID} className='rounded-lg'>
                                              <button
                                                type='button'
                                                onClick={() => hasSubs && toggleSet(setOpenParams, paramKey)}
                                                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left ${
                                                  hasSubs ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-default'
                                                }`}
                                                aria-expanded={hasSubs ? paramOpen : undefined}
                                                disabled={!hasSubs}
                                              >
                                                <span className='inline-flex items-center gap-2'>
                                                  <Folder className='text-amber-600' />
                                                  <span className='text-sm font-medium text-slate-800'>
                                                    {param.parameter}
                                                  </span>
                                                </span>
                                                {hasSubs && (
                                                  <ChevronDown
                                                    className={`h-5 w-5 text-slate-600 transition ${
                                                      paramOpen ? 'rotate-180' : ''
                                                    }`}
                                                  />
                                                )}
                                              </button>

                                              {hasSubs && paramOpen && (
                                                <div className='space-y-2 border-l border-slate-200 pl-5'>
                                                  {Object.values(param.subParameters).map((sub) => {
                                                    const subKey = `sub:${area.areaID}:${param.parameterID}:${sub.subParameterID}`;
                                                    const subOpen = openSubs.has(subKey);
                                                    const hasInds = Object.values(sub.indicators).length > 0;

                                                    return (
                                                      <div key={sub.subParameterID} className='rounded-lg'>
                                                        <button
                                                          type='button'
                                                          onClick={() => hasInds && toggleSet(setOpenSubs, subKey)}
                                                          className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left ${
                                                            hasInds
                                                              ? 'hover:bg-slate-50 cursor-pointer'
                                                              : 'cursor-default'
                                                          }`}
                                                          aria-expanded={hasInds ? subOpen : undefined}
                                                          disabled={!hasInds}
                                                        >
                                                          <span className='inline-flex items-center gap-2'>
                                                            <Folder className='text-amber-600' />
                                                            <span className='text-sm text-slate-800'>
                                                              {sub.subParameter}
                                                            </span>
                                                          </span>
                                                          {hasInds && (
                                                            <ChevronDown
                                                              className={`h-5 w-5 text-slate-600 transition ${
                                                                subOpen ? 'rotate-180' : ''
                                                              }`}
                                                            />
                                                          )}
                                                        </button>

                                                        {hasInds && subOpen && (
                                                          <div className='space-y-1 border-l border-slate-200 pl-5'>
                                                            {Object.values(sub.indicators).map((ind) => (
                                                              <div key={ind.indicatorID} className='rounded-lg'>
                                                                <div className='flex items-center gap-2 rounded-lg px-3 py-2'>
                                                                  <Folder className='text-amber-600' />
                                                                  <span className='text-sm text-slate-800'>
                                                                    {ind.indicator}
                                                                  </span>
                                                                </div>
                                                                {ind.taskForces.length > 0 && (
                                                                  <ul className='list-inside list-disc pl-8 text-sm text-slate-600'>
                                                                    {ind.taskForces.map((tf) => (
                                                                      <li key={tf.assignmentID}>
                                                                        {tf.taskForce}{' '}
                                                                        <span className='italic text-slate-500'>
                                                                          ({tf.role})
                                                                        </span>
                                                                      </li>
                                                                    ))}
                                                                  </ul>
                                                                )}
                                                              </div>
                                                            ))}
                                                          </div>
                                                        )}
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </AssignmentCard>
                      ))}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className='flex w-full flex-col items-center justify-center gap-4 py-12'>
                <img src={notAssignedDM} alt='No assignments' className='h-48 w-48 opacity-60' loading='lazy' />
                <p className='text-slate-700'>Not yet assigned.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <TaskForceModal
        data={{
          modalType,
          updatedValue,
          selectedUser,
          isUpdateBtnDisabled,
        }}
        handlers={{
          toggleDropdown,
          handleChevronClick,
          handleConfirmDelete,
          handleDropdownMenuClick,
          handleChange,
          handleCloseModal,
          setUpdatedProfilePic,
          handleProfilePicUpdate,
          handleSaveUpdate,
        }}
      />
    </AdminLayout>
  );
};

export default TaskForceDetail;
