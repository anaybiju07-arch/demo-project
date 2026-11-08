import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { Building2, Globe, Mail, Phone, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllCompanies();
      if (res.success) {
        setCompanies(res.companies);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleToggleApproval = async (id) => {
    try {
      await adminAPI.toggleCompanyApproval(id);
      fetchCompanies();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Corporate Partners</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage registered companies, recruitment agencies, and job posting permissions
          </p>
        </div>

        {loading ? (
          <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse" />
        ) : companies.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 text-xs">
            No company accounts registered yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c) => (
              <div
                key={c._id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-sm shrink-0">
                      {c.logo ? (
                        <img
                          src={c.logo}
                          alt={c.companyName}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Building2 className="w-6 h-6" />
                      )}
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        c.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.isApproved ? 'Approved' : 'Pending Review'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">{c.companyName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{c.industry} • {c.location}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                    <p>
                      Contact: <strong>{c.contactPerson || c.user?.name}</strong>
                    </p>
                    <p className="text-slate-500">{c.contactEmail || c.user?.email}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{c.contactPhone || c.user?.phone}</p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}

                  <button
                    onClick={() => handleToggleApproval(c._id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      c.isApproved
                        ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                    }`}
                  >
                    {c.isApproved ? 'Revoke Approval' : 'Approve Partner'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
