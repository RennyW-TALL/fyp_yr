import { useState, useEffect, useCallback } from 'react';
import localDatabase, { Appointment, Therapist, TherapistAvailability, Student, PendingTherapist } from '../services/localDatabase';

export const useDatabase = (username?: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [therapistAppointments, setTherapistAppointments] = useState<Appointment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [pendingTherapists, setPendingTherapists] = useState<PendingTherapist[]>([]);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    if (username) {
      setAppointments(localDatabase.getAppointments(username));
    }
    setTherapists(localDatabase.getTherapists());
    setStudents(localDatabase.getStudents());
    setPendingTherapists(localDatabase.getPendingTherapists());
  }, [username]);

  // Listen for storage changes for real-time sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (username) {
        setAppointments(localDatabase.getAppointments(username));
      }
      setTherapists(localDatabase.getTherapists());
      setStudents(localDatabase.getStudents());
      setPendingTherapists(localDatabase.getPendingTherapists());
      
      // Update therapist appointments for all therapists
      if (e.key === 'therapist_appointments_sync' || e.key === 'appointments_sync') {
        // Force refresh of therapist appointments
        setTherapistAppointments([]);
        setTimeout(() => {
          // This will trigger a re-render and fresh data fetch
        }, 0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [username]);

  // Appointment operations
  const createAppointment = useCallback(async (appointmentData: {
    therapist_id: number;
    therapist_name: string;
    appointment_date: string;
    start_time: string;
    end_time: string;
    status?: 'Pending' | 'Confirmed';
  }) => {
    if (!username) throw new Error('Username required');
    
    setLoading(true);
    try {
      const newAppointment = localDatabase.createAppointment({
        student_username: username,
        status: 'Pending',
        ...appointmentData
      });
      setAppointments(localDatabase.getAppointments(username));
      return newAppointment;
    } finally {
      setLoading(false);
    }
  }, [username]);

  const updateAppointment = useCallback(async (appointmentId: number, updates: Partial<Appointment>) => {
    if (!username) throw new Error('Username required');
    
    setLoading(true);
    try {
      const success = localDatabase.updateAppointment(username, appointmentId, updates);
      if (success) {
        setAppointments(localDatabase.getAppointments(username));
      }
      return success;
    } finally {
      setLoading(false);
    }
  }, [username]);

  const cancelAppointment = useCallback(async (appointmentId: number, reason: string) => {
    if (!username) throw new Error('Username required');
    
    setLoading(true);
    try {
      const success = localDatabase.cancelAppointment(username, appointmentId, reason);
      if (success) {
        setAppointments(localDatabase.getAppointments(username));
      }
      return success;
    } finally {
      setLoading(false);
    }
  }, [username]);

  const confirmAppointment = useCallback(async (appointmentId: number) => {
    return updateAppointment(appointmentId, { status: 'Confirmed' });
  }, [updateAppointment]);

  // Availability operations
  const getAvailableSlots = useCallback((therapistId: number, date: string) => {
    return localDatabase.getAvailableSlots(therapistId, date);
  }, []);

  const getAvailability = useCallback((therapistId?: number, date?: string) => {
    return localDatabase.getAvailability(therapistId, date);
  }, []);

  // Search and filter
  const searchAppointments = useCallback((filters: {
    status?: string;
    therapistId?: number;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    if (!username) return [];
    return localDatabase.searchAppointments(username, filters);
  }, [username]);

  // Utility functions
  const getUpcomingAppointment = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointments.find(apt => {
      const appointmentDate = new Date(apt.appointment_date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= today && (apt.status === 'Confirmed' || apt.status === 'Pending');
    });
  }, [appointments]);

  const getAppointmentsByStatus = useCallback((status: string) => {
    return appointments.filter(apt => apt.status === status);
  }, [appointments]);

  // Therapist operations
  const getAppointmentsByTherapist = useCallback((therapistId: number) => {
    const appointments = localDatabase.getAppointmentsByTherapist(therapistId);
    setTherapistAppointments(appointments);
    return appointments;
  }, []);

  const updateAppointmentStatus = useCallback(async (appointmentId: number, status: 'Confirmed' | 'Cancelled', reason?: string) => {
    setLoading(true);
    try {
      const success = localDatabase.updateAppointmentStatus(appointmentId, status, reason);
      if (success && username) {
        setAppointments(localDatabase.getAppointments(username));
      }
      return success;
    } finally {
      setLoading(false);
    }
  }, [username]);

  const setTherapistAvailability = useCallback(async (therapistId: number, date: string, timeSlots: { start_time: string; end_time: string; is_available: boolean }[]) => {
    setLoading(true);
    try {
      return localDatabase.setTherapistAvailability(therapistId, date, timeSlots);
    } finally {
      setLoading(false);
    }
  }, []);

  // Admin operations
  const addStudent = useCallback(async (student: Omit<Student, 'created_at'>) => {
    setLoading(true);
    try {
      const newStudent = localDatabase.addStudent(student);
      setStudents(localDatabase.getStudents());
      return newStudent;
    } finally {
      setLoading(false);
    }
  }, []);

  const addPendingTherapist = useCallback(async (therapist: Omit<PendingTherapist, 'id' | 'status' | 'created_at'>) => {
    setLoading(true);
    try {
      const newPendingTherapist = localDatabase.addPendingTherapist(therapist);
      setPendingTherapists(localDatabase.getPendingTherapists());
      return newPendingTherapist;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveTherapist = useCallback(async (pendingId: number) => {
    setLoading(true);
    try {
      const success = localDatabase.approveTherapist(pendingId);
      if (success) {
        setTherapists(localDatabase.getTherapists());
        setPendingTherapists(localDatabase.getPendingTherapists());
      }
      return success;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectTherapist = useCallback(async (pendingId: number) => {
    setLoading(true);
    try {
      const success = localDatabase.rejectTherapist(pendingId);
      if (success) {
        setPendingTherapists(localDatabase.getPendingTherapists());
      }
      return success;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStudent = useCallback(async (username: string, updates: Partial<Student>) => {
    setLoading(true);
    try {
      const success = localDatabase.updateStudent(username, updates);
      if (success) {
        setStudents(localDatabase.getStudents());
      }
      return success;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStudent = useCallback(async (username: string) => {
    setLoading(true);
    try {
      const success = localDatabase.deleteStudent(username);
      if (success) {
        setStudents(localDatabase.getStudents());
      }
      return success;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTherapist = useCallback(async (id: number, updates: Partial<Therapist>) => {
    setLoading(true);
    try {
      const success = localDatabase.updateTherapist(id, updates);
      if (success) {
        setTherapists(localDatabase.getTherapists());
      }
      return success;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTherapist = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const success = localDatabase.deleteTherapist(id);
      if (success) {
        setTherapists(localDatabase.getTherapists());
      }
      return success;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    appointments,
    therapists,
    therapistAppointments,
    students,
    pendingTherapists,
    loading,
    
    // Operations
    createAppointment,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    
    // Therapist Operations
    getAppointmentsByTherapist,
    updateAppointmentStatus,
    setTherapistAvailability,
    
    // Admin Operations
    addStudent,
    addPendingTherapist,
    approveTherapist,
    rejectTherapist,
    updateStudent,
    deleteStudent,
    updateTherapist,
    deleteTherapist,
    
    // Availability
    getAvailableSlots,
    getAvailability,
    
    // Search & Filter
    searchAppointments,
    
    // Utilities
    getUpcomingAppointment,
    getAppointmentsByStatus
  };
};