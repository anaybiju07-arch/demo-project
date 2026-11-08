import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventAPI } from '../../services/api';
import { EventCard } from '../../components/events/EventCard';
import { Search, Filter, Calendar, Sparkles, RefreshCw } from 'lucide-react';

export const EventsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [eligibility, setEligibility] = useState('all');
  const [sort, setSort] = useState('date_asc');

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'technical', label: 'Technical' },
    { id: 'workshops', label: 'Workshops' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'seminars', label: 'Seminars' },
    { id: 'sports', label: 'Sports' },
    { id: 'fests', label: 'Fests' }
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        category: category !== 'all' ? category : undefined,
        eligibility: eligibility !== 'all' ? eligibility : undefined,
        sort
      };

      const res = await eventAPI.getEvents(params);
      if (res.success) {
        setEvents(res.events);
        setTotal(res.total);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, eligibility, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>College Event Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Explore College Events & Activities
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Discover hackathons, seminars, cultural concerts, and sports competitions open to host and
          visiting college students.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
              category === cat.id
                ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-md scale-105'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search & Secondary Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event title, tags, or topic..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
          />
        </form>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px] uppercase">Eligibility:</span>
            <select
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Students</option>
              <option value="internal_only">Internal Host Only</option>
              <option value="external_only">External Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px] uppercase">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
            >
              <option value="date_asc">Earliest Date</option>
              <option value="date_desc">Latest Date</option>
              <option value="popular">Most Popular</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Event Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 max-w-md mx-auto my-12">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">No Events Match Your Filters</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your category, keyword search, or eligibility criteria.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('all');
              setEligibility('all');
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-4 px-1">
            <span>Showing {events.length} of {total} campus events</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
