import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, User, Calendar } from 'lucide-react';

const StudentHeader = () => {
  const location = useLocation();

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

          {/* User Profile */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
            <User className="h-5 w-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Student</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default StudentHeader;