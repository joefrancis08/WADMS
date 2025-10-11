import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FileText, CheckCircle, Clock } from 'lucide-react';
import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { useAuth } from '../../contexts/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import PATH from '../../constants/path';

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const Dashboard = () => {
  usePageTitle('Dashboard');
  const { user, isLoading } = useAuth();

  if (isLoading) return <p className="text-center text-slate-400 mt-10">Loading...</p>;

  return (
    <AdminLayout>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 p-8">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[url('/pit-bg.jpg')] bg-cover bg-center opacity-[0.07]"></div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative flex items-center justify-between bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-lg mb-10"
        >
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <LayoutDashboard size={24} className="text-green-400" />
              Welcome, {user.fullName.split(' ')[0]}!
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Manage your accreditation documents and monitor progress with ease.
            </p>
          </div>

          <div className="relative">
            <img
              src={
                user?.profilePicPath?.startsWith('http')
                  ? user.profilePicPath
                  : `${PROFILE_PIC_PATH}/${user.profilePicPath || 'default-profile-picture.png'}`
              }
              alt={`${user.fullName} Profile`}
              className="h-14 w-14 rounded-full object-cover border border-green-500 shadow-md"
            />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              label: 'Task Forces',
              value: '10',
              icon: <Users size={22} />,
              link: PATH.DEAN.TASK_FORCE,
            },
            {
              label: 'Documents',
              value: '48',
              icon: <FileText size={22} />,
              link: PATH.DEAN.DOCUMENTS,
            },
            {
              label: 'Pending Reviews',
              value: '6',
              icon: <Clock size={22} />,
              link: PATH.DEAN.REVIEWS,
            },
            {
              label: 'Approved Parameters',
              value: '22',
              icon: <CheckCircle size={22} />,
              link: PATH.DEAN.APPROVED,
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <Link
                to={card.link}
                className="group relative block rounded-xl bg-slate-800/60 border border-slate-700 hover:border-green-400 p-5 transition-all hover:scale-[1.02] shadow-md hover:shadow-green-500/10"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">{card.label}</p>
                    <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                  </div>
                  <div className="text-green-400 group-hover:text-green-300 transition">
                    {card.icon}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-slate-900/50 border border-slate-700 rounded-2xl p-6 shadow-md"
        >
          <h2 className="text-lg font-semibold text-green-400 mb-2">Recent Activities</h2>
          <p className="text-slate-400 text-sm italic">
            Activity tracking feature coming soon.
          </p>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
