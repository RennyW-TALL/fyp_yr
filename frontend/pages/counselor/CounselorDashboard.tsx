import React from 'react';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const CounselorDashboard = () => {
  const { user } = useAuth();
  // Filter for this counselor in real app
  const pendingRequests = MOCK_APPOINTMENTS.filter(a => a.status === 'PENDING');
  const todayAppointments = MOCK_APPOINTMENTS.filter(a => a.status === 'CONFIRMED');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Counselor Dashboard</h1>
        <p className="text-slate-500">Manage your schedule and student requests.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Pending Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-orange-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" /> Pending Requests
                </h3>
                <span className="bg-white px-2 py-0.5 rounded text-xs font-bold text-orange-600 border border-orange-100">
                    {pendingRequests.length}
                </span>
            </div>
            <div className="divide-y divide-slate-100">
                {pendingRequests.map(apt => (
                    <div key={apt.id} className="p-6">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-slate-900">{apt.studentName}</h4>
                                <p className="text-sm text-slate-500">Student ID: {apt.studentId}</p>
                            </div>
                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">{apt.type}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                            <span className="flex items-center"><Calendar className="h-4 w-4 mr-1.5"/> {apt.date}</span>
                            <span className="flex items-center"><Clock className="h-4 w-4 mr-1.5"/> {apt.time}</span>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
                                <XCircle className="h-4 w-4" /> Decline
                            </button>
                            <button className="flex-1 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 flex items-center justify-center gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Approve
                            </button>
                        </div>
                    </div>
                ))}
                {pendingRequests.length === 0 && <div className="p-8 text-center text-slate-500">No pending requests.</div>}
            </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-blue-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-brand-600" /> Confirmed Appointments
                </h3>
            </div>
            <div className="divide-y divide-slate-100">
                {todayAppointments.map(apt => (
                    <div key={apt.id} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                        <div>
                            <p className="font-bold text-slate-900 text-lg">{apt.time}</p>
                            <p className="text-slate-600 font-medium">{apt.studentName}</p>
                            <p className="text-xs text-slate-400 mt-1">{apt.type} Session</p>
                        </div>
                        <button className="px-4 py-2 text-sm text-brand-600 border border-brand-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-50">
                            View Details
                        </button>
                    </div>
                ))}
                {todayAppointments.length === 0 && <div className="p-8 text-center text-slate-500">No appointments today.</div>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorDashboard;