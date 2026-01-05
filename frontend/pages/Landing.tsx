import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, ShieldCheck, HeartPulse, Activity } from 'lucide-react';
import { SDG_INFO } from '../constants';
import { API_ENDPOINTS } from '../api';

const Landing = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ENDPOINTS.USERS_LIST)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUsers(data.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-brand-600" />
                <span className="text-xl font-bold text-slate-900">MindCare APU</span>
            </div>
            <Link to="/login" className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
                Portal Login
            </Link>
        </nav>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-6">
                APU Final Year Project 2024
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                Cloud-Based Mental Healthcare <br className="hidden md:block"/> Platform testing
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                A secure, role-based platform bridging the gap between students and professional counseling through ethical AI screening and streamlined appointment management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login" className="px-8 py-3 bg-brand-600 text-white rounded-xl font-semibold shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all transform hover:-translate-y-0.5">
                    Student Access
                </Link>
                <Link to="/login" className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                    Staff Login
                </Link>
            </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Registered Users</h2>
        {loading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.user_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'counselor' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_active === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active === '1' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                    <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Early Detection</h3>
                <p className="text-slate-600 leading-relaxed">
                    AI-driven conversations to identify early signs of stress and burnout using NLP, guiding students to appropriate resources.
                </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                    <HeartPulse className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{SDG_INFO.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                    Directly aligned with UN SDG 3 Target 3.4 to promote mental health and well-being within the university community.
                </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Ethical & Secure</h3>
                <p className="text-slate-600 leading-relaxed">
                    Prioritizing student privacy with role-based access control. Not a clinical diagnostic tool, but a supportive bridge to care.
                </p>
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <p className="font-semibold text-white">Asia Pacific University (APU)</p>
                <p className="text-sm">BSc (Hons) in Information Technology (Cloud Engineering)</p>
            </div>
            <div className="text-sm text-center md:text-right">
                <p>FYP Investigation Report - Part 1</p>
                <p>&copy; 2024 MindCare Project. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;