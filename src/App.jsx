import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { StudentProvider } from './context/StudentContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Admin pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import StudentData from './pages/StudentData';
import Halls from './pages/Halls';
import SeatingGen from './pages/SeatingGen';
import MapView from './pages/MapView';
import Monitoring from './pages/Monitoring';
import StudentPortal from './pages/StudentPortal';
import AdminWelfare from './pages/AdminWelfare';
import StaffPortal from './pages/StaffPortal';
import CatMarksUpdate from './pages/CatMarksUpdate';
import CycleTestMarksUpdate from './pages/CycleTestMarksUpdate';
import AssignmentManagement from './pages/AssignmentManagement';
import Backup from './pages/Backup';

// Student pages
import StudentLanding from './pages/student/StudentLanding';
import StudentLogin from './pages/student/StudentLogin';
import StudentAbout from './pages/student/StudentAbout';
import StudentLayout from './components/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentExamSeating from './pages/student/StudentExamSeating';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentResources from './pages/student/StudentResources';
import StudentProfile from './pages/student/StudentProfile';
import StudentHelp from './pages/student/StudentHelp';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <StudentProvider>
          <Router basename="/ExamSmartSeat-Portal">

            <Routes>
              {/* ── Student Public Routes ─────────────── */}
              <Route path="/" element={<StudentLanding />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/about" element={<StudentAbout />} />

              {/* ── Student Authenticated Routes ──────── */}
              <Route path="/student" element={<StudentLayout />}>
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="exam-seating" element={<StudentExamSeating />} />
                <Route path="timetable" element={<StudentTimetable />} />
                <Route path="assignments" element={<StudentAssignments />} />
                <Route path="notifications" element={<StudentNotifications />} />
                <Route path="resources" element={<StudentResources />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="help" element={<StudentHelp />} />
              </Route>

              {/* ── Admin Routes ──────────────────────── */}
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="students" element={<StudentData />} />
                <Route path="halls" element={<Halls />} />
                <Route path="seating-generator" element={<SeatingGen />} />
                <Route path="interactive-map" element={<MapView />} />
                <Route path="student-welfare" element={<AdminWelfare />} />
                <Route path="staff-portal" element={<StaffPortal />} />
                <Route path="cat-marks" element={<CatMarksUpdate />} />
                <Route path="cycle-test-marks" element={<CycleTestMarksUpdate />} />
                <Route path="assignments" element={<AssignmentManagement />} />
                <Route path="monitoring" element={<Monitoring />} />
                <Route path="student-portal" element={<StudentPortal />} />
                <Route path="backup" element={<Backup />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Route>

              {/* ── Catch-all ─────────────────────────── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </StudentProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
