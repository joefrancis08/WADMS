import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../utils/toastNotification.js';
import SubmitButton from '../components/Registration-and-Login/SubmitButton.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Register() {
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Step 1: Get all users from backend
      const { data } = await axios.get(`${API_BASE_URL}/users`);
      const users = data.data; // Fix: access the actual array
      console.log(data);

      // Step 2: Check if email already exists
      const existingUser = users.find(user => user.email === values.email);
      if (existingUser) {
        showErrorToast('Email already exists. Please use a different one.');
        return; // Stop form submission
      }

      // Step 3: Register the user
      const res = await axios.post(`${API_BASE_URL}/users`, values);
      const response = res.data;

      if (!response.success) {
        showErrorToast('Registration unsuccessful. Try again.');
        return;
      }

      showSuccessToast('Registration successful. Your credentials will be verified by the admin.');
      navigate('/');
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
        <h2 className="text-2xl font-bold mb-6 mt-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="input-label-style">Full Name</label>
            <input
              type="text"
              id="fullName"
              className="input-field-style"
              onChange={(e) => setValues({ ...values, fullName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="email" className="input-label-style">Email</label>
            <input
              type="email"
              id="email"
              className="input-field-style"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="input-label-style">Password</label>
            <input
              type="password"
              id="password"
              className="input-field-style"
              onChange={(e) => setValues({ ...values, password: e.target.value })}
            />
          </div>
          <div>
            <SubmitButton>
              Register
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
