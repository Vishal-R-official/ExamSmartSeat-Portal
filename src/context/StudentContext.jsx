import React, { createContext, useState, useCallback, useMemo } from 'react';
import { pdfStudents } from '../data/pdfData';

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('smartseat_theme');
      return savedTheme || 'light';
    } catch { return 'light'; }
  });

  const [isStudentAuth, setIsStudentAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('smartseat_student_auth');
      return saved ? JSON.parse(saved) : false;
    } catch { return false; }
  });
  const [currentStudent, setCurrentStudent] = useState(() => {
    try {
      const saved = localStorage.getItem('smartseat_student_data');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('smartseat_theme', newTheme);
      return newTheme;
    });
  }, []);

  // Sync theme for global effects
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  const studentLogin = useCallback((registerNumber) => {
    const trimmed = registerNumber.trim();
    const found = pdfStudents.find(s =>
      s.registerNumber.toLowerCase() === trimmed.toLowerCase()
    );
    if (found) {
      setIsStudentAuth(true);
      setCurrentStudent(found);
      localStorage.setItem('smartseat_student_auth', 'true');
      localStorage.setItem('smartseat_student_data', JSON.stringify(found));
      return { success: true, student: found };
    }
    return { success: false, error: 'Register number not found. Please check and try again.' };
  }, []);

  const studentLogout = useCallback(() => {
    setIsStudentAuth(false);
    setCurrentStudent(null);
    localStorage.removeItem('smartseat_student_auth');
    localStorage.removeItem('smartseat_student_data');
  }, []);

  const searchStudent = useCallback((term) => {
    const t = term.trim().toLowerCase();
    return pdfStudents.find(s =>
      s.registerNumber.toLowerCase() === t ||
      s.registerNumber.toLowerCase().includes(t)
    ) || null;
  }, []);

  const stats = useMemo(() => ({
    totalStudents: pdfStudents.length,
    departments: [...new Set(pdfStudents.map(s => s.department))],
    subjects: [...new Set(pdfStudents.map(s => s.subjectCode))],
    halls: [...new Set(pdfStudents.map(s => s.hall))],
  }), []);

  const value = {
    theme, toggleTheme,
    isStudentAuth, currentStudent,
    studentLogin, studentLogout, searchStudent,
    allStudents: pdfStudents, stats,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};
