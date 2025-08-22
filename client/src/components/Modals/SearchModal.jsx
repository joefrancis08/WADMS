import { ArrowLeft, Search } from "lucide-react";

const SearchModal = ({ placeholder, onClose }) => {
  const handleContentClick = (e) => {
    e.stopPropagation();
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-hidden">
      <div onClick={handleContentClick} className="w-full h-auto max-w-md m-10 bg-slate-100 rounded shadow-2xl py-6 animate-fadeIn">
        <div className="flex flex-col px-2">
          <div className="flex justify-between mb-6">
            <button onClick={onClose} className="hover:rounded-full hover:bg-slate-200 p-3 cursor-pointer">
              <ArrowLeft className="h-7 w-7 text-gray-700" />
            </button>
            <div className="relative flex items-center w-full">
              <input
                name="search-bar"
                type="text"
                placeholder={placeholder}
                className="w-full pl-12 p-3 mr-10 text-md border rounded-full border-slate-600 focus:outline-none focus:ring-1 focus:ring-green-600 shadow transition-all duration-300 text-slate-700"
              />
              <Search className="absolute left-4 top-3 w-6 h-6 text-slate-600" />
            </div>
          </div>
          <hr className="text-slate-400"></hr>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
