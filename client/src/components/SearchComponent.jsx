import { Search } from 'lucide-react';

const SearchComponent = ({ placeholder, title, searchClick, condition, onClick, options = {} }) => {

  return (
    <div className='relative flex items-center justify-center gap-x-2 h-0'>
      {searchClick && (
        <>
          <input
            name='search-bar'
            className='max-md:hidden bg-white to-white px-5 pl-12 text-md mt-1 max-sm:w-60 w-100 border rounded-full p-3 border-slate-300 focus:outline-none focus:ring-1 focus:ring-green-600 shadow focus:shadow-lg transition-all duration-300 text-slate-700' 
            type='text' 
            placeholder={placeholder} 
          />
          <Search className='max-md:hidden absolute -top-2.5 left-4 text-slate-400' />
        </>
      )}
      {/* Render search button only if there are data to search */}
      {(condition) && (
        <button
          title={title}
          onClick={onClick}
          className='flex p-2 rounded-full hover:bg-green-600 items-center justify-center cursor-pointer active:opacity-50'
        >
          <Search 
            className='text-slate-100 h-8 w-8 max-md:h-7 max-md:w-7' 
          />
        </button>
      )}
    </div>
  );
};

export default SearchComponent;
