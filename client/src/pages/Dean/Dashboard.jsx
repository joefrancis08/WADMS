import AdminLayout from '../../components/Layout/Dean/DeanLayout';

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className='flex-1 bg-sky-300 border-gray-950'>
        <div>
          <p>Hello, I'm an admin</p>
        </div>
      </div>
    </AdminLayout>
    
  );
};

export default Dashboard;
