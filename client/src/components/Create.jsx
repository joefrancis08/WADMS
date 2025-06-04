import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';



function Create() {
    const [values, setValues] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        // Here you would typically handle the form submission, e.g., send the data to an API
        axios.post('http://localhost:5000/register_user', values)
        .then((res) => {
                console.log(res)
                navigate('/home'); // Redirect to home page after successful registration
        })
        .catch((err) => console.error(err));
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <div>
                <img src="/CGS_Logo.png" alt="Logo" className=" h-20 mx-auto mb-4" />
            </div>
            <h2 className="font-bold mb-6 text-center text-green-700">Web-Based Document Management System</h2>
            <hr className="opacity-20"/>
            <h2 className="text-2xl font-bold mb-6 mt-6 text-center">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="input-label-style">Full Name</label>
                    <input 
                        type="text" 
                        id="fullName" 
                        className="input-field-style" 
                        onChange={(e) => setValues({...values, fullName: e.target.value})} 
                    />
                </div>
                <div>
                    <label htmlFor="email" className="input-label-style">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        className="input-field-style" 
                        onChange={(e) => setValues({...values, email: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="input-label-style">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        className="input-field-style" 
                        onChange={(e) => setValues({...values, password: e.target.value})}
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer">Register</button>
                <p className="text-center mt-4">
                    Already have an account? 
                    <Link to="/login" className="text-blue-500 hover:underline"> Login </Link>
                </p>
            </form>
        </div>
    </div>
  )
}

export default Create
