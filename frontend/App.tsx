import React, { PropsWithChildren } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import FloatingChatbot from './components/FloatingChatbot';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import StudentDashboard from './pages/student/StudentDashboard';
import PHQ9Assessment from './pages/student/PHQ9Assessment';
import AppointmentsPage from './pages/student/AppointmentsPage';
import AIChatPage from './pages/student/AIChatPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CounselorDashboard from './pages/counselor/CounselorDashboard';
import { Role } from './types';

// Protected Route Component
const ProtectedRoute = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

const ChatbotWrapper = () => {
  const location = useLocation();
  const isStudentRoute = location.pathname.startsWith('/student');
  
  return isStudentRoute ? <FloatingChatbot /> : null;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Student Routes */}
            <Route path="/student/*" element={
                <ProtectedRoute>
                    <Layout>
                        <Routes>
                            <Route path="dashboard" element={<StudentDashboard />} />
                            <Route path="phq9" element={<PHQ9Assessment />} />
                            <Route path="appointments" element={<AppointmentsPage />} />
                            <Route path="chat" element={<AIChatPage />} />
                        </Routes>
                    </Layout>
                </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
                <ProtectedRoute>
                    <Layout>
                        <Routes>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="database" element={<div className="p-8 text-slate-500">Database Management Mock Interface</div>} />
                        </Routes>
                    </Layout>
                </ProtectedRoute>
            } />

            {/* Counselor Routes */}
            <Route path="/counselor/*" element={
                <ProtectedRoute>
                    <Layout>
                        <Routes>
                            <Route path="dashboard" element={<CounselorDashboard />} />
                            <Route path="requests" element={<div className="p-8 text-slate-500">Full Request List</div>} />
                            <Route path="calendar" element={<div className="p-8 text-slate-500">Full Calendar View</div>} />
                        </Routes>
                    </Layout>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

const App = () => {
  return (
    <Router>
        <AuthProvider>
            <AppRoutes />
            <ChatbotWrapper />
        </AuthProvider>
    </Router>
  );
};

export default App;