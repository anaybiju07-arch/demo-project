import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Twitter, Linkedin, ExternalLink } from 'lucide-react';

export const ShareModal = ({ event, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const eventUrl = `${window.location.origin}/events/${event._id}`;
  const shareText = `Check out "${event.title}" on Smart Campus Portal! 🗓️ Date: ${new Date(
    event.date
  ).toLocaleDateString()} | 📍 Venue: ${event.venue}. Register online: ${eventUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
      '_blank'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Share Event</h3>
            <p className="text-xs text-slate-500">Spread the word and invite fellow students</p>
          </div>
        </div>

        {/* Event Preview Banner */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5 flex items-center gap-3">
          {event.posterUrl ? (
            <img
              src={event.posterUrl.startsWith('http') ? event.posterUrl : `http://localhost:5000${event.posterUrl}`}
              alt={event.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              CAMPUS
            </div>
          )}
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">{event.title}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {new Date(event.date).toLocaleDateString()} • {event.venue}
            </p>
            <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-600">
              {event.viewCount} views tracked
            </span>
          </div>
        </div>

        {/* Social Sharing Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <button
            onClick={shareWhatsApp}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition font-semibold text-xs gap-1.5 shadow-sm"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            WhatsApp
          </button>
          <button
            onClick={shareTwitter}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border border-sky-100 bg-sky-50 text-sky-700 hover:bg-sky-100 transition font-semibold text-xs gap-1.5 shadow-sm"
          >
            <Twitter className="w-5 h-5 text-sky-600" />
            Twitter / X
          </button>
          <button
            onClick={shareLinkedIn}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-semibold text-xs gap-1.5 shadow-sm"
          >
            <Linkedin className="w-5 h-5 text-blue-600" />
            LinkedIn
          </button>
        </div>

        {/* Copy Link Input */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">Direct Registration Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={eventUrl}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
