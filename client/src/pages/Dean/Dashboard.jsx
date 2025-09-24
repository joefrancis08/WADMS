import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { useAuth } from '../../contexts/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';

const Dashboard = () => {
  usePageTitle('Dashboard | WDMS');
  const {user, isLoading} = useAuth();
  return (
    <AdminLayout>
      <div>
        <div>
          <p>Welcome, {user.fullName}!</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
