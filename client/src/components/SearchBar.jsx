import Icons from "../assets/icons";

const SearchBar = ({ placeholder, type}) => {
  return (
    <div className='relative'>
      <img className='absolute inset-y-9.5 inset-x-8 h-8 w-8 opacity-50' src={Icons.searchIconDark} alt='' />
      <input 
        className='pl-12 text-md mt-1 w-1/2 border rounded-full p-3 border-gray-400 focus:outline-none focus:ring-1 focus:ring-green-700 shadow-inner focus:shadow-lg' 
        type='text'
        placeholder={placeholder} 
      />
    </div>
  );
};

export default SearchBar;

