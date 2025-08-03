const VerifiedUserSkeletonLoader = () => {
  const skeletonCards = [];
  for (let i = 0; i < 20; i++) {
    skeletonCards.push(
      <div className='relative bg-gray-50 p-4 rounded-xl border border-gray-100 shadow  transition duration-300 hover:shadow-xl active:shadow cursor-pointer animate-pulse'>
        <div className='flex flex-col items-center text-center'>
          <div className='w-24 h-24 bg-gray-400 rounded-full mb-2'></div>
          <div className='w-40 h-5 bg-gray-400 rounded-full mb-2'></div>
          <div className='w-30 h-5 bg-gray-400 rounded-full mb-2'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='px-3 pb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6'>
      {skeletonCards.map((card, index) => (
        <div key={index}>{card}</div>
      ))}
    </div>
  )
}

export default VerifiedUserSkeletonLoader;
