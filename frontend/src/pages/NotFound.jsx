import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        <GraduationCap className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-900">404</h1>
      <h2 className="text-base font-bold text-slate-700 mt-1">Page Not Found</h2>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        The campus page you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 flex items-center gap-2 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
};
