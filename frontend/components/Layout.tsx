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
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if (!user) return <>{children}</>;

  const getNavItems = () => {
    switch (user.role) {
      case Role.STUDENT:
        return [
          { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { label: 'AI Chat Support', path: '/student/chat', icon: MessageSquare },
          { label: 'My Appointments', path: '/student/appointments', icon: Calendar },
        ];
      case Role.COUNSELOR:
        return [
          { label: 'Dashboard', path: '/counselor/dashboard', icon: LayoutDashboard },
          { label: 'Requests', path: '/counselor/requests', icon: Users },
          { label: 'Calendar', path: '/counselor/calendar', icon: Calendar },
        ];
      case Role.ADMIN:
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'User Management', path: '/admin/users', icon: Users },
          { label: 'Database', path: '/admin/database', icon: ShieldAlert },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <Brain className="h-8 w-8 text-brand-600 mr-2" />
            <span className="text-xl font-bold text-slate-800 tracking-tight">MindCare</span>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-brand-50 text-brand-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20">
            <div className="flex items-center">
                <Brain className="h-6 w-6 text-brand-600 mr-2" />
                <span className="font-bold text-slate-800">MindCare</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
             <div className="absolute top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white z-50 p-4 flex flex-col gap-2 md:hidden">
                 {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700"
                    >
                        <item.icon className="h-5 w-5 mr-3 text-slate-400" />
                        {item.label}
                    </Link>
                 ))}
                 <button onClick={logout} className="flex items-center px-4 py-3 text-red-600 mt-auto">
                     <LogOut className="h-5 w-5 mr-3" />
                     Sign Out
                 </button>
             </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
            {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;