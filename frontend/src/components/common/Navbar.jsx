import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  GraduationCap,
  Calendar,
  Briefcase,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Ticket,
  FileCheck,
  Megaphone,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export const Navbar = () => {
  const { user, profile, logout, isStudent, isAdmin, isCompany } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                  Smart Campus
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-600 -mt-1">
                  Events & Careers
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/events"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/events')
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4 text-indigo-500" />
                Events
              </Link>

              <Link
                to="/jobs"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/jobs')
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-4 h-4 text-blue-500" />
                Job Portal
              </Link>

              <Link
                to="/announcements"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/announcements')
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Megaphone className="w-4 h-4 text-amber-500" />
                Announcements
              </Link>
            </div>
          </div>

          {/* Right Section: Actions / User Profile */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-500 text-sm">
                            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                            No new notifications
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                markAsRead(n._id);
                                if (n.link) {
                                  navigate(n.link);
                                  setNotifDropdownOpen(false);
                                }
                              }}
                              className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 text-left ${
                                !n.isRead ? 'bg-indigo-50/40' : ''
                              }`}
                            >
                              <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-indigo-600" />
                              <div className="flex-1">
                                <p className="text-xs font-bold text-slate-800">{n.title}</p>
                                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Pill & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all focus:outline-none"
                  >
                    <div className="hidden sm:flex flex-col text-right">
                      <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-600 capitalize">
                        {isStudent && profile?.studentType === 'external' ? 'External Student' : user.role}
                      </span>
                    </div>
                    {user.avatar ? (
                      <img
                        src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* User Dropdown */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700 capitalize">
                          {isStudent && profile?.studentType === 'external'
                            ? 'External Student'
                            : `${user.role} Portal`}
                        </span>
                      </div>

                      {/* Role Specific Navigation */}
                      <div className="py-1">
                        {isStudent && (
                          <>
                            <Link
                              to="/student/dashboard"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <LayoutDashboard className="w-4 h-4 text-slate-400" />
                              Student Dashboard
                            </Link>
                            <Link
                              to="/my-registrations"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <Ticket className="w-4 h-4 text-emerald-500" />
                              My Event Passes
                            </Link>
                            <Link
                              to="/my-applications"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <FileCheck className="w-4 h-4 text-blue-500" />
                              My Job Applications
                            </Link>
                            <Link
                              to="/student/profile"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <User className="w-4 h-4 text-slate-400" />
                              My Profile
                            </Link>
                          </>
                        )}

                        {isAdmin && (
                          <>
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <LayoutDashboard className="w-4 h-4 text-purple-500" />
                              Admin Dashboard
                            </Link>
                            <Link
                              to="/admin/events"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <Calendar className="w-4 h-4 text-indigo-500" />
                              Manage Events
                            </Link>
                            <Link
                              to="/admin/students"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <GraduationCap className="w-4 h-4 text-emerald-500" />
                              Manage Students
                            </Link>
                            <Link
                              to="/admin/reports"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <Briefcase className="w-4 h-4 text-blue-500" />
                              Reports & Analytics
                            </Link>
                          </>
                        )}

                        {isCompany && (
                          <>
                            <Link
                              to="/company/dashboard"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <LayoutDashboard className="w-4 h-4 text-blue-500" />
                              Recruiter Dashboard
                            </Link>
                            <Link
                              to="/company/post-job"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <Briefcase className="w-4 h-4 text-emerald-500" />
                              Post New Vacancy
                            </Link>
                            <Link
                              to="/company/jobs"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <FileCheck className="w-4 h-4 text-slate-400" />
                              Manage Listings
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:shadow-indigo-300"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Calendar className="w-4 h-4 text-indigo-500" />
            Events
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Briefcase className="w-4 h-4 text-blue-500" />
            Job Portal
          </Link>
          <Link
            to="/announcements"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Megaphone className="w-4 h-4 text-amber-500" />
            Announcements
          </Link>

          {user ? (
            <div className="pt-3 border-t border-slate-100 space-y-1">
              {isStudent && (
                <>
                  <Link
                    to="/student/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    Student Dashboard
                  </Link>
                  <Link
                    to="/my-registrations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Ticket className="w-4 h-4 text-emerald-500" />
                    My Registrations
                  </Link>
                  <Link
                    to="/my-applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <FileCheck className="w-4 h-4 text-blue-500" />
                    My Applications
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-purple-700 bg-purple-50"
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-600" />
                  Admin Dashboard
                </Link>
              )}
              {isCompany && (
                <Link
                  to="/company/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  Company Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-indigo-600 rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
