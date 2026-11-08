import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import {
  Users,
  Calendar,
  Briefcase,
  Ticket,
  FileCheck,
  Building2,
  TrendingUp,
  PlusCircle,
  Megaphone,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  QrCode
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getDashboardStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const recent = data?.recentActivity || {};

  // Doughnut Chart Data for Event Categories
  const categoryLabels = charts.eventCategories?.map((c) => c._id?.toUpperCase()) || [];
  const categoryCounts = charts.eventCategories?.map((c) => c.count) || [];

  const doughnutData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryCounts,
        backgroundColor: [
          '#6366f1',
          '#a855f7',
          '#ec4899',
          '#f59e0b',
          '#10b981',
          '#3b82f6',
          '#64748b'
        ],
        borderWidth: 0
      }
    ]
  };

  // Bar Chart Data for Application Status
  const statusLabels = charts.applicationStatuses?.map((s) => s._id) || [];
  const statusCounts = charts.applicationStatuses?.map((s) => s.count) || [];

  const barData = {
    labels: statusLabels,
    datasets: [
      {
        label: 'Applications',
        data: statusCounts,
        backgroundColor: '#4f46e5',
        borderRadius: 8
      }
    ]
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-100 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold text-purple-200 border border-white/10 uppercase tracking-wider">
              Campus Administration Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              Administrative Command Center
            </h1>
            <p className="text-xs text-purple-200 mt-1">
              Overview of college events, registrations, placement drives, and student metrics
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 self-start sm:self-auto">
            <Link
              to="/admin/events"
              className="px-4 py-2.5 rounded-xl bg-white text-purple-900 hover:bg-purple-50 font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Add Event
            </Link>
            <Link
              to="/admin/announcements"
              className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs border border-white/20 transition flex items-center gap-1.5"
            >
              <Megaphone className="w-4 h-4" />
              Broadcast Notice
            </Link>
          </div>
        </div>

        {/* 6 Key Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalStudents || 0}</p>
            <span className="text-[10px] font-bold text-indigo-600 mt-1 block">
              {stats.internalStudents || 0} Host • {stats.externalStudents || 0} Ext
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campus Events</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalEvents || 0}</p>
            <span className="text-[10px] font-bold text-purple-600 mt-1 block">
              {stats.upcomingEvents || 0} Upcoming
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registrations</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{stats.totalRegistrations || 0}</p>
            <span className="text-[10px] font-semibold text-slate-500 mt-1 block">QR Verified</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Vacancies</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalJobs || 0}</p>
            <span className="text-[10px] font-bold text-blue-600 mt-1 block">
              {stats.activeJobs || 0} Active Openings
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applications</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{stats.totalApplications || 0}</p>
            <span className="text-[10px] font-semibold text-slate-500 mt-1 block">Submitted</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recruiters</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalCompanies || 0}</p>
            <span className="text-[10px] font-bold text-emerald-600 mt-1 block">Verified Partners</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart 1: Event Category Distribution */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Event Categories</h3>
                <p className="text-xs text-slate-400">Distribution across technical, cultural, & workshops</p>
              </div>
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="h-64 flex items-center justify-center">
              {categoryCounts.length > 0 ? (
                <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
              ) : (
                <span className="text-xs text-slate-400">No category data yet</span>
              )}
            </div>
          </div>

          {/* Chart 2: Job Applications Status Breakdown */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Hiring Pipeline Funnel</h3>
                <p className="text-xs text-slate-400">Application statuses across all company listings</p>
              </div>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>

            <div className="h-64 flex items-center justify-center">
              {statusCounts.length > 0 ? (
                <Bar
                  data={barData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }}
                />
              ) : (
                <span className="text-xs text-slate-400">No application funnel data yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity: Registrations & Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Ticket className="w-5 h-5 text-indigo-600" />
                <span>Recent Event Passes Issued</span>
              </h3>
              <Link to="/admin/events" className="text-xs font-bold text-indigo-600 hover:underline">
                View All Events →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recent.registrations?.map((r) => (
                <div key={r._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{r.studentName}</span>
                    <span className="text-[11px] text-slate-500">{r.event?.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] font-bold text-indigo-600 block">
                      {r.registrationId}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>Recent Placement Applications</span>
              </h3>
              <Link to="/admin/jobs" className="text-xs font-bold text-blue-600 hover:underline">
                View All Jobs →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recent.applications?.map((a) => (
                <div key={a._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{a.fullName}</span>
                    <span className="text-[11px] text-slate-500">
                      {a.job?.title} at {a.job?.companyName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                      {a.status}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
