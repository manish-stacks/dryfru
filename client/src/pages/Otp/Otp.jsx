import React, { useState, useRef } from 'react';
import { Nut, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
function Otp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputs = useRef([]);
  const location = new URLSearchParams(window.location.search)
  const phone = location.get('phone');
  const type = location.get('type');
  console.log(type)
  const email = location.get('email');

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);


    if (element.value !== '') {
      if (index < 3) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace') {
      if (index > 0 && otp[index] === '') {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6); // Allow up to 6 characters only
    if (/^\d+$/.test(pastedData)) {
      const otpArray = pastedData.split('').slice(0, 6); // Convert to array and limit to 6 digits
      setOtp([...otpArray, ...Array(6 - otpArray.length).fill('')]); // Fill the remaining slots with empty strings
      inputs.current[Math.min(otpArray.length, 5)].focus(); // Focus the next input field
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.join('').length !== 6) {
      toast.error('Please enter all digits');
      return;
    }
    try {
      const data = await axios.post('https://api.dyfru.com/api/v1/verify-otp', {
        email,
        otp,
        type: type
      })

      toast.success(data.data.mesage)
      sessionStorage.setItem('token_login', data.data?.token)

      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
      console.log(data.data)
    } catch (error) {
      toast.error(error.response.data.message || 'We are faccing some error please try again')
      console.log("i am error",error)
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('OTP Verification attempted with:', otp.join(''));
      setIsSubmitting(false);
    }, 2000);
  };

  const handleResend = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post('https://api.dyfru.com/api/v1/resend-otp', {
        email,
        type: type
      })
      console.log(data.data)
      toast.success(data.data.msg || 'OTP Verification Success')
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data.msg)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <Nut className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a code to your email {email}
          </p>
        </div>

        {/* Back Button */}
        <Link
          to={"/login"}
          onClick={() => window.history.back()}
          className="flex items-center text-sm text-green-600 hover:text-green-500"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to login
        </Link>

        {/* OTP Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(ref) => inputs.current[index] = ref}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
            >
              {isSubmitting ? 'Verifying...' : 'Verify'}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Didn't receive the code? </span>
            <a
              href="#"
              onClick={handleResend}
              className="font-medium text-green-600 hover:text-green-500"
            >
              Resend OTP
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Otp;