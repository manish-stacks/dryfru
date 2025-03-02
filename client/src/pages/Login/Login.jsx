import React, { useState } from 'react';
import { Lock, Mail, Nut } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('https://api.dyfru.com/api/v1/login', {
        Email: email,
        Password: password,
      })
      console.log(response.data)
      setIsSubmitting(false);
      toast.success('Successfully logged in')
      sessionStorage.setItem('token_login', response.data.token);
      window.location.href = '/'
    } catch (error) {
      console.log(error)
      const data = error?.response?.data?.data
      if (error.status === 403) {
        window.location.href = `/Verify-Otp?type=register&email=${data}`
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        toast.error(error?.response?.data?.message)
      }

    }


  };

  return (
    <>
    <Helmet>
  <title>{`Login to DyFru - Access Your Account`}</title>
  <meta 
    name="description" 
    content="Login to your DyFru account to manage orders, track shipments, and shop for premium dry fruits and nuts online with ease." 
  />
  <meta 
    name="keywords" 
    content="DyFru login, account access, sign in DyFru, dry fruits shopping, nuts online, track orders, manage account, online dry fruits store" 
  />
</Helmet>

    
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <Nut className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your Nutri Delights account
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 z-10 pl-3 flex items-center pointer-events-none" style={{
                  zIndex: '9999',
                }}>
                  <Mail className="h-5 w-5 text-green-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{
                  zIndex: '9999',
                }}>
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgetpassword"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              to={'/register'}
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign up now
            </Link>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default Login;
