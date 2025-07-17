export const PendingSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md animate-pulse">
        {/* Logo placeholder */}
        <div className="flex justify-center mb-6">
          <div className="w-24 md:w-32 h-24 bg-gray-300 rounded-full"></div>
        </div>

        {/* Content box skeleton */}
        <div className="content border-2 border-gray-200 rounded-3xl pt-4">
          {/* Title */}
          <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto mb-4"></div>

          {/* Paragraph lines (matching mt-4 m-2 and pb-4 spacing) */}
          <div className="mt-4 m-2 h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="mt-4 m-2 h-4 bg-gray-200 rounded w-full mx-auto"></div>
          <div className="mt-4 m-2 h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
          <div className="mt-4 m-2 h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          <div className="mt-4 m-2 h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
          <div className="mt-4 m-2 h-4 bg-gray-200 rounded w-2/3 mx-auto pb-4"></div>
        </div>
      </div>
    </div>
  );
};

export default PendingSkeleton;
