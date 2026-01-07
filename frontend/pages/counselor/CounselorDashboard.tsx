import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Clock, ChevronLeft, ChevronRight, X, Check, XCircle } from 'lucide-react';

interface Appointment {
  id: number;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  reason: string;
  cancelRemark?: string;
}

interface Session {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  month: string;
  bookedBy?: string;
}

const CounselorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'appointments' | 'sessions' | 'history'>('appointments');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // January 2026
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayPopup, setShowDayPopup] = useState(false);
  const [sessionForm, setSessionForm] = useState({ date: '', time: '' });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
  const [cancelRemark, setCancelRemark] = useState('');

  const counselorProfile = {
    name: 'Dr John Smith',
    gender: 'Male',
    specialty: 'Anxiety & Stress'
  };

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, studentName: 'Wong Yi Ren', date: '2026-01-15', startTime: '10:00', endTime: '11:00', status: 'Pending', reason: 'Anxiety issues' },
    { id: 2, studentName: 'Sarah Lee', date: '2026-01-20', startTime: '14:00', endTime: '15:00', status: 'Pending', reason: 'Stress management' },
    { id: 3, studentName: 'John Doe', date: '2026-01-25', startTime: '09:00', endTime: '10:00', status: 'Confirmed', reason: 'Depression' }
  ]);

  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, date: '2026-01-15', startTime: '10:00', endTime: '11:00', month: 'January', bookedBy: 'Wong Yi Ren' },
    { id: 2, date: '2026-01-20', startTime: '14:00', endTime: '15:00', month: 'January', bookedBy: 'Sarah Lee' },
    { id: 3, date: '2026-01-25', startTime: '09:00', endTime: '10:00', month: 'January', bookedBy: 'John Doe' },
    { id: 4, date: '2026-01-18', startTime: '11:00', endTime: '12:00', month: 'January' },
    { id: 5, date: '2026-02-10', startTime: '10:00', endTime: '11:00', month: 'February' },
    { id: 6, date: '2026-02-15', startTime: '14:00', endTime: '15:00', month: 'February' },
    { id: 7, date: '2026-03-05', startTime: '09:00', endTime: '10:00', month: 'March' }
  ]);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleAccept = (id: number) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: 'Confirmed' } : apt));
  };

  const handleCancelClick = (appointment: Appointment) => {
    setCancellingAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    if (cancellingAppointment && cancelRemark.trim()) {
      setAppointments(prev => prev.map(apt => 
        apt.id === cancellingAppointment.id 
          ? { ...apt, status: 'Cancelled', cancelRemark } 
          : apt
      ));
      setShowCancelModal(false);
      setCancellingAppointment(null);
      setCancelRemark('');
    }
  };

  const handleCreateSession = () => {
    if (sessionForm.date && sessionForm.time) {
      const [hours] = sessionForm.time.split(':');
      const endHour = String(parseInt(hours) + 1).padStart(2, '0');
      const endTime = `${endHour}:00`;
      const sessionDate = new Date(sessionForm.date);
      const monthName = sessionDate.toLocaleString('default', { month: 'long' });
      
      const newSession: Session = {
        id: sessions.length + 1,
        date: sessionForm.date,
        startTime: sessionForm.time,
        endTime: endTime,
        month: monthName
      };
      
      setSessions(prev => [...prev, newSession]);
      setSessionForm({ date: '', time: '' });
      setShowSessionForm(false);
    }
  };

  const changeMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    
    // Limit to Jan 2026 - March 2026
    if (newMonth >= new Date(2026, 0, 1) && newMonth <= new Date(2026, 2, 31)) {
      setCurrentMonth(newMonth);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const hasSessionOnDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sessions.some(s => s.date === dateStr);
  };

  const getSessionsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sessions.filter(s => s.date === dateStr);
  };

  const handleDayClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
    setShowDayPopup(true);
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const currentMonthName = currentMonth.toLocaleString('default', { month: 'long' });
  const sessionsThisMonth = sessions.filter(s => s.month === currentMonthName);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600">{counselorProfile.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-500">Counselor Profile</h2>
              <h1 className="text-xl font-bold text-slate-900">{counselorProfile.name}</h1>
              <p className="text-sm text-slate-600">{counselorProfile.gender}</p>
              <p className="text-sm text-indigo-600 font-medium">{counselorProfile.specialty} (specialty)</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'appointments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'sessions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
            }`}
          >
            Appointment Sessions
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
            }`}
          >
            History
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Pending Appointments</h2>
            {appointments.filter(apt => apt.status === 'Pending' || apt.status === 'Confirmed').map(apt => (
              <div key={apt.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{apt.studentName}</h3>
                    <div className="flex gap-4 text-sm text-slate-600 mt-2">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {apt.startTime} - {apt.endTime}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2"><span className="font-medium">Reason:</span> {apt.reason}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {apt.status}
                    </span>
                    {apt.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleAccept(apt.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          <Check className="h-4 w-4" /> Accept
                        </button>
                        <button
                          onClick={() => handleCancelClick(apt)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          <XCircle className="h-4 w-4" /> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Manage Sessions</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowSessionForm(true); setShowCalendar(false); }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create Session
                </button>
                <button
                  onClick={() => { setShowCalendar(true); setShowSessionForm(false); }}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  View Calendar
                </button>
              </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg border border-slate-200">
              <button
                onClick={() => changeMonth(-1)}
                disabled={currentMonth <= new Date(2026, 0, 1)}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-bold text-slate-900">{monthName}</h3>
              <button
                onClick={() => changeMonth(1)}
                disabled={currentMonth >= new Date(2026, 2, 1)}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Session Form */}
            {showSessionForm && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">{currentMonthName}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={sessionForm.date}
                      onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time (Working Hours)</label>
                    <select
                      value={sessionForm.time}
                      onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    >
                      <option value="">Select time</option>
                      <option value="09:00">09:00 - 10:00</option>
                      <option value="10:00">10:00 - 11:00</option>
                      <option value="11:00">11:00 - 12:00</option>
                      <option value="13:00">13:00 - 14:00</option>
                      <option value="14:00">14:00 - 15:00</option>
                      <option value="15:00">15:00 - 16:00</option>
                      <option value="16:00">16:00 - 17:00</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleCreateSession}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Session
                </button>
              </div>
            )}

            {/* Sessions List */}
            {!showCalendar && (
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">{currentMonthName} Sessions ({sessionsThisMonth.length})</h3>
                <div className="space-y-3">
                  {sessionsThisMonth.map(session => (
                    <div key={session.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{session.date}</p>
                        <p className="text-sm text-slate-600">{session.startTime} - {session.endTime}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        session.bookedBy ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {session.bookedBy ? `Booked by ${session.bookedBy}` : 'Available'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar View */}
            {showCalendar && (
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-slate-700 py-2">{day}</div>
                  ))}
                  {getDaysInMonth().map((day, idx) => (
                    <div
                      key={idx}
                      onClick={() => day && hasSessionOnDate(day) && handleDayClick(day)}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer ${
                        day ? (hasSessionOnDate(day) ? 'bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200' : 'bg-slate-50 text-slate-600') : ''
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">All Appointments</h2>
            {appointments.map(apt => (
              <div key={apt.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{apt.studentName}</h3>
                    <div className="flex gap-4 text-sm text-slate-600 mt-2">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {apt.startTime} - {apt.endTime}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2"><span className="font-medium">Reason:</span> {apt.reason}</p>
                    {apt.cancelRemark && (
                      <p className="text-sm text-red-600 mt-2"><span className="font-medium">Cancellation Remark:</span> {apt.cancelRemark}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                    apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Cancel Appointment</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-600">Cancel appointment with {cancellingAppointment?.studentName}?</p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cancellation Remark *</label>
                <textarea
                  value={cancelRemark}
                  onChange={(e) => setCancelRemark(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  rows={3}
                  placeholder="Provide reason for cancellation..."
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancellingAppointment(null);
                  setCancelRemark('');
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={!cancelRemark.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Day Popup */}
      {showDayPopup && selectedDate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {selectedDate.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <button onClick={() => setShowDayPopup(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {getSessionsForDate(selectedDate.getDate()).map(session => (
                <div key={session.id} className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-900">{session.startTime} - {session.endTime}</p>
                  <p className={`text-sm mt-1 ${session.bookedBy ? 'text-green-600' : 'text-slate-600'}`}>
                    {session.bookedBy ? `Booked by ${session.bookedBy}` : 'Available'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorDashboard;
