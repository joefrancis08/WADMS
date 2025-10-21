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
    e.preventDefault();

    const formErrors = validateForm(values);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) {
      const firstErrorKey = Object.keys(formErrors)[0];
      const ref = fieldRefs[firstErrorKey];
      ref?.current?.focus();
      ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      // (Optional) If you keep the pre-check:
      const res = await checkUserEmail(values.email);
      if (res?.data?.alreadyExists) {
        setErrors(prev => ({ ...prev, email: 'This email was already registered. Try another.' }));
        return;
      }

      setIsLoading(true);
      const data = await registerUser(values); // ← always returns an object now
      setIsLoading(false);

      if (!data?.success || !data?.user) {
        // server tells you what happened
        if (data?.alreadyExists) {
          setErrors(prev => ({ ...prev, email: 'This email was already registered. Try another.' }));
        } else {
          // toast the message if present; fall back to generic
          showErrorToast(data?.message || REGISTRATION.UNSUCCESSFUL);
        }
        return;
      }

      // safe to destructure now
      const { userId, userUUID, email, fullName, profilePicPath, role, status } = data.user;

      register(userId, userUUID, email, fullName, profilePicPath, role, status);

      setValues({ fullName: '', email: '', password: '' });
      showSuccessToast(REGISTRATION.SUCCESS);
      navigate(PATH.UNVERIFIED_USER.PENDING);

    } catch (error) {
      console.error(error);
      setIsLoading(false);
      showErrorToast(REGISTRATION.ERROR);
    }
  };


  return {
    formValues: {values, setValues},
    formErrors: {errors, setErrors},
    refs: {fullNameRef, emailRef, passwordRef},
    passwordVisibility: {isPasswordVisible, setIsPasswordVisible, togglePasswordVisibility},
    loading: {isLoading, setIsLoading},
    actions: {handleChange, handleSubmit}
  };
}