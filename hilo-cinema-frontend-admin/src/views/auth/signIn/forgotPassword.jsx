import React, { useState } from 'react';
import darkLogo from '../../../assets/img/darkLogo.png'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
function ForgotPassword() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic here
    console.log('Email or Phone:', emailOrPhone);
    history.push('/verify-otp');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white flex items-center p-10 rounded-md shadow-md w-full max-w-4xl">
        {/* Logo và tiêu đề */}
        <div className="w-1/2 pr-10">
          <img
            src={darkLogo}
            alt="Google logo"
            className="w-20"
          />
          <h1 className="text-3xl font-bold mb-2">Tìm email của bạn</h1>
          <p className="text-gray-600">Enter your recovery phone number or email</p>
        </div>
        {/* Form */}
        <div className="w-1/2">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              
            >
              Continute
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
