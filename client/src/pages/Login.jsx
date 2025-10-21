import { Link } from 'react-router-dom';
import { ArrowLeft, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import SubmitButton from '../components/Auth/SubmitButton';
import Field from '../components/Form/Auth/Field';
import OTPField from '../components/Auth/OTPField';
import useLogin from '../hooks/useLogin';
import { useRef } from 'react';
import GoogleLoginButton from '../services/google/GoogleLoginButton';
import { googleIcon } from '../assets/icons';
import { showErrorToast, showSuccessToast } from '../utils/toastNotification';
import { USER_ROLES } from '../constants/user';
import PATH from '../constants/path';

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
    otpExpired,
  } = datas;

  const {
    handleChange,
    handleSubmit,
    handleBackToLogin,
    handleOtpChange,
    handleVerifyOtp,
    handleResendOtp,
  } = handlers;

  const googleRef = useRef();

  // Handle response from Google login
  const handleGoogleLoginResult = (data) => {
    const { success, registered, approved, message, user } = data;
    console.log('Google login result:', data);

    if (success) {
      if (registered && !approved) {
        showSuccessToast(message, 'top-center', 4000);
        setTimeout(() => {
          window.location.href = '/pending-verification';
        }, 4000);
      } else if (approved) {
        showSuccessToast('Login successful! Redirecting...', 'top-center', 2000);
        setTimeout(() => {
          const targetPath =
            user.role === USER_ROLES.DEAN
              ? PATH.DEAN.DASHBOARD
              : user.role === USER_ROLES.ACCREDITOR
              ? PATH.ACCREDITOR.DASHBOARD
              : user.role === USER_ROLES.TASK_FORCE
              ? PATH.TASK_FORCE.DASHBOARD
              : user.role === USER_ROLES.IA
              ? PATH.INTERNAL_ASSESSOR.DASHBOARD
              : '/';
          window.location.href = targetPath;
        }, 2000);
      }
    } else {
      showErrorToast(
        message || 'Google login failed. Please try again.',
        'top-center',
        6000
      );
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-dvh bg-[url('/pit-bg-1.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="bg-slate-200 shadow-xl shadow-slate-800/70 px-10 py-6 z-20 rounded-2xl flex flex-col md:flex-row gap-x-20 relative overflow-hidden">
        {/* Left side info */}
        <div className="flex flex-col justify-center items-start md:w-[40%] text-slate-800">
          {/* PIT + CGS Logo Hierarchy */}
          <div className="flex flex-col items-start mb-6">
            <div className="flex items-center gap-x-3">
              <img
                src="/pit-logo-outlined.png"
                alt="PIT Logo"
                className="h-16 drop-shadow-md"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-700 tracking-tight">
                  Palompon Institute of Technology
                </h3>
                <p className="text-sm text-slate-600 italic">
                  College of Graduate Studies
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-green-700 text-3xl font-bold leading-tight mb-4">
            Document Management System
          </h2>

          {/* Divider */}
          <div className="w-24 h-1 bg-green-600 mb-6 rounded-full"></div>

          {/* Description */}
          <p className="text-slate-700 leading-relaxed max-w-[320px] text-sm">
            {nextStep === 1
              ? 'Login using your email and password, or continue with Google. Password logins require OTP verification for added security, while Google logins skip OTP since your identity is already verified by Google.'
              : 'After successful OTP verification, you will be redirected to your assigned dashboard based on your role.'}
          </p>
        </div>

        {/* Right side login form */}
        <div className="bg-slate-100 p-8 rounded-xl shadow-md shadow-slate-400 min-w-[360px] md:w-[380px] flex flex-col justify-center relative translate-x-10">
          {nextStep === 1 ? (
            <>
              <h2 className="text-center text-2xl font-bold text-slate-800 mb-4 tracking-wide">
                Login
              </h2>

              <form onSubmit={(e) => handleSubmit(e)} className="space-y-3">
                <Field
                  autoFocus
                  icon={<Mail color="gray" size={22} />}
                  ref={emailRef}
                  name="email"
                  placeholder="Email Address"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                {/* Password field with Forgot Password inline */}
                <div>
                  <Field
                    icon={<LockKeyhole color="gray" size={22} />}
                    ref={passwordRef}
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                    isPassword
                    isPasswordVisible={isPasswordVisible}
                    togglePasswordVisibility={togglePasswordVisibility}
                  />
                  <div className="flex justify-end">
                    <p className="text-green-700 text-sm hover:underline hover:cursor-pointer mt-1">
                      Forgot password?
                    </p>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <SubmitButton disabled={isLoading}>
                    {isLoading ? (
                      <div className='flex items-center justify-center gap-x-1'>
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        <p className='text-sm'>Sending OTP...</p>
                      </div>
                    ) : (
                      'Login'
                    )}
                  </SubmitButton>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center justify-center gap-x-4 my-6">
                <hr className="w-24 border-slate-300" />
                <p className="text-slate-500 text-sm">or</p>
                <hr className="w-24 border-slate-300" />
              </div>

              {/* Google Login Button */}
              <div className="flex flex-col items-center justify-center mb-3">
                <button
                  onClick={() => googleRef.current.signIn()}
                  className="w-full gap-x-3 flex items-center justify-center bg-gradient-to-br from-white to-slate-100 border border-slate-300 text-slate-800 px-4 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-all active:scale-[0.97] cursor-pointer"
                >
                  <img src={googleIcon} alt="Google Logo" className="h-5 w-5" loading="lazy" />
                  Continue with Google
                </button>

                <p className="text-xs text-slate-500 mt-2 text-center max-w-[280px]">
                  Google login skips OTP verification — your account is securely verified by Google.
                </p>
              </div>

              {/* Invisible Google Logic Component */}
              <GoogleLoginButton ref={googleRef} onLogin={handleGoogleLoginResult} mode="login" />

              <p className="text-center text-sm mt-5">
                No account?{' '}
                <Link to="/register" className="text-green-700 hover:underline font-semibold">
                  Create
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* OTP Verification Step */}
              <button
                onClick={handleBackToLogin}
                title="Back to Login"
                className="absolute top-3 left-3 flex flex-row justify-center items-center gap-x-2 py-1 px-3 hover:bg-slate-200 rounded-full cursor-pointer text-slate-600 text-sm"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <h2 className="text-center text-2xl font-bold text-slate-800 mb-2">
                OTP Verification
              </h2>
              <p className="text-center text-slate-600 mb-4 text-sm">
                Enter the 6-digit code sent to{' '}
                <span className="font-semibold">{tempUser?.email}</span>
              </p>

              <div className="flex gap-x-3 py-2 items-center justify-center mb-4">
                {otp.map((digit, i) => (
                  <OTPField
                    key={i}
                    value={digit}
                    autoFocus={i === 0}
                    onChange={(val) => handleOtpChange(val, i)}
                  />
                ))}
              </div>

              <div className="flex flex-col justify-center items-center">
                {!otpExpired ? (
                  <>
                    <SubmitButton onClick={handleVerifyOtp}>
                      <p>Verify OTP</p>
                    </SubmitButton>
                    <p className="mt-4 text-sm text-slate-600">
                      Code will expire in <b>{formatTime(timeLeft)}</b>.
                    </p>
                  </>
                ) : (
                  <>
                    {console.log(tempUser)}
                    <p className="text-red-600 font-semibold mb-3">OTP expired!</p>
                    <button
                      onClick={() => handleResendOtp(tempUser.email)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
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
  );
};

export default Login;
