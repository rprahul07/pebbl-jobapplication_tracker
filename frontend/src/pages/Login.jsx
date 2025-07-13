import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import from React Router
import { useAppContext } from '../context/AppContext'; // ✅ Replace with actual import in your app

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { dispatch } = useAppContext();
  const navigate = useNavigate(); // ✅ Working navigate function

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      // Simulate login
      dispatch({ type: 'LOGIN', user: { id: '1', email, role: 'user' } });

      // ✅ Navigate to dashboard
      navigate('/dashboard');
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white bg-opacity-5 backdrop-filter backdrop-blur-lg border border-opacity-10 border-white rounded-xl shadow-lg p-8 md:p-10 w-full max-w-md flex flex-col items-center transform transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-xl"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-white text-shadow-md">
          Welcome Back!
        </h2>

        <input
          className="w-full mb-4 p-3 bg-white bg-opacity-10 border border-opacity-20 border-white rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200 ease-in-out"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full mb-6 p-3 bg-white bg-opacity-10 border border-opacity-20 border-white rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200 ease-in-out"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="text-red-300 mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-gray-700 to-gray-950 text-white font-bold text-lg rounded-lg shadow-md hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Login
        </button>

        <div className="mt-6 text-white text-opacity-80 text-sm">
          Don't have an account?{' '}
          <a href="#" className="font-semibold hover:underline text-white">
            Sign Up
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
