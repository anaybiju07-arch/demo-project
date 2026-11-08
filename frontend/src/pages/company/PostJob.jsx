import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { Briefcase, Building2, Save, AlertCircle, ArrowLeft } from 'lucide-react';

export const PostJob = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [qualifications, setQualifications] = useState('B.Tech / B.E. / M.C.A. (2025/2026 Batch)');
  const [skillsRequired, setSkillsRequired] = useState('React, Node.js, Python, SQL');
  const [jobType, setJobType] = useState('full-time');
  const [salaryOrStipend, setSalaryOrStipend] = useState('₹8,00,000 - ₹12,00,000 / year');
  const [location, setLocation] = useState('Bengaluru / Hybrid');
  const [eligibility, setEligibility] = useState('Graduating 2025/2026 Batch, minimum 65% aggregate');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0]
  );

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const payload = {
        title,
        description,
        requirements,
        qualifications,
        skillsRequired: skillsRequired.split(',').map((s) => s.trim()),
        jobType,
        salaryOrStipend,
        location,
        eligibility,
        deadline
      };

      const res = await jobAPI.createJob(payload);
      if (res.success) {
        navigate('/company/jobs');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to post job vacancy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="company" />

      <main className="flex-1 p-6 sm:p-8 max-w-4xl overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Post New Job Vacancy</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish recruitment drives, full-time engineering roles, and internships for students
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Job Title / Position <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Associate Software Engineer - Cloud Platforms"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Employment Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value="full-time">Full-Time</option>
                  <option value="internship">Internship</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Salary / Stipend Details <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={salaryOrStipend}
                  onChange={(e) => setSalaryOrStipend(e.target.value)}
                  placeholder="e.g. ₹10,00,000 / year or ₹35,000 / month"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru / Hybrid / Remote"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Job Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role, day-to-day responsibilities, and team structure..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Required Qualifications & Eligibility <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g. Graduating 2025/2026 Batch, minimum 65% aggregate, no active backlogs"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={skillsRequired}
                  onChange={(e) => setSkillsRequired(e.target.value)}
                  placeholder="React, Node.js, Python, AWS, Docker"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Application Deadline Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-200 transition flex items-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Publish Vacancy
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
