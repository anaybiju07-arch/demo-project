import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Briefcase,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Upload,
  Send
} from 'lucide-react';

export const JobApply = () => {
  const { id } = useParams();
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successApp, setSuccessApp] = useState(null);

  // Form Fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(profile?.phone || user?.phone || '');
  const [collegeName, setCollegeName] = useState(profile?.collegeName || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [academicYear, setAcademicYear] = useState(profile?.academicYear || '3rd Year');
  const [cgpa, setCgpa] = useState(profile?.cgpa || 8.0);
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState(profile?.github || '');

  // Resume handling
  const [resumeFile, setResumeFile] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(!!profile?.resumeUrl);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}/apply` } } });
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await jobAPI.getJobById(id);
        if (res.success) {
          setJob(res.job);
          if (res.hasApplied) {
            setSuccessApp(res.applicationDetails);
          }
        }
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, isAuthenticated]);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        setErrorMsg('Only PDF files are accepted for resumes!');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Resume PDF size must be under 5MB');
        return;
      }
      setResumeFile(file);
      setUseProfileResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('collegeName', collegeName);
      formData.append('department', department);
      formData.append('academicYear', academicYear);
      formData.append('cgpa', cgpa);
      formData.append('coverLetter', coverLetter);
      formData.append('portfolioUrl', portfolioUrl);

      if (resumeFile) {
        formData.append('resume', resumeFile);
      } else if (useProfileResume && profile?.resumeUrl) {
        formData.append('resumeUrl', profile.resumeUrl);
      } else {
        throw new Error('Please upload a PDF resume or use your profile resume');
      }

      const res = await applicationAPI.applyForJob(id, formData);
      if (res.success) {
        setSuccessApp(res.application);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading application form...</div>;
  }

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <Link
          to={`/jobs/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Details</span>
        </Link>
      </div>

      {successApp ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {successApp.applicationId}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3">Application Submitted! 🚀</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Your application for <strong>{job?.title}</strong> at <strong>{job?.companyName}</strong> has
              been submitted to the campus recruiter.
            </p>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Link
              to="/my-applications"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-200 transition"
            >
              Track Application Status
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10">
          <div className="mb-6 pb-6 border-b border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Application Form
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Apply for {job?.title}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">{job?.companyName} • {job?.location}</p>
            </div>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">College / University</label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Resume Selection */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Attach Resume (PDF, Max 5MB) <span className="text-rose-500">*</span>
              </label>

              {profile?.resumeUrl && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="useProfile"
                    checked={useProfileResume}
                    onChange={(e) => {
                      setUseProfileResume(e.target.checked);
                      if (e.target.checked) setResumeFile(null);
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="useProfile" className="text-xs text-slate-700 font-semibold cursor-pointer">
                    Use current saved resume: <strong>{profile.resumeOriginalName || 'Resume.pdf'}</strong>
                  </label>
                </div>
              )}

              {(!useProfileResume || !profile?.resumeUrl) && (
                <div>
                  <input
                    type="file"
                    accept="application/pdf"
                    required={!useProfileResume}
                    onChange={handleResumeChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {resumeFile && (
                    <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                      ✓ Ready to upload: {resumeFile.name}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Portfolio or GitHub URL (Optional)
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/yourhandle"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cover Note / Message to Recruiter
              </label>
              <textarea
                rows={3}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Highlight your key projects, hackathon achievements, and why you are excited for this role..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md shadow-blue-200 transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
