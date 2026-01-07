import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Clock, ChevronLeft, ChevronRight, X, Check, XCircle, ChevronDown, User } from 'lucide-react';

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
  reason?: string;
}

const CounselorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'appointments' | 'sessions'>('appointments');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // January 2026
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayPopup, setShowDayPopup] = useState(false);
  const [sessionForm, setSessionForm] = useState({ date: '', time: '' });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
  const [cancelRemark, setCancelRemark] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [cancellingSession, setCancellingSession] = useState<Session | null>(null);
  const [showSessionCancelModal, setShowSessionCancelModal] = useState(false);
  const [sessionCancelRemark, setSessionCancelRemark] = useState('');

  const counselorProfile = {
    name: 'Dr John Smith',
    gender: 'Male',
    specialty: 'Anxiety & Stress'
  };

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, studentName: 'Wong Yi Ren', date: '2026-01-12', startTime: '10:00', endTime: '11:00', status: 'Pending', reason: 'demo purposes' },
    { id: 2, studentName: 'John Doe', date: '2026-01-16', startTime: '11:00', endTime: '12:00', status: 'Pending', reason: 'Depression' },
    { id: 3, studentName: 'Sarah Lee', date: '2026-01-26', startTime: '11:00', endTime: '12:00', status: 'Confirmed', reason: 'Stress management' }
  ]);

  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, date: '2026-01-12', startTime: '10:00', endTime: '11:00', month: 'January', bookedBy: 'Wong Yi Ren', reason: 'demo purposes' },
    { id: 2, date: '2026-01-13', startTime: '14:00', endTime: '15:00', month: 'January'},
    { id: 3, date: '2026-01-14', startTime: '15:00', endTime: '16:00', month: 'January'},
    { id: 4, date: '2026-01-16', startTime: '11:00', endTime: '12:00', month: 'January', bookedBy: 'John Doe', reason: 'Depression' },
    { id: 5, date: '2026-01-18', startTime: '11:00', endTime: '12:00', month: 'January' },
    { id: 6, date: '2026-01-25', startTime: '14:00', endTime: '15:00', month: 'January' },
    { id: 7, date: '2026-01-26', startTime: '11:00', endTime: '12:00', month: 'January', bookedBy: 'Sarah Lee', reason: 'Stress management' },
    { id: 8, date: '2026-02-10', startTime: '10:00', endTime: '11:00', month: 'February' },
    { id: 9, date: '2026-02-15', startTime: '14:00', endTime: '15:00', month: 'February' },
    { id: 10, date: '2026-03-05', startTime: '09:00', endTime: '10:00', month: 'March' }
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
      // Cancel the appointment
      setAppointments(prev => prev.map(apt => 
        apt.id === cancellingAppointment.id 
          ? { ...apt, status: 'Cancelled', cancelRemark } 
          : apt
      ));
      
      // Remove the corresponding session booking
      setSessions(prev => prev.map(session => {
        if (session.date === cancellingAppointment.date && 
            session.startTime === cancellingAppointment.startTime && 
            session.endTime === cancellingAppointment.endTime &&
            session.bookedBy === cancellingAppointment.studentName) {
          return { ...session, bookedBy: undefined, reason: undefined };
        }
        return session;
      }));
      
      setShowCancelModal(false);
      setCancellingAppointment(null);
      setCancelRemark('');
    }
  };

  const handleSessionCancelClick = (session: Session) => {
    setCancellingSession(session);
    setShowSessionCancelModal(true);
  };

  const handleSessionCancelConfirm = () => {
    if (cancellingSession && sessionCancelRemark.trim()) {
      setSessions(prev => prev.filter(s => s.id !== cancellingSession.id));
      setShowSessionCancelModal(false);
      setCancellingSession(null);
      setSessionCancelRemark('');
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

  const isConfirmedBooking = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sessions.some(s => s.date === dateStr && s.bookedBy);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Header */}
      <header className="bg-blue-900 border-b border-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/assets/images/mindcare-apu-logo.png" 
              alt="MindCare APU" 
              className="h-12 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="h-12 w-12 bg-blue-100 rounded-lg items-center justify-center hidden">
              <span className="text-lg font-bold text-blue-900">MC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MindCare APU</h1>
              <p className="text-sm text-blue-200">Counselor Dashboard</p>
            </div>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                <img 
                  src="/assets/images/therapists/dr-john-smith.png" 
                  alt={counselorProfile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <User className="h-6 w-6 text-blue-900 hidden" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{counselorProfile.name}</p>
                <p className="text-xs text-blue-200">Counselor</p>
              </div>
              <ChevronDown className="h-4 w-4 text-blue-200" />
            </button>
            
            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                      <img 
                        src="/assets/images/therapists/dr-john-smith.png" 
                        alt={counselorProfile.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <User className="h-8 w-8 text-blue-900 hidden" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{counselorProfile.name}</h3>
                      <p className="text-sm text-gray-600">{counselorProfile.gender}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">SPECIALTY</span>
                      <p className="text-sm text-blue-600 font-medium">{counselorProfile.specialty}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">ROLE</span>
                      <p className="text-sm text-gray-700">Licensed Counselor</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex border-b border-blue-300 mb-6 bg-white/10 backdrop-blur-sm rounded-t-lg">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'appointments' ? 'border-white text-white bg-white/20' : 'border-transparent text-blue-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Pending AP
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'sessions' ? 'border-white text-white bg-white/20' : 'border-transparent text-blue-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Manage AP
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Pending Appointments</h2>
            {appointments.filter(apt => apt.status === 'Pending' || apt.status === 'Confirmed').map(apt => (
              <div key={apt.id} className="bg-white/95 backdrop-blur-sm p-6 rounded-xl border border-blue-200 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-blue-900">{apt.studentName}</h3>
                    <div className="flex gap-4 text-sm text-blue-700 mt-2">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {apt.startTime} - {apt.endTime}</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-2"><span className="font-medium">Reason:</span> {apt.reason}</p>
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
              <h2 className="text-xl font-bold text-white">Manage Sessions</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowSessionForm(true); setShowCalendar(false); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Session
                </button>
                <button
                  onClick={() => { setShowCalendar(true); setShowSessionForm(false); }}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  View Calendar
                </button>
              </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6 bg-white/95 backdrop-blur-sm p-4 rounded-lg border border-blue-200">
              <button
                onClick={() => changeMonth(-1)}
                disabled={currentMonth <= new Date(2026, 0, 1)}
                className="p-2 hover:bg-blue-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-blue-900"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-bold text-blue-900">{monthName}</h3>
              <button
                onClick={() => changeMonth(1)}
                disabled={currentMonth >= new Date(2026, 2, 1)}
                className="p-2 hover:bg-blue-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-blue-900"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Session Form */}
            {showSessionForm && (
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl border border-blue-200 mb-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">{currentMonthName}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Date</label>
                    <input
                      type="date"
                      value={sessionForm.date}
                      onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                      className="w-full p-2 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Time (Working Hours)</label>
                    <select
                      value={sessionForm.time}
                      onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                      className="w-full p-2 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Session
                </button>
              </div>
            )}

            {/* Sessions List */}
            {!showCalendar && (
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4">{currentMonthName} Sessions ({sessionsThisMonth.length})</h3>
                <div className="space-y-3">
                  {sessionsThisMonth.map(session => (
                    <div key={session.id} className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">{session.date}</p>
                        <p className="text-sm text-blue-700">{session.startTime} - {session.endTime}</p>
                        {session.reason && (
                          <p className="text-xs text-blue-600 mt-1"><span className="font-medium">Reason:</span> {session.reason}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          session.bookedBy ? 'bg-green-100 text-green-700' : 'bg-blue-200 text-blue-800'
                        }`}>
                          {session.bookedBy ? `Booked by ${session.bookedBy}` : 'Available'}
                        </span>
                        {session.bookedBy && (
                          <button
                            onClick={() => handleSessionCancelClick(session)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar View */}
            {showCalendar && (
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl border border-blue-200">
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-blue-900 py-2">{day}</div>
                  ))}
                  {getDaysInMonth().map((day, idx) => {
                    const sessionsForDay = day ? getSessionsForDate(day) : [];
                    const isBooked = day && isConfirmedBooking(day);
                    return (
                      <div
                        key={idx}
                        onClick={() => day && hasSessionOnDate(day) && handleDayClick(day)}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs cursor-pointer p-1 ${
                          day ? (
                            isBooked ? 'bg-green-100 text-green-800 font-bold hover:bg-green-200' :
                            hasSessionOnDate(day) ? 'bg-blue-100 text-blue-700 font-bold hover:bg-blue-200' : 
                            'bg-blue-50 text-blue-600'
                          ) : ''
                        }`}
                      >
                        <span className="font-medium">{day}</span>
                        {sessionsForDay.length > 0 && (
                          <div className="text-xs mt-1 text-center">
                            {sessionsForDay.map((session, i) => (
                              <div key={i} className="leading-tight">
                                {session.startTime}-{session.endTime}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Session Cancel Modal */}
      {showSessionCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Cancel Session</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-600">Cancel session with {cancellingSession?.bookedBy} on {cancellingSession?.date}?</p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cancellation Reason *</label>
                <textarea
                  value={sessionCancelRemark}
                  onChange={(e) => setSessionCancelRemark(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  rows={3}
                  placeholder="Provide reason for cancellation..."
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSessionCancelModal(false);
                  setCancellingSession(null);
                  setSessionCancelRemark('');
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={handleSessionCancelConfirm}
                disabled={!sessionCancelRemark.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                  {session.reason && (
                    <p className="text-xs text-slate-600 mt-1"><span className="font-medium">Reason:</span> {session.reason}</p>
                  )}
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
