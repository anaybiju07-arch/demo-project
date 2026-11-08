import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import {
  Users,
  FileText,
  Building2,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Filter,
  MessageSquare
} from 'lucide-react';

export const JobApplicants = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Status Update Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Shortlisted');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await applicationAPI.getJobApplicants(jobId, {
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      if (res.success) {
        setJob(res.job);
        setApplicants(res.applicants);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId, statusFilter]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdating(true);
    try {
      const res = await applicationAPI.updateStatus(selectedApp._id, {
        status: newStatus,
        note: statusNote
      });
      if (res.success) {
        setSuccessMsg(`Status updated to "${newStatus}" and candidate notified.`);
        setSelectedApp(null);
        setStatusNote('');
        fetchApplicants();
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shortlisted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="company" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        <div className="mb-6">
          <Link
            to="/company/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Manage Jobs</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Candidate Review
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {job?.title || 'Job Applicants'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {applicants.length} total applications submitted for this vacancy
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-xs focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse" />
        ) : applicants.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 shadow-sm max-w-md mx-auto my-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-900 text-base">No Applicants Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No students currently match this filter criteria.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 pl-6">Student</th>
                    <th className="p-4">College & Dept</th>
                    <th className="p-4">CGPA</th>
                    <th className="p-4">Resume</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applicants.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4 pl-6">
                        <span className="font-extrabold text-slate-900 text-xs block">{app.fullName}</span>
                        <span className="text-[11px] text-slate-500">{app.email}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{app.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-800 block text-xs truncate max-w-[200px]">
                          {app.collegeName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {app.department} • {app.academicYear}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs">
                          {app.cgpa}
                        </span>
                      </td>
                      <td className="p-4">
                        {app.resumeUrl ? (
                          <a
                            href={
                              app.resumeUrl.startsWith('http')
                                ? app.resumeUrl
                                : `http://localhost:5000${app.resumeUrl}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            <span>PDF Resume</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase border ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setNewStatus(app.status);
                            setStatusNote('');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-base">
                Update Status for {selectedApp.fullName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Candidate will immediately receive a portal notification regarding their hiring update.
              </p>

              <form onSubmit={handleStatusUpdate} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Feedback / Next Step Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Round 1 Technical Interview scheduled for Monday via Google Meet link..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                  >
                    {updating ? 'Updating...' : 'Save & Notify Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
