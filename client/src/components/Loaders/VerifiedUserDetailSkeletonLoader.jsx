import React from 'react'

const VerifiedUserDetailSkeletonLoader = () => {
  return (
    <div className='flex flex-col w-full h-full bg-gray-50 p-4 rounded-xl border border-gray-200 transition-all animate-pulse duration-500 shadow hover:shadow-lg hover:shadow-gray-300 hover:drop-shadow-sm'>
      <div className='flex justify-end p-2 gap-4 md:p-4'>
        <button>
          
        </button>
        <button>
          
        </button>
      </div>
      <div className='flex max-lg:flex-col items-center px-5 pb-6 lg:flex-row md:px-20 md:pb-20 justify-evenly'>
        <div className='w-40 md:w-65 lg:w-70 h-40 md:h-65 lg:h-70 rounded-full shadow-md bg-gray-400 mb-8 lg:mb-0'></div>
        <div className='flex flex-col items-center gap-y-2'>
          <div className='flex items-center w-90 rounded-full h-auto p-6 bg-gray-400'></div>
          <div className='flex items-center w-50 rounded-full h-auto p-4 bg-gray-400'></div>
        </div>
      </div>
      <hr className='w-[50%] m-auto text-gray-400'></hr>
      <div className='px-5 py-5'>
        <div className='flex flex-col py-5 justify-center lg:flex-row items-center max-lg:gap-6 lg:justify-between'>
          <div className='flex max-md:flex-col max-md:gap-2 items-center'>
            <div className='bg-gray-400 w-10 rounded-full p-3'></div>
            <div className='ml-2 bg-gray-400 max-md:w-50 lg:w-80 rounded-full p-3'></div>
          </div>
          <div className='flex max-md:flex-col items-center'>
            <div className='bg-gray-400 w-10 rounded-full p-3'></div>
            <div className='ml-2 bg-gray-400 max-md:w-50 lg:w-80 rounded-full p-3'></div>
          </div>
        </div>
      </div>
      <hr className='border-1 text-gray-400'></hr>
    </div>
  )
}

export default VerifiedUserDetailSkeletonLoader;
