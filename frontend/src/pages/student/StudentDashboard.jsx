import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registrationAPI, applicationAPI, announcementAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import {
  Calendar,
  Briefcase,
  Ticket,
  FileCheck,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Megaphone
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [regRes, appRes, annRes] = await Promise.all([
          registrationAPI.getMyRegistrations(),
          applicationAPI.getMyApplications(),
          announcementAPI.getAnnouncements({ limit: 3 })
        ]);

        if (regRes.success) setRegistrations(regRes.registrations || []);
        if (appRes.success) setApplications(appRes.applications || []);
        if (annRes.success) setAnnouncements(annRes.announcements || []);
      } catch (err) {
        console.warn('Dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const confirmedRegistrations = registrations.filter((r) => r.status !== 'cancelled');
  const activeApplications = applications.filter((a) => a.status !== 'Rejected');

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100 mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-indigo-200 border border-white/10 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart Campus Student Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-indigo-100 leading-relaxed">
              {profile?.collegeName} • {profile?.department} ({profile?.academicYear})
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 relative z-10">
            <Link
              to="/events"
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Explore College Events
            </Link>
            <Link
              to="/jobs"
              className="px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              View Campus Placements
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Events</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{confirmedRegistrations.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Applications</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{applications.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student CGPA</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{profile?.cgpa || '8.85'}</p>
            </div>
          </div>
        </div>

        {/* Two Columns: Recent Registrations & Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Event Passes */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">My Event Passes</h3>
                </div>
                <Link
                  to="/my-registrations"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="h-40 bg-slate-50 rounded-2xl animate-pulse" />
              ) : registrations.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-xs">
                  You haven't registered for any events yet.
                  <div className="mt-3">
                    <Link
                      to="/events"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold inline-block"
                    >
                      Browse Events
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {registrations.slice(0, 3).map((reg) => (
                    <div
                      key={reg._id}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition flex items-center justify-between gap-3"
                    >
                      <div className="overflow-hidden">
                        <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60 inline-block mb-1">
                          {reg.registrationId}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {reg.event?.title || 'Campus Event'}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : 'Upcoming'} •{' '}
                          {reg.event?.venue}
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                          reg.status === 'attended'
                            ? 'bg-emerald-100 text-emerald-800'
                            : reg.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Job Applications */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">Job Applications Tracker</h3>
                </div>
                <Link
                  to="/my-applications"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="h-40 bg-slate-50 rounded-2xl animate-pulse" />
              ) : applications.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-xs">
                  You haven't submitted any job applications yet.
                  <div className="mt-3">
                    <Link
                      to="/jobs"
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold inline-block"
                    >
                      Explore Job Openings
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app._id}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition flex items-center justify-between gap-3"
                    >
                      <div className="overflow-hidden">
                        <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 inline-block mb-1">
                          {app.applicationId}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {app.job?.title || 'Software Role'}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {app.job?.companyName || 'Campus Partner'} • Applied{' '}
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                          app.status === 'Selected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Shortlisted'
                            ? 'bg-amber-100 text-amber-800'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Latest Campus Notices */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-base">Important Campus Circulars</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcements.map((ann) => (
              <div
                key={ann._id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    {ann.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">{ann.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
                  {new Date(ann.createdAt).toLocaleDateString()} • By {ann.authorName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
