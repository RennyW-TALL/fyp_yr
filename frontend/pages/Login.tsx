import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    const staticUsers = {
      'student1': { role: 'student', password: 'abc123' },
      'counselor1': { role: 'counselor', password: 'abc123' },
      'admin01': { role: 'admin', password: 'abc123' }
    };

    const user = staticUsers[formData.username as keyof typeof staticUsers];
    
    if (user && user.password === formData.password) {
      setMessage({ type: 'success', text: `Login successful as ${user.role.toUpperCase()}! Redirecting...` });
      
      const userData = {
        username: formData.username,
        role: user.role
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      setTimeout(() => {
        if (user.role === 'student') {
          navigate('/student/dashboard');
        } else if (user.role === 'counselor') {
          navigate('/counselor/dashboard');
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard');
        }
      }, 1500);
    } else {
      setMessage({ type: 'error', text: 'Invalid username or password' });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <Link to="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Main Page</span>
          </Link>
          
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center gap-2 mb-4">
              <Brain className="h-10 w-10 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">MindCare APU</span>
            </Link>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-600">
              Sign in to continue to your dashboard
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50/50"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50/50"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Static Login Info */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Demo Accounts:</h3>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Student: <code className="bg-white px-1 rounded">student1</code> / <code className="bg-white px-1 rounded">abc123</code></div>
              <div>Counselor: <code className="bg-white px-1 rounded">counselor1</code> / <code className="bg-white px-1 rounded">abc123</code></div>
              <div>Admin: <code className="bg-white px-1 rounded">admin01</code> / <code className="bg-white px-1 rounded">abc123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;