import { Link } from 'react-router-dom';
import { AtSign, Eye, EyeOff, Lock, UserRoundPen } from 'lucide-react';
import { useRegister } from '../hooks/useRegister';
import SubmitButton from '../components/Auth/SubmitButton'; // Importing custom SubmitButton component
import ValidationMessage from '../components/Auth/ValidationMessage'; // Importing custom ValidationMessage component
import LoadSpinner from '../components/Loaders/LoadSpinner'; // Importing custom LoadSpinner component


// Register component
// Handles user registration, form validation, and error handling
function Register() {
  
  const { formValues, formErrors, refs, passwordVisibility, loading, handlers } = useRegister();

  const { values } = formValues;
  const { errors } = formErrors;
  const { fullNameRef, emailRef, passwordRef } = refs;
  const { isPasswordVisible, setIsPasswordVisible } = passwordVisibility;
  const { isLoading } = loading;
  const { handleChange, handleSubmit} = handlers;

  return (
    <div className="reg-card-container">
      <div className="reg-card-content">
        <div className='flex justify-center'>
          <img src="/CGS_Logo.png" alt="Logo" className="h-25 mb-4" />
        </div>
        <h2 className="reg-card-header-title">
          Document Management System
        </h2>
        <hr className="reg-hr-line" />
        <h2 className="reg-form-title">REGISTER</h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="w-full">
            <div className="input-container-layout">
              <span className="input-icon-layout">
                <UserRoundPen color='gray' size={24} />
              </span>
              <input
                type="text"
                ref={fullNameRef}
                placeholder="Full Name"
                autoComplete='off'
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                className={`${errors.fullName 
                  ? 'input-invalid' 
                  : 'input-valid'} 
                  input-field-style`
                }
              />
            </div>
            <div className="min-h-[1.25rem]">
              {errors.fullName && <ValidationMessage message={errors.fullName} />}
            </div>
          </div>

          <div className="w-full">
            <div className="input-container-layout">
              <span className="input-icon-layout">
                <AtSign color='gray' size={24} />
              </span>
              <input
                type="text"
                ref={emailRef}
                placeholder="Email Address"
                autoComplete='off'
                name="email"
                value={values.email}
                onChange={handleChange}
                className={`${errors.email 
                  ? 'input-invalid' 
                  : 'input-valid'} 
                  input-field-style`
                }
              />
            </div>
            <div className="min-h-[1.25rem]">
              {errors.email && <ValidationMessage message={errors.email} />}
            </div>
          </div>
          <div className="w-full">
            <div className="input-container-layout">
              <span className="input-icon-layout">
                <Lock color='gray' size={24}/>
              </span>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                ref={passwordRef}
                placeholder='Password'
                name="password"
                value={values.password}
                onChange={handleChange}
                className={`${errors.password 
                  ? 'input-invalid' 
                  : 'input-valid'} 
                  input-field-style`
                }
              />
              <span
                title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)} 
                className="password-icon-visibility">
                {isPasswordVisible ? <EyeOff color='gray' /> : <Eye color='gray'/>}
              </span>
            </div>
            <div className="min-h-[1.25rem]">
              {errors.password && <ValidationMessage message={errors.password} />}
            </div>
          </div>

          <div className='flex justify-center'>
            <SubmitButton disabled={isLoading}>
              {isLoading 
                ? <LoadSpinner height={'h-5'} width={'w-5'}>
                    Registering...
                  </LoadSpinner> 
                : "Register"
              }
            </SubmitButton>
          </div>

          <div>
            <p className="text-center mt-4">
              Already have an account?
              <Link to="/login" className="text-green-700 hover:underline"> Login </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
