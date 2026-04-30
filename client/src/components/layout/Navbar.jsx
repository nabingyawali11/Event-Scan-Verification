import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Calendar, ScanLine, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Scanner', path: '/scanner', icon: ScanLine },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-indigo-600 flex items-center space-x-2">
              <span className="text-2xl">🎫</span>
              <span className="hidden sm:inline">EventPortal</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.organization || 'Organizer'}</p>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <button
              onClick={logout}
              className="hidden md:flex p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 px-4">
               <button
                onClick={logout}
                className="w-full flex items-center space-x-3 text-red-500 font-medium py-2"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
