import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import {
  Briefcase,
  Users,
  PlusCircle,
  Clock,
  ArrowRight,
  Building2,
  CheckCircle,
  FileText
} from 'lucide-react';

export const CompanyDashboard = () => {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await jobAPI.getMyCompanyJobs();
        if (res.success) {
          setJobs(res.jobs);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicantCount || 0), 0);

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="company" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        {/* Recruiter Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-100 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold text-blue-200 border border-white/10 uppercase tracking-wider">
              Recruiter Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              {profile?.companyName || user?.name}
            </h1>
            <p className="text-xs text-blue-200 mt-1">
              {profile?.industry} • {profile?.location}
            </p>
          </div>

          <Link
            to="/company/post-job"
            className="px-5 py-3 rounded-xl bg-white text-blue-800 hover:bg-blue-50 font-extrabold text-xs shadow-md transition flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Job Opening
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Openings</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{jobs.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applicants</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{totalApplicants}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Partner Status</p>
              <p className="text-base font-extrabold text-emerald-600 mt-0.5">Verified Recruiter</p>
            </div>
          </div>
        </div>

        {/* Active Openings & Applicants Review */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Your Active Job Vacancies</h3>
              <p className="text-xs text-slate-500">Monitor candidate flow and review resumes</p>
            </div>
            <Link
              to="/company/jobs"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Manage Listings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="h-40 bg-slate-50 rounded-2xl animate-pulse" />
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-xs">
              You haven't posted any jobs yet.
              <div className="mt-3">
                <Link
                  to="/company/post-job"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold inline-block"
                >
                  Post First Vacancy
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {jobs.map((j) => (
                <div
                  key={j._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{j.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {j.location} • {j.salaryOrStipend} • Deadline: {new Date(j.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                      {j.applicantCount || 0} applicants
                    </span>
                    <Link
                      to={`/company/jobs/${j._id}/applicants`}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs transition"
                    >
                      Review Candidates
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
