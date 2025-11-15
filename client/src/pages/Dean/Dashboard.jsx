import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, Clock, User2, ClipboardCheck } from 'lucide-react';
import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { useAuth } from '../../contexts/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import PATH from '../../constants/path';
import { useUsersBy } from '../../hooks/fetch-react-query/useUsers';
import { USER_ROLES } from '../../constants/user';
import { useFetchILP } from '../../hooks/fetch-react-query/useFetchILP';
import { useMemo } from 'react';

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;
const { TASK_FORCE_CHAIR, TASK_FORCE_MEMBER } = USER_ROLES;

const SAMPLE_ACCREDITATIONS = [
  // Same accreditation, multiple programs/levels
  {
    id: 'aaccup-2025-prelim-bsit',
    title: 'AACCUP Accreditation 2025',
    level: 'Preliminary',
    program: 'BS Information Technology',
    status: 'Scheduled • Mar 2025',
  },
  {
    id: 'aaccup-2025-level1-bsed',
    title: 'AACCUP Accreditation 2025',
    level: 'Level I',
    program: 'BSEd Major in English',
    status: 'Document prep • In progress',
  },
  // Another program under same accreditation but different level
  {
    id: 'aaccup-2025-level2-bsmath',
    title: 'AACCUP Accreditation 2025',
    level: 'Level II',
    program: 'BS Mathematics',
    status: 'Self-survey • Due Jan 15',
  },

  // (Optional) Add a different accreditation cycle to show grouping works across titles
  {
    id: 'paqao-2026-level1-bsa',
    title: 'PAQAO Accreditation 2026',
    level: 'Level I',
    program: 'BS Accountancy',
    status: 'Kickoff • Apr 2026',
  },
];

// Simple demo progress data (replace with real values when available)
const SAMPLE_PROGRESS = [
  { id: 'bsit', program: 'BS Information Technology', overall: 62, areas: [
    { name: 'Area I', percent: 70 }, { name: 'Area II', percent: 55 },
    { name: 'Area III', percent: 60 }, { name: 'Area IV', percent: 63 },
  ]},
  { id: 'bsed-eng', program: 'BSEd Major in English', overall: 44, areas: [
    { name: 'Area I', percent: 50 }, { name: 'Area II', percent: 41 },
    { name: 'Area III', percent: 38 }, { name: 'Area IV', percent: 47 },
  ]},
  { id: 'bsmath', program: 'BS Mathematics', overall: 78, areas: [
    { name: 'Area I', percent: 82 }, { name: 'Area II', percent: 76 },
    { name: 'Area III', percent: 71 }, { name: 'Area IV', percent: 83 },
  ]},
  { id: 'bsa', program: 'BS Accountancy', overall: 20, areas: [
    { name: 'Area I', percent: 25 }, { name: 'Area II', percent: 15 },
    { name: 'Area III', percent: 18 }, { name: 'Area IV', percent: 22 },
  ]},
];

// Map progress by program name for quick lookup
const PROGRESS_BY_PROGRAM = Object.fromEntries(SAMPLE_PROGRESS.map((p) => [p.program, p]));

// Group accreditation items by title so one accreditation can show multiple programs/levels
const GROUPED_ACCREDITATIONS = Object.values(
  SAMPLE_ACCREDITATIONS.reduce((acc, item) => {
    const key = item.title;
    if (!acc[key]) acc[key] = { title: key, items: [] };
    acc[key].items.push(item);
    return acc;
  }, {})
);

