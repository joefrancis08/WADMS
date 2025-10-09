import { Link } from 'react-router-dom';
import { AtSign, LockKeyhole, Mail, UserRound, UserRoundPen } from 'lucide-react';
import { useRegister } from '../hooks/useRegister'; // Importing register custom hook
import SubmitButton from '../components/Auth/SubmitButton'; // Importing custom SubmitButton component
import LoadSpinner from '../components/Loaders/LoadSpinner'; // Importing custom LoadSpinner component
import Field from '../components/Form/Auth/Field'; // Importing fied component
import { googleIcon } from '../assets/icons';

// Register component
// Handles user registration, form validation, and error handling
function Register() {
  
  const { formValues, formErrors, refs, passwordVisibility, loading, actions } = useRegister();

  const { values } = formValues;
  const { errors } = formErrors;
  const { fullNameRef, emailRef, passwordRef } = refs;
  const { isPasswordVisible, togglePasswordVisibility } = passwordVisibility;
  const { isLoading } = loading;
  const { handleChange, handleSubmit} = actions;

  return (
    <div className="reg-card-container">
      <div className='absolute inset-0 bg-black/60'></div>
      <div className="reg-card-content">
        <div>
          <div className="flex justify-start">
            <img src="/pit-logo-outlined.png" alt="Logo" className="h-14 mb-8" />
            <img src="/cgs-logo.png" alt="Logo" className="h-14 mb-4" />
          </div>
          <h2 className="reg-card-header-title">
            Document Management System
          </h2>
          <div className='w-[50%] h-0.5 bg-slate-400 my-20'></div>
          <div className='max-w-[300px]'>
            <p>
              After successful registration, the administrator will verify your credentials before granting you access to the system.
            </p>
          </div>
        </div>
        <div className='max-w-[50%] bg-slate-100 px-8 py-4 rounded-lg shadow-md shadow-slate-300'>
          <h2 className="reg-form-title">REGISTER</h2>
          <form onSubmit={handleSubmit} className="space-y-2">
            <Field
              autoFocus={true}
              icon={<UserRound color='gray' size={24} />}
              ref={fullNameRef}
              name='fullName'
              placeholder='Full Name'
              value={values.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            
            <Field
              icon={<Mail color='gray' size={24} />}
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
                  ? <LoadSpinner height={'h-5'} width={'w-5'}>
                      Registering...
                    </LoadSpinner> 
                  : 'Register'
                }
              </SubmitButton>
            </div>
            <div className='mt-4'>
              <p className="text-center text-sm">
                Already have an account?
                <Link to="/login" className="text-green-700 hover:underline"> Login </Link>
              </p>
            </div>
            <div className='flex items-center justify-center gap-x-4 my-2'>
              <hr className='w-50 text-slate-300'></hr>
              <p>or</p>
              <hr className='w-50 text-slate-300'></hr>
            </div>
          </form>
          <div className='flex items-center justify-center mb-4'>
            <button className='w-75 gap-x-2 flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-200 text-slate-900 px-4 py-3 rounded-full text-md hover:bg-gradient-to-tr hover:bg-slate-200 hover:shadow-xs shadow-slate-400 active:opacity-50 transition cursor-pointer active:scale-95'>
              <img src={googleIcon} alt="Google Logo" className='h-5 w-5' loading='lazy' />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
