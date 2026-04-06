// Mock data for the SmartSeat Student Portal
// Real seating data is imported from pdfData.js

export const mockTimetable = [
  { day: 'Monday', slots: [
    { time: '09:00 - 10:00', subject: 'Data Structures', code: 'CS23413', room: 'A1-01', type: 'lecture' },
    { time: '10:00 - 11:00', subject: 'Operating Systems', code: 'CS23414', room: 'A1-03', type: 'lecture' },
    { time: '11:15 - 12:15', subject: 'Digital Circuits', code: 'EC23631', room: 'B2-02', type: 'lecture' },
    { time: '01:30 - 03:30', subject: 'OS Lab', code: 'CS23414L', room: 'Lab 3', type: 'lab' },
  ]},
  { day: 'Tuesday', slots: [
    { time: '09:00 - 10:00', subject: 'Mathematics III', code: 'MA23411', room: 'A2-08', type: 'lecture' },
    { time: '10:00 - 11:00', subject: 'Data Structures', code: 'CS23413', room: 'A1-01', type: 'lecture' },
    { time: '11:15 - 12:15', subject: 'Machine Learning', code: 'AD23412', room: 'C2-02', type: 'lecture' },
    { time: '01:30 - 03:30', subject: 'ML Lab', code: 'AD23412L', room: 'Lab 5', type: 'lab' },
  ]},
  { day: 'Wednesday', slots: [
    { time: '09:00 - 10:00', subject: 'Operating Systems', code: 'CS23414', room: 'A1-03', type: 'lecture' },
    { time: '10:00 - 11:00', subject: 'Digital Circuits', code: 'EC23631', room: 'B2-02', type: 'lecture' },
    { time: '11:15 - 12:15', subject: 'Mathematics III', code: 'MA23411', room: 'A2-08', type: 'lecture' },
    { time: '01:30 - 02:30', subject: 'Soft Skills', code: 'HS23401', room: 'A3-07', type: 'tutorial' },
  ]},
  { day: 'Thursday', slots: [
    { time: '09:00 - 10:00', subject: 'Machine Learning', code: 'AD23412', room: 'C2-02', type: 'lecture' },
    { time: '10:00 - 11:00', subject: 'Data Structures', code: 'CS23413', room: 'A1-01', type: 'lecture' },
    { time: '11:15 - 01:15', subject: 'DS Lab', code: 'CS23413L', room: 'Lab 2', type: 'lab' },
    { time: '01:30 - 02:30', subject: 'Digital Circuits', code: 'EC23631', room: 'B2-02', type: 'lecture' },
  ]},
  { day: 'Friday', slots: [
    { time: '09:00 - 10:00', subject: 'Mathematics III', code: 'MA23411', room: 'A2-08', type: 'lecture' },
    { time: '10:00 - 11:00', subject: 'Machine Learning', code: 'AD23412', room: 'C2-02', type: 'lecture' },
    { time: '11:15 - 12:15', subject: 'Operating Systems', code: 'CS23414', room: 'A1-03', type: 'lecture' },
    { time: '01:30 - 02:30', subject: 'Mentoring', code: 'MN23400', room: 'A1-01', type: 'tutorial' },
  ]},
];

export const mockAssignments = [
  { id: 1, subject: 'Data Structures', code: 'CS23413', task: 'Implement AVL Tree with self-balancing', deadline: '2026-04-05', status: 'pending', progress: 40 },
  { id: 2, subject: 'Operating Systems', code: 'CS23414', task: 'Process Scheduling Simulation Report', deadline: '2026-04-02', status: 'overdue', progress: 20 },
  { id: 3, subject: 'Machine Learning', code: 'AD23412', task: 'Linear Regression Model on Housing Dataset', deadline: '2026-04-08', status: 'pending', progress: 65 },
  { id: 4, subject: 'Digital Circuits', code: 'EC23631', task: 'Design 4-bit ALU using Logisim', deadline: '2026-03-28', status: 'completed', progress: 100 },
  { id: 5, subject: 'Mathematics III', code: 'MA23411', task: 'Solve Fourier Transform Problem Set', deadline: '2026-04-10', status: 'pending', progress: 10 },
  { id: 6, subject: 'Data Structures', code: 'CS23413', task: 'Graph Traversal (BFS/DFS) Lab Report', deadline: '2026-03-30', status: 'completed', progress: 100 },
  { id: 7, subject: 'Machine Learning', code: 'AD23412', task: 'K-Means Clustering Visualization', deadline: '2026-04-15', status: 'pending', progress: 0 },
];

