import { Link } from 'react-router-dom';
import { ArrowLeft, AtSign, LockKeyhole } from 'lucide-react';
import { useRegister } from '../hooks/useRegister';
import SubmitButton from '../components/Auth/SubmitButton';
import LoadSpinner from '../components/Loaders/LoadSpinner';
import Field from '../components/Form/Auth/Field';
import { useState, useEffect } from 'react';
import OTPField from '../components/Auth/OTPField';
import usePageTitle from '../hooks/usePageTitle';

const Login = () => {
  const { formValues, formErrors, refs, passwordVisibility, loading, actions } = useRegister();

  const { values } = formValues;
  const { errors } = formErrors;
  const { emailRef, passwordRef } = refs;
  const { isPasswordVisible, togglePasswordVisibility } = passwordVisibility;
  const { isLoading } = loading;
  const { handleChange } = actions;

  const [nextStep, setNextStep] = useState(1);

  // 🕒Timer states for OTP
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [otpExpired, setOtpExpired] = useState(false);

  useEffect(() => {
    let timer;
    if (nextStep === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    if (timeLeft <= 0) {
      setOtpExpired(true);
    }
    return () => clearInterval(timer);
  }, [timeLeft, nextStep]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call backend to verify credentials and send OTP
    setNextStep(2);
    setTimeLeft(5 * 60); // reset timer
    setOtpExpired(false);
  };

  const handleResendOtp = () => {
    setTimeLeft(5 * 60);
    setOtpExpired(false);
    // 🔑 Call backend to send new OTP here
    alert('New OTP sent!');
  };

  usePageTitle('Login');
  
  return (
    <div className='flex items-center justify-center w-full h-dvh bg-[url("/pit-bg.jpg")] bg-cover bg-center'>
      <div className='absolute inset-0 bg-black/60'></div>
      <div className="bg-slate-200 shadow-md shadow-slate-600 p-8 z-20">
        <div className='flex gap-x-15'>
          <div className='flex flex-col items-center justify-between'>
            <div className="flex justify-center items-center p-5 rounded-md bg-slate-100 shadow-md">
              <img src="/pit-logo-outlined.png" alt="Logo" className="h-14 -ml-3 mr-3" />
              <div className='flex flex-col items-center justify-center'>
                <p className='max-w-[300px]'>Palompon Institute of Technology</p>
                <p className='max-w-[300px]'>College of Graduate Studies</p>
              </div>
              <img src="/cgs-logo.png" alt="Logo" className="h-14 -mr-5 ml-3" />
            </div>
            <h2 className="text-green-700 text-2xl max-w-[300px] font-bold text-center">
              Document Management System
            </h2>
            <div className='w-[50%] h-0.5 bg-slate-400'></div>
            <div className='flex items-center justify-center w-full'>
              <p className='max-w-[300px] text-center'>
                {nextStep === 1
                  ? `After verifying your credentials, you'll be redirected to One-Time Password (OTP) Verification.`
                  : `After successful OTP verification, you can access the system based on your role set by administrator.`
                }
              </p>
            </div>
          </div>

          {/* Right Side Form */}
          <div className='bg-slate-100 p-8 rounded-md shadow-md shadow-slate-300 min-w-100 min-h-90 max-w-100 max-h-90 relative'>
            {nextStep === 1 ? (
              <>
                <h2 className="reg-form-title">LOGIN</h2>
                <form onSubmit={handleSubmit} className="space-y-2">
                  <Field
                    autoFocus={true}
                    icon={<AtSign color='gray' size={24} />}
                    ref={emailRef}
                    name='email'
                    placeholder='Email Address'
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                  <Field
                    icon={<LockKeyhole color='gray' size={24} />}
                    ref={passwordRef}
                    name='password'
                    placeholder='Password'
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                    isPassword={true}
                    isPasswordVisible={isPasswordVisible}
                    togglePasswordVisibility={togglePasswordVisibility}
                  />
                  <div className='flex justify-center'>
                    <SubmitButton disabled={isLoading}>
                      {isLoading 
                        ? <LoadSpinner height={'h-5'} width={'w-5'}>Verifying</LoadSpinner> 
                        : 'Login'
                      }
                    </SubmitButton>
                  </div>
                  <div>
                    <p className="text-center mt-4">
                      No account? {' '}
                      <Link to="/register" className="text-green-700 hover:underline">Register</Link>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setNextStep(1);
                    setTimeLeft(5 * 60);
                    setOtpExpired(false);
                  }} 
                  title='Back to Login'
                  className='absolute top-3 left-1 flex flex-row justify-center items-center gap-x-2 py-1 px-3 hover:bg-slate-200 rounded-full cursor-pointer text-slate-600'
                >
                  <ArrowLeft />
                  Back
                </button>
                <h2 className="reg-form-title">OTP Verification</h2>
                <p className='text-center'>
                  Enter the 6-digit code we've sent to {' '}
                  <span className='font-semibold'>{values.email || "your email"}</span>
                </p>
                <div className='flex gap-x-4 py-4 items-center justify-center mb-4'>
                  {[...Array(6)].map((_, i) => <OTPField key={i} autoFocus={i===0} />)}
                </div>
                <div className='flex flex-col justify-center items-center'>
                  {!otpExpired ? (
                    <>
                      <SubmitButton>
                        <p>Verify OTP</p>
                      </SubmitButton>
                      <p className='mt-4 text-sm'>
                        Code will expire in <b>{formatTime(timeLeft)}</b>.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className='text-red-600 font-semibold mb-3'>OTP expired!</p>
                      <button
                        onClick={handleResendOtp}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Resend
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
