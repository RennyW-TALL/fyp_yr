import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, LogOut, Calendar, MessageCircle, User } from 'lucide-react';

const StudentDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'student') {
      navigate('/login');
      return;
    }
    
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-brand-600" />
              <span className="text-xl font-bold text-slate-900">MindCare APU</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your mental health journey</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Book Appointment</h3>
            </div>
            <p className="text-slate-600 mb-4">Schedule a session with a counselor</p>
            <button className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
              Book Now
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">AI Chat</h3>
            </div>
            <p className="text-slate-600 mb-4">Talk to our AI assistant for initial support</p>
            <button className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Profile</h3>
            </div>
            <p className="text-slate-600 mb-4">Update your personal information</p>
            <button className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-slate-500">
            No recent activity to display
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;