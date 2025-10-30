import React from 'react'
import IALayout from '../../components/Layout/Internal Assessor/IALayout';
import { ChevronDown } from 'lucide-react';

const CGSPage = () => {
  return (
    <IALayout>
      <div>
        <div className='relative flex flex-col items-center justify-center bg-[url("/cgs-bg-4.jpg")] bg-cover bg-center h-147 w-full'>
          <div className='absolute inset-0 bg-black/65'></div>
          <div className='flex flex-col items-center justify-center z-20'>
            <h1 className='leading-20 tracking-wide text-center text-white text-7xl font-bold max-w-[800px]'>
              COLLEGE OF GRADUATE STUDIES
            </h1>
            <hr className='border-3 border-green-600 w-100 my-6'></hr>
            <h2 className='text-yellow-400 text-xl font-bold'>
              {'Level I'.toLocaleUpperCase()} &bull; {'Level III'.toLocaleUpperCase()}
            </h2>
          </div>

          {/* Scroll down button */}
          <button className='absolute bottom-2 text-white z-20 hover:bg-slate-200/20 p-2 rounded-full cursor-pointer active:scale-95 transition'>
            <ChevronDown size={32}/>
          </button>
        </div>
        {/* Programs and Areas */}
        <div className='flex flex-col py-4 mt-8 w-full h-156'>
          <div className='flex flex-col items-center justify-center'>
            <h2 className='text-green-700 text-3xl font-extrabold tracking-wide'>
              {'Programs To Be Accredited'.toUpperCase()}
            </h2>
            <hr className='border-3 border-green-600 w-[60%] my-6'></hr>
          </div>
          <div className='flex flex-wrap items-center justify-center gap-3 p-4'>
            <div className='w-[40%] h-50 bg-slate-200 rounded-lg cursor-pointer hover:shadow-md transition shadow-slate-400/50'></div>
            <div className='w-[40%] h-50 bg-slate-200 rounded-lg cursor-pointer hover:shadow-md transition shadow-slate-400/50'></div>
            <div className='w-[40%] h-50 bg-slate-200 rounded-lg cursor-pointer hover:shadow-md transition shadow-slate-400/50'></div>
            <div className='w-[40%] h-50 bg-slate-200 rounded-lg cursor-pointer hover:shadow-md transition shadow-slate-400/50'></div>
          </div>
        </div>
      </div>
    </IALayout>
  );
};

export default CGSPage;
