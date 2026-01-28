import React, { PropsWithChildren } from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Users, 
  LogOut, 
  Brain,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }: PropsWithChildren) => {
  const { user, logout } = useAuth();

  if (!user) return <>{children}</>;

  // All roles use header-only layout, no sidebars
  return <>{children}</>;
};

export default Layout;