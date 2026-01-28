import { useState, useEffect, useCallback } from 'react';
import localDatabase, { Appointment, Therapist, TherapistAvailability } from '../services/localDatabase';

export const useDatabase = (username?: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    if (username) {
      setAppointments(localDatabase.getAppointments(username));
    }
    setTherapists(localDatabase.getTherapists());
  }, [username]);

  // Listen for storage changes for real-time sync
  useEffect(() => {
    const handleStorageChange = () => {
      if (username) {
        setAppointments(localDatabase.getAppointments(username));
      }
      setTherapists(localDatabase.getTherapists());
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
    return localDatabase.getAppointmentsByTherapist(therapistId);
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

  return {
    // Data
    appointments,
    therapists,
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