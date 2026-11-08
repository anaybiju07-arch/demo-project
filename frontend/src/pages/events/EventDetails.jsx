import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ShareModal } from '../../components/events/ShareModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Tag,
  Share2,
  Building,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Ticket
} from 'lucide-react';

export const EventDetails = () => {
  const { id } = useParams();
  const { user, isStudent } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await eventAPI.getEventById(id);
        if (res.success) {
          setEvent(res.event);
          setIsRegistered(res.isRegistered);
          setRegistrationDetails(res.registrationDetails);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 max-w-5xl mx-auto p-6 sm:p-8 w-full animate-pulse space-y-6">
        <div className="h-64 bg-slate-200 rounded-3xl" />
        <div className="h-32 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
        <Link to="/events" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Back to Events List
        </Link>
      </div>
    );
  }

  const isClosed = !event.isRegistrationOpen;
  const eventDateStr = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const deadlineStr = new Date(event.regEndDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden mb-8">
        {/* Event Banner */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-900 overflow-hidden">
          {event.posterUrl ? (
            <img
              src={event.posterUrl.startsWith('http') ? event.posterUrl : `http://localhost:5000${event.posterUrl}`}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-indigo-700 via-purple-700 to-indigo-900 flex items-center justify-center p-8 text-center text-white">
              <span className="font-black text-2xl tracking-tight">{event.department}</span>
            </div>
          )}

          {/* Share Button Floating */}
          <button
            onClick={() => setShareOpen(true)}
            className="absolute top-4 right-4 px-3.5 py-2 rounded-2xl bg-white/95 text-slate-800 hover:text-indigo-600 font-bold text-xs shadow-lg backdrop-blur-md flex items-center gap-2 transition hover:scale-105"
          >
            <Share2 className="w-4 h-4 text-indigo-600" />
            <span>Share Event</span>
          </button>

          {/* Badges Overlay */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 text-slate-900 shadow-md backdrop-blur-md">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md">
              {event.registrationFee > 0 ? `Fee: ₹${event.registrationFee}` : 'Free Entry'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md">
              {event.eligibility === 'all'
                ? 'Open to All Colleges'
                : event.eligibility === 'internal_only'
                ? 'Internal Students Only'
                : 'External Colleges Only'}
            </span>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {event.department}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 leading-snug">
                  {event.title}
                </h1>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Event Overview
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Tags */}
              {event.tags?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Event Focus & Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Information & Registration Sidebar Box */}
            <div className="w-full lg:w-80 p-6 bg-slate-50 rounded-3xl border border-slate-200 shrink-0 space-y-5">
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Date</span>
                    <span className="font-bold text-slate-900">{eventDateStr}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Time</span>
                    <span className="font-bold text-slate-900">{event.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Venue</span>
                    <span className="font-bold text-slate-900">{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Capacity</span>
                    <span className="font-bold text-slate-900">
                      {event.currentParticipants} / {event.maxParticipants} Registered
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">
                      Registration Deadline
                    </span>
                    <span className="font-bold text-slate-900">{deadlineStr}</span>
                  </div>
                </div>
              </div>

              {/* Action State */}
              <div className="pt-4 border-t border-slate-200">
                {isRegistered ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>You are registered for this event!</span>
                    </div>
                    <Link
                      to="/my-registrations"
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Ticket className="w-4 h-4" />
                      View Digital Pass & QR
                    </Link>
                  </div>
                ) : isClosed ? (
                  <div className="p-3 bg-slate-200 text-slate-600 rounded-2xl text-center text-xs font-bold">
                    Registration Closed (Deadline or Capacity Reached)
                  </div>
                ) : (
                  <Link
                    to={`/events/${event._id}/register`}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-200 transition text-center block"
                  >
                    Register for Event
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareModal event={event} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
};
