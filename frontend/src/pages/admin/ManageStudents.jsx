import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import {
  Users,
  Search,
  GraduationCap,
  Building,
  FileText,
  ExternalLink,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

export const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [studentType, setStudentType] = useState('all');
  const [total, setTotal] = useState(0);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        studentType: studentType !== 'all' ? studentType : undefined
      };
      const res = await adminAPI.getAllStudents(params);
      if (res.success) {
        setStudents(res.students);
        setTotal(res.total);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [studentType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Directory</h1>
            <p className="text-xs text-slate-500 mt-1">
              Complete registry of host campus internal students and visiting external participants
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Affiliation:</span>
            <select
              value={studentType}
              onChange={(e) => setStudentType(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-xs focus:outline-none"
            >
              <option value="all">All Students</option>
              <option value="internal">Host Campus Only</option>
              <option value="external">External University Only</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm mb-6 flex items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="w-full sm:w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by college, department, or roll number..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
            />
          </form>

          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Total Enrolled: {total} students
          </span>
        </div>

        {loading ? (
          <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse" />
        ) : students.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 text-xs">
            No students found.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 pl-6">Student</th>
                    <th className="p-4">Affiliation</th>
                    <th className="p-4">College Name</th>
                    <th className="p-4">Department & Year</th>
                    <th className="p-4">CGPA</th>
                    <th className="p-4 pr-6 text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => (
                    <tr key={st._id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4 pl-6">
                        <span className="font-extrabold text-slate-900 text-xs block">
                          {st.user?.name}
                        </span>
                        <span className="text-[11px] text-slate-500">{st.user?.email}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {st.phone || st.user?.phone}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            st.studentType === 'internal'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {st.studentType === 'internal' ? 'Internal Host' : 'External'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700 font-medium truncate max-w-[200px]">
                        {st.collegeName}
                      </td>
                      <td className="p-4 text-slate-600">
                        {st.department} • {st.academicYear}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {st.cgpa || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {st.resumeUrl ? (
                          <a
                            href={
                              st.resumeUrl.startsWith('http')
                                ? st.resumeUrl
                                : `http://localhost:5000${st.resumeUrl}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-bold"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
