import React, { useState, useEffect } from 'react';
import { registrationAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { RegistrationTicket } from '../../components/events/RegistrationTicket';
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Printer,
  XCircle,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [message, setMessage] = useState('');

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await registrationAPI.getMyRegistrations();
      if (res.success) {
        setRegistrations(res.registrations);
        if (res.registrations.length > 0 && !selectedReg) {
          setSelectedReg(res.registrations[0]);
        }
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async () => {
    if (!cancellingId) return;
    try {
      const res = await registrationAPI.cancelRegistration(cancellingId, cancelReason);
      if (res.success) {
        setMessage('Registration has been successfully cancelled.');
        setCancelModalOpen(false);
        setCancelReason('');
        setCancellingId(null);
        fetchRegistrations();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel registration');
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              My Event Registrations & Passes
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              View your entry tickets, scan codes for attendance, and download passes
            </p>
          </div>

          <Link
            to="/events"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition inline-flex items-center gap-2 self-start"
          >
            <Calendar className="w-4 h-4" />
            Browse More Events
          </Link>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse" />
            <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse col-span-2" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 shadow-sm max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No Event Registrations Yet</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Discover workshops, hackathons, and cultural fests happening across campus and reserve
              your spot with an instant digital pass.
            </p>
            <Link
              to="/events"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition"
            >
              Explore Events Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left list of all registered tickets */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Your Registrations ({registrations.length})
              </h3>
              {registrations.map((reg) => (
                <div
                  key={reg._id}
                  onClick={() => setSelectedReg(reg)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedReg?._id === reg._id
                      ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-600/10'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
                      {reg.registrationId}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        reg.status === 'attended'
                          ? 'bg-emerald-100 text-emerald-800'
                          : reg.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {reg.event?.title || 'Campus Event'}
                  </h4>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>
                      {reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : 'Upcoming'}
                    </span>
                    <span className="text-indigo-600 font-bold flex items-center gap-1">
                      View Pass <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Ticket Preview & Management */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Digital Entry Ticket</h3>
                  <p className="text-xs text-slate-500">Official pass for venue security verification</p>
                </div>

                {selectedReg?.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      setCancellingId(selectedReg._id);
                      setCancelModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel Registration
                  </button>
                )}
              </div>

              {selectedReg ? (
                <RegistrationTicket registration={selectedReg} />
              ) : (
                <div className="text-center p-8 text-slate-400 text-xs">
                  Select a registration to view its ticket
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>

              <h3 className="font-extrabold text-slate-900 text-base">Cancel Event Registration?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Cancelling will release your reserved seat to other waiting students. You will not be
                able to use this QR code at the venue.
              </p>

              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Cancellation (Optional)
                </label>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Schedule conflict, academic exam..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setCancelModalOpen(false);
                    setCancellingId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Keep Registration
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
