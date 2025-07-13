import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importing axios for HTTP requests
import { Link, useNavigate } from 'react-router-dom'; // Importing Link and useNavigate for navigation
import { showErrorToast, showSuccessToast } from '../utils/toastNotification.js'; // Importing utility functions for toast notifications
import SubmitButton from '../components/Auth/SubmitButton.jsx'; // Importing custom SubmitButton component
import AlertMessage from '../components/Auth/AlertMessage.jsx'; // Importing custom AlertMessage component
import LoadSpinner from '../components/LoadSpinner.jsx'; // Importing custom LoadSpinner component
import { emailRegex, passwordRegex } from '../utils/regEx.js'; // Importing regex
import eyeShowIcon from '../assets/eye-show-icon.svg'; // Importing the eye show icon
import eyeHideIcon from '../assets/eye-hide-icon.svg'; // Importing the eye hide


// Base URL for API requests
// This should be set in environment variables for security and flexibility
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Register component
// Handles user registration, form validation, and error handling
function Register() {
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // State of form values
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  // State for empty fields
  const [isEmailEmpty, setIsEmailEmpty] = useState();
  const [isFullNameEmpty, setIsFullNameEmpty] = useState();
  const [isPasswordEmpty, setIsPasswordEmpty] = useState();
  
  // State for email validation
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [alreadyTaken, setAlreadyTaken] = useState(false);

  // State for password visibility and strength
  const [isStrongPassword, setIsStrongPassword] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // State for loading and error
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle input changes
  // Updates the corresponding state based on input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));

    if (name === 'fullName') setIsFullNameEmpty(false);
    if (name === 'email') {
      setIsEmailEmpty(false);
      setAlreadyTaken(false);
      setIsValidEmail(true);
    }

    if (name === 'password') {
      setIsPasswordEmpty(false);
      setIsStrongPassword(true);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Check if any field is empty. If empty, stop form submission
      if (!values.fullName || !values.email || !values.password) {
        setIsEmailEmpty(!values.email);
        setIsFullNameEmpty(!values.fullName);
        setIsPasswordEmpty(!values.password);
        return; // Stop form submission
      }

      /* 
        Step 2: Check if email is good. If criteria not met, stop form submission.
        A good email:
          - Has one or more characters before the '@' symbol
          - Has '@' symbol followed by one or more characters after it and before the '.' symbol
          - Has a '.' symbol followed by at least two characters
       */
      if (!emailRegex.test(values.email)) {
        setIsValidEmail(false);
        return; // Stop form submission
      }

      // Step 3: Check if email already exists
      const res = await axios.post(`${API_BASE_URL}/users/check-email`, {email: values.email});
      const emailAlreadyExists = res?.data?.alreadyExists;
      if (emailAlreadyExists) {
        setAlreadyTaken(true);
        return;
      }

      /* 
        Step 4: Check if password is good. If criteria not met, stop form submission.
        A good password:
          - Has at least 8 characters
          - Contains at least one uppercase letter, one lowercase letter, one number, and one special character
       */
      if (!passwordRegex.test(values.password)) {
        setIsStrongPassword(false);
        return; // Stop form submission
      }

      // Step 5: Register the user if meet the conditions above
      setIsLoading(true); // Show loading spinner
      const { data } = await axios.post(`${API_BASE_URL}/users/register`, values);
      setIsLoading(false); // Hide loading spinner

      // Step 6: If registration unsuccessful. Let the user know thru toast notification.
      if (!data.success) {
        showErrorToast(data?.message || 'Unsuccessful Registration. Try again.');
        return;
      }

      // Step 7: Reset field values after successful form submission
      setValues({ ...values, fullName: '', email: '', password: '' });
      showSuccessToast('Registration successful.'); // Show success notification

      // Step 8: Redirect to pending verification page
      // navigate('/pending-verification');
    } catch (error) {
      console.error(error);
      showErrorToast('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div>
          <img src="/CGS_Logo.png" alt="Logo" className="h-20 mx-auto mb-4" />
        </div>
        <h2 className="font-bold mb-6 text-center text-green-700">
          Web-Based Document Management System
        </h2>
        <hr className="opacity-20" />
        <h2 className="text-2xl font-bold mb-6 mt-6 text-center text-green-700">REGISTER</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative w-full">
            <div className="relative">
              <span className="absolute inset-y-7 left-0 flex items-center pl-4">
                <img src="user-icon.svg" alt="icon" className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Full Name"
                autoComplete='off'
                name="fullName"
                value={values.fullName}
                className={`${isFullNameEmpty 
                  ? 'border-red-500 focus:outline-none' 
                  : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600'} input-field-style`
                }
                onChange={handleChange}
              />
            </div>
            {isFullNameEmpty && <AlertMessage message="This field is required." />}
          </div>

          <div className="relative w-full">
            <div className="relative">
              <span className="absolute inset-y-7 left-0 flex items-center pl-4">
                <img src="email-icon.svg" alt="icon" className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Email Address"
                autoComplete='off'
                name="email"
                value={values.email}
                className={`${alreadyTaken 
                  || isEmailEmpty 
                  || !isValidEmail 
                  ? 'border-red-500 focus:outline-none' 
                  : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600'} input-field-style`}
                onChange={handleChange}
              />
            </div>
            {alreadyTaken && <AlertMessage message="This email was already registered." />}
            {isEmailEmpty && <AlertMessage message="This field is required." />}
            {!isValidEmail && <AlertMessage message="Please enter a valid email (e.g., user@example.com)." />}
          </div>

          <div className="relative w-full">
            <div className="relative">
              <span className="absolute inset-y-5 left-0 flex items-center pl-4">
                <img src="key-icon.svg" alt="lock icon" className="w-5 h-5" />
              </span>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder='Password'
                name="password"
                value={values.password}
                className={`${isPasswordEmpty 
                  || !isStrongPassword 
                  ? 'border-red-500 focus:outline-none' 
                  : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600'} input-field-style`}
                onChange={handleChange}
              />
              <span onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute inset-y-7 right-0 flex items-center pr-4 hover:cursor-pointer hover:text-gray-500">
                <img src={isPasswordVisible ? eyeHideIcon : eyeShowIcon} alt="show password icon" className="w-6 h-6" />
              </span>
            </div>
            {isPasswordEmpty && <AlertMessage message="This field is required." />}
            {!isStrongPassword && <AlertMessage message="Password must be at least 8 characters long with uppercase and lowercase letters, a number, and a symbol." />}
          </div>

          <div>
            <SubmitButton disabled={isLoading}>
              {isLoading ? <LoadSpinner height={5} width={5}>Registering...</LoadSpinner> : "Register"}
            </SubmitButton>
          </div>

          <div>
            <p className="text-center mt-4">
              Already have an account?
              <Link to="/login" className="text-blue-500 hover:underline"> Login </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
