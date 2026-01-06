import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar as CalendarIcon, Clock, Video, MapPin, XCircle, Plus, CheckCircle2 } from 'lucide-react';
import StudentHeader from '../../components/StudentHeader';
import CareCompanion from '../../components/CareCompanion';

interface Appointment {
  appointment_id: number;
  therapist_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  cancel_reason?: string;
  cancelled_at?: string;
  session_note?: string;
  created_at: string;
}

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await fetch('/data/appointments.csv');
      const csvText = await response.text();
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      
      const appointmentData = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',');
        const appointment: any = {};
        headers.forEach((header, index) => {
          appointment[header.trim()] = values[index]?.trim() || '';
        });
        return appointment as Appointment;
      });
      
      setAppointments(appointmentData);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };
  
  // Filters
  const today = new Date();
  const upcoming = appointments.filter(apt => {
    const appointmentDate = new Date(apt.appointment_date);
    return appointmentDate > today && (apt.status === 'Pending' || apt.status === 'Confirmed');
  });
  const past = appointments.filter(apt => {
    const appointmentDate = new Date(apt.appointment_date);
    return appointmentDate <= today || apt.status === 'Completed' || apt.status === 'Cancelled';
  });
  const displayList = activeTab === 'upcoming' ? upcoming : past;

  return (
    <>
      <StudentHeader />
      <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
        <button 
            onClick={() => setShowBookingModal(true)}
            className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
        >
            <Plus className="h-5 w-5 mr-2" />
            New Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button 
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'upcoming' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
            Upcoming
        </button>
        <button 
            onClick={() => setActiveTab('past')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'past' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
            Past History
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {displayList.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900">No appointments found</h3>
                <p className="text-slate-500">You don't have any {activeTab} appointments.</p>
            </div>
        ) : (
            displayList.map(apt => (
                <div key={apt.appointment_id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-600' : apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-500'}`}>
                            {apt.status === 'Confirmed' && <CheckCircle2 className="h-6 w-6" />}
                            {apt.status === 'Pending' && <Clock className="h-6 w-6" />}
                            {(apt.status === 'Cancelled' || apt.status === 'Completed') && <CalendarIcon className="h-6 w-6" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{apt.therapist_name}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                                <span className="flex items-center"><CalendarIcon className="h-4 w-4 mr-1"/> {apt.appointment_date}</span>
                                <span className="flex items-center"><Clock className="h-4 w-4 mr-1"/> {apt.start_time} - {apt.end_time}</span>
                            </div>
                            {apt.session_note && (
                                <p className="text-sm text-slate-600 mt-2 italic">{apt.session_note}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${apt.status === 'Confirmed' ? 'bg-green-50 text-green-700' : ''}
                            ${apt.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : ''}
                            ${apt.status === 'Cancelled' ? 'bg-red-50 text-red-700' : ''}
                            ${apt.status === 'Completed' ? 'bg-slate-100 text-slate-700' : ''}
                        `}>
                            {apt.status}
                        </div>
                        {apt.status === 'Pending' && (
                            <button className="text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100">
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Booking Modal (Static for visual) */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Request Appointment</h3>
                    <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-slate-600">
                        <XCircle className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Counselor</label>
                        <select className="w-full p-2 border border-slate-300 rounded-lg">
                            <option>Dr. Sarah Counselor</option>
                            <option>Mr. David Smith (Available)</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input type="date" className="w-full p-2 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                            <input type="time" className="w-full p-2 border border-slate-300 rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Session Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-slate-50">
                                <input type="radio" name="type" className="text-brand-600" defaultChecked />
                                <span>In-Person (Campus)</span>
                            </label>
                            <label className="flex items-center gap-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-slate-50">
                                <input type="radio" name="type" className="text-brand-600" />
                                <span>Online (Teams)</span>
                            </label>
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Reason (Optional)</label>
                         <textarea className="w-full p-2 border border-slate-300 rounded-lg text-sm" rows={3} placeholder="Briefly describe what you'd like to discuss..."></textarea>
                    </div>
                </div>
                <div className="p-6 bg-slate-50 flex justify-end gap-3">
                    <button onClick={() => setShowBookingModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                    <button onClick={() => setShowBookingModal(false)} className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">Submit Request</button>
                </div>
            </div>
        </div>
      )}
      </div>
      <CareCompanion />
    </>
  );
};

export default AppointmentsPage;