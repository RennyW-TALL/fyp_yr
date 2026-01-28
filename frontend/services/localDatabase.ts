export interface Appointment {
  appointment_id: number;
  student_username: string;
  therapist_id: number;
  therapist_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  cancel_reason?: string;
  cancelled_at?: string;
  session_note?: string;
  created_at: string;
}

export interface TherapistAvailability {
  therapist_id: number;
  therapist_name: string;
  date: string;
  time_slots: {
    start_time: string;
    end_time: string;
    is_available: boolean;
    appointment_id?: number;
  }[];
}

export interface Therapist {
  id: number;
  name: string;
  gender: string;
  specialization: string;
  profileImage: string;
}

class LocalDatabase {
  private static instance: LocalDatabase;
  
  static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  private constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize therapists if not exists
    if (!localStorage.getItem('therapists')) {
      const therapists: Therapist[] = [
        {
          id: 1,
          name: 'Dr. John Smith',
          gender: 'male',
          specialization: 'Anxiety & Stress',
          profileImage: '/images/therapists/dr-john-smith.jpg'
        },
        {
          id: 2,
          name: 'Dr. Mei Lee',
          gender: 'female',
          specialization: 'Academic Pressure',
          profileImage: '/images/therapists/dr-mei-lee.jpg'
        },
        {
          id: 3,
          name: 'Dr. Wilson House',
          gender: 'male',
          specialization: 'Anxiety and Depression',
          profileImage: '/images/therapists/dr-wilson-house.jpg'
        }
      ];
      localStorage.setItem('therapists', JSON.stringify(therapists));
    }

    // Initialize availability for next 30 days
    if (!localStorage.getItem('therapist_availability')) {
      this.generateAvailability();
    }

