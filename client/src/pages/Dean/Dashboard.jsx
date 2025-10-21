import { motion } from 'framer-motion'
import { LayoutDashboard, Users, FileText, CheckCircle, Clock, User2 } from 'lucide-react'
import AdminLayout from '../../components/Layout/Dean/DeanLayout'
import { useAuth } from '../../contexts/AuthContext'
import usePageTitle from '../../hooks/usePageTitle'
import { Link } from 'react-router-dom'
import PATH from '../../constants/path'
import { useUsersBy } from '../../hooks/fetch-react-query/useUsers'
import { USER_ROLES } from '../../constants/user'

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH
const { TASK_FORCE_CHAIR, TASK_FORCE_MEMBER } = USER_ROLES

const Dashboard = () => {
  const { users = [], loading, error } = useUsersBy({ role: [TASK_FORCE_CHAIR, TASK_FORCE_MEMBER] })
  const { user, isLoading } = useAuth()
  usePageTitle('Dashboard')

  // Derive counts (simplified and accurate)
  const chairs = users?.filter(u => u.role === TASK_FORCE_CHAIR) ?? []
  const members = users?.filter(u => u.role === TASK_FORCE_MEMBER) ?? []

  // Use total users as task forces count (accurate for current structure)
  const taskForcesCount = users.length

  const chairsCount = chairs.length
  const membersCount = members.length

  if (isLoading) return <p className='text-center text-slate-400 mt-10'>Loading...</p>

  return (
    <AdminLayout>
      <div className='relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 p-8'>
        {/* Subtle background texture */}
        <div className='absolute inset-0 bg-[url("/pit-bg.jpg")] bg-cover bg-center opacity-[0.07]'></div>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='relative flex items-center justify-between bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-lg mb-10'
        >
          <div>
            <h1 className='text-2xl font-bold text-white flex items-center gap-3'>
              <LayoutDashboard size={24} className='text-green-400' />
              Welcome, {user.fullName.split(' ')[0]}!
            </h1>
            <p className='text-slate-400 mt-1 text-sm'>
              Manage your accreditation documents and monitor progress with ease.
            </p>
          </div>

          <div className='relative'>
            <img
              src={
                user?.profilePicPath?.startsWith('http')
                  ? user.profilePicPath
                  : `${PROFILE_PIC_PATH}/${user.profilePicPath || 'default-profile-picture.png'}`
              }
              alt={`${user.fullName} Profile`}
              className='h-14 w-14 rounded-full object-cover border border-green-500 shadow-md'
            />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6'>
          {/* Task Forces card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to={PATH.DEAN.TASK_FORCE}
              className='group relative block rounded-xl bg-slate-800/60 border border-slate-700 hover:border-green-400 p-5 transition-all hover:scale-[1.02] shadow-md hover:shadow-green-500/10'
            >
              <div className='flex justify-between items-center'>
                <div>
                  <p className='text-sm text-slate-400'>Task Forces</p>
                  <h3 className='text-2xl font-bold text-white'>
                    {loading ? '—' : taskForcesCount}
                  </h3>
                  <p className='text-xs mt-1 text-slate-400'>
                    <span className='text-green-400 font-semibold'>
                      {loading ? '—' : chairsCount}
                    </span>{' '}
                    chairs •{' '}
                    <span className='text-green-400 font-semibold'>
                      {loading ? '—' : membersCount}
                    </span>{' '}
                    members
                  </p>
                </div>
                <div className='text-green-400 group-hover:text-green-300 transition'>
                  <Users size={22} />
                </div>
              </div>

              {/* Task Force Preview (top 3) */}
              {users.length > 0 && (
                <div className='mt-4 flex -space-x-2 items-center'>
                  {(() => {
                    // Combine chairs first, then members as fallback
                    const previewList = [
                      ...chairs.slice(0, 5),
                      ...members.slice(0, Math.max(0, 3 - chairs.length))
                    ].slice(0, 5)

                    return previewList.map((p, i) => {
                      const src = p?.profilePicPath?.startsWith?.('http')
                        ? p.profilePicPath
                        : `${PROFILE_PIC_PATH}/${p.profilePicPath || 'default-profile-picture.png'}`
                      return (
                        <div
                          key={p.userId ?? p.uuid ?? i}
                          className='relative h-8 w-8 rounded-full border-2 border-slate-800 overflow-hidden bg-slate-700 flex items-center justify-center'
                        >
                          {p.profilePicPath ? (
                            <img src={src} alt={p.fullName} className='h-full w-full object-cover' />
                          ) : (
                            <User2 size={16} className='text-slate-300' />
                          )}
                        </div>
                      )
                    })
                  })()}
                  {/* Correct “+x more” logic */}
                  {users.length > 3 && (
                    <span className='ml-3 text-xs text-slate-400'>
                      +{users.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </Link>
          </motion.div>

          {/* Documents */}
          <StatCard
            delay={0.1}
            label='Documents'
            value='48'
            icon={<FileText size={22} />}
            link={PATH.DEAN.DOCUMENTS}
          />

          {/* Pending Reviews */}
          <StatCard
            delay={0.2}
            label='Pending Reviews'
            value='6'
            icon={<Clock size={22} />}
            link={PATH.DEAN.REVIEWS}
          />

          {/* Approved Parameters */}
          <StatCard
            delay={0.3}
            label='Approved Parameters'
            value='22'
            icon={<CheckCircle size={22} />}
            link={PATH.DEAN.APPROVED}
          />
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='mt-12 bg-slate-900/50 border border-slate-700 rounded-2xl p-6 shadow-md'
        >
          <h2 className='text-lg font-semibold text-green-400 mb-2'>Recent Activities</h2>
          {loading && <p className='text-slate-400 text-sm'>Loading team activity…</p>}
          {error && <p className='text-red-400 text-sm'>Failed to load activities.</p>}
          {!loading && !error && (
            <p className='text-slate-400 text-sm italic'>Activity tracking feature coming soon.</p>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}

// Small helper for the other stat cards
function StatCard({ label, value, icon, link, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link
        to={link}
        className='group relative block rounded-xl bg-slate-800/60 border border-slate-700 hover:border-green-400 p-5 transition-all hover:scale-[1.02] shadow-md hover:shadow-green-500/10'
      >
        <div className='flex justify-between items-center'>
          <div>
            <p className='text-sm text-slate-400'>{label}</p>
            <h3 className='text-2xl font-bold text-white'>{value}</h3>
          </div>
          <div className='text-green-400 group-hover:text-green-300 transition'>{icon}</div>
        </div>
      </Link>
    </motion.div>
  )
}

export default Dashboard
