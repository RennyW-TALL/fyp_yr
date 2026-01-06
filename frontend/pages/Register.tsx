import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [userType, setUserType] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Student fields
    tp_number: '',
    full_name: '',
    gender: '',
    age: '',
    course: '',
    year_of_study: '',
    // Therapist fields
    specialization: '',
    max_daily_sessions: '6'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: userType,
        ...(userType === 'student' ? {
          tp_number: formData.tp_number,
          full_name: formData.full_name,
          gender: formData.gender,
          age: parseInt(formData.age),
          course: formData.course,
          year_of_study: parseInt(formData.year_of_study)
        } : {
          full_name: formData.full_name,
          gender: formData.gender,
          specialization: formData.specialization,
          max_daily_sessions: parseInt(formData.max_daily_sessions)
        })
      };

      const response = await fetch('http://13.251.172.57/API/auth/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Registration successful! Redirecting to login...' });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div>
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <Brain className="h-8 w-8 text-brand-600" />
            <span className="text-xl font-bold text-slate-900">MindCare APU</span>
          </Link>
          <h2 className="text-center text-3xl font-extrabold text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Register as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('student')}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                  userType === 'student'
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setUserType('counselor')}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                  userType === 'counselor'
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Therapist
              </button>
            </div>
          </div>

          {/* Basic Account Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="block w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Role-specific fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">
              {userType === 'student' ? 'Student Information' : 'Therapist Information'}
            </h3>

            {userType === 'student' ? (
              <>
                <div>
                  <label htmlFor="tp_number" className="block text-sm font-medium text-slate-700">
                    TP Number
                  </label>
                  <input
                    id="tp_number"
                    name="tp_number"
                    type="text"
                    required
                    maxLength={6}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="e.g., 032244"
                    value={formData.tp_number}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-slate-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-slate-700">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="16"
                    max="100"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-slate-700">
                    Course
                  </label>
                  <input
                    id="course"
                    name="course"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="e.g., Computer Science"
                    value={formData.course}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="year_of_study" className="block text-sm font-medium text-slate-700">
                    Year of Study
                  </label>
                  <select
                    id="year_of_study"
                    name="year_of_study"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    value={formData.year_of_study}
                    onChange={handleChange}
                  >
                    <option value="">Select year</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="e.g., Dr. John Smith"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-slate-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-slate-700">
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="e.g., Anxiety & Stress"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="max_daily_sessions" className="block text-sm font-medium text-slate-700">
                    Max Daily Sessions
                  </label>
                  <input
                    id="max_daily_sessions"
                    name="max_daily_sessions"
                    type="number"
                    min="1"
                    max="12"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    value={formData.max_daily_sessions}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>

          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;