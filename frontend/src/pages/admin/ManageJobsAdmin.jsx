import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { Briefcase, Users, Trash2, ExternalLink } from 'lucide-react';

export const ManageJobsAdmin = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobAPI.getJobs({ limit: 50 });
      if (res.success) {
        setJobs(res.jobs);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job vacancy listing?')) return;
    try {
      await jobAPI.deleteJob(id);
      fetchJobs();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Job Listings Management</h1>
            <p className="text-xs text-slate-500 mt-1">
              Oversee campus recruitment vacancies, salary offerings, and applicant metrics
            </p>
          </div>

          <Link
            to="/company/post-job"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition self-start"
          >
            Post Admin Placement
          </Link>
        </div>

        {loading ? (
          <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse" />
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 pl-6">Company & Position</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Compensation</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Applicants</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((j) => (
                    <tr key={j._id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4 pl-6">
                        <span className="font-extrabold text-slate-900 text-xs block">{j.title}</span>
                        <span className="text-[11px] text-slate-500 font-semibold">{j.companyName}</span>
                      </td>
                      <td className="p-4 capitalize">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                          {j.jobType}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-emerald-600">{j.salaryOrStipend}</td>
                      <td className="p-4 text-slate-600">{j.location}</td>
                      <td className="p-4">
                        <Link
                          to={`/company/jobs/${j._id}/applicants`}
                          className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{j.applicantCount || 0} candidates</span>
                        </Link>
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(j.deadline).toLocaleDateString()}
                      </td>
                      <td className="p-4 pr-6 text-right space-x-1.5">
                        <Link
                          to={`/company/jobs/${j._id}/applicants`}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs transition inline-block"
                        >
                          Applicants
                        </Link>
                        <button
                          onClick={() => handleDelete(j._id)}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
