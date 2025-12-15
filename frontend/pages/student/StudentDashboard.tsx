import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, Activity, ArrowRight, BookOpen } from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const moodData = [
  { day: 'Mon', mood: 6 },
  { day: 'Tue', mood: 7 },
  { day: 'Wed', mood: 5 },
  { day: 'Thu', mood: 8 },
  { day: 'Fri', mood: 7 },
  { day: 'Sat', mood: 9 },
  { day: 'Sun', mood: 8 },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const nextAppointment = MOCK_APPOINTMENTS.find(a => a.studentId === user?.id && a.status === 'CONFIRMED');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-500">How are you feeling today?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
            <Link to="/student/chat" className="p-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl shadow-lg text-white hover:shadow-brand-200/50 transition-all hover:-translate-y-1">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-1">Talk to AI Assistant</h3>
                <p className="text-brand-100 text-sm mb-4">Feeling overwhelmed? Chat safely and privately.</p>
                <div className="flex items-center text-sm font-medium">Start Chat <ArrowRight className="ml-2 h-4 w-4"/></div>
            </Link>

            <Link to="/student/appointments" className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all">
                <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Book Counseling</h3>
                <p className="text-slate-500 text-sm mb-4">Schedule a session with a certified counselor.</p>
                <div className="flex items-center text-sm font-medium text-brand-600">Schedule Now <ArrowRight className="ml-2 h-4 w-4"/></div>
            </Link>
        </div>

        {/* Next Appointment Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-brand-500" /> Upcoming Session
            </h3>
            {nextAppointment ? (
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="font-semibold text-slate-900">{nextAppointment.date}</p>
                        <p className="text-slate-500 text-sm">{nextAppointment.time}</p>
                        <div className="mt-2 text-xs font-medium text-brand-600 bg-brand-50 inline-block px-2 py-1 rounded">
                            {nextAppointment.type}
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">Counselor: <span className="text-slate-900 font-medium">{nextAppointment.counselorName}</span></p>
                </div>
            ) : (
                <div className="h-32 flex flex-col items-center justify-center text-center">
                    <p className="text-slate-400 text-sm mb-3">No upcoming appointments</p>
                    <Link to="/student/appointments" className="text-sm font-medium text-brand-600 hover:underline">Book a session</Link>
                </div>
            )}
        </div>
      </div>

      {/* Mood Tracker & Resources */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-brand-500" /> Weekly Mood Check-in
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={moodData}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                        <YAxis hide domain={[0, 10]} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="mood" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-brand-500" /> Self-Assessment Tools
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div>
                        <h4 className="font-semibold text-slate-800">PHQ-9 Assessment</h4>
                        <p className="text-xs text-slate-500">Screening for depressive symptoms</p>
                    </div>
                    <button className="text-sm font-medium text-brand-600 bg-white px-3 py-1.5 border border-slate-200 rounded-lg shadow-sm">Start</button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div>
                        <h4 className="font-semibold text-slate-800">DASS-21 Assessment</h4>
                        <p className="text-xs text-slate-500">Depression, Anxiety & Stress Scale</p>
                    </div>
                    <button className="text-sm font-medium text-brand-600 bg-white px-3 py-1.5 border border-slate-200 rounded-lg shadow-sm">Start</button>
                </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <h4 className="text-sm font-bold text-yellow-800 mb-1">Note:</h4>
                <p className="text-xs text-yellow-700">These tools are for screening only and do not provide a medical diagnosis. Results are private.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;