import React, { useState, useEffect } from 'react';
import { chatbotAPI } from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { BotMessageSquare, PlusCircle, Trash2, Edit2, Sparkles, X, CheckCircle2 } from 'lucide-react';

export const ManageChatbot = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('general');
  const [keywords, setKeywords] = useState('');
  const [quickReplies, setQuickReplies] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await chatbotAPI.getFAQs();
      if (res.success) {
        setFaqs(res.faqs);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreate = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('general');
    setKeywords('');
    setQuickReplies('What events are happening?, Available Jobs');
    setModalOpen(true);
  };

  const openEdit = (faq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setKeywords(faq.keywords ? faq.keywords.join(', ') : '');
    setQuickReplies(faq.suggestedQuickReplies ? faq.suggestedQuickReplies.join(', ') : '');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        question,
        answer,
        category,
        keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
        suggestedQuickReplies: quickReplies.split(',').map((q) => q.trim()).filter(Boolean)
      };

      if (editingFaq) {
        await chatbotAPI.updateFAQ(editingFaq._id, payload);
        setMessage('FAQ knowledge entry updated');
      } else {
        await chatbotAPI.createFAQ(payload);
        setMessage('New FAQ added to AI Chatbot knowledge base');
      }
      setModalOpen(false);
      fetchFaqs();
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this AI knowledge FAQ entry?')) return;
    try {
      await chatbotAPI.deleteFAQ(id);
      fetchFaqs();
      setMessage('FAQ deleted.');
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl overflow-x-hidden">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Chatbot Knowledge Base</h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure natural language queries, quick responses, and database retrieval prompts
            </p>
          </div>

          <button
            onClick={openCreate}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 self-start"
          >
            <PlusCircle className="w-4 h-4" />
            Add Knowledge Entry
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((f) => (
              <div
                key={f._id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      {f.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {f.clickCount || 0} user inquiries
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm mt-1">{f.question}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {f.answer}
                  </p>

                  {f.keywords?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {f.keywords.map((kw, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(f)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(f._id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add / Edit FAQ */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingFaq ? 'Edit Chatbot FAQ' : 'Add AI Chatbot Knowledge Entry'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Query / Question
                  </label>
                  <input
                    type="text"
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. What is the dress code for the festival?"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="general">General</option>
                    <option value="event">Event</option>
                    <option value="job">Job</option>
                    <option value="registration">Registration</option>
                    <option value="admission">Admission</option>
                    <option value="campus">Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Grounded Answer / Guidance
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Detailed response provided by the AI assistant..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Trigger Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. dress code, clothing, rules"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
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
                    {saving ? 'Saving...' : 'Save Knowledge Entry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