    // Initialize static appointments for student1
    if (!localStorage.getItem('appointments_student1')) {
      const staticAppointments: Appointment[] = [
        {
          appointment_id: 1,
          student_username: 'student1',
          therapist_id: 1,
          therapist_name: 'Dr. John Smith',
          appointment_date: '2024-03-10',
          start_time: '10:00:00',
          end_time: '11:00:00',
          status: 'Completed',
          session_note: 'The session went well, the patient showed significant improvement in their mood and behavior.',
          created_at: '2024-12-01 10:00:00'
        },
        {
          appointment_id: 2,
          student_username: 'student1',
          therapist_id: 2,
          therapist_name: 'Dr. Mei Lee',
          appointment_date: '2026-04-15',
          start_time: '11:00:00',
          end_time: '12:00:00',
          status: 'Pending',
          created_at: '2025-01-01 14:00:00'
        },
        {
          appointment_id: 3,
          student_username: 'student1',
          therapist_id: 3,
          therapist_name: 'Dr. Wilson House',
          appointment_date: '2026-05-20',
          start_time: '14:00:00',
          end_time: '15:00:00',
          status: 'Confirmed',
          created_at: '2025-01-10 11:00:00'
        },
        {
          appointment_id: 4,
          student_username: 'student1',
          therapist_id: 1,
          therapist_name: 'Dr. John Smith',
          appointment_date: '2025-06-10',
          start_time: '09:00:00',
          end_time: '10:00:00',
          status: 'Cancelled',
          cancel_reason: 'User no-show',
          cancelled_at: '2025-06-10 08:30:00',
          session_note: 'The appointment was cancelled as the patient did not show up.',
          created_at: '2025-01-20 13:00:00'
        },
        {
          appointment_id: 5,
          student_username: 'student1',
          therapist_id: 2,
          therapist_name: 'Dr. Mei Lee',
          appointment_date: '2024-07-10',
          start_time: '16:00:00',
          end_time: '17:00:00',
          status: 'Completed',
          session_note: 'The session was very productive, the patient made good progress in addressing their stress.',
          created_at: '2025-02-01 15:00:00'
        },
        {
          appointment_id: 6,
          student_username: 'student1',
          therapist_id: 3,
          therapist_name: 'Dr. Wilson House',
          appointment_date: '2024-08-05',
          start_time: '10:00:00',
          end_time: '11:00:00',
          status: 'Completed',
          session_note: 'The patient showed great engagement during the session and discussed their coping mechanisms.',
          created_at: '2025-02-15 10:30:00'
        }
      ];
      localStorage.setItem('appointments_student1', JSON.stringify(staticAppointments));
    }
  }

  private generateAvailability() {
    const availability: TherapistAvailability[] = [];
    const therapists = this.getTherapists();
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      therapists.forEach(therapist => {
        const timeSlots = [];
        for (let hour = 9; hour < 17; hour++) {
          timeSlots.push({
            start_time: `${hour.toString().padStart(2, '0')}:00:00`,
            end_time: `${(hour + 1).toString().padStart(2, '0')}:00:00`,
            is_available: true
          });
        }
        
        availability.push({
          therapist_id: therapist.id,
          therapist_name: therapist.name,
          date: dateStr,
          time_slots: timeSlots
        });
      });
    }
    
    localStorage.setItem('therapist_availability', JSON.stringify(availability));
  }

  // Therapist methods
  getTherapists(): Therapist[] {
    return JSON.parse(localStorage.getItem('therapists') || '[]');
  }

  // Appointment methods
  getAppointments(username: string): Appointment[] {
    return JSON.parse(localStorage.getItem(`appointments_${username}`) || '[]');
  }

  createAppointment(appointment: Omit<Appointment, 'appointment_id' | 'created_at'>): Appointment {
    const appointments = this.getAppointments(appointment.student_username);
    const newId = Math.max(0, ...appointments.map(a => a.appointment_id)) + 1;
    
    const newAppointment: Appointment = {
      ...appointment,
      appointment_id: newId,
      created_at: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    localStorage.setItem(`appointments_${appointment.student_username}`, JSON.stringify(appointments));
    
    // Update availability
    this.updateAvailability(appointment.therapist_id, appointment.appointment_date, appointment.start_time, false, newId);
    
    this.notifyChange();
    return newAppointment;
  }

  updateAppointment(username: string, appointmentId: number, updates: Partial<Appointment>): boolean {
    const appointments = this.getAppointments(username);
    const index = appointments.findIndex(a => a.appointment_id === appointmentId);
    
    if (index === -1) return false;
    
    const oldAppointment = appointments[index];
    appointments[index] = { ...oldAppointment, ...updates };
    
    localStorage.setItem(`appointments_${username}`, JSON.stringify(appointments));
    
    // If cancelling, free up the slot
    if (updates.status === 'Cancelled') {
      this.updateAvailability(oldAppointment.therapist_id, oldAppointment.appointment_date, oldAppointment.start_time, true);
    }
    
    this.notifyChange();
    return true;
  }

  cancelAppointment(username: string, appointmentId: number, reason: string): boolean {
    return this.updateAppointment(username, appointmentId, {
      status: 'Cancelled',
      cancel_reason: reason,
      cancelled_at: new Date().toISOString()
    });
  }

  // Availability methods
  getAvailability(therapistId?: number, date?: string): TherapistAvailability[] {
    const availability = JSON.parse(localStorage.getItem('therapist_availability') || '[]');
    
    let filtered = availability;
    if (therapistId) {
      filtered = filtered.filter((a: TherapistAvailability) => a.therapist_id === therapistId);
    }
    if (date) {
      filtered = filtered.filter((a: TherapistAvailability) => a.date === date);
    }
    
    return filtered;
  }

  private updateAvailability(therapistId: number, date: string, startTime: string, isAvailable: boolean, appointmentId?: number) {
    const availability = this.getAvailability();
    const dayAvailability = availability.find(a => a.therapist_id === therapistId && a.date === date);
    
    if (dayAvailability) {
      const slot = dayAvailability.time_slots.find(s => s.start_time === startTime);
      if (slot) {
        slot.is_available = isAvailable;
        if (appointmentId) {
          slot.appointment_id = appointmentId;
        } else {
          delete slot.appointment_id;
        }
      }
    }
    
    localStorage.setItem('therapist_availability', JSON.stringify(availability));
  }

  getAvailableSlots(therapistId: number, date: string): { start_time: string; end_time: string }[] {
    const availability = this.getAvailability(therapistId, date);
    if (availability.length === 0) return [];
    
    return availability[0].time_slots
      .filter(slot => slot.is_available)
      .map(slot => ({ start_time: slot.start_time, end_time: slot.end_time }));
  }

  // Get all appointments for therapist (for therapist dashboard)
  getAppointmentsByTherapist(therapistId: number): Appointment[] {
    const allAppointments: Appointment[] = [];
    
    // Get all appointment keys from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('appointments_')) {
        const appointments = JSON.parse(localStorage.getItem(key) || '[]');
        allAppointments.push(...appointments.filter((apt: Appointment) => apt.therapist_id === therapistId));
      }
    }
    
    return allAppointments.sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());
  }

  // Update appointment status (for therapist actions)
  updateAppointmentStatus(appointmentId: number, status: 'Confirmed' | 'Cancelled', reason?: string): boolean {
    // Find the appointment across all users
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('appointments_')) {
        const appointments = JSON.parse(localStorage.getItem(key) || '[]');
        const index = appointments.findIndex((a: Appointment) => a.appointment_id === appointmentId);
        
        if (index !== -1) {
          const appointment = appointments[index];
          appointments[index] = {
            ...appointment,
            status,
            ...(reason && { cancel_reason: reason, cancelled_at: new Date().toISOString() })
          };
          
          localStorage.setItem(key, JSON.stringify(appointments));
          
          // If cancelling, free up the slot
          if (status === 'Cancelled') {
            this.updateAvailability(appointment.therapist_id, appointment.appointment_date, appointment.start_time, true);
          }
          
          this.notifyChange();
          return true;
        }
      }
    }
    return false;
  }

  // Set therapist availability (for therapist to manage schedule)
  setTherapistAvailability(therapistId: number, date: string, timeSlots: { start_time: string; end_time: string; is_available: boolean }[]): boolean {
    const availability = this.getAvailability();
    const existingIndex = availability.findIndex(a => a.therapist_id === therapistId && a.date === date);
    
    const therapist = this.getTherapists().find(t => t.id === therapistId);
    if (!therapist) return false;
    
    const dayAvailability: TherapistAvailability = {
      therapist_id: therapistId,
      therapist_name: therapist.name,
      date,
      time_slots: timeSlots
    };
    
    if (existingIndex >= 0) {
      availability[existingIndex] = dayAvailability;
    } else {
      availability.push(dayAvailability);
    }
    
    localStorage.setItem('therapist_availability', JSON.stringify(availability));
    this.notifyChange();
    return true;
  }

  // Utility methods
  private notifyChange() {
    // Trigger multiple storage events for comprehensive sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'appointments_sync',
      newValue: Date.now().toString()
    }));
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'therapist_appointments_sync',
      newValue: Date.now().toString()
    }));
  }

  // Search and filter methods
  searchAppointments(username: string, filters: {
    status?: string;
    therapistId?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Appointment[] {
    let appointments = this.getAppointments(username);
    
    if (filters.status) {
      appointments = appointments.filter(a => a.status === filters.status);
    }
    if (filters.therapistId) {
      appointments = appointments.filter(a => a.therapist_id === filters.therapistId);
    }
    if (filters.dateFrom) {
      appointments = appointments.filter(a => a.appointment_date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      appointments = appointments.filter(a => a.appointment_date <= filters.dateTo!);
    }
    
    return appointments.sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime());
  }
}

export default LocalDatabase.getInstance();