export const mockNotifications = [
  { id: 1, type: 'exam', title: 'CAT-2 Seating Released', message: 'Your seating arrangement for CAT-2 II & III Year exams has been published. Check your seat now.', time: '2 hours ago', read: false },
  { id: 2, type: 'assignment', title: 'OS Assignment Due Tomorrow', message: 'Process Scheduling Simulation Report is due on April 2nd. Submit before 11:59 PM.', time: '5 hours ago', read: false },
  { id: 3, type: 'general', title: 'Campus Placement Drive', message: 'TCS & Infosys are visiting campus on April 12th. Register on the placement portal.', time: '1 day ago', read: false },
  { id: 4, type: 'exam', title: 'Hall Change Notice', message: 'Students in B3-04 for EC23631 have been moved to B3-05 due to maintenance.', time: '1 day ago', read: true },
  { id: 5, type: 'general', title: 'Library Hours Extended', message: 'Library will remain open until 10 PM during exam week (March 25 - April 5).', time: '2 days ago', read: true },
  { id: 6, type: 'assignment', title: 'ML Lab Submission Extended', message: 'Deadline for Linear Regression Model has been extended to April 8th.', time: '3 days ago', read: true },
  { id: 7, type: 'general', title: 'Sports Day Registration', message: 'Register for annual sports day events by April 1st. Contact your class rep.', time: '4 days ago', read: true },
  { id: 8, type: 'exam', title: 'CAT-2 Schedule Published', message: 'CAT-2 examinations are scheduled from March 27 to April 5, 2026.', time: '5 days ago', read: true },
];

export const mockResources = [
  { id: 1, category: 'Notes', subject: 'Data Structures', title: 'Unit 3 - Trees and Graphs', type: 'PDF', size: '2.4 MB' },
  { id: 2, category: 'Notes', subject: 'Operating Systems', title: 'Unit 2 - Process Management', type: 'PDF', size: '3.1 MB' },
  { id: 3, category: 'Notes', subject: 'Machine Learning', title: 'Unit 1 - Introduction to ML', type: 'PDF', size: '1.8 MB' },
  { id: 4, category: 'Question Papers', subject: 'Digital Circuits', title: 'CAT-1 2025 Question Paper', type: 'PDF', size: '540 KB' },
  { id: 5, category: 'Question Papers', subject: 'Data Structures', title: 'CAT-2 2025 Question Paper', type: 'PDF', size: '620 KB' },
  { id: 6, category: 'Question Papers', subject: 'Mathematics III', title: 'Model Exam 2025', type: 'PDF', size: '480 KB' },
  { id: 7, category: 'Notes', subject: 'Digital Circuits', title: 'Unit 4 - Sequential Circuits', type: 'PDF', size: '2.9 MB' },
  { id: 8, category: 'Lab Manuals', subject: 'OS Lab', title: 'Complete Lab Manual 2026', type: 'PDF', size: '5.2 MB' },
  { id: 9, category: 'Lab Manuals', subject: 'DS Lab', title: 'Lab Manual - Sorting & Searching', type: 'PDF', size: '1.5 MB' },
];

export const mockAnnouncements = [
  { id: 1, title: 'CAT-2 Exam Begins', description: 'CAT-2 II & III Year examinations begin March 27th. Check your seating.', type: 'exam', urgent: true },
  { id: 2, title: 'Hall B3-04 Relocated', description: 'Due to maintenance, exams in B3-04 moved to B3-05.', type: 'notice', urgent: true },
  { id: 3, title: 'Placement Season Open', description: 'Top companies visiting April 10-15. Update your profile.', type: 'placement', urgent: false },
  { id: 4, title: 'Library Extended Hours', description: 'Library open till 10 PM during exam week.', type: 'general', urgent: false },
];

export const mockFAQs = [
  { q: 'How do I find my exam seat?', a: 'Go to "Exam Seating" from the sidebar, enter your register number, and your hall and seat details will be displayed instantly.' },
  { q: 'What if my seat information is incorrect?', a: 'Contact the Exam Cell office (Room A1-102) or email examcell@ritchennai.edu.in with your register number and issue details.' },
  { q: 'Can I download my seat slip?', a: 'Yes! After searching your seat, click the "Download Seat Slip" button to save a PDF version of your seating details.' },
  { q: 'How do I reset my portal access?', a: 'Your access is linked to your register number. If you face issues, contact the IT Help Desk at ext. 2042.' },
  { q: 'When are the exam timings?', a: 'Morning session: 9:30 AM - 12:30 PM. Afternoon session: 1:30 PM - 4:30 PM. Arrive 30 minutes early.' },
  { q: 'Who do I contact for assignment queries?', a: 'Reach out to your respective subject faculty or class advisor through the department office.' },
];
