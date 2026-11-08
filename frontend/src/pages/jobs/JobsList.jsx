import React, { useState, useEffect } from 'react';
import { jobAPI } from '../../services/api';
import { JobCard } from '../../components/jobs/JobCard';
import { Search, Briefcase, MapPin, Building2, Filter } from 'lucide-react';

export const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('all');
  const [location, setLocation] = useState('all');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        jobType: jobType !== 'all' ? jobType : undefined,
        location: location !== 'all' ? location : undefined
      };
      const res = await jobAPI.getJobs(params);
      if (res.success) {
        setJobs(res.jobs);
        setTotal(res.total);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobType, location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Campus Recruitment & Internships</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Job Vacancies & Career Opportunities
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Apply directly to top technology enterprises, campus placements, and summer internships
          with 1-click PDF resume submission.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role, skill (e.g. React, Python), or company..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
          />
        </form>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px] uppercase">Job Type:</span>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-Time</option>
              <option value="internship">Internship</option>
              <option value="part-time">Part-Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 max-w-md mx-auto my-12">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">No Openings Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search keywords or filters.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-4 px-1">
            <span>Showing {jobs.length} active opportunities</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
