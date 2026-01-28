export interface Student {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'student';
  tpNumber: string;
  fullName: string;
  gender: string;
  age: number;
  course: string;
  yearOfStudy: number;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'student' | 'counselor' | 'admin';
  fullName: string;
  tpNumber?: string;
  gender?: string;
  age?: number;
  course?: string;
  yearOfStudy?: number;
  createdAt: Date;
}

class LocalStorageDB {
  private getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  registerStudent(studentData: Omit<Student, 'id' | 'createdAt'>): Student {
    const users = this.getUsers();
    
    // Check if username or email already exists
    if (users.find(u => u.username === studentData.username)) {
      throw new Error('Username already exists');
    }
    if (users.find(u => u.email === studentData.email)) {
      throw new Error('Email already exists');
    }

    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    users.push(newStudent);
    this.saveUsers(users);
    return newStudent;
  }

  login(username: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
  }

  getUserByUsername(username: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.username === username) || null;
  }
}

export const localDB = new LocalStorageDB();