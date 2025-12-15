export enum Role {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  COUNSELOR = 'COUNSELOR',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatar?: string;
}

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  counselorId: string;
  counselorName: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  type: 'Online' | 'In-Person';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface AssessmentResult {
  id: string;
  type: 'PHQ-9' | 'DASS-21';
  score: number;
  date: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
}