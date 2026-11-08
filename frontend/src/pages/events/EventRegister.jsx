import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventAPI, registrationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { RegistrationTicket } from '../../components/events/RegistrationTicket';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Ticket
} from 'lucide-react';

export const EventRegister = () => {
  const { id } = useParams();
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields pre-filled from authenticated user
  const [phone, setPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [academicYear, setAcademicYear] = useState('3rd Year');
  const [rollNumber, setRollNumber] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${id}/register` } } });
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await eventAPI.getEventById(id);
        if (res.success) {
          setEvent(res.event);
          if (res.isRegistered) {
            setRegistrationSuccess(res.registrationDetails);
          }
        }
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    if (profile) {
      setPhone(profile.phone || user?.phone || '');
      setCollegeName(profile.collegeName || '');
      setDepartment(profile.department || '');
      setAcademicYear(profile.academicYear || '3rd Year');
      setRollNumber(profile.rollNumber || '');
    }
  }, [id, isAuthenticated, profile, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = {
        phone,
        collegeName,
        department,
        academicYear,
        rollNumber
      };

      const res = await registrationAPI.registerForEvent(id, payload);
      if (res.success) {
        setRegistrationSuccess(res.registration);
        // Trigger celebratory confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading event details...</div>;
  }

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Details</span>
        </Link>
      </div>

      {registrationSuccess ? (
        <div className="space-y-6">
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 text-center">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-emerald-950">Registration Confirmed! 🎉</h2>
            <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
              Your seat for <strong>{event?.title}</strong> is reserved. Your digital pass with
              verified QR code is ready.
            </p>
          </div>

          <RegistrationTicket registration={registrationSuccess} />

          <div className="text-center pt-4">
            <Link
              to="/my-registrations"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
            >
              <Ticket className="w-4 h-4" />
              Go to My Registrations Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10">
          <div className="mb-6 pb-6 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Registration Form
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Register for {event?.title}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Please confirm your student details. A digital ticket pass will be generated instantly.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  readOnly
                  value={user?.name || ''}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-bold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  College / University
                </label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>Postgraduate</option>
                </select>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-indigo-900">Event Guidelines:</p>
              <p>• Entry pass QR code must be presented at the gate on the day of the event.</p>
              <p>• Please arrive 15 minutes before the scheduled time ({event?.time}).</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Event Registration
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
