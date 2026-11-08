import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Heart, Shield, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Smart Campus
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A comprehensive next-generation digital portal unifying college event registration,
              campus placements, internship applications, and AI student assistance into a single
              seamless ecosystem.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Serving Internal & External University Students
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/events" className="hover:text-indigo-400 transition">
                  Upcoming College Events
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-indigo-400 transition">
                  Campus Job Placements
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="hover:text-indigo-400 transition">
                  Important Announcements
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition">
                  Student & Recruiter Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition">
                  Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Event Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/events?category=technical" className="hover:text-indigo-400 transition">
                  Technical Hackathons & Summits
                </Link>
              </li>
              <li>
                <Link to="/events?category=workshops" className="hover:text-indigo-400 transition">
                  Hands-On Tech Bootcamps
                </Link>
              </li>
              <li>
                <Link to="/events?category=cultural" className="hover:text-indigo-400 transition">
                  Annual Cultural Festivals
                </Link>
              </li>
              <li>
                <Link to="/events?category=seminars" className="hover:text-indigo-400 transition">
                  Industry 4.0 & AI Seminars
                </Link>
              </li>
              <li>
                <Link to="/events?category=sports" className="hover:text-indigo-400 transition">
                  Inter-College Sports Meets
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Campus Helpdesk
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Smart Campus Engineering Institute, University Enclave, Tech Park Road</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>events@smartcampus.edu / tpo@smartcampus.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 98765 00001 / +91 80 2345 6789</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ISO 9001:2025 Certified Academic Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Smart Campus Portal. Final Year Capstone Project. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            Built with modern MERN Stack & AI Assistant
          </div>
        </div>
      </div>
    </footer>
  );
};
