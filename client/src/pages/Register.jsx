import { Link } from 'react-router-dom';
import { AtSign, LockKeyhole, UserRoundPen } from 'lucide-react';
import { useRegister } from '../hooks/useRegister'; // Importing register custom hook
import SubmitButton from '../components/Auth/SubmitButton'; // Importing custom SubmitButton component
import LoadSpinner from '../components/Loaders/LoadSpinner'; // Importing custom LoadSpinner component
import Field from '../components/Form/Auth/Field'; // Importing fied component

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
      <div className="reg-card-content">
        <div className="flex justify-center">
          <img src="/cgs-logo.png" alt="Logo" className="h-25 mb-4" />
        </div>
        <h2 className="reg-card-header-title">
          Document Management System
        </h2>
        <hr className="reg-hr-line" />
        <h2 className="reg-form-title">REGISTER</h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          <Field
            autoFocus={true}
            icon={<UserRoundPen color='gray' size={24} />}
            ref={fullNameRef}
            name='fullName'
            placeholder='Full Name'
            value={values.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />
          
          <Field
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
                ? <LoadSpinner height={'h-5'} width={'w-5'}>
                    Registering...
                  </LoadSpinner> 
                : 'Register'
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
