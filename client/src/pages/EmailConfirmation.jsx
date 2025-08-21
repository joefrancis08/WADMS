import { Info } from 'lucide-react';
import React, { useState } from 'react';
import Popover from '../components/Popover';
import SubmitButton from '../components/Auth/SubmitButton';
import { emailRegex } from '../utils/regEx';

const EmailConfirmation = () => {
  const [emailValue, setEmailValue] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  const handleChange = (e) => {
    e.stopPropagation();
    setEmailValue(e.target.value);
  };

  const handleConfirm = () => {
    
  }

  return (
    <div className='relative flex items-center justify-center bg-slate-500 w-full h-dvh'>
      <div className='flex flex-col items-center w-100 h-100 max-md:w-100 max-md:h-100 bg-white rounded shadow-lg'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-center justify-center pt-4'>
            <img className='w-24 h-auto' src="/CGS_Logo.png" alt="CGS Logo" />
            <p className='text-slate-700 text-lg'>PIT-College of Graduate Studies</p>
          </div>
          <hr className='text-slate-400 w-1/2 mx-auto pt-4'></hr>
          <div>
            <p className='text-center text-xl font-medium'>Email Confirmation</p>
          </div>
          <div>
            <input 
              className='w-80 border text-slate-800 border-slate-400 rounded-md transition-all shadow focus:outline-1 focus:outline-green-500 py-3 px-4' 
              name='email'
              placeholder='Enter your email...'
              autoComplete='off'
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className='flex items-center justify-center'>
            <SubmitButton 
              disabled={!emailRegex.test(emailValue)}
              children={'Confirm'}
            />
          </div>
        </div>
      </div>
      <div className='absolute bottom-4 right-6'>
        <button 
          title='About this page' 
          onClick={handleInfoClick} 
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
        >
          <Info className='text-white hover:opacity-70 transition-all cursor-pointer' size={28} />
        </button>
        {showInfo && (
          <Popover 
            handleInfoClick={handleInfoClick}
            position='bottom-10 right-2'
            content={
              <p className='text-slate-100 text-sm p-2 transition-all duration-1000'>
                This page is for accreditation use only. If your email is not registered, please contact the CGS Dean for assistance.
              </p>
            }
          />
        )}
      </div>
    </div>
  )
}

export default EmailConfirmation;

