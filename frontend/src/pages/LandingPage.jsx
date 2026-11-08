import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventAPI, jobAPI, announcementAPI } from '../services/api';
import { EventCard } from '../components/events/EventCard';
import { JobCard } from '../components/jobs/JobCard';
import {
  GraduationCap,
  Calendar,
  Briefcase,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Users,
  Building2,
  Trophy,
  Megaphone,
  QrCode,
  ShieldCheck,
  Globe
} from 'lucide-react';

export const LandingPage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [eventRes, jobRes, annRes] = await Promise.all([
          eventAPI.getFeaturedEvents(),
          jobAPI.getJobs({ limit: 4 }),
          announcementAPI.getAnnouncements({ limit: 2 })
        ]);

        if (eventRes.success) setFeaturedEvents(eventRes.events || []);
        if (jobRes.success) setActiveJobs(jobRes.jobs || []);
        if (annRes.success) setAnnouncements(annRes.announcements || []);
      } catch (err) {
        console.warn('Error loading homepage data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Announcement Banner if active */}
      {announcements.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white px-4 py-2.5 text-xs font-semibold shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                {announcements[0].priority} NOTICE
              </span>
              <span className="truncate">{announcements[0].title}</span>
            </div>
            <Link
              to="/announcements"
              className="shrink-0 underline hover:text-indigo-200 transition text-[11px] font-bold"
            >
              Read Notice →
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200/60">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-pink-100/20 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Digital Event Registration & Career Portal for All Colleges</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Experience Campus Life,{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Events & Placements
            </span>{' '}
            in One Digital Hub.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Replace clumsy Google Forms with instant digital tickets, verified QR code check-ins,
            and direct access to campus recruitment vacancies from top global recruiters.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-xl mx-auto flex items-center gap-2 p-2 bg-white rounded-2xl shadow-xl shadow-indigo-100/60 border border-slate-200"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hackathons, bootcamps, workshops, jobs..."
              className="flex-1 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition"
            >
              Search
            </button>
          </form>

          {/* Quick Action Badges */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-slate-600">
            <Link
              to="/events"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 shadow-sm transition"
            >
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>Browse 2026 Events</span>
            </Link>
            <Link
              to="/jobs"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 shadow-sm transition"
            >
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span>Job Vacancies</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 shadow-sm transition"
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>External Student Registration</span>
            </Link>
          </div>

          {/* Live Platform Stats */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-indigo-600">100%</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Digital Pass & QR</p>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-purple-600">₹24 LPA</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Top Placement CTC</p>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">Open</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Inter-College Events</p>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-blue-600">24/7</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">AI Campus Chatbot</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Grid Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Campus Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming College Events & Hackathons
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.slice(0, 3).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200 text-slate-500 text-sm">
            No events scheduled yet.
          </div>
        )}
      </section>

      {/* Campus Placement & Hiring Partners Section */}
      <section className="py-16 bg-slate-100/60 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Briefcase className="w-4 h-4" />
                <span>Training & Placement Cell</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Active Job Opportunities & Internships
              </h2>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights: Why Smart Campus */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Modern Academic Institutions
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            A digital solution bridging students, event organizers, placement officers, and corporate recruiters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              Digital QR Pass Verification
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every registered participant receives an instant verified QR badge. Administrators can
              scan codes at gate entrances to eliminate lines and verify real-time attendance.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              External University Support
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Seamlessly supports students from other colleges to discover, register, and attend
              inter-collegiate cultural festivals, sports tournaments, and hackathons.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              AI Campus Virtual Assistant
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Equipped with a database-grounded virtual assistant that answers student questions on
              deadlines, event schedules, venues, and recruiters using real live records.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
