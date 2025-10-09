import { LayoutDashboard } from 'lucide-react';
import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { useAuth } from '../../contexts/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';
import { Link, useNavigate } from 'react-router-dom';
import PATH from '../../constants/path';

const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const Dashboard = () => {
  const navigate = useNavigate();
  usePageTitle('Dashboard');
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <div className="p-4 bg-slate-800 min-h-screen text-slate-300">
        {/* Welcome Card */}
        <div className='bg-slate-900 rounded-lg p-6 mb-6 flex items-start justify-between shadow-lg shadow-slate-700 transition relative w-full h-50 bg-[url("/pit-bg.jpg")] bg-cover bg-center'>
          <div className='absolute inset-0 bg-black/60 rounded-lg border border-slate-700 shadow shadow-slate-800'></div>
          
          <div className='z-20'>
            <h2 className="text-2xl font-bold text-slate-100">Welcome, {user.fullName}!</h2>
            <p className="text-slate-200 mt-1">Here's your dashboard overview</p>
          </div>
          <img 
            src={`${PROFILE_PIC_PATH}/${user.profilePicPath || '/default-profile-picture.png'}`} 
            alt={`${user.fullName} Profile Picture`}
            className='h-12 w-12 object-cover rounded-full z-20' 
          />
          
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Link to={PATH.DEAN.TASK_FORCE}
            className="bg-slate-900 rounded-lg p-4 hover:shadow-lg hover:shadow-slate-700 hover:scale-102 transition">
            <p className="text-slate-400">Number of Task Forces</p>
            <h3 className="text-2xl font-bold text-slate-100">10</h3>
          </Link>

          <div className="bg-slate-900 rounded-lg p-4 hover:shadow-lg hover:shadow-slate-700 transition">
            <p className="text-slate-400">Growth Rate</p>
            <h3 className="text-2xl font-bold text-slate-100">78.4%</h3>
            <p className="text-slate-400">+12% from last month</p>
          </div>

          {/* Add more cards like Monthly Revenue, Device Type, Social Leads etc. */}
        </div>

        {/* Charts Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-lg p-4 hover:shadow-lg hover:shadow-slate-700 transition">
            <h3 className="text-slate-100 font-bold mb-2">Monthly Revenue</h3>
            <div className="h-40">
              {/* Insert chart library here */}
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 hover:shadow-lg hover:shadow-slate-700 transition">
            <h3 className="text-slate-100 font-bold mb-2">Device Type</h3>
            <div className="h-40">
              {/* Pie chart for device type */}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
