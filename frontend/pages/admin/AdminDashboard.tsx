import React from 'react';
import { Users, UserPlus, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { MOCK_USERS } from '../../constants';
import { UserStatus } from '../../types';

const AdminDashboard = () => {
  const pendingCounselors = MOCK_USERS.filter(u => u.status === UserStatus.PENDING);
  const totalUsers = MOCK_USERS.length;
  const suspendedUsers = MOCK_USERS.filter(u => u.status === UserStatus.SUSPENDED).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">System overview and user management.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                    <Users className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalUsers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                    <UserPlus className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Pending Approval</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{pendingCounselors.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-3 rounded-xl text-red-600">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Suspended</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{suspendedUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-xl text-green-600">
                    <Shield className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">System Status</span>
            </div>
            <p className="text-xl font-bold text-slate-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Operational
            </p>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Pending Counselor Registrations</h3>
        </div>
        <div className="divide-y divide-slate-100">
            {pendingCounselors.length > 0 ? (
                pendingCounselors.map(user => (
                    <div key={user.id} className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{user.name}</p>
                                <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors">Reject</button>
                            <button className="px-4 py-2 text-sm bg-brand-600 text-white font-medium hover:bg-brand-700 rounded-lg transition-colors flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2" /> Approve
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-8 text-center text-slate-500">No pending registrations.</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;