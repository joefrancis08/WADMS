import { useState } from 'react';
import SearchModal from '../Modals/SearchModal';
import SearchComponent from '../SearchComponent';

const ContentHeader = ({ headerIcon, headerTitle, searchClick, placeholder, condition, onClick }) => {
  const Icon = headerIcon;

  // State to control modal visibility
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleOpenModal = () => setIsSearchModalOpen(true);
  const handleCloseModal = () => setIsSearchModalOpen(false);

  return (
    <header className='relative md:sticky top-0 md:z-50 h-18 md:h-20 bg-gradient-to-r from-slate-900 to-green-700 shadow-md'>
      <div className='flex justify-between items-center p-4'>
        
        {/* Title + Icon */}
        <div className='flex items-center gap-x-2'>
          <Icon className='text-slate-100' size={36} />
          <p className='text-slate-100 max-md:text-xl md:text-3xl font-bold truncate'>
            {headerTitle}
          </p>
        </div>

        {/* Search Button */}
        <div className='flex items-center gap-x-2'>
          <SearchComponent
            placeholder='Search Task Force...'
            title='Search Task Force'
            searchClick={searchClick}
            condition={condition}
            onClick={handleOpenModal}  // Open modal when clicking search
          />
        </div>

      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <SearchModal
          placeholder={placeholder}
          onClose={handleCloseModal}  // Close modal when clicking back
        />
      )}
    </header>
  );
};

export default ContentHeader;
