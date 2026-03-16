import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, User as UserIcon, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, className = '' }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive(to)
          ? 'bg-white/20 text-white'
          : 'text-indigo-100 hover:bg-white/10 hover:text-white'}
        ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Skill<span className="text-primary-300">Exchange</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <NavLink to="/dashboard">
                  <span className="flex items-center gap-1.5"><LayoutDashboard className="w-4 h-4" /> Dashboard</span>
                </NavLink>
                <NavLink to="/profile">
                  <span className="flex items-center gap-1.5">
                    <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" className="w-5 h-5 rounded-md object-cover" />
                    Profile
                  </span>
                </NavLink>
                <div className="w-px h-6 bg-white/20 mx-2" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link
                  to="/register"
                  className="ml-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:from-primary-400 hover:to-primary-500 transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-indigo-200 hover:bg-white/10 transition"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-dark border-t border-white/10 animate-fade-in-up">
          <div className="px-4 py-3 space-y-1">
            {user ? (
              <>
                <NavLink to="/dashboard" className="w-full block">
                  <span className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</span>
                </NavLink>
                <NavLink to="/profile" className="w-full block">
                  <span className="flex items-center gap-2"><UserIcon className="w-4 h-4" /> Profile</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-300 hover:bg-rose-500/15 transition"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="w-full block">Login</NavLink>
                <NavLink to="/register" className="w-full block">Register</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
