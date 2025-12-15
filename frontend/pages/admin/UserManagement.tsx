import React from 'react';
import { MOCK_USERS } from '../../constants';
import { MoreVertical, Search, Filter } from 'lucide-react';
import { Role, UserStatus } from '../../types';

const UserManagement = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
       <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                <p className="text-slate-500">Manage access and roles for all users.</p>
            </div>
            <button className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-brand-700 transition-colors">
                + Add User
            </button>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..."
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                </div>
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center text-sm font-medium">
                    <Filter className="h-4 w-4 mr-2" /> Filter
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_USERS.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{user.name}</p>
                                            <p className="text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                        user.role === Role.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                        user.role === Role.COUNSELOR ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                        'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 ${
                                        user.status === UserStatus.ACTIVE ? 'text-green-600' :
                                        user.status === UserStatus.PENDING ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${
                                            user.status === UserStatus.ACTIVE ? 'bg-green-500' :
                                            user.status === UserStatus.PENDING ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`}></span>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-600 p-1">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
       </div>
    </div>
  );
};

export default UserManagement;