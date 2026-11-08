import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCircle2, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, loading } =
    useNotifications();
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Stay updated with event schedules, registration confirmations, and recruiter updates
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="h-40 bg-white rounded-3xl animate-pulse" />
      ) : notifications.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 shadow-sm max-w-md mx-auto">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-extrabold text-slate-900 text-sm">No Notifications</h3>
          <p className="text-xs text-slate-500 mt-1">You are all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-5 bg-white rounded-3xl border transition flex items-start justify-between gap-4 shadow-xs hover:shadow-md ${
                !n.isRead ? 'border-indigo-300 bg-indigo-50/20 ring-1 ring-indigo-100' : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    !n.isRead ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                    {new Date(n.createdAt).toLocaleDateString()} at{' '}
                    {new Date(n.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {n.link && (
                  <button
                    onClick={() => {
                      markAsRead(n._id);
                      navigate(n.link);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => removeNotification(n._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-slate-50"
                  title="Remove notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
