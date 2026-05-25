import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  ScanLine,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Scanner", path: "/scanner", icon: ScanLine },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-3 sm:px-4 md:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-4 sm:gap-8 min-w-0">
            <Link
              to="/"
              className="text-xl font-bold text-indigo-600 flex items-center gap-2 shrink-0"
            >
              <span className="text-xl sm:text-2xl">🎫</span>
              <span className="hidden sm:inline text-sm md:text-base">
                EventPortal
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
                >
                  <item.icon size={16} className="md:w-5 md:h-5" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs md:text-sm font-semibold text-slate-800 truncate">
                {user?.name}
              </p>
              <p className="text-[10px] md:text-xs text-slate-500 truncate">
                {user?.organization || "Organizer"}
              </p>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg shrink-0"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <button
              onClick={logout}
              className="hidden md:flex p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
              title="Logout"
            >
              <LogOut size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 px-4">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 text-red-500 font-medium py-2 text-sm"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
