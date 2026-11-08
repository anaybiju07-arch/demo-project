import React, { useState, useEffect } from 'react';
import { eventAPI, registrationAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import {
  Calendar,
  PlusCircle,
  Users,
  Download,
  Trash2,
  Edit2,
  QrCode,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  Search
} from 'lucide-react';

export const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal: Add / Edit Event
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('technical');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [venue, setVenue] = useState('Main Auditorium');
  const [regEndDate, setRegEndDate] = useState('');
  const [registrationFee, setRegistrationFee] = useState(0);
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [eligibility, setEligibility] = useState('all');
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [posterFile, setPosterFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // Modal: View Participants & CSV Export
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [selectedEventForParts, setSelectedEventForParts] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [partsLoading, setPartsLoading] = useState(false);

  // Modal: QR Pass Verification
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrScanInput, setQrScanInput] = useState('');
  const [qrResult, setQrResult] = useState(null);
  const [qrVerifying, setQrVerifying] = useState(false);

  const [message, setMessage] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventAPI.getEvents({ limit: 50 });
      if (res.success) {
        setEvents(res.events);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setCategory('technical');
    setDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setTime('10:00 AM');
    setVenue('Main Auditorium, Campus');
    setRegEndDate(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]);
    setRegistrationFee(0);
    setMaxParticipants(100);
    setEligibility('all');
    setDepartment('Computer Science and Engineering');
    setPosterFile(null);
    setModalOpen(true);
  };

  const openEditModal = (ev) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setDescription(ev.description);
    setCategory(ev.category);
    setDate(new Date(ev.date).toISOString().split('T')[0]);
    setTime(ev.time);
    setVenue(ev.venue);
    setRegEndDate(new Date(ev.regEndDate).toISOString().split('T')[0]);
    setRegistrationFee(ev.registrationFee);
    setMaxParticipants(ev.maxParticipants);
    setEligibility(ev.eligibility);
    setDepartment(ev.department);
    setPosterFile(null);
    setModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('date', date);
      formData.append('time', time);
      formData.append('venue', venue);
      formData.append('regEndDate', regEndDate);
      formData.append('registrationFee', registrationFee);
      formData.append('maxParticipants', maxParticipants);
      formData.append('eligibility', eligibility);
      formData.append('department', department);
      if (posterFile) formData.append('poster', posterFile);

      if (editingEvent) {
        await eventAPI.updateEvent(editingEvent._id, formData);
        setMessage('Event updated successfully');
      } else {
        await eventAPI.createEvent(formData);
        setMessage('Event created and published successfully');
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? All participant registrations will also be removed.')) return;
    try {
      await eventAPI.deleteEvent(id);
      fetchEvents();
      setMessage('Event deleted.');
    } catch (err) {
      alert(err.message || 'Failed to delete event');
    }
  };

  const openParticipants = async (ev) => {
    setSelectedEventForParts(ev);
    setParticipantsModalOpen(true);
    try {
      setPartsLoading(true);
      const res = await registrationAPI.getEventParticipants(ev._id);
      if (res.success) {
        setParticipants(res.participants);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setPartsLoading(false);
    }
  };

  const handleQRVerify = async (e) => {
    e.preventDefault();
    if (!qrScanInput.trim()) return;

    setQrVerifying(true);
    setQrResult(null);
    try {
      let regId = qrScanInput.trim();
      // If user pasted raw QR json payload
      if (regId.startsWith('{')) {
        try {
          const parsed = JSON.parse(regId);
          regId = parsed.regId || regId;
        } catch (e) {}
      }

      const res = await registrationAPI.verifyQRCode(regId);
      setQrResult(res);
      fetchEvents();
    } catch (err) {
      setQrResult({ success: false, message: err.message });
    } finally {
      setQrVerifying(false);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Event Management</h1>
            <p className="text-xs text-slate-500 mt-1">
              Create, update, manage capacity, export participants, and scan QR entry passes
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => {
                setQrScanInput('');
                setQrResult(null);
                setQrModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-indigo-600" />
              QR Gate Scanner
            </button>

            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Create Event
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Events Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Event</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Registered</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 pl-6">
                      <span className="font-extrabold text-slate-900 text-xs block">{ev.title}</span>
                      <span className="text-[11px] text-slate-400">{ev.department}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {ev.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      {new Date(ev.date).toLocaleDateString()} • {ev.time}
                    </td>
                    <td className="p-4 text-slate-600 truncate max-w-[150px]">{ev.venue}</td>
                    <td className="p-4 font-bold text-slate-700">
                      {ev.registrationFee > 0 ? `₹${ev.registrationFee}` : 'Free'}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => openParticipants(ev)}
                        className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:underline bg-indigo-50 px-2.5 py-1 rounded-xl"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          {ev.currentParticipants} / {ev.maxParticipants}
                        </span>
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-1.5">
                      <button
                        onClick={() => openParticipants(ev)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                        title="View Participants"
                      >
                        <Users className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(ev)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                        title="Edit Event"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev._id)}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create / Edit Event */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingEvent ? 'Edit Event Details' : 'Create New College Event'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    >
                      <option value="technical">Technical</option>
                      <option value="workshops">Workshops</option>
                      <option value="cultural">Cultural</option>
                      <option value="seminars">Seminars</option>
                      <option value="sports">Sports</option>
                      <option value="fests">Fests</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Description</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Event Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                    <input
                      type="text"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Venue</label>
                    <input
                      type="text"
                      required
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registration Deadline
                    </label>
                    <input
                      type="date"
                      required
                      value={regEndDate}
                      onChange={(e) => setRegEndDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fee (₹, 0=Free)</label>
                    <input
                      type="number"
                      min="0"
                      value={registrationFee}
                      onChange={(e) => setRegistrationFee(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Max Capacity</label>
                    <input
                      type="number"
                      min="1"
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility</label>
                    <select
                      value={eligibility}
                      onChange={(e) => setEligibility(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    >
                      <option value="all">All Colleges & Students</option>
                      <option value="internal_only">Internal Host College Only</option>
                      <option value="external_only">External Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Event Poster Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPosterFile(e.target.files[0])}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200"
                  >
                    {saving ? 'Saving...' : editingEvent ? 'Save Changes' : 'Publish Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: View Participants List & Export to CSV */}
        {participantsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Participants for: {selectedEventForParts?.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {participants.length} registered attendees • Real-time database list
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={registrationAPI.getExportUrl(selectedEventForParts?._id)}
                    download
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </a>
                  <button
                    onClick={() => setParticipantsModalOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {partsLoading ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading attendees...</div>
              ) : participants.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No students have registered for this event yet.
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3 pl-4">Reg ID</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Email & Phone</th>
                        <th className="p-3">College & Dept</th>
                        <th className="p-3">Type</th>
                        <th className="p-3 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {participants.map((p) => (
                        <tr key={p._id}>
                          <td className="p-3 pl-4 font-mono font-bold text-indigo-600 text-[11px]">
                            {p.registrationId}
                          </td>
                          <td className="p-3 font-bold text-slate-800">{p.studentName}</td>
                          <td className="p-3 text-slate-500 text-[11px]">
                            {p.studentEmail} • {p.studentPhone}
                          </td>
                          <td className="p-3 text-slate-600 text-[11px]">
                            {p.collegeName} ({p.department})
                          </td>
                          <td className="p-3 uppercase text-[10px] font-bold">
                            <span
                              className={`px-2 py-0.5 rounded ${
                                p.studentType === 'internal'
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {p.studentType}
                            </span>
                          </td>
                          <td className="p-3 pr-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                p.status === 'attended'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: QR Pass Gate Scanner & Manual Verification */}
        {qrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">QR Gate Scanner</h3>
                </div>
                <button
                  onClick={() => setQrModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Scan attendee badge QR code or paste/enter the <strong>Registration ID</strong> (e.g.{' '}
                <code className="text-indigo-600 font-bold">SC-REG-2026-A19F</code>) to verify validity and
                record gate attendance.
              </p>

              <form onSubmit={handleQRVerify} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    value={qrScanInput}
                    onChange={(e) => setQrScanInput(e.target.value)}
                    placeholder="Scan or enter Registration ID..."
                    className="w-full px-3.5 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={qrVerifying}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition"
                >
                  {qrVerifying ? 'Checking...' : 'Verify Entry Pass'}
                </button>
              </form>

              {/* QR Scan Result Feedback Box */}
              {qrResult && (
                <div
                  className={`mt-4 p-4 rounded-2xl border text-xs ${
                    qrResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5">
                    {qrResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    )}
                    {qrResult.message}
                  </p>
                  {qrResult.registration && (
                    <div className="mt-2 text-[11px] space-y-0.5 text-slate-600">
                      <p>
                        Attendee: <strong>{qrResult.registration.studentName}</strong>
                      </p>
                      <p>
                        College: <strong>{qrResult.registration.collegeName}</strong>
                      </p>
                      <p>
                        Status: <strong>{qrResult.registration.status.toUpperCase()}</strong>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
