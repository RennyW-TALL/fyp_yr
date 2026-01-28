import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../hooks/useDatabase';
import StudentHeader from '../../components/StudentHeader';
import TherapistCard from '../../components/TherapistCard';
import CareCompanion from '../../components/CareCompanion';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { appointments, therapists, getUpcomingAppointment } = useDatabase(user?.username);
  
  const nextAppointment = getUpcomingAppointment();

  return (
    <>
      <StudentHeader />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-green-900">Welcome back, {user?.fullName?.split(' ')[0] || user?.username} 👋</h1>
          <p className="text-green-700">How are you feeling today?</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="grid gap-4">
              <Link to="/student/appointments" className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg text-white hover:shadow-green-200/50 transition-all hover:-translate-y-1">
                  <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                      <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">View Appointments</h3>
                  <p className="text-green-100 text-sm mb-4">Manage your counseling sessions and bookings.</p>
                  <div className="flex items-center text-sm font-medium">View All <ArrowRight className="ml-2 h-4 w-4"/></div>
              </Link>
          </div>

          {/* Next Appointment Card */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-green-200">
              <h3 className="font-bold text-green-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" /> Upcoming Session
              </h3>
              {nextAppointment ? (
                  <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                          <p className="font-semibold text-green-900">{nextAppointment.appointment_date}</p>
                          <p className="text-green-700 text-sm">{nextAppointment.start_time} - {nextAppointment.end_time}</p>
                          <div className="mt-2 text-xs font-medium text-green-700 bg-green-100 inline-block px-2 py-1 rounded">
                              {nextAppointment.status}
                          </div>
                      </div>
                      <p className="text-sm text-green-700">Therapist: <span className="text-green-900 font-medium">{nextAppointment.therapist_name}</span></p>
                  </div>
              ) : (
                  <div className="h-32 flex flex-col items-center justify-center text-center">
                      <p className="text-green-600 text-sm mb-3">No upcoming appointments</p>
                  </div>
              )}
          </div>

          {/* PHQ-9 Assessment Widget */}
          <div className="bg-gradient-to-br from-emerald-600 to-green-700 p-6 rounded-2xl shadow-lg text-white">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">PHQ-9 Assessment</h3>
              <p className="text-green-100 text-sm mb-4">Screen for depressive symptoms with this quick assessment tool.</p>
              <Link 
                  to="/student/phq9" 
                  className="inline-flex items-center text-sm font-medium bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                  Take Assessment <ArrowRight className="ml-2 h-4 w-4"/>
              </Link>
          </div>
        </div>

        {/* Available Counselors */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-green-200">
          <h3 className="font-bold text-green-900 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" /> Available Counselors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.map((therapist) => (
              <TherapistCard
                key={therapist.id}
                id={therapist.id}
                name={therapist.name}
                gender={therapist.gender}
                specialization={therapist.specialization}
                profileImage={therapist.profileImage}
              />
            ))}
          </div>
        </div>


        </div>
      </div>
      <CareCompanion />
    </>
  );
};

export default StudentDashboard;