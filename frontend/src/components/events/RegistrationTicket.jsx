import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, CheckCircle, Calendar, MapPin, User, GraduationCap, Building } from 'lucide-react';

export const RegistrationTicket = ({ registration }) => {
  const ticketRef = useRef(null);

  if (!registration) return null;

  const event = registration.event || {};
  const eventDate = event.date
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Upcoming Event';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto my-6">
      {/* Printable / Downloadable Pass Card */}
      <div
        ref={ticketRef}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative"
      >
        {/* Pass Top Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 p-6 text-white relative">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold tracking-tight text-sm uppercase">Smart Campus Pass</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                registration.status === 'attended'
                  ? 'bg-emerald-500 text-white'
                  : registration.status === 'cancelled'
                  ? 'bg-rose-500 text-white'
                  : 'bg-emerald-400 text-slate-900'
              }`}
            >
              {registration.status === 'attended' ? '✓ Attended / Checked-in' : 'Confirmed Entry'}
            </span>
          </div>

          <h2 className="text-xl font-black mt-4 leading-snug">{event.title || 'Event Registration'}</h2>
          <p className="text-xs text-indigo-200 mt-1 font-medium">
            Category: {(event.category || 'Event').toUpperCase()} • Organized by {event.department || 'Campus'}
          </p>
        </div>

        {/* Pass Middle: Event & Student Info */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50">
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Attendee Name</span>
              <span className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                {registration.studentName}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">College / Institution</span>
              <span className="font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {registration.collegeName}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Department & Year</span>
              <span className="font-medium text-slate-700">
                {registration.department} ({registration.academicYear})
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Registration ID</span>
              <span className="font-mono font-bold text-indigo-600 text-sm bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200/60 inline-block mt-0.5">
                {registration.registrationId}
              </span>
            </div>
          </div>

          {/* QR Code Block */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
            {registration.qrCodeDataUrl ? (
              <img
                src={registration.qrCodeDataUrl}
                alt="QR Pass"
                className="w-36 h-36 object-contain"
              />
            ) : (
              <QRCodeSVG
                value={JSON.stringify({
                  regId: registration.registrationId,
                  student: registration.studentName,
                  event: event.title
                })}
                size={144}
                level="H"
              />
            )}
            <span className="text-[10px] text-slate-400 font-mono mt-2 font-semibold">
              SCAN AT VENUE GATE
            </span>
          </div>
        </div>

        {/* Pass Bottom: Venue and Schedule */}
        <div className="px-6 py-4 bg-white border-t border-dashed border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              {eventDate} at {event.time || '10:00 AM'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="truncate max-w-[200px]">{event.venue || 'Main Campus'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Print & Download */}
      <div className="mt-4 flex items-center justify-end gap-3 no-print">
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-2 transition"
        >
          <Printer className="w-4 h-4" />
          Print Ticket Pass
        </button>
      </div>
    </div>
  );
};
