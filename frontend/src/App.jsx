import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ChatbotWidget } from './components/chatbot/ChatbotWidget';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

// Events Pages
import { EventsList } from './pages/events/EventsList';
import { EventDetails } from './pages/events/EventDetails';
import { EventRegister } from './pages/events/EventRegister';

// Jobs Pages
import { JobsList } from './pages/jobs/JobsList';
import { JobDetails } from './pages/jobs/JobDetails';
import { JobApply } from './pages/jobs/JobApply';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { MyRegistrations } from './pages/student/MyRegistrations';
import { MyApplications } from './pages/student/MyApplications';

// Company Pages
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { PostJob } from './pages/company/PostJob';
import { ManageJobs } from './pages/company/ManageJobs';
import { JobApplicants } from './pages/company/JobApplicants';
import { CompanyProfile } from './pages/company/CompanyProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageEvents } from './pages/admin/ManageEvents';
import { ManageStudents } from './pages/admin/ManageStudents';
import { ManageCompanies } from './pages/admin/ManageCompanies';
import { ManageJobsAdmin } from './pages/admin/ManageJobsAdmin';
import { ManageAnnouncements } from './pages/admin/ManageAnnouncements';
import { ManageChatbot } from './pages/admin/ManageChatbot';
import { ReportsAnalytics } from './pages/admin/ReportsAnalytics';

import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { NotFound } from './pages/NotFound';

// Route Guards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Authenticating...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
            <Navbar />
            <div className="flex-1 flex flex-col">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/events" element={<EventsList />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/events/:id/register" element={<EventRegister />} />
                <Route path="/jobs" element={<JobsList />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/jobs/:id/apply" element={<JobApply />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Student Protected Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/profile"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-registrations"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <MyRegistrations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-applications"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <MyApplications />
                    </ProtectedRoute>
                  }
                />

                {/* Company Protected Routes */}
                <Route
                  path="/company/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['company']}>
                      <CompanyDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/company/post-job"
                  element={
                    <ProtectedRoute allowedRoles={['company']}>
                      <PostJob />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/company/jobs"
                  element={
                    <ProtectedRoute allowedRoles={['company']}>
                      <ManageJobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/company/jobs/:jobId/applicants"
                  element={
                    <ProtectedRoute allowedRoles={['company', 'admin']}>
                      <JobApplicants />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/company/profile"
                  element={
                    <ProtectedRoute allowedRoles={['company']}>
                      <CompanyProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageEvents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/students"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageStudents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/companies"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageCompanies />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/jobs"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageJobsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/announcements"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageAnnouncements />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/chatbot"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageChatbot />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ReportsAnalytics />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />

            {/* Persistent AI-Powered College Chatbot Widget */}
            <ChatbotWidget />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
