import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.error_description || error.message);
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.error_description || error.message);
    } else {
      toast.success('Check your email for the verification link!');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">PassMan Login</h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in or create an account
        </p>
        <form>
          <div className="mb-4">
            <input
              className="rounded-md border border-gray-300 w-full p-3"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              className="rounded-md border border-gray-300 w-full p-3"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogin}
              className="flex-1 font-bold px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? <span>Loading...</span> : <span>Login</span>}
            </button>
            <button
              onClick={handleSignup}
              className="flex-1 font-bold px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              disabled={loading}
            >
              {loading ? <span>Loading...</span> : <span>Sign Up</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
