import { Link } from 'react-router-dom';
import { LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useRegister } from '../hooks/useRegister';
import SubmitButton from '../components/Auth/SubmitButton';
import LoadSpinner from '../components/Loaders/LoadSpinner';
import Field from '../components/Form/Auth/Field';
import GoogleLoginButton from '../services/google/GoogleLoginButton';
import { useRef } from 'react';
import { googleIcon } from '../assets/icons';
import { showErrorToast, showSuccessToast } from '../utils/toastNotification';

function Register() {
  const { formValues, formErrors, refs, passwordVisibility, loading, actions } = useRegister();
  const { values } = formValues;
  const { errors } = formErrors;
  const { fullNameRef, emailRef, passwordRef } = refs;
  const { isPasswordVisible, togglePasswordVisibility } = passwordVisibility;
  const { isLoading } = loading;
  const { handleChange, handleSubmit } = actions;

  const googleRef = useRef();

  // Handle response from Google login
  const handleGoogleLoginResult = (data) => {
    const { success, registered, approved, message } = data;

    if (success) {
      if (registered && !approved) {
        showSuccessToast(message, 'top-center', 4000);
        setTimeout(() => {
          window.location.href = '/pending-verification';
        }, 4000);
      } else if (approved) {
        showSuccessToast('Account approved! Redirecting...', 'top-center', 2000);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } else {
      showErrorToast(message, 'top-center', 8000);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-dvh bg-[url('/pit-bg-1.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="bg-slate-200 shadow-xl shadow-slate-800/70 px-10 py-6 z-20 rounded-2xl flex flex-col md:flex-row gap-x-20 relative overflow-hidden">
        {/* Left section */}
        <div className="flex flex-col justify-center items-start md:w-[40%] text-slate-800">
          {/* Improved PIT + CGS logo layout */}
          <div className="flex flex-col mb-6">
            <div className="flex items-center gap-x-3">
              <img src="/pit-logo-outlined.png" alt="PIT Logo" className="h-14 drop-shadow-md" />
              <div className="flex flex-col">
                <h3 className="text-slate-800 text-xl font-bold leading-tight">
                  Palompon Institute of Technology
                </h3>
                <p className="text-slate-600 text-sm italic">College of Graduate Studies</p>
              </div>
            </div>
          </div>

          <h2 className="text-green-700 text-3xl font-bold leading-tight mb-4">
            Document Management System
          </h2>

          <div className="w-24 h-1 bg-green-600 mb-6"></div>

          <p className="text-slate-700 leading-relaxed max-w-[320px] text-sm">
            Register your account or continue with your Google account.  
            After successful registration, an administrator will verify your credentials before granting access.
          </p>
        </div>

        {/* Right side form */}
        <div className="bg-slate-100 p-6 rounded-xl shadow-md shadow-slate-400 min-w-[350px] md:w-[370px] flex flex-col justify-center relative">
          <h2 className="text-center text-2xl font-bold text-slate-800 mb-4 tracking-wide">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Field
              autoFocus
              icon={<UserRound color="gray" size={22} />}
              ref={fullNameRef}
              name="fullName"
              placeholder="Full Name"
              value={values.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />

            <Field
              icon={<Mail color="gray" size={22} />}
              ref={emailRef}
              name="email"
              placeholder="Email Address"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
            />

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

            <div className="flex justify-center mt-6">
              <SubmitButton disabled={isLoading}>
                {isLoading ? (
                  <LoadSpinner height="h-5" width="w-5">
                    Registering...
                  </LoadSpinner>
                ) : (
                  'Register'
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

          {/* Google Register Button */}
          <div className="flex items-center justify-center mb-3">
            <button
              onClick={() => googleRef.current.signIn()}
              className="w-full gap-x-3 flex items-center justify-center bg-gradient-to-br from-white to-slate-100 border border-slate-300 text-slate-800 px-4 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <img
                src={googleIcon}
                alt="Google Logo"
                className="h-5 w-5"
                loading="lazy"
              />
              Continue with Google
            </button>
          </div>

          {/* Invisible Google Logic Component */}
          <GoogleLoginButton
            ref={googleRef}
            onLogin={handleGoogleLoginResult}
            mode="register"
          />

          <p className="text-center text-sm mt-5">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-green-700 hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
