import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import {
  User,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Building,
  GraduationCap,
  Save,
  Link as LinkIcon,
  Phone,
  Mail
} from 'lucide-react';

export const StudentProfile = () => {
  const { user, profile, updateProfileData } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(profile?.phone || user?.phone || '');
  const [collegeName, setCollegeName] = useState(profile?.collegeName || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [course, setCourse] = useState(profile?.course || 'B.Tech');
  const [academicYear, setAcademicYear] = useState(profile?.academicYear || '3rd Year');
  const [rollNumber, setRollNumber] = useState(profile?.rollNumber || '');
  const [cgpa, setCgpa] = useState(profile?.cgpa || 8.5);
  const [bio, setBio] = useState(profile?.bio || '');
  const [skills, setSkills] = useState(profile?.skills?.join(', ') || '');
  const [linkedin, setLinkedin] = useState(profile?.linkedin || '');
  const [github, setGithub] = useState(profile?.github || '');

  // File Upload states
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState(profile?.resumeOriginalName || '');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarPreview(user.avatar);
    }
    if (profile) {
      setPhone(profile.phone || user?.phone || '');
      setCollegeName(profile.collegeName || '');
      setDepartment(profile.department || '');
      setCourse(profile.course || 'B.Tech');
      setAcademicYear(profile.academicYear || '3rd Year');
      setRollNumber(profile.rollNumber || '');
      setCgpa(profile.cgpa || 8.5);
      setBio(profile.bio || '');
      setSkills(profile.skills ? profile.skills.join(', ') : '');
      setLinkedin(profile.linkedin || '');
      setGithub(profile.github || '');
      setResumeName(profile.resumeOriginalName || '');
    }
  }, [user, profile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size cannot exceed 5MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        setErrorMsg('Only PDF files are permitted for resumes!');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Resume PDF size cannot exceed 5MB');
        return;
      }
      setResumeFile(file);
      setResumeName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Upload Avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const avatarRes = await userAPI.uploadAvatar(formData);
        if (avatarRes.success && user) {
          user.avatar = avatarRes.avatarUrl;
        }
      }

      // 2. Upload Resume PDF if changed
      if (resumeFile) {
        const resumeData = new FormData();
        resumeData.append('resume', resumeFile);
        await userAPI.uploadResume(resumeData);
      }

      // 3. Update Profile text details
      const profilePayload = {
        name,
        phone,
        collegeName,
        department,
        course,
        academicYear,
        rollNumber,
        cgpa,
        bio,
        skills,
        linkedin,
        github
      };

      const res = await userAPI.updateStudentProfile(profilePayload);
      if (res.success) {
        updateProfileData(res.user, res.profile);
        setSuccessMsg('Profile and documents successfully updated!');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-6 sm:p-8 max-w-5xl overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal academic information, portfolio resume, and verified registration details
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Avatar & Basic Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <span>Personal Identity & Photo</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-slate-100">
              <div className="relative group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview.startsWith('http') || avatarPreview.startsWith('blob') ? avatarPreview : `http://localhost:5000${avatarPreview}`}
                    alt={name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                    {name?.charAt(0)}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">Profile Picture</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Upload a clear portrait photo in PNG, JPG, or WEBP format (max 5MB).
                </p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 capitalize">
                  {profile?.studentType === 'external' ? 'External Student Account' : 'Internal Campus Student'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cumulative GPA / Grade
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: College & Academic Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>Academic Details</span>
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  College / Institute Name
                </label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course / Degree</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
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
                    <option>Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll / Reg Number</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Resume PDF & Skills */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Resume PDF & Career Profile</span>
            </h3>

            {/* Resume Upload Card */}
            <div className="p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 transition mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {resumeName ? resumeName : 'No Resume Uploaded'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Required for 1-click job & internship applications. Format: PDF only (max 5MB).
                  </p>
                  {profile?.resumeUrl && (
                    <a
                      href={`http://localhost:5000${profile.resumeUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-indigo-600 hover:underline mt-1 inline-block"
                    >
                      View Current Resume ↗
                    </a>
                  )}
                </div>
              </div>

              <label className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer shadow-sm transition">
                <span>{resumeName ? 'Replace PDF' : 'Upload PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Technical Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, Python, MongoDB, Docker, Git"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">About Me / Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Briefly describe your interests, projects, or background..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GitHub / Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition flex items-center gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
