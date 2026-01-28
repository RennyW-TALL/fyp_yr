import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, User, Calendar, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Static profile for student1, dynamic profile for new users
  const studentProfile = user?.username === 'student1' ? {
    name: 'Wong Yi Ren',
    username: 'student1',
    gender: 'Male',
    age: 21,
    course: 'Computer Science',
    year: 3
  } : {
    name: user?.fullName || user?.username || 'Student',
    username: user?.username || '',
    gender: user?.gender || 'Not specified',
    age: user?.age || 'Not specified',
    course: user?.course || 'Not specified',
    year: user?.yearOfStudy || 'Not specified'
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/student/dashboard" className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MindCare APU
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            to="/student/appointments"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/student/appointments'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Appointments</span>
          </Link>

          <Link
            to="/student/phq9"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/student/phq9'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
            }`}
          >
            <Brain className="h-4 w-4" />
            <span className="font-medium">PHQ-9</span>
          </Link>

          <Link
            to="/student/chat"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/student/chat'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
            }`}
          >
            <Brain className="h-4 w-4" />
            <span className="font-medium">AI Chat</span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <User className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">{studentProfile.name}</span>
              <ChevronDown className="h-4 w-4 text-slate-600" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-2">Profile</h3>
                  <div className="space-y-1 text-sm text-slate-600">
                    <div><span className="font-medium">Name:</span> {studentProfile.name}</div>
                    <div><span className="font-medium">Username:</span> {studentProfile.username}</div>
                    <div><span className="font-medium">Gender:</span> {studentProfile.gender}</div>
                    <div><span className="font-medium">Age:</span> {studentProfile.age}</div>
                    <div><span className="font-medium">Course:</span> {studentProfile.course}</div>
                    <div><span className="font-medium">Year:</span> {studentProfile.year}</div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
      
      {/* Backdrop to close dropdown */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </header>
  );
};

export default StudentHeader;