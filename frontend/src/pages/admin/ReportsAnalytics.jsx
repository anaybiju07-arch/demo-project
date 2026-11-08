import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Briefcase,
  PieChart as PieIcon,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';

export const ReportsAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
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

    fetchReports();
  }, []);

  const stats = data?.stats || {};
  const charts = data?.charts || {};

  // Doughnut: Student Breakdown (Internal vs External)
  const studentRatioData = {
    labels: ['Host College (Internal)', 'Visiting Colleges (External)'],
    datasets: [
      {
        data: [stats.internalStudents || 1, stats.externalStudents || 1],
        backgroundColor: ['#4f46e5', '#10b981'],
        borderWidth: 0
      }
    ]
  };

  // Bar: Department Distribution
  const deptLabels = charts.departments?.map((d) => d._id) || [];
  const deptCounts = charts.departments?.map((d) => d.count) || [];

  const deptBarData = {
    labels: deptLabels,
    datasets: [
      {
        label: 'Registered Students',
        data: deptCounts,
        backgroundColor: '#6366f1',
        borderRadius: 8
      }
    ]
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        <div className="mb-8">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Institutional Intelligence
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Reports & Campus Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time demographic breakdowns, event participation ratios, and campus placement analytics
          </p>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Student Body
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalStudents || 0}</p>
            <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>100% Digital Profiles Active</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Event Pass Volume
            </span>
            <p className="text-3xl font-black text-indigo-600 mt-1">
              {stats.totalRegistrations || 0}
            </p>
            <div className="mt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero Paper / Zero Google Forms</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Vacancies
            </span>
            <p className="text-3xl font-black text-purple-600 mt-1">{stats.totalJobs || 0}</p>
            <div className="mt-2 text-xs font-semibold text-purple-600 flex items-center gap-1">
              <span>{stats.totalCompanies || 0} Corporate Partners</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Placements Applied
            </span>
            <p className="text-3xl font-black text-blue-600 mt-1">
              {stats.totalApplications || 0}
            </p>
            <div className="mt-2 text-xs font-semibold text-blue-600 flex items-center gap-1">
              <span>Verified PDF Resumes</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart 1: Student Demographics */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="font-extrabold text-slate-900 text-base">
                Internal vs External Student Ratio
              </h3>
              <p className="text-xs text-slate-400">
                Participation comparison between host institute students and external universities
              </p>
            </div>

            <div className="h-64 flex items-center justify-center">
              <Doughnut data={studentRatioData} options={{ maintainAspectRatio: false }} />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-around text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                Internal ({stats.internalStudents || 0})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                External ({stats.externalStudents || 0})
              </span>
            </div>
          </div>

          {/* Chart 2: Department Participation */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="font-extrabold text-slate-900 text-base">
                Departmental Representation
              </h3>
              <p className="text-xs text-slate-400">
                Enrolled students broken down by engineering & management branch
              </p>
            </div>

            <div className="h-64 flex items-center justify-center">
              {deptCounts.length > 0 ? (
                <Bar
                  data={deptBarData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }}
                />
              ) : (
                <span className="text-xs text-slate-400">No departmental data</span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
