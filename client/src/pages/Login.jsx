import { Link } from 'react-router-dom';
import { ArrowLeft, AtSign, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import SubmitButton from '../components/Auth/SubmitButton';
import Field from '../components/Form/Auth/Field';
import OTPField from '../components/Auth/OTPField';
import useLogin from '../hooks/useLogin';

const Login = () => {
  const { refs, datas, utils, handlers } = useLogin();

  const { emailRef, passwordRef } = refs;
  const { formatTime } = utils;
  const {
    values,
    isLoading, 
    errors,  
    isPasswordVisible, 
    togglePasswordVisibility,
    tempUser,
    nextStep,
    otp,
    timeLeft,
    otpExpired
  } = datas;

  const { 
    handleChange,
    handleSubmit,
    handleBackToLogin,
    handleOtpChange,
    handleVerifyOtp,
    handleResendOtp
  } = handlers;
  
  return (
    <div className='flex items-center justify-center w-full h-dvh bg-[url("/pit-bg-1.jpg")] bg-cover bg-center'>
      <div className='absolute inset-0 bg-black/60'></div>
      <div className="bg-slate-200 shadow-md shadow-slate-700 p-8 z-20 rounded">
        <div className='flex gap-x-15'>
          <div className='flex flex-col items-start'>
            <div className="relative flex justify-center items-center p-8 h-20 w-20">
              <img src="/pit-logo-outlined.png" alt="Logo" className="h-14 absolute top-0 left-0 z-10" />
              <img src="/cgs-logo.png" alt="Logo" className="h-14 -mr-10 absolute bottom-6 right-0" />
            </div>
            <h2 className="text-green-700 text-2xl max-w-[300px] font-bold">
              Document Management System
            </h2>
            <div className='w-[50%] h-0.5 bg-slate-400 my-15'></div>
            <div className='flex items-center justify-center w-full'>
              <p className='max-w-[300px]'>
                {nextStep === 1
                  ? `After verifying your credentials, you'll be redirected to One-Time Password (OTP) Verification.`
                  : `After successful OTP verification, you can access the system based on your role set by administrator.`
                }
              </p>
            </div>
          </div>

          {/* Right Side Form */}
          <div className='bg-slate-100 p-8 rounded-md shadow-md shadow-slate-300 min-w-110 min-h-100 max-w-100 max-h-90 relative'>
            {nextStep === 1 ? (
              <>
                <h2 className="reg-form-title">LOGIN</h2>
                <form onSubmit={(e) => handleSubmit(e)} className="space-y-2">
                  <Field
                    autoFocus={true}
                    icon={<Mail color='gray' size={24} />}
                    ref={emailRef}
                    name='email'
                    placeholder='Email Address'
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                  <div className='relative'>
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
                    <p className='text-green-600 text-sm absolute bottom-0 right-0 hover:cursor-pointer active:text-blue-400 hover:underline'>
                      Forgot password?
                    </p>
                  </div>
                  
                  <div className='flex justify-center mt-5'>
                    <SubmitButton 
                      disabled={isLoading} 
                    >
                      {isLoading 
                        ? <LoaderCircle className='h-5 w-5 animate-spin'/> 
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
                  onClick={handleBackToLogin} 
                  title='Back to Login'
                  className='absolute top-3 left-1 flex flex-row justify-center items-center gap-x-2 py-1 px-3 hover:bg-slate-200 rounded-full cursor-pointer text-slate-600'
                >
                  <ArrowLeft />
                  Back
                </button>
                <h2 className="reg-form-title">OTP Verification</h2>
                <p className='text-center'>
                  Enter the 6-digit code we've sent to {' '}
                  <span className='font-semibold'>{tempUser?.email || "your email"}</span>
                </p>
                <div className='flex gap-x-4 py-4 items-center justify-center mb-4'>
                  {otp.map((digit, i) => (
                    <OTPField 
                      key={i}
                      value={digit} 
                      autoFocus={i===0}
                      onChange={(val) => handleOtpChange(val, i)} 
                    />
                  ))}
                </div>
                <div className='flex flex-col justify-center items-center'>
                  {!otpExpired ? (
                    <>
                      <SubmitButton onClick={(e) => handleVerifyOtp(e)}>
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
                        onClick={() => handleResendOtp(tempUser.email)}
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
