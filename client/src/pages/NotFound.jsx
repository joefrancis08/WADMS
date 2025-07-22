import React from 'react';
import { notFoundIcon } from '../assets/icons';

const NotFound = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='w-full max-w-md bg-white px-4 py-6 sm:px-6 md:px-8 rounded-lg shadow-md text-center'>
        <div className='flex justify-center mb-6'>
          <img src={notFoundIcon} alt="Not Found" className="w-40 sm:w-60 md:w-72 h-auto" />
        </div>
        <h1 className="text-4xl text-[#f36060] font-bold">Page Not Found</h1>
        <p className="mt-4 text-gray-600">Sorry, the page you're looking for does not exist.</p>
        <div className='mt-6'>
          <a href="/" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
