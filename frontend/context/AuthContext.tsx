import React, { createContext, useContext, useState, ReactNode, PropsWithChildren } from 'react';
import { User, Role } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  syncWithLocalStorage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage on app start
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser) {
        // Simple password check for demo purposes
        let isValid = false;
        if (foundUser.role === Role.ADMIN && pass === 'Admin@123') isValid = true;
        if (foundUser.role === Role.STUDENT && pass === 'Student@123') isValid = true;
        if (foundUser.role === Role.COUNSELOR && pass === 'Counselor@123') isValid = true;

        if (isValid) {
            setUser(foundUser);
            localStorage.setItem('user', JSON.stringify(foundUser));
            setIsLoading(false);
            return;
        }
    }
    
    setIsLoading(false);
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const syncWithLocalStorage = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, syncWithLocalStorage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};