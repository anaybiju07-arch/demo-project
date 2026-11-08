import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import {
  FileCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await applicationAPI.getMyApplications();
        if (res.success) {
          setApplications(res.applications);
          if (res.applications.length > 0) {
            setSelectedApp(res.applications[0]);
          }
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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

  const steps = ['Applied', 'Under Review', 'Shortlisted', 'Selected'];

  const getStepState = (stepName, currentStatus) => {
    if (currentStatus === 'Rejected') {
      return stepName === 'Applied' ? 'completed' : 'rejected';
    }
    const order = { Applied: 1, 'Under Review': 2, Shortlisted: 3, Selected: 4 };
    const currentOrder = order[currentStatus] || 1;
    const stepOrder = order[stepName] || 1;

    if (stepOrder < currentOrder) return 'completed';
    if (stepOrder === currentOrder) return 'active';
    return 'pending';
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              My Job Applications
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track real-time hiring status from recruiters and campus placement drives
            </p>
          </div>

          <Link
            to="/jobs"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-100 transition inline-flex items-center gap-2 self-start"
          >
            <Building2 className="w-4 h-4" />
            Explore More Jobs
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse" />
            <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse col-span-2" />
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 shadow-sm max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No Applications Submitted</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Explore open vacancies with top technology and engineering partners, attach your resume,
              and apply in one click.
            </p>
            <Link
              to="/jobs"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-200 transition"
            >
              Browse Job Portal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left applications list */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Your Applications ({applications.length})
              </h3>
              {applications.map((app) => (
                <div
                  key={app._id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedApp?._id === app._id
                      ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                      {app.applicationId}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {app.job?.title || 'Software Engineer'}
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    {app.job?.companyName || 'Recruiter'}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                    <span className="text-blue-600 font-bold flex items-center gap-1">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Application Progress Details */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm sticky top-24">
              {selectedApp && (
                <div>
                  <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-600">
                        {selectedApp.applicationId}
                      </span>
                      <h2 className="text-xl font-black text-slate-900 mt-1">
                        {selectedApp.job?.title}
                      </h2>
                      <p className="text-xs font-bold text-slate-600 mt-0.5">
                        {selectedApp.job?.companyName} • {selectedApp.job?.location}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${getStatusBadge(
                        selectedApp.status
                      )}`}
                    >
                      {selectedApp.status}
                    </span>
                  </div>

                  {/* Visual Status Stepper */}
                  <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-6">
                      Hiring Pipeline Status
                    </h4>
                    <div className="grid grid-cols-4 gap-2 relative">
                      {steps.map((st, i) => {
                        const state = getStepState(st, selectedApp.status);
                        return (
                          <div key={st} className="flex flex-col items-center text-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                                state === 'completed'
                                  ? 'bg-emerald-500 text-white shadow-sm'
                                  : state === 'active'
                                  ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100'
                                  : state === 'rejected'
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {state === 'completed' ? '✓' : i + 1}
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                state === 'active'
                                  ? 'text-blue-700'
                                  : state === 'completed'
                                  ? 'text-emerald-700'
                                  : 'text-slate-400'
                              }`}
                            >
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status History & Notes */}
                  <div className="space-y-4 mb-6">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Status History & Notes
                    </h4>
                    <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
                      {selectedApp.statusHistory?.map((hist, idx) => (
                        <div key={idx} className="p-3.5 flex items-start justify-between gap-3 text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{hist.status}</span>
                            {hist.note && (
                              <p className="text-slate-500 text-[11px] mt-0.5">{hist.note}</p>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(hist.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attached Resume */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Submitted Resume</p>
                        <p className="text-[10px] text-slate-500">PDF Document</p>
                      </div>
                    </div>
                    {selectedApp.resumeUrl && (
                      <a
                        href={
                          selectedApp.resumeUrl.startsWith('http')
                            ? selectedApp.resumeUrl
                            : `http://localhost:5000${selectedApp.resumeUrl}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 font-bold text-xs flex items-center gap-1 transition shadow-xs"
                      >
                        <span>View Resume</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
