import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { Briefcase, Users, Trash2, PlusCircle, ExternalLink, AlertCircle } from 'lucide-react';

export const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await jobAPI.deleteJob(id);
      setDeleteConfirmId(null);
      fetchJobs();
    } catch (err) {
      alert(err.message || 'Failed to delete job');
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="company" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Job Vacancies</h1>
            <p className="text-xs text-slate-500 mt-1">
              Review current vacancies, candidate volumes, and application deadlines
            </p>
          </div>

          <Link
            to="/company/post-job"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 self-start"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse" />
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 shadow-sm max-w-xl mx-auto my-12">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-900 text-base">No Job Listings Posted</h3>
            <p className="text-xs text-slate-500 mt-1">Publish an opening to start receiving student applications.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 pl-6">Job Title</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Compensation</th>
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
                        <span className="text-[11px] text-slate-400">{j.location}</span>
                      </td>
                      <td className="p-4 capitalize">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                          {j.jobType}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-emerald-600">{j.salaryOrStipend}</td>
                      <td className="p-4">
                        <Link
                          to={`/company/jobs/${j._id}/applicants`}
                          className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{j.applicantCount || 0} candidates</span>
                        </Link>
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(j.deadline).toLocaleDateString()}
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <Link
                          to={`/company/jobs/${j._id}/applicants`}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs transition inline-block"
                        >
                          Review
                        </Link>
                        <button
                          onClick={() => setDeleteConfirmId(j._id)}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Job"
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

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-base">Delete Job Listing?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                This will permanently delete this job listing and all student applications attached to it.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
