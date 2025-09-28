import { AlertCircle, Check, CircleCheck, CircleX, Info, Mail} from 'lucide-react';
import { useState } from 'react';
import Popover from '../components/Popover';
import SubmitButton from '../components/Auth/SubmitButton';
import { emailRegex } from '../utils/regEx';
import { confirmEmail } from '../api-calls/Users/userAPI';

const EmailConfirmation = () => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const [emailValue, setEmailValue] = useState('');
  const [storedEmail, setStoredEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const [notRegistered, setNotRegistered] = useState(false);
  
  const [showInfo, setShowInfo] = useState(false);

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  const handleChange = (e) => {
    e.stopPropagation();
    setEmailValue(e.target.value);
    setStoredEmail('');
    setNotRegistered(false);
    setRegistered(false);
    setError(false);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const res = await confirmEmail(emailValue);
      if (res.data.notRegistered) {
        setNotRegistered(true);
        setRegistered(false);
        setStoredEmail(emailValue);
        return;
      } else {
        setRegistered(true);
        setNotRegistered(false);

        setStoredEmail(emailValue);
        setEmailValue('');

        setTimeout(() => {
          setRegistered(false);
        }, 8000)
      
      }

    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        setError(true);
      }

      setStoredEmail(emailValue);

    } finally {
      setLoading(false);
    }

  };


  return (
    <>
      <div className='relative flex items-center justify-center bg-gradient-to-r from-slate-900 to-green-600 w-full max-md:p-2 h-dvh'>
        {error && (
          <div className='flex items-start justify-center absolute top-4 max-md:top-8 left-1/2 animate-slide-up'>
            <p className='flex gap-x-4 items-center justify-center text-md font-medium text-red-600 bg-gradient-to-r from-slate-200 to-white py-2 w-100 px-4 rounded-md'>
              <CircleX className='text-red-500 font-bold right-2' size={64}/>
              Network error. Please check your internet connection.
            </p>
          </div>
        )}
        {registered && (
          <div className='flex items-start justify-center absolute top-4 max-md:top-8 left-1/2 animate-slide-up'>
            <p className='flex gap-x-4 items-center justify-center text-md font-medium text-green-600 bg-gradient-to-r from-slate-200 to-white py-2 w-100 px-4 rounded-md'>
              <CircleCheck className='text-green-500 font-bold right-2' size={64}/>
              Access link was sent to {storedEmail}
            </p>
          </div>
        )}
        <div className='flex flex-col items-center w-100 h-100 max-md:w-100 max-md:h-100 bg-gradient-to-r from-slate-200 to-white rounded shadow-lg'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col items-center justify-center pt-3'>
              <img className='w-24 h-auto' src="/cgs-logo.png" alt="CGS Logo" />
              <p className='text-green-700 text-md font-bold'>PIT-College of Graduate Studies</p>
            </div>
            <hr className='text-slate-400 w-1/2 mx-auto pt-3'></hr>
            <div className='flex flex-col items-center justify-center'>
              <Mail className='text-slate-500 mt-2' size={32}/>
              <p className='text-center text-xl font-bold text-green-600'>Email Confirmation</p>
            </div>
            <div className=' w-80 relative'>
              <input 
                className={`w-80 border rounded-md transition-all shadow focus:outline-1 py-3 px-4 ${notRegistered 
                  ? 'focus:outline-red-500 border-red-300 text-red-400' 
                  : 'focus:outline-green-500 border-slate-400 text-slate-800' }`} 
                name='email'
                placeholder='Enter your email...'
                autoComplete='off'
                value={emailValue}
                onFocus={() => setNotRegistered(false)}
                onChange={(e) => handleChange(e)}
              />
              {notRegistered && (
                <>
                  <AlertCircle className='absolute top-3.5 text-red-500 right-2' size={20}/>
                  <p className='text-[12.5px] text-wrap h-0 font-medium text-red-500'>
                    The email provided is not registered for accreditation.
                  </p>
                </>
              )}
            </div>
            <div className='flex items-center justify-center pt-4'>
              <SubmitButton
                onClick={handleConfirm}
                disabled={error || loading || storedEmail || !emailRegex.test(emailValue)}
                children={loading ? 'Confirming...' : 'Confirm'}
              />
            </div>
          </div>
        </div>
        <div className='absolute bottom-4 right-6'>
          <button 
            title='About this page' 
            onClick={handleInfoClick} 
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
                  This page is for accreditation use only. You need to provide your registered email then we'll send your access link to the email you provide. If your email is not registered, please contact the CGS Dean for assistance.
                </p>
              }
            />
          )}
        </div>
      </div>
    </>
    
  )
}

export default EmailConfirmation;

