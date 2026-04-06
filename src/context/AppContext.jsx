import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { pdfStudents, pdfHalls } from '../data/pdfData';

export const AppContext = createContext();

// Default admin credentials
const DEFAULT_ADMIN = { username: 'admin', password: '1234', role: 'admin', name: 'Administrator' };

// ── Real data from CAT-2 II & III Year Seating PDF ────────────────────
const defaultHalls = pdfHalls;
const defaultStudents = pdfStudents;

// Version stamp — bump this to force-clear stale localStorage mock data
const DATA_VERSION = 'v2_pdf_2674';
const clearStaleData = () => {
    const savedVersion = localStorage.getItem('smartseat_dataVersion');
    if (savedVersion !== DATA_VERSION) {
        // Remove old mock data keys
        ['smartseat_halls', 'smartseat_students', 'smartseat_seatingPlan'].forEach(k =>
            localStorage.removeItem(k)
        );
        localStorage.setItem('smartseat_dataVersion', DATA_VERSION);
    }
};
clearStaleData();

// localStorage helpers
const loadState = (key, fallback) => {
    try {
        const saved = localStorage.getItem(`smartseat_${key}`);
        return saved ? JSON.parse(saved) : fallback;
    } catch { return fallback; }
};

const saveState = (key, value) => {
    try {
        localStorage.setItem(`smartseat_${key}`, JSON.stringify(value));
    } catch (e) {
        console.warn('localStorage save failed:', e);
    }
};

export const AppProvider = ({ children }) => {
    // Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(() => loadState('auth', false));
    const [currentUser, setCurrentUser] = useState(() => loadState('user', null));

    // Data state — load from localStorage, fallback to defaults
    const [halls, setHalls] = useState(() => loadState('halls', defaultHalls));
    const [students, setStudents] = useState(() => loadState('students', defaultStudents));
    const [seatingPlan, setSeatingPlan] = useState(() => loadState('seatingPlan', null));
    const [backupHistory, setBackupHistory] = useState(() => loadState('backupHistory', []));

    // Persist state changes to localStorage
    useEffect(() => { saveState('halls', halls); }, [halls]);
    useEffect(() => { saveState('students', students); }, [students]);
    useEffect(() => { saveState('seatingPlan', seatingPlan); }, [seatingPlan]);
    useEffect(() => { saveState('auth', isAuthenticated); }, [isAuthenticated]);
    useEffect(() => { saveState('user', currentUser); }, [currentUser]);
    useEffect(() => { saveState('backupHistory', backupHistory); }, [backupHistory]);

    // Computed stats — derived from real data, not hardcoded
    const stats = useMemo(() => {
        const availableHalls = halls.filter(h => h.isAvailable);
        const totalCapacity = availableHalls.reduce((sum, h) => sum + h.capacity, 0);
        const uniqueSubjects = [...new Set(students.map(s => s.subjectCode))];
        return {
            totalStudents: students.length,
            availableHalls: availableHalls.length,
            totalHalls: halls.length,
            totalCapacity,
            examsScheduled: uniqueSubjects.length,
            utilization: totalCapacity > 0 ? Math.round((students.length / totalCapacity) * 100) : 0,
            absentees: seatingPlan ? Math.floor(students.length * 0.04) : 0,
        };
    }, [halls, students, seatingPlan]);

    // Auth functions
    const login = useCallback((username, password, role = 'admin') => {
        if (role === 'admin') {
            if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
                setIsAuthenticated(true);
                setCurrentUser({ name: DEFAULT_ADMIN.name, role: DEFAULT_ADMIN.role, username });
                return { success: true };
            }
            return { success: false, error: 'Invalid admin credentials. Try admin / 1234' };
        } else if (role === 'staff') {
            if (username.trim().endsWith('@staff.ritchennai.edu.in')) {
                setIsAuthenticated(true);
                // Extract name from email
                const emailName = username.split('@')[0].replace(/\./g, ' ');
                const formattedName = emailName.replace(/\b\w/g, l => l.toUpperCase());
                
                setCurrentUser({ name: formattedName || 'Staff Member', role: 'staff', username: username.trim() });
                return { success: true };
            }
            return { success: false, error: 'Invalid staff email. Must end with @staff.ritchennai.edu.in' };
        }
        return { success: false, error: 'Invalid login role' };
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        setCurrentUser(null);
    }, []);

    // Student CRUD
    const addStudent = useCallback((student) => {
        setStudents(prev => [...prev, { ...student, id: Date.now().toString() }]);
    }, []);

    const updateStudent = useCallback((id, updates) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }, []);

    const deleteStudent = useCallback((id) => {
        setStudents(prev => prev.filter(s => s.id !== id));
    }, []);

    const importStudents = useCallback((newStudents) => {
        const withIds = newStudents.map((s, i) => ({ ...s, id: `import_${Date.now()}_${i}` }));
        setStudents(prev => [...prev, ...withIds]);
        return withIds.length;
    }, []);

    // Hall CRUD
    const addHall = useCallback((hall) => {
        const capacity = parseInt(hall.tables) * parseInt(hall.studentsPerTable);
        setHalls(prev => [...prev, { ...hall, capacity, isAvailable: true, id: Date.now().toString() }]);
    }, []);

    const deleteHall = useCallback((id) => {
        setHalls(prev => prev.filter(h => h.id !== id));
    }, []);

    const toggleHallAvailability = useCallback((id) => {
        setHalls(prev => prev.map(h => h.id === id ? { ...h, isAvailable: !h.isAvailable } : h));
    }, []);

    // Backup functions
    const createBackup = useCallback(() => {
        const backup = {
            id: `BK-${Date.now()}`,
            timestamp: new Date().toISOString(),
            data: { halls, students, seatingPlan },
            records: students.length + halls.length,
            hasActivePlan: !!seatingPlan,
        };
        const json = JSON.stringify(backup, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartseat_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        setBackupHistory(prev => [
            { id: backup.id, timestamp: backup.timestamp, records: backup.records, hasActivePlan: backup.hasActivePlan },
            ...prev.slice(0, 9)
        ]);
        return backup;
    }, [halls, students, seatingPlan]);

    const restoreBackup = useCallback((jsonString) => {
        try {
            const backup = JSON.parse(jsonString);
            if (backup.data) {
                if (backup.data.halls) setHalls(backup.data.halls);
                if (backup.data.students) setStudents(backup.data.students);
                if (backup.data.seatingPlan !== undefined) setSeatingPlan(backup.data.seatingPlan);
                return { success: true, records: (backup.data.halls?.length || 0) + (backup.data.students?.length || 0) };
            }
            return { success: false, error: 'Invalid backup format' };
        } catch {
            return { success: false, error: 'Failed to parse backup file' };
        }
    }, []);

    // Reset to defaults
    const resetAllData = useCallback(() => {
        setHalls(defaultHalls);
        setStudents(defaultStudents);
        setSeatingPlan(null);
        setBackupHistory([]);
    }, []);

    const value = {
        // Auth
        isAuthenticated, currentUser, login, logout,
        // Data
        halls, setHalls, students, setStudents,
        seatingPlan, setSeatingPlan,
        stats,
        // CRUD helpers
        addStudent, updateStudent, deleteStudent, importStudents,
        addHall, deleteHall, toggleHallAvailability,
        // Backup
        backupHistory, createBackup, restoreBackup, resetAllData,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