const Dashboard = () => {
  const { users = [], loading, error } = useUsersBy({ role: [TASK_FORCE_CHAIR, TASK_FORCE_MEMBER] });
  const { user, isLoading } = useAuth();
  const { accredInfoLevelPrograms, loading: loadingILP, error: errorILP } = useFetchILP();
  usePageTitle('Dashboard');


  console.log(accredInfoLevelPrograms);
  const infoLevelProgramsData = useMemo(() => accredInfoLevelPrograms?.data ?? [], [accredInfoLevelPrograms.data]);

  const grouped = useMemo(() => {
      return infoLevelProgramsData.reduce((acc, item) => {
        const accredTitle = `${item.accreditationInfo.accred_title} ${item.accreditationInfo.accred_year}`;
        if (!acc[accredTitle]) acc[accredTitle] = {};
        if (!acc[accredTitle][item.level]) acc[accredTitle][item.level] = [];
        acc[accredTitle][item.level].push({
          ...item.program,
          ilpmId: item.ilpmId,
          level: item.level,
          accred_id: item.accreditationInfo.id,
          accred_uuid: item.accreditationInfo.accred_uuid,
          accred_year: item.accreditationInfo.accred_year,
          accred_title: item.accreditationInfo.accred_title,
          accred_body_name: item.accreditationInfo.accred_body
        });
        return acc;
      }, {});
    }, [infoLevelProgramsData]);

  console.log(grouped); 

  const chairs = users?.filter(u => u.role === TASK_FORCE_CHAIR) ?? [];
  const members = users?.filter(u => u.role === TASK_FORCE_MEMBER) ?? [];
  const taskForcesCount = users.length;

  if (isLoading) return <p className='mt-10 text-center text-slate-400'>Loading...</p>;

  const avatarSrc = user?.profilePicPath?.startsWith?.('http')
    ? user.profilePicPath
    : `${PROFILE_PIC_PATH}/${user?.profilePicPath || 'default-profile-picture.png'}`;

  return (
    <AdminLayout>
      <div className='min-h-screen bg-slate-50'>
        {/* Header */}
        <div className='border-b border-slate-200 bg-white'>
          <div className='mx-auto max-w-7xl px-4 py-6'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div>
                <h1 className='text-xl font-semibold text-slate-900 md:text-2xl'>Home</h1>
                <p className='text-sm text-slate-600'>
                  {new Date().toLocaleDateString(undefined, {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>

              {/* Compact user chip */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm hover:shadow'>
                  <div className='h-8 w-8 overflow-hidden rounded-full ring-1 ring-slate-200'>
                    {user?.profilePicPath ? (
                      <img src={avatarSrc} alt={user?.fullName} className='h-full w-full object-cover' />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center bg-slate-100'>
                        <User2 size={16} className='text-slate-400' />
                      </div>
                    )}
                  </div>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium text-slate-900'>{user?.fullName}</p>
                    <p className='truncate text-xs text-slate-600'>{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content: 2-column layout (main left, recent activity right) */}
        <main className='mx-auto max-w-7xl px-4 py-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* LEFT: Main content spans 2 columns */}
            <div className='space-y-6 lg:col-span-2'>
              {/* Accreditation container */}
              <section className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
                <header className='mb-4 flex items-center justify-between'>
                  <div>
                    <h2 className='text-lg font-semibold text-slate-900'>Accreditation</h2>
                    <p className='text-sm text-slate-600'>Track documents, progress, and ratings.</p>
                  </div>
                </header>

                {/* Top counters */}
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4'>
                  <StatCard to={PATH.DEAN?.DOCUMENTS || '#'} label='Uploaded Documents' value='48' icon={<FileText size={20} />} />
                  <StatCard to={PATH.DEAN?.REVIEWS || '#'} label='Pending Reviews' value='6' icon={<Clock size={20} />} />
                  <StatCard to={PATH.DEAN?.APPROVED || '#'} label='Approved Parameters' value='22' icon={<CheckCircle size={20} />} />
                  <StatCard to={PATH.DEAN?.REVIEWS || '#'} label='Reviewed by Internal Assessor' value='31' icon={<ClipboardCheck size={20} />} />
                </div>

                {/* Upcoming / Active Accreditation with grouped programs & level chips inline */}
                <div className='mt-6 overflow-hidden rounded-xl border border-slate-200'>
                  <div className='flex items-center justify-between border-b border-slate-200 px-4 py-3'>
                    <h3 className='text-sm font-semibold text-slate-900'>Active Accreditation</h3>
                    <Link to={PATH.DEAN?.PROGRAMS_TO_BE_ACCREDITED || '#'} className='text-sm font-medium text-emerald-700 hover:underline'>
                      Manage
                    </Link>
                  </div>

                  <ul className='divide-y divide-slate-200'>
                    {Object.entries(grouped).map(([accredTitle, levelsMap], idx) => (
                      <li key={idx} className='group px-4 py-4'>
                        {/* Title line */}
                        <div className='mb-2 flex flex-wrap items-center gap-x-2'>
                          <p className='text-sm font-semibold text-slate-900'>{accredTitle}</p>
                        </div>

                        {/* Programs under this accreditation */}
                        <div className='space-y-5'>
                          {Object.entries(levelsMap).flatMap(([level, programs]) =>
                            programs.map((program) => {
                              const progress = PROGRESS_BY_PROGRAM[program.program]; // matches by program name

                              return (
                                <div key={program.id || program.program_uuid} className='rounded-lg border border-slate-200 p-3'>
                                  {/* Program row: Level chip next to program name */}
                                  <div className='flex flex-wrap items-center justify-between gap-3'>
                                    <div className='min-w-0'>
                                      <div className='flex flex-wrap items-center gap-2'>
                                        <span className='inline-flex items-center rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-white ring-1 ring-emerald-300/50'>
                                          {program.level}
                                        </span>
                                        <p className='truncate text-sm font-medium text-slate-900'>{program.program}</p>
                                      </div>
                                      <p className='mt-1 text-xs text-slate-500'>
                                        {program.accred_year} • {program.accred_body_name}
                                      </p>
                                    </div>

                                    <Link
                                      to={`${PATH.DEAN.PROGRAM_AREAS({ accredInfoUUID: program.accred_uuid, level: program.level.split(' ').join('-').toLowerCase(), programUUID: program.program_uuid})}`}
                                      className='shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700'
                                    >
                                      Open
                                    </Link>
                                  </div>

                                  {/* Progress section (if available) */}
                                  {progress && (
                                    <div className='mt-3 border-t border-dashed border-slate-200 pt-3'>
                                      <div className='mb-2 flex items-center justify-between'>
                                        <span className='text-[11px] font-semibold uppercase tracking-wide text-slate-700'>
                                          Progress
                                        </span>
                                        <span className='text-xs font-semibold text-slate-700'>{progress.overall}%</span>
                                      </div>
                                      <Progress value={progress.overall} ariaLabel={`${program.program} overall progress`} />

                                      {/* Areas (compact) */}
                                      <div className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3'>
                                        {progress.areas.map((area) => (
                                          <div key={area.name}>
                                            <div className='mb-1 flex items-center justify-between'>
                                              <span className='text-[11px] text-slate-600'>{area.name}</span>
                                              <span className='text-[11px] font-medium text-slate-700'>{area.percent}%</span>
                                            </div>
                                            <Progress value={area.percent} ariaLabel={`${area.name} progress`} compact />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* User Management container */}
              <section className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
                <header className='mb-4 flex items-center justify-between'>
                  <div>
                    <h2 className='text-lg font-semibold text-slate-900'>User Management</h2>
                    <p className='text-sm text-slate-600'>Manage task force teams and assignments.</p>
                  </div>
                </header>

                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>
                  <StatCard
                    to={PATH.DEAN?.TASK_FORCE || '#'}
                    label='Task Forces'
                    value={loading ? '—' : taskForcesCount}
                    icon={<Users size={20} />}
                    footer={<TeamPreview users={users} chairs={chairs} members={members} />}
                  />
                </div>
              </section>
            </div>

            {/* RIGHT: Recent Activities (sidebar) */}
            <aside className='lg:col-span-1'>
              <div className='lg:sticky lg:top-18'>
                <section className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
                  <h2 className='text-lg font-semibold text-slate-900'>Recent Activities</h2>
                  <div className='mt-2 border-t border-slate-200 pt-4'>
                    <p className='text-sm text-slate-600'>
                      {loading && 'Loading team activity…'}
                      {error && 'Failed to load activities.'}
                      {!loading && !error && 'Activity tracking feature coming soon.'}
                    </p>
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

function Progress({ value = 0, ariaLabel = 'progress', compact = false }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={compact ? 'h-2 w-full rounded-full bg-slate-100' : 'h-3 w-full rounded-full bg-slate-100'}
      role='progressbar'
      aria-label={ariaLabel}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className='h-full rounded-full bg-gradient-to-r from-emerald-600 to-amber-400'
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function TeamPreview({ users, chairs, members }) {
  if (!users?.length) return null;

  const previewList = [
    ...chairs.slice(0, 5),
    ...members.slice(0, Math.max(0, 5 - chairs.length)),
  ].slice(0, 5);

  return (
    <div className='mt-4 flex items-center'>
      <div className='flex -space-x-2'>
        {previewList.map((p, i) => {
          const src = p?.profilePicPath?.startsWith?.('http')
            ? p.profilePicPath
            : `${PROFILE_PIC_PATH}/${p?.profilePicPath || 'default-profile-picture.png'}`;
          return (
            <div
              key={p?.userId ?? p?.uuid ?? i}
              className='relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white ring-1 ring-slate-200 bg-slate-100'
              title={p?.fullName}
            >
              {p?.profilePicPath ? (
                <img src={src} alt={p?.fullName} className='h-full w-full object-cover' />
              ) : (
                <User2 size={14} className='text-slate-400' />
              )}
            </div>
          );
        })}
      </div>
      {users.length > 5 && (
        <span className='ml-3 text-xs text-slate-500'>+{users.length - 5} more</span>
      )}
    </div>
  );
}

function StatCard({ to = '#', label, value, icon, footer, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <Link
        to={to}
        className='group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm ring-emerald-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-2'
      >
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-sm text-slate-500'>{label}</p>
            <h3 className='mt-1 text-2xl font-bold text-slate-900'>{value}</h3>
          </div>
          <div className='rounded-full bg-emerald-50 p-2 text-emerald-600 ring-1 ring-emerald-200'>
            {icon}
          </div>
        </div>
        {footer}
      </Link>
    </motion.div>
  );
}

export default Dashboard;
