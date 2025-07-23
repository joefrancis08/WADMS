import { useRef, useState } from 'react';
import axios from 'axios'; // Importing axios for HTTP requests
import { useAuth } from '../contexts/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom'; // Importing Link and useNavigate for navigation
import { validateForm } from '../utils/validateForm.js'; // Importing validateForm for form validation
import { showErrorToast, showSuccessToast } from '../utils/toastNotification.js'; // Importing utility functions for toast notifications
import SubmitButton from '../components/Auth/SubmitButton.jsx'; // Importing custom SubmitButton component
import AlertMessage from '../components/Auth/AlertMessage.jsx'; // Importing custom AlertMessage component
import LoadSpinner from '../components/Loaders/LoadSpinner.jsx'; // Importing custom LoadSpinner component
import { AtSign, Eye, EyeClosed, EyeOff, Lock, UserRound, UserRoundPen } from 'lucide-react';

// Base URL for API requests
// This was set in environment variables (.env) for security and flexibility
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Register component
// Handles user registration, form validation, and error handling
function Register() {
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Context of where to save the user's data, user data will be passed to the register variable
  const { register } = useAuth();

  // State of form values
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  // 
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // 
  const fieldRefs = {
    fullName: fullNameRef,
    email: emailRef,
    password: passwordRef,
  };

  // State for form errors
  const [errors, setErrors] = useState({});
  
  // State for the visibility of the password
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // State for loading and error
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle input changes
  // Updates the corresponding state based on input field changes
  const handleChange = (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up to parent elements
    const { name, value } = e.target; 

    setValues(prevValues => ({ ...prevValues, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Validate form for common errors (i.e., empty fields, invalid email, weak passwords)
    const formErrors = validateForm(values);
    setErrors(formErrors);

    // Step 2: Stop submitting form if there are any form errors
    if (Object.keys(formErrors).length > 0) {
      const firstErrorKey = Object.keys(formErrors)[0];
      const ref = fieldRefs[firstErrorKey];
      ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      ref?.current?.focus();
      return;
    }

    try {
      // Step 3: Check if email already exists 
      // Note: This is a server-side validation so I think it's good to keep the code here, still I update the errors if there's any.
      const res = await axios.post(`${API_BASE_URL}/users/check-email`, {email: values.email});
      const emailAlreadyExists = res?.data?.alreadyExists;
      if (emailAlreadyExists) {
        setErrors(prev => ({ ...prev, email: 'This email was already registered. Try another.'}))
        return;
      }

      // Step 4: Register the user if there are no errors
      setIsLoading(true); // Show loading spinner while waiting to post the data
      const { data } = await axios.post(`${API_BASE_URL}/users/register`, values, { withCredentials: true });
      const { email, fullName, role, status } = data.user; // Destructure the data for easy usage
      setIsLoading(false); // Hide loading spinner after posting the data to the db

      // Step 5: Save the data of the registered user to the context so that it can be used in other components
      register(email, fullName, role, status); 

      // Step 6: If registration unsuccessful. Let the user know thru toast notification.
      if (!data.success) {
        showErrorToast(data?.message || 'Unsuccessful Registration. Try again.');
        return;
      }

      // Step 7: Reset field values after successful form submission
      setValues({ ...values, fullName: '', email: '', password: '' });
      showSuccessToast('Registration successful.'); // Show success notification

      // Step 9: Redirect to pending verification page
      navigate('/pending-verification');

    } catch (error) {
      // Additional Step: Log the error and let the user know thru toast notification
      console.error(error);
      showErrorToast('Something went wrong. Please try again later.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="w-full max-w-md max-sm:mx-4 bg-gradient-to-b from-gray-100 to-white gray px-8 pb-8 pt-2 rounded-lg drop-shadow-md">
        <div className='flex justify-center'>
          <img src="/CGS_Logo.png" alt="Logo" className="h-25 mb-4" />
        </div>
        <h2 className="font-bold mb-6 text-center text-md text-green-700">
          Document Management System
        </h2>
        <hr className="opacity-50 text-secondary shadow-lg" />
        <h2 className="text-2xl font-bold py-4 text-center text-green-700">REGISTER</h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="w-full">
            <div className="relative flex items-center">
              <span className="absolute inset-y-7 left-0 flex items-center pl-4">
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
                  ? 'border-red-500 focus:outline-none' 
                  : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600'} input-field-style`
                }
              />
            </div>
            <div className="min-h-[1.25rem]">
              {errors.fullName && <AlertMessage message={errors.fullName} />}
            </div>
          </div>

          <div className="relative w-full">
            <div className="relative">
              <span className="absolute inset-y-7 left-0 flex items-center pl-4">
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
                  ? 'border-red-500 focus:outline-none' 
                  : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600'} input-field-style`}
              />
            </div>
            <div className="min-h-[1.25rem]">
              {errors.email && <AlertMessage message={errors.email} />}
            </div>
          </div>

          <div className="relative w-full">
            <div className="relative">
              <span className="absolute inset-y-7 left-0 flex items-center pl-4">
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
                  ? 'border-red-500 focus:outline-none' 
                  : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600'} input-field-style`}
              />
              <span
                title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)} 
                className="absolute inset-y-7 right-0 flex items-center pr-4 hover:cursor-pointer hover:text-gray-500">
                {isPasswordVisible ? <EyeOff color='gray' fill='currentFill'/> : <Eye color='gray'/>}
                {/* <button 
                  title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                  src={isPasswordVisible ? eyeCloseIcon : eyeOpenIcon} className="w-6 h-6" 
                /> */}
              </span>
            </div>
            <div className="transition-all ease-linear duration-700 min-h-[1.25rem]">
              {errors.password && <AlertMessage message={errors.password} />}
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
