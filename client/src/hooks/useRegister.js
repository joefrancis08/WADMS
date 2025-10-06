import { useNavigate } from 'react-router-dom'; // Importing Link and useNavigate for navigation
import { useAuth } from '../contexts/AuthContext';
import { useRef, useState } from 'react';
import { validateForm } from '../utils/validateForm';
import { checkUserEmail, registerUser } from '../api-calls/Users/userAPI';
import { showErrorToast, showSuccessToast } from '../utils/toastNotification';
import { TOAST_MESSAGES } from '../constants/messages';
import usePageTitle from './usePageTitle';
import PATH from '../constants/path';

const { REGISTRATION } = TOAST_MESSAGES;

export const useRegister = () => {
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Context of where to save the registered user's data, his/her data will be passed to the register variable
  const { register } = useAuth();

  // State of form values
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '' 
  });

  // Create reference of form values
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Assign reference to the input fields
  const fieldRefs = {
    fullName: fullNameRef,
    email: emailRef,
    password: passwordRef
  };

  // Set state for form errors
  const [errors, setErrors] = useState({});

  // Set state for the visibility of the password
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Set state for loading and error
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  usePageTitle('Register');

  // Create function to handle input changes
  // Updates the corresponding state based on the input field changes
  const handleChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;

    setValues(prevValues => ({
      ...prevValues, [name]: value,
    }));

    setErrors(prevErrors => ({
      ...prevErrors, [name]: ''
    }));
  }

  // Create function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop default form behavior

    // Step 1: Validate form for common errors (i.e., empty fields, invalid email, weak passwords)
    const formErrors = validateForm(values);
    setErrors(formErrors);

    // Step 2: Stop submitting form if there are any form errors and focus on the first error in the field
    if (Object.keys(formErrors).length > 0) {
      const firstErrorKey = Object.keys(formErrors)[0];
      const ref = fieldRefs[firstErrorKey];
      ref?.current?.focus();
      ref?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      return;
    }

    try {
      // Step 3: Check if email already exists
      // Note: This is a server-side validation so I think it's good to keep the code here, still I update the errors if there's any.
      const res = await checkUserEmail(values.email);
      const emailAlreadyExists = res?.data?.alreadyExists;

      if (emailAlreadyExists) {
        setErrors(prev => ({
          ...prev, email: 'This email was already registered. Try another.'
        }));

        return;
      }

      // Step 4: Register the user if there are no errors
      setIsLoading(true); // Set loading state to true while waiting to post the data
      const data = await registerUser(values);
      const { email, fullName, profilePicPath, role, status } = data.user; // Destructure the data for easy access and usage
      console.log(data.user);
      
      // Step 5: If registration unsuccessful, let the user know thru toast notification
      if (!data?.success) {
        showErrorToast(data?.message || REGISTRATION.UNSUCCESSFUL);
        return;
      }

      setIsLoading(false); // Set loading to false after posting the data

      // Step 6: Save the data of the registered user to the context so that it can be used in other components
      register(email, fullName, profilePicPath, role, status);

      // Step 7: Reset field values after successful form submission
      setValues({
        ...values,
        fullName: '', 
        email: '',
        password: ''
      });
      showSuccessToast(REGISTRATION.SUCCESS); // Show success toast notification

      // Step 8: Redirect to pedinding verification page
      navigate(PATH.UNVERIFIED_USER.PENDING);

    } catch (error) {
      // Additional step: Log the error and let the user know thru toast notification
      console.error(error);
      showErrorToast(REGISTRATION.ERROR);
    }
  }

  return {
    formValues: {values, setValues},
    formErrors: {errors, setErrors},
    refs: {fullNameRef, emailRef, passwordRef},
    passwordVisibility: {isPasswordVisible, setIsPasswordVisible, togglePasswordVisibility},
    loading: {isLoading, setIsLoading},
    actions: {handleChange, handleSubmit}
  };
}