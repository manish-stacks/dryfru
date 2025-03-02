import React, { useState } from 'react';
import { Lock, Mail, Nut, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { Helmet } from 'react-helmet';

const ForgetPassword = () => {
    const [formData, setFormData] = useState({
        Email: '',
        newPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post('https://api.dyfru.com/api/v1/Password-Change-Request', formData);
            console.log('API Response:', response.data);
            setSuccessMessage(response.data.msg);
            setTimeout(() => {
                window.location.href = `/Verify-Otp?type=password_reset&email=${formData.Email}&changepassword=true`

            }, 1400)
        } catch (error) {
            console.error('API Error:', error);
            setErrorMessage('Failed to send password change request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>{`Reset Your Password - DyFru Account Recovery`}</title>
                <meta
                    name="description"
                    content="Forgot your DyFru account password? Reset it easily and securely to regain access to your account and continue shopping for premium dry fruits and nuts."
                />
                <meta
                    name="keywords"
                    content="reset password, DyFru account recovery, forgot password, recover account, dry fruits shopping, nuts online, login help, secure password reset"
                />
            </Helmet>


            <div className='min-h-screen bg-gradient-to-br from-green-50 to-orange-100 flex items-center justify-center p-4'>
                <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl'>
                    <div className='text-center'>
                        <div className='mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center'>
                            <Nut className='h-8 w-8 text-green-600' />
                        </div>
                        <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
                            Forget Password
                        </h2>
                        <p className='mt-2 text-sm text-gray-600'>
                            Enter your account email to receive a link allowing you to reset your password.
                        </p>
                    </div>

                    {/* Error and Success Message */}
                    {errorMessage && (
                        <div className="text-red-500 text-center">
                            <p>{errorMessage}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="text-green-500 text-center">
                            <p>{successMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
                        <div className='space-y-4'>
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email address
                                </label>
                                <div className='relative'>
                                    <div className='absolute z-20 inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Mail className='h-5 w-5 text-green-500' />
                                    </div>
                                    <input
                                        id="email"
                                        name="Email"
                                        type="email"
                                        autoComplete="email"
                                        value={formData.Email}
                                        onChange={handleChange}
                                        required
                                        className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500
                                    text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="Email address"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="sr-only">
                                    New Password
                                </label>
                                <div className='relative'>
                                    <div className='absolute z-20 inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Lock className='h-5 w-5 text-gray-500' />
                                    </div>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type={passwordVisible ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500
                                    text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="New Password"
                                    />
                                    <div
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                        onClick={togglePasswordVisibility}
                                    >
                                        {passwordVisible ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
                            >
                                {isSubmitting ? 'Sending request...' : 'Set Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ForgetPassword;
