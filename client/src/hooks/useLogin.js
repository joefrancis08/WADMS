import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useRef } from "react";
import { validateForm } from "../utils/validateForm";
import { loginUser } from "../api-calls/Users/userAPI";
import { showErrorToast, showSuccessToast } from "../utils/toastNotification";
import { TOAST_MESSAGES } from "../constants/messages";
import { useEffect } from "react";
import usePageTitle from "./usePageTitle";
import { verifyOTP } from "../api-calls/auth/otpAPI";
import { USER_ROLES } from "../constants/user";

const { LOGIN } = TOAST_MESSAGES;

const useLogin = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Context of where to save the registered user's data, his/her data will be passed to the login variable
  const { login } = useAuth();
  const { user } = useAuth();

  // State of login values
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  // Set state for loading and error
  const [isLoading, setIsLoading] = useState(false);

  // Set state for form errors
  const [errors, setErrors] = useState({});

  // Set state for password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Set temporary user data to use for OTP verification
  const [tempUser, setTempUser] = useState(null);

  // Set state for the next step after login
  const [nextStep, setNextStep] = useState(1);

  // Set otp state
  const [otp, setOtp] = useState(Array(6).fill(''));

  // Set timer states for OTP
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds

  // Set state for OTP expiration
  const [otpExpired, setOtpExpired] = useState(false);

  usePageTitle('Login');

  console.log(user);

  useEffect(() => {
    let timer;
    if (nextStep === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } 

    if (timeLeft <= 0) {
      setOtpExpired(true);
    }

    return () => clearInterval(timer);
  }, [timeLeft, nextStep]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Assign reference to the login fields
  const loginRefs = {
    email: emailRef,
    password: passwordRef
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Create handlers for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues(prev => ({
      ...prev,
      [name]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Create handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop form default behavior

    // Step 1: Validate form for common errors (i.e., empty field, email don't exist, and wrong password)
    const formErrors = validateForm(values, { isForLogin: true });
    setErrors(formErrors);

    // Step 2: Stop submitting form if there are any form errors and autofocus on the first error
    if (Object.keys(formErrors).length > 0) {
      const firstErrorKey = Object.keys(formErrors)[0];
      const ref = loginRefs[firstErrorKey];
      ref?.current?.focus();
      ref?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      return;
    }

    // Step 3: Submit the form
    try {
      setIsLoading(true);
      const { data } = await loginUser({
        email: values.email,
        password: values.password
      });

      console.log('Backend response:', data);

      const { 
        email, fullName, profile_pic_path, 
        role,status 
      } = data.user;

      console.log(data);
      console.log('User:', { email, fullName, profile_pic_path, role, status });

      // Step 3.1: Show toast notif if login is unsuccessful
      if (!data?.success) {
        showErrorToast(LOGIN.UNSUCCESSFUL, 'top-center', 5000);
        return;
      }

      // Step 3.2: Save the data of the logged in user temporarily so that it can be use in creating session after OTP verification
      setTempUser(data.user);

      // Step 3.4: Reset field values after successful form submission
      setValues({
        ...values,
        email: '',
        password: ''
      });

      setNextStep(2);
      setTimeLeft(5 * 60); // reset timer
      setOtpExpired(false);

    } catch (error) {
      console.error(error.message);
      const { response } = error;
      const { data } = response;
      const { emailNotFound, wrongPassword } = data;

      if (emailNotFound) {
        setErrors({
          email: `Email does not exist. Make sure you are registered and/or verified by the admin.`
        });
      } 

      if (wrongPassword) {
        setErrors({
          password: `Wrong password!`
        });
      }

      if (error.response.data.error === 'EDNS') {
        showErrorToast("Can't send OTP to your email. Please check your internet connection and try again.", 'top-center', 8000);
      }

      if (error.code === 'ERR_NETWORK') {
        showErrorToast("Something went wrong. Please check your internet connection and try again.", 'top-center', 8000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIsPasswordVisible(false);
    setNextStep(1);
    setOtp(Array(6).fill(''));
    setTimeLeft(5 * 60);
    setOtpExpired(false);
  };

  const handleOtpChange = (val, index) => {
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); // prevent default form submit

    const otpCode = otp.join(''); // combine all OTP digits

    if (!tempUser) return;

    try {
      const { data } = await verifyOTP(
        tempUser.email, // or user.email if saved in context
        otpCode
      );

      console.log(data);

      if (!data.success) {
        showErrorToast(data.message || 'OTP verification failed', 'top-center', 5000);
        return;
      }

      // Now save the user in the context to be use by other components
      const { email, fullName, profile_pic_path, role, status } = tempUser;
      login(email, fullName, profile_pic_path, role, status);
      
      showSuccessToast('Logged in successfully!', 'top-center', 5000);

      // Navigate to dashboard or home page after OTP verification
      if (tempUser.role === USER_ROLES.DEAN) {
        navigate('/d', { replace: true });
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error(error);
      showErrorToast(error.response?.data?.message || 'OTP verification error', 'top-center', 5000);

    } finally {
      setTempUser(null);
    }
  };

  const handleResendOtp = async (email) => {
    setTimeLeft(5 * 60);
    setOtpExpired(false);

    await verifyOTP(email);

    showSuccessToast('New OTP sent!', 'top-center');

    console.log(email);
  };

  return {
    refs: {
      emailRef,
      passwordRef
    },

    datas: {
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
    },

    utils: {
      formatTime
    },

    handlers: {
      handleChange,
      handleSubmit,
      handleBackToLogin,
      handleOtpChange,
      handleVerifyOtp,
      handleResendOtp,
    }
  };
};

export default useLogin;