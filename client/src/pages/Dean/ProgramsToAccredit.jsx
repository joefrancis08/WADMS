import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { ClipboardList } from 'lucide-react';

const ProgramsToAccredit = () => {
  return (
    <AdminLayout>
      <div className='flex-1 p-0 space-y-3'>
        {/* Header */}
        <header className='max-md:pt-2 md:sticky top-0 md:z-1 bg-gradient-to-r from-slate-900 to-green-700 shadow-md'>
          <div className='flex justify-between items-center p-5'>
            <div className='relative flex items-center'>
              <ClipboardList className='text-slate-100' size={36} color='white'/>
              <p className='ml-2 mt-1 text-slate-100 text-3xl font-bold'>
                Programs Under Accreditation
              </p>
            </div>
          </div>
        </header>
      </div>
    </AdminLayout>
  );
};

export default ProgramsToAccredit;
