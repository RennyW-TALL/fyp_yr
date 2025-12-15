import React, { PropsWithChildren } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Landing from './pages/Landing';
import StudentDashboard from './pages/student/StudentDashboard';
import ChatbotPage from './pages/student/ChatbotPage';
import AppointmentsPage from './pages/student/AppointmentsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CounselorDashboard from './pages/counselor/CounselorDashboard';
import { Role } from './types';

// Protected Route Component - tee hee lol xd
const ProtectedRoute = ({ children, allowedRoles }: PropsWithChildren<{ allowedRoles?: Role[] }>) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard if they try to access unauthorized pages
    if (user.role === Role.ADMIN) return <Navigate to="/admin/dashboard" replace />;
    if (user.role === Role.STUDENT) return <Navigate to="/student/dashboard" replace />;
    if (user.role === Role.COUNSELOR) return <Navigate to="/counselor/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Student Routes */}
            <Route path="/student/*" element={
                <ProtectedRoute allowedRoles={[Role.STUDENT]}>
                    <Layout>
                        <Routes>
                            <Route path="dashboard" element={<StudentDashboard />} />
                            <Route path="chat" element={<ChatbotPage />} />
                            <Route path="appointments" element={<AppointmentsPage />} />
                        </Routes>
                    </Layout>
                </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
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
                <ProtectedRoute allowedRoles={[Role.COUNSELOR]}>
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
        </AuthProvider>
    </Router>
  );
};

export default App;