import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const JobDetails = () => {
  const { id } = useParams();
  const { user, isStudent } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await jobAPI.getJobById(id);
        if (res.success) {
          setJob(res.job);
          setHasApplied(res.hasApplied);
          setApplicationDetails(res.applicationDetails);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 max-w-5xl mx-auto p-6 sm:p-8 w-full animate-pulse space-y-6">
        <div className="h-40 bg-slate-200 rounded-3xl" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Job Opening Not Found</h2>
        <Link to="/jobs" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Back to Jobs List
        </Link>
      </div>
    );
  }

  const deadlineStr = new Date(job.deadline).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <div className="mb-6">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Jobs</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 sm:p-10 mb-8">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex items-start gap-5">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-16 h-16 rounded-2xl object-contain p-2 bg-slate-50 border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-xl shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {job.companyName}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold mt-2">
                <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <DollarSign className="w-3.5 h-3.5" />
                  {job.salaryOrStipend}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span className="capitalize px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-lg font-bold">
                  {job.jobType}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto shrink-0">
            {hasApplied ? (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-center space-y-2">
                <span className="text-xs font-bold text-blue-800 flex items-center gap-1 justify-center">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Applied ({applicationDetails?.status})
                </span>
                <Link
                  to="/my-applications"
                  className="block text-[11px] font-bold text-blue-600 hover:underline"
                >
                  Track Application ↗
                </Link>
              </div>
            ) : (
              <Link
                to={`/jobs/${job._id}/apply`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-200 transition text-center block"
              >
                Apply for Position
              </Link>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Job Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.requirements && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Requirements & Responsibilities
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Required Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Eligibility</span>
              <span className="font-bold text-slate-900 text-xs mt-0.5 block">{job.eligibility}</span>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Qualifications</span>
              <span className="font-semibold text-slate-700 mt-0.5 block">{job.qualifications}</span>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Deadline</span>
              <span className="font-bold text-rose-600 mt-0.5 block">{deadlineStr}</span>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Applicants</span>
              <span className="font-medium text-slate-700 mt-0.5 block">
                {job.applicantCount || 0} students applied
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
