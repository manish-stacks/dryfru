import React, { useState } from 'react';
import { Lock, Mail, Nut, Phone, User, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

function Register() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [Msg, setMsg] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        Name: '',
        Email: '',
        Password: '',
        ContactNumber: ''
    });

    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        Password: '',
        ContactNumber: ''
    });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const validateForm = () => {
        const errors = {
            Name: '',
            Email: '',
            Password: '',
            ContactNumber: ''
        };
        let isValid = true;

        // Name validation
        if (formData.Name.trim().length < 2) {
            errors.Name = 'Name must be at least 2 characters long';
            isValid = false;
        }

        // Email validation
        if (!validateEmail(formData.Email)) {
            errors.Email = 'Please enter a valid email address';
            isValid = false;
        }

        // Password validation
        if (formData.Password.length < 6) {
            errors.Password = 'Password must be at least 6 characters long';
            isValid = false;
        }

        // Phone validation
        if (!validatePhone(formData.ContactNumber)) {
            errors.ContactNumber = 'Please enter a valid 10-digit phone number';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Clear validation error when user starts typing
        setValidationErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setMsg('');

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('https://api.dyfru.com/api/v1/regsiter-user', formData);
            console.log(response.data.data)
            const user = response.data.data
            setSuccess(response.data.message);
            window.location.href = `/Verify-Otp?type=register&email=${user?.Email || formData.Email}&number=${user?.ContactNumber || formData.ContactNumber}`
            setFormData({
                Name: '',
                Email: '',
                Password: '',
                ContactNumber: ''
            });
        } catch (error) {
            console.log(error)
            if (error?.response?.data.message === "An account already exists with this email. Please verify your email or reset your password if you forgot it.") {
                setMsg('An account already exists with this email. Please verify your email or reset your password if you forgot it. Redirecting....');
                setTimeout(() => {
                    window.location.href = `/Verify-Otp?type=register&email=${formData.Email}&number=${formData.ContactNumber}&reverify=true`

                }, 2000);
            } else {
                setError(error?.response?.data.message || 'An error occurred during registration');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (

        <>
        <Helmet>
  <title>{`Create an Account - Join DyFru Today!`}</title>
  <meta 
    name="description" 
    content="Sign up for a DyFru account and enjoy a seamless shopping experience. Get access to premium dry fruits, exclusive offers, and fast delivery." 
  />
  <meta 
    name="keywords" 
    content="register DyFru, create account, sign up, join DyFru, dry fruits online, buy nuts, healthy snacks, premium dry fruits store" 
  />
</Helmet>

        <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Nut className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome To Register
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Register to your Nutri Delights account
                    </p>
                </div>

                {(error || success || Msg) && (
                    <div className={`p-4 rounded-lg ${error ? 'bg-red-100 text-red-700' : success ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {error || success || Msg}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 z-20 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    name="Name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.Name}
                                    onChange={onChange}
                                    className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${validationErrors.Name ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                                    placeholder="Full Name"
                                />
                            </div>
                            {validationErrors.Name && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.Name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 z-20 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="Email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.Email}
                                    onChange={onChange}
                                    className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${validationErrors.Email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                                    placeholder="Email Address"
                                />
                            </div>
                            {validationErrors.Email && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.Email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 z-20 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="Password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.Password}
                                    onChange={onChange}
                                    className={`appearance-none relative block w-full pl-10 pr-10 py-2 border ${validationErrors.Password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {validationErrors.Password && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.Password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 z-20 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="contactNumber"
                                    name="ContactNumber"
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    value={formData.ContactNumber}
                                    onChange={onChange}
                                    className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${validationErrors.ContactNumber ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                                    placeholder="Contact Number"
                                />
                            </div>
                            {validationErrors.ContactNumber && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.ContactNumber}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create An Account'}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-600">Already Have an Account? </span>
                        <Link
                            to="/login"
                            className="font-medium text-green-600 hover:text-green-500"
                        >
                            Sign In now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
}

export default Register;