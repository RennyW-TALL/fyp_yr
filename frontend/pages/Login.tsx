import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      // Determine redirection based on mock user logic or wait for auth state update
      // Since context updates synchronously after await in mock, we can just let App.tsx handle redirect
      // or manually redirect if needed immediately.
      // However, App.tsx is better for protection. But let's check mock data here for a redirect hint.
      if (email.includes('admin')) navigate('/admin/dashboard');
      else if (email.includes('student')) navigate('/student/dashboard');
      else navigate('/counselor/dashboard');

    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const redirectToRegistration = () => {
    navigate('/register');
  };

  const populateDemo = (role: 'student' | 'admin' | 'counselor') => {
    switch(role) {
        case 'student':
            setEmail('student1@apu.edu.my');
            setPassword('Student@123');
            break;
        case 'admin':
            setEmail('admin@apumentalhealth.edu');
            setPassword('Admin@123');
            break;
        case 'counselor':
            setEmail('counselor1@apu.edu.my');
            setPassword('Counselor@123');
            break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Sign in to access the MindCare portal</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start gap-3 rounded-r">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                        placeholder="you@apu.edu.my"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-2.5 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button 
                    onClick={redirectToRegistration}
                    className="text-brand-600 hover:text-brand-700 font-medium underline"
                >
                    Register here
                </button>
            </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-center text-slate-500 mb-3">Quick Fill (Demo Only)</p>
            <div className="flex justify-center gap-2">
                <button onClick={() => populateDemo('student')} className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded text-slate-600">Student</button>
                <button onClick={() => populateDemo('counselor')} className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded text-slate-600">Counselor</button>
                <button onClick={() => populateDemo('admin')} className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded text-slate-600">Admin</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;