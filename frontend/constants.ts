import { Role, UserStatus, User, Appointment } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'System Admin',
    email: 'admin@apumentalhealth.edu',
    role: Role.ADMIN,
    status: UserStatus.ACTIVE,
  },
  {
    id: 'u2',
    name: 'John Student',
    email: 'student1@apu.edu.my',
    role: Role.STUDENT,
    status: UserStatus.ACTIVE,
  },
  {
    id: 'u3',
    name: 'Dr. Sarah Counselor',
    email: 'counselor1@apu.edu.my',
    role: Role.COUNSELOR,
    status: UserStatus.PENDING, 
  },
  {
    id: 'u4',
    name: 'Jane Doe',
    email: 'student2@apu.edu.my',
    role: Role.STUDENT,
    status: UserStatus.SUSPENDED,
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    studentId: 'u2',
    studentName: 'John Student',
    counselorId: 'u3',
    counselorName: 'Dr. Sarah Counselor',
    date: '2023-11-15',
    time: '10:00 AM',
    status: 'CONFIRMED',
    type: 'In-Person'
  },
  {
    id: 'a2',
    studentId: 'u2',
    studentName: 'John Student',
    counselorId: 'u3',
    counselorName: 'Dr. Sarah Counselor',
    date: '2023-11-20',
    time: '02:00 PM',
    status: 'PENDING',
    type: 'Online'
  },
];

export const SDG_INFO = {
  title: "SDG 3: Good Health and Well-Being",
  description: "Ensure healthy lives and promote well-being for all at all ages.",
  target: "Target 3.4: By 2030, reduce by one third premature mortality from non-communicable diseases through prevention and treatment and promote mental health and well-being.",
};

export const CHATBOT_SYSTEM_INSTRUCTION = `
You are a compassionate, non-judgmental, and ethical AI mental health assistant for university students at APU.
Your role is to offer initial support, active listening, and guide students to professional help.

CRITICAL RULES:
1. DO NOT DIAGNOSE. You are not a doctor. Never say "You have depression" or "You are anxious". Instead say "It sounds like you are going through a tough time."
2. IF DISTRESS IS DETECTED: Gently suggest they might benefit from a self-assessment (PHQ-9 or DASS-21) or speaking to a human counselor.
3. EMERGENCY: If the user mentions self-harm or suicide, IMMEDIATELY provide emergency resources (Befrienders KL: 03-76272929, Talian Kasih: 15999) and urge them to seek immediate help.
4. TONE: Warm, academic yet accessible, empathetic, and professional.
5. CONTEXT: You are part of a university project. Acknowledge this if asked.

When suggesting an appointment, guide them to the 'Appointments' tab.
`;
