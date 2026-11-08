import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Ticket,
  FileCheck,
  User,
  LogOut,
  Users,
  Building2,
  BarChart3,
  Megaphone,
  BotMessageSquare,
  PlusCircle,
  QrCode
} from 'lucide-react';

export const Sidebar = ({ role }) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* User Mini Profile Badge */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-indigo-200 shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">{user?.name}</h4>
            <p className="text-[10px] text-slate-500 font-medium truncate">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold rounded-full bg-indigo-100 text-indigo-700 capitalize">
              {role === 'student' && profile?.studentType === 'external' ? 'External Student' : role}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          {role === 'student' && (
            <>
              <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Student Portal
              </p>
              <NavLink to="/student/dashboard" className={navItemClass}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard Overview
              </NavLink>
              <NavLink to="/my-registrations" className={navItemClass}>
                <Ticket className="w-4 h-4" />
                My Event Registrations
              </NavLink>
              <NavLink to="/my-applications" className={navItemClass}>
                <FileCheck className="w-4 h-4" />
                My Job Applications
              </NavLink>
              <NavLink to="/student/profile" className={navItemClass}>
                <User className="w-4 h-4" />
                Profile & Resume
              </NavLink>
              <div className="pt-4">
                <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Campus Navigation
                </p>
                <NavLink to="/events" className={navItemClass}>
                  <Calendar className="w-4 h-4" />
                  Browse All Events
                </NavLink>
                <NavLink to="/jobs" className={navItemClass}>
                  <Briefcase className="w-4 h-4" />
                  Explore Job Openings
                </NavLink>
              </div>
            </>
          )}

          {role === 'admin' && (
            <>
              <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Administration
              </p>
              <NavLink to="/admin/dashboard" className={navItemClass}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard Overview
              </NavLink>
              <NavLink to="/admin/events" className={navItemClass}>
                <Calendar className="w-4 h-4" />
                Manage Events & Pass
              </NavLink>
              <NavLink to="/admin/students" className={navItemClass}>
                <Users className="w-4 h-4" />
                Student Directory
              </NavLink>
              <NavLink to="/admin/companies" className={navItemClass}>
                <Building2 className="w-4 h-4" />
                Company Partners
              </NavLink>
              <NavLink to="/admin/jobs" className={navItemClass}>
                <Briefcase className="w-4 h-4" />
                Campus Job Postings
              </NavLink>
              <NavLink to="/admin/announcements" className={navItemClass}>
                <Megaphone className="w-4 h-4" />
                Publish Announcements
              </NavLink>
              <NavLink to="/admin/chatbot" className={navItemClass}>
                <BotMessageSquare className="w-4 h-4" />
                AI Chatbot FAQs
              </NavLink>
              <NavLink to="/admin/reports" className={navItemClass}>
                <BarChart3 className="w-4 h-4" />
                Reports & Analytics
              </NavLink>
            </>
          )}

          {role === 'company' && (
            <>
              <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Recruiter Portal
              </p>
              <NavLink to="/company/dashboard" className={navItemClass}>
                <LayoutDashboard className="w-4 h-4" />
                Recruiter Overview
              </NavLink>
              <NavLink to="/company/post-job" className={navItemClass}>
                <PlusCircle className="w-4 h-4" />
                Post New Vacancy
              </NavLink>
              <NavLink to="/company/jobs" className={navItemClass}>
                <Briefcase className="w-4 h-4" />
                Manage Job Listings
              </NavLink>
              <NavLink to="/company/profile" className={navItemClass}>
                <Building2 className="w-4 h-4" />
                Company Profile
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
