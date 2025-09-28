import { LayoutDashboard } from 'lucide-react';
import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { useAuth } from '../../contexts/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';

const Dashboard = () => {
  usePageTitle('Dashboard | WDMS');
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <div className="p-4 bg-slate-800 min-h-screen text-slate-300">
        {/* Welcome Card */}
        <div className="bg-slate-900 rounded-lg p-6 mb-6 flex items-center justify-between hover:shadow-lg hover:shadow-slate-700 transition">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Welcome back, {user.fullName}!</h2>
            <p className="text-slate-400 mt-1">Here's your dashboard overview</p>
          </div>
          <div>
            <LayoutDashboard className="text-slate-100" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-slate-900 rounded-lg p-4 hover:shadow-lg hover:shadow-slate-700 transition">
            <p className="text-slate-400">Today's Sales</p>
            <h3 className="text-2xl font-bold text-slate-100">$65.4K</h3>
            <p className="text-slate-400">+5.4% from last week</p>
          </div>

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
