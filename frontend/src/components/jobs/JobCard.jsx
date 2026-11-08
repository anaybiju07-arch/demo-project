import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Clock, Building2, ArrowRight } from 'lucide-react';

export const JobCard = ({ job }) => {
  const deadlineStr = new Date(job.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isExpired = new Date() > new Date(job.deadline);

  const getTypeColor = (type) => {
    switch (type) {
      case 'full-time':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'internship':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'part-time':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Header: Company logo & Job Type badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-12 h-12 rounded-2xl object-contain p-1.5 bg-slate-50 border border-slate-200 shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100';
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-sm shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
            )}
            <div>
              <h4 className="text-xs font-bold text-slate-500">{job.companyName}</h4>
              <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                {job.title}
              </h3>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shrink-0 ${getTypeColor(
              job.jobType
            )}`}
          >
            {job.jobType}
          </span>
        </div>

        {/* Salary & Location Tags */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 mb-4">
          <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            {job.salaryOrStipend}
          </span>
          <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location}
          </span>
        </div>

        {/* Job Brief */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Required Skills tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.skillsRequired?.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700"
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired?.length > 4 && (
            <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-500">
              +{job.skillsRequired.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Deadline: {deadlineStr}</span>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition group-hover:gap-2"
        >
          <span>View & Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
