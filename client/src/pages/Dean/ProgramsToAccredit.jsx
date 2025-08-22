import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { ClipboardList, NotepadText } from 'lucide-react';
import SearchComponent from '../../components/SearchComponent';
import { useState } from 'react';
import ContentHeader from '../../components/Dean/ContentHeader';

const ProgramsToAccredit = () => {

  const [searchClick, setSearchClick] = useState(false);

  const handleSearchClick = () => {
    setSearchClick(!searchClick);
  }
  const dummyData = {
    programName: 'PhD-TM'
  };

  return (
    <AdminLayout>
      <div className='flex-1 p-0 space-y-3'>
        {/* Header */}
        <ContentHeader 
          headerIcon={NotepadText}
          headerTitle='Programs Under Accreditation'
          searchClick={searchClick}
          placeholder='Search program...'
          condition={true}
        />
      </div>
    </AdminLayout>
  );
};

export default ProgramsToAccredit;
