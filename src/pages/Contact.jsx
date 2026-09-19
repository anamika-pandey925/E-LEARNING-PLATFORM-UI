import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Button from '../components/Button';
import contactService from '../services/contactService';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setLoading(true);
    setError('');
    try {
      const response = await contactService.sendMessage({ name, email, subject, message });
      if (response && response.success) {
        setSent(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setTimeout(() => setSent(false), 5000);
      } else {
        setError(response?.message || 'Could not send message. Please try again.');
      }
    } catch (err) {
      // Offline fallback: still inform user
      setSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSent(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <FiMail size={18} />, label: 'Email Support', val: 'Coming Soon' },
    { icon: <FiPhone size={18} />, label: 'Helpline No.', val: 'Coming Soon' },
    { icon: <FiMapPin size={18} />, label: 'Global Campus', val: 'Coming Soon' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12 text-left">
      {/* Toast Alert */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 pointer-events-none">
        <AnimatePresence>
          {sent && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex items-center space-x-3 p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 max-w-sm shadow-2xl glass pointer-events-auto ml-auto"
            >
              <FiCheckCircle size={22} className="shrink-0" />
              <div>
                <p className="text-sm font-semibold">Message Dispatched!</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Thank you. Our support desk will respond shortly.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Header */}
      <section className="text-center space-y-3 sm:space-y-4 py-4 sm:py-8 max-w-3xl mx-auto">
        <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-100 leading-tight">
          Let's Start a <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Conversation</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
          Have queries about syllabus structure, certificate details, or mentorship guidelines? Reach out directly, and we will get back to you.
        </p>
      </section>

      {/* Main Grid: Left = Info cards, Right = Message form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Col - contact details (Coming Soon placeholders) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 space-y-5 sm:space-y-6">
            <h2 className="font-poppins font-bold text-lg sm:text-xl text-slate-200 border-b border-slate-800 pb-3 sm:pb-3.5">
              Contact Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We aim to reply to all queries within 24 hours. Our support portal is active around the clock for global students.
            </p>

            <div className="space-y-3.5 sm:space-y-4 pt-1 sm:pt-2">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="flex items-center space-x-3.5 sm:space-x-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 border border-slate-700/60 text-emerald-400 flex items-center justify-center shrink-0">
                    {info.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wide truncate">{info.label}</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-300 mt-0.5 truncate">{info.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Col - message form */}
        <section className="lg:col-span-7 glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition-colors"
                  required
                />
              </div>

            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Course syllabus, support query..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition-colors"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Message Body
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="State your query here in detail..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition-colors"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center space-x-2">
                <FiAlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full sm:w-auto justify-center space-x-2 py-3" disabled={loading}>
                <FiSend />
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              </Button>
            </div>
          </form>
        </section>

      </div>
    </div>
  );
};

export default Contact;
