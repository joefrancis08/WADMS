const VerifiedUserSkeletonLoader = () => {
  // create chair skeletons
  const chairSkeletons = Array.from({ length: 2 }).map((_, i) => (
    <div
      key={`chair-${i}`}
      className="relative w-45 sm:w-50 md:w-55 lg:w-60 xl:w-65 p-4 bg-gray-50 rounded-xl border border-slate-200 shadow animate-pulse"
    >
      {/* Ellipsis placeholder */}
      <div className="absolute top-0 right-0 p-2 w-6 h-6 bg-gray-300 rounded-bl-xl rounded-tr-lg"></div>

      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-28 h-28 bg-gray-300 rounded-full mb-3"></div>
        {/* Name */}
        <div className="w-36 h-5 bg-gray-300 rounded-full mb-2"></div>
        {/* Role */}
        <div className="w-28 h-4 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  ));

  // create member skeletons
  const memberSkeletons = Array.from({ length: 6 }).map((_, i) => (
    <div
      key={`member-${i}`}
      className="relative w-40 sm:w-44 md:w-48 lg:w-52 xl:w-56 p-4 bg-gray-50 rounded-xl border border-slate-200 shadow animate-pulse"
    >
      {/* Ellipsis placeholder */}
      <div className="absolute top-0 right-0 p-2 w-6 h-6 bg-gray-300 rounded-bl-xl rounded-tr-lg"></div>

      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-3"></div>
        {/* Name */}
        <div className="w-32 h-5 bg-gray-300 rounded-full mb-2"></div>
        {/* Role */}
        <div className="w-24 h-4 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  ));

  return (
    <div className="px-3 pb-4 space-y-6">
      {/* Chair Section */}
      <div>
        <div className="flex justify-center">
          <div className="w-full lg:w-[75%] p-6 bg-gray-300 rounded-md mb-3 animate-pulse"></div>
        </div>
        <div className="flex flex-wrap gap-10 pb-6 justify-center">
          {chairSkeletons}
        </div>
      </div>

      {/* Member Section */}
      <div>
        <div className="flex justify-center">
          <div className="w-full p-6 bg-gray-300 rounded-md mb-3 animate-pulse"></div>
        </div>
        <div className="flex flex-wrap gap-10 pb-6 justify-center">
          {memberSkeletons}
        </div>
      </div>
    </div>
  );
};

export default VerifiedUserSkeletonLoader;
