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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [bookingForm, setBookingForm] = useState({
    therapist: '',
    session: ''
  });
  
  const availableSessions = {
    'Dr. Mei Lee': [
      { date: '2026-01-08', start_time: '14:00:00', end_time: '15:00:00', display: '8th Jan 2026 - 2pm to 3pm' },
      { date: '2026-01-09', start_time: '14:00:00', end_time: '15:00:00', display: '9th Jan 2026 - 2pm to 3pm' },
      { date: '2026-01-09', start_time: '16:00:00', end_time: '17:00:00', display: '9th Jan 2026 - 4pm to 5pm' },
      { date: '2026-01-18', start_time: '14:00:00', end_time: '15:00:00', display: '18th Jan 2026 - 2pm to 3pm' },
      { date: '2026-01-22', start_time: '09:00:00', end_time: '10:00:00', display: '22nd Jan 2026 - 9am to 10am' }
    ],
    'Dr. John Smith': [
      { date: '2026-01-12', start_time: '10:00:00', end_time: '11:00:00', display: '12th Jan 2026 - 10am to 11am' },
      { date: '2026-01-12', start_time: '14:00:00', end_time: '15:00:00', display: '12th Jan 2026 - 2pm to 3pm' },
      { date: '2026-01-13', start_time: '15:00:00', end_time: '16:00:00', display: '13th Jan 2026 - 3pm to 4pm' },
      { date: '2026-01-18', start_time: '11:00:00', end_time: '12:00:00', display: '18th Jan 2026 - 11am to 12pm' },
      { date: '2026-01-25', start_time: '14:00:00', end_time: '15:00:00', display: '25th Jan 2026 - 2pm to 3pm' }
    ],
    'Dr. Wilson House': [
      { date: '2026-01-14', start_time: '09:00:00', end_time: '10:00:00', display: '14th Jan 2026 - 9am to 10am' },
      { date: '2026-01-14', start_time: '13:00:00', end_time: '14:00:00', display: '14th Jan 2026 - 1pm to 2pm' },
      { date: '2026-01-15', start_time: '11:00:00', end_time: '12:00:00', display: '15th Jan 2026 - 11am to 12pm' },
      { date: '2026-01-20', start_time: '10:00:00', end_time: '11:00:00', display: '20th Jan 2026 - 10am to 11am' },
      { date: '2026-01-24', start_time: '15:00:00', end_time: '16:00:00', display: '24th Jan 2026 - 3pm to 4pm' }
    ]
  };
  
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      appointment_id: 1,
      therapist_name: 'Dr. John Smith',
      appointment_date: '2025-03-10',
      start_time: '10:00:00',
      end_time: '11:00:00',
      status: 'Completed',
      session_note: 'The session went well, the patient showed significant improvement in their mood and behavior.',
      created_at: '2024-12-01 10:00:00'
    },
    {
      appointment_id: 2,
      therapist_name: 'Dr. Mei Lee',
      appointment_date: '2026-04-15',
      start_time: '11:00:00',
      end_time: '12:00:00',
      status: 'Pending',
      created_at: '2025-01-01 14:00:00'
    },
    {
      appointment_id: 3,
      therapist_name: 'Dr. Wilson House',
      appointment_date: '2026-05-20',
      start_time: '14:00:00',
      end_time: '15:00:00',
      status: 'Confirmed',
      created_at: '2025-01-10 11:00:00'
    },
    {
      appointment_id: 4,
      therapist_name: 'Dr. John Smith',
      appointment_date: '2026-06-10',
      start_time: '09:00:00',
      end_time: '10:00:00',
      status: 'Cancelled',
      cancel_reason: 'User no-show',
      cancelled_at: '2026-06-10 08:30:00',
      session_note: 'The appointment was cancelled as the patient did not show up.',
      created_at: '2025-01-20 13:00:00'
    },
    {
      appointment_id: 5,
      therapist_name: 'Dr. Mei Lee',
      appointment_date: '2026-07-10',
      start_time: '16:00:00',
      end_time: '17:00:00',
      status: 'Completed',
      session_note: 'The session was very productive, the patient made good progress in addressing their stress.',
      created_at: '2025-02-01 15:00:00'
    },
    {
      appointment_id: 6,
      therapist_name: 'Dr. Wilson House',
      appointment_date: '2026-08-05',
      start_time: '10:00:00',
      end_time: '11:00:00',
      status: 'Completed',
      session_note: 'The patient showed great engagement during the session and discussed their coping mechanisms.',
      created_at: '2025-02-15 10:30:00'
    }
  ]);

  // Load appointments from localStorage on mount
  useEffect(() => {
    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    }
  }, []);

  // Save appointments to localStorage whenever appointments change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const therapists = ['Dr. John Smith', 'Dr. Mei Lee', 'Dr. Wilson House'];

  const handleCancelClick = (appointment: Appointment) => {
    setCancellingAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    if (cancellingAppointment && cancelReason.trim()) {
      setAppointments(prev => prev.map(apt => 
        apt.appointment_id === cancellingAppointment.appointment_id 
          ? { ...apt, status: 'Cancelled', cancel_reason: cancelReason, cancelled_at: new Date().toISOString() }
          : apt
      ));
      setShowCancelModal(false);
      setCancellingAppointment(null);
      setCancelReason('');
    }
  };

  const handleBookingSubmit = () => {
    if (bookingForm.therapist && bookingForm.session) {
      const sessionData = availableSessions[bookingForm.therapist as keyof typeof availableSessions]
        .find(session => session.display === bookingForm.session);
      
      if (sessionData) {
        const newAppointment: Appointment = {
          appointment_id: Math.max(...appointments.map(a => a.appointment_id)) + 1,
          therapist_name: bookingForm.therapist,
          appointment_date: sessionData.date,
          start_time: sessionData.start_time,
          end_time: sessionData.end_time,
          status: 'Pending',
          created_at: new Date().toISOString()
        };
        
        setAppointments(prev => [...prev, newAppointment]);
        setShowBookingModal(false);
        setBookingForm({ therapist: '', session: '' });
      }
    }
  };
  
  // Filters
  const today = new Date();
  const upcoming = appointments.filter(apt => {
    const appointmentDate = new Date(apt.appointment_date);
    return appointmentDate > today && (apt.status === 'Pending' || apt.status === 'Confirmed');
  });
  const allAppointments = appointments;
  const displayList = activeTab === 'upcoming' ? upcoming : allAppointments;

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
            All Appointments
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
                            <button 
                                onClick={() => handleCancelClick(apt)}
                                className="text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            >
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
                        <select 
                            value={bookingForm.therapist}
                            onChange={(e) => setBookingForm({therapist: e.target.value, session: ''})}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                        >
                            <option value="">Choose a therapist</option>
                            {therapists.map(therapist => (
                                <option key={therapist} value={therapist}>{therapist}</option>
                            ))}
                        </select>
                    </div>
                    {bookingForm.therapist && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Available Sessions</label>
                            <select 
                                value={bookingForm.session}
                                onChange={(e) => setBookingForm({...bookingForm, session: e.target.value})}
                                className="w-full p-2 border border-slate-300 rounded-lg"
                            >
                                <option value="">Choose a session</option>
                                {availableSessions[bookingForm.therapist as keyof typeof availableSessions]?.map(session => (
                                    <option key={session.display} value={session.display}>{session.display}</option>
                                ))}
                            </select>
                        </div>
                    )}
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
                    <button onClick={handleBookingSubmit} className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">Submit Request</button>
                </div>
            </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Cancel Appointment</h3>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-slate-600">Are you sure you want to cancel your appointment with {cancellingAppointment?.therapist_name}?</p>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cancellation Reason *</label>
                        <textarea 
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm" 
                            rows={3} 
                            placeholder="Please provide a reason for cancellation..."
                            required
                        />
                    </div>
                </div>
                <div className="p-6 bg-slate-50 flex justify-end gap-3">
                    <button 
                        onClick={() => {
                            setShowCancelModal(false);
                            setCancellingAppointment(null);
                            setCancelReason('');
                        }} 
                        className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Keep Appointment
                    </button>
                    <button 
                        onClick={handleCancelConfirm}
                        disabled={!cancelReason.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel Appointment
                    </button>
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