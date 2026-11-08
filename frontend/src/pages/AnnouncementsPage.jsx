import React, { useState, useEffect } from 'react';
import { announcementAPI } from '../services/api';
import { Megaphone, Calendar, AlertCircle, ShieldAlert, Tag, Clock } from 'lucide-react';

export const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await announcementAPI.getAnnouncements({
          category: category !== 'all' ? category : undefined
        });
        if (res.success) {
          setAnnouncements(res.announcements);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [category]);

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'academic', label: 'Academic' },
    { id: 'event', label: 'Events & Fests' },
    { id: 'placement', label: 'Placement Drives' },
    { id: 'general', label: 'General' },
    { id: 'urgent', label: 'Urgent Alerts' }
  ];

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3">
          <Megaphone className="w-3.5 h-3.5" />
          <span>Official Campus Circulars</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          College Announcements & Notices
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Stay informed on semester exams, placement assessment schedules, guest lectures, and campus
          events.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
              category === cat.id
                ? 'bg-amber-600 text-white shadow-amber-200 shadow-md scale-105'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs max-w-md mx-auto">
          No notices currently found under this category.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a._id}
              className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm transition hover:shadow-md ${
                a.priority === 'urgent'
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : a.priority === 'high'
                  ? 'border-amber-300'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {a.category}
                </span>

                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    a.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : a.priority === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {a.priority} Priority
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">{a.title}</h2>

              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed whitespace-pre-line">
                {a.content}
              </p>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Published by: {a.authorName}</span>
                <span>{new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
