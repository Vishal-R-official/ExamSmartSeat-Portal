import React, { useState, useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { StudentContext } from '../../context/StudentContext';
import StudentSidebar from './StudentSidebar';
import StudentTopbar from './StudentTopbar';
import '../../styles/StudentPortal.css';

const StudentLayout = () => {
  const { isStudentAuth } = useContext(StudentContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isStudentAuth) {
    return <Navigate to="/student-login" replace />;
  }

  return (
    <div className="student-app">
      <div className="sp-layout">
        <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="sp-main">
          <StudentTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="sp-page sp-page-enter">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
