import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { Building2, Save, CheckCircle2, AlertCircle, Globe, Mail, Phone, MapPin } from 'lucide-react';

export const CompanyProfile = () => {
  const { user, profile, updateProfileData } = useAuth();

  const [companyName, setCompanyName] = useState(profile?.companyName || user?.name || '');
  const [industry, setIndustry] = useState(profile?.industry || 'Technology');
  const [website, setWebsite] = useState(profile?.website || '');
  const [location, setLocation] = useState(profile?.location || 'Bengaluru / Remote');
  const [contactPerson, setContactPerson] = useState(profile?.contactPerson || user?.name || '');
  const [contactPhone, setContactPhone] = useState(profile?.contactPhone || user?.phone || '');
  const [about, setAbout] = useState(profile?.about || '');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.companyName || user?.name || '');
      setIndustry(profile.industry || 'Technology');
      setWebsite(profile.website || '');
      setLocation(profile.location || 'Bengaluru / Remote');
      setContactPerson(profile.contactPerson || user?.name || '');
      setContactPhone(profile.contactPhone || user?.phone || '');
      setAbout(profile.about || '');
    }
  }, [profile, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        companyName,
        industry,
        website,
        location,
        contactPerson,
        contactPhone,
        about
      };

      const res = await userAPI.updateCompanyProfile(payload);
      if (res.success) {
        updateProfileData(user, res.profile);
        setSuccessMsg('Company details updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update company profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="company" />

      <main className="flex-1 p-6 sm:p-8 max-w-4xl overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recruiter Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage company brand details, hiring locations, and corporate overview
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Company Overview / About
              </label>
              <textarea
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Describe your organization, mission, and work culture..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-200 transition flex items-center gap-2"
              >
                {saving ? 'Saving...' : 'Save Company Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
