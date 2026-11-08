import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Share2, Tag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ShareModal } from './ShareModal';

export const EventCard = ({ event }) => {
  const [shareOpen, setShareOpen] = useState(false);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'technical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'workshops':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cultural':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'seminars':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'sports':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'fests':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const percentFull = Math.min(
    100,
    Math.round(((event.currentParticipants || 0) / (event.maxParticipants || 100)) * 100)
  );

  const isClosed = !event.isRegistrationOpen;

  return (
    <>
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
        {/* Poster / Image Header */}
        <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
          {event.posterUrl ? (
            <img
              src={event.posterUrl.startsWith('http') ? event.posterUrl : `http://localhost:5000${event.posterUrl}`}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-indigo-700 via-purple-700 to-indigo-900 flex items-center justify-center p-6 text-center">
              <span className="font-extrabold text-white text-lg tracking-tight">
                {event.department}
              </span>
            </div>
          )}

          {/* Category Pill */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md ${getCategoryColor(
                event.category
              )}`}
            >
              {event.category}
            </span>
            {event.eligibility === 'all' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 shadow-sm">
                Open to All Colleges
              </span>
            )}
          </div>

          {/* Share Button on Top Right */}
          <button
            onClick={() => setShareOpen(true)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600 shadow-md backdrop-blur-sm transition-transform hover:scale-110"
            title="Share on WhatsApp / Social Media"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Registration Fee Tag */}
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-slate-950/80 text-white backdrop-blur-md shadow-sm">
              {event.registrationFee > 0 ? `₹${event.registrationFee} Registration Fee` : 'FREE Entry'}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1.5">
              <Calendar className="w-4 h-4" />
              <span>
                {formattedDate} • {event.time}
              </span>
            </div>

            <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {event.title}
            </h3>

            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
              {event.description}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Capacity Progress & Action CTA */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {event.currentParticipants} / {event.maxParticipants} Registered
              </span>
              <span className="font-bold text-slate-700">{percentFull}% Full</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentFull >= 90 ? 'bg-rose-500' : percentFull >= 70 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${percentFull}%` }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/events/${event._id}`}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {isClosed ? (
                <span className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200">
                  Closed
                </span>
              ) : (
                <Link
                  to={`/events/${event._id}/register`}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition"
                >
                  Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal event={event} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
};
