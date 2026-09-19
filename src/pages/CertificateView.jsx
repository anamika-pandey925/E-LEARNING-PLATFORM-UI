import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiAward, FiPrinter, FiArrowLeft, FiCheckCircle, FiShield } from 'react-icons/fi';
import certificateService from '../services/certificateService';
import Loader from '../components/Loader';
import Button from '../components/Button';

const CertificateView = () => {
  const { id, certificateId } = useParams();
  const targetId = id || certificateId;
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      try {
        const res = await certificateService.getCertificateById(targetId);
        if (res?.success && res.data) {
          setCertificate(res.data);
        } else {
          setError('Certificate not found or verification ID invalid.');
        }
      } catch (err) {
        setError(err.message || 'Failed to verify certificate.');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [targetId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Loader />;

  if (error || !certificate) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-rose-400">{error || 'Certificate not found'}</h2>
        <Button to="/dashboard" variant="secondary">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const formattedDate = new Date(certificate.issueDate || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <FiArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg transition-all"
        >
          <FiPrinter size={16} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Certificate Layout */}
      <div className="relative p-8 sm:p-14 rounded-3xl bg-slate-950 border-8 border-double border-emerald-500/40 shadow-2xl text-center space-y-6 sm:space-y-8 overflow-hidden print:m-0 print:border-4 print:shadow-none">
        {/* Decorative Watermark & Borders */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Certificate Header */}
        <div className="space-y-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-inner">
            <FiAward size={36} />
          </div>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400 pt-2">
            Study Point Online Academy
          </p>
          <h1 className="font-poppins font-extrabold text-2xl sm:text-4xl md:text-5xl text-slate-100 tracking-wide">
            CERTIFICATE OF COMPLETION
          </h1>
        </div>

        {/* Recipient info */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-400 italic">This is proudly presented to</p>
          <h2 className="font-poppins font-extrabold text-2xl sm:text-3xl md:text-4xl text-emerald-300 border-b-2 border-emerald-500/30 pb-2">
            {certificate.studentName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
            for successfully completing all practical syllabus modules, lecture requirements, quizzes, and course projects for
          </p>
          <h3 className="font-poppins font-bold text-lg sm:text-2xl text-slate-100">
            {certificate.courseName}
          </h3>
        </div>

        {/* Signatures & Seal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 sm:pt-10 border-t border-slate-800/80 items-end">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs font-bold text-slate-300 font-mono">
              {certificate.instructorName || 'Study Point Faculty'}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Course Instructor</p>
          </div>

          {/* Verification Badge */}
          <div className="space-y-1 text-center">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <FiCheckCircle size={14} />
              <span>Verified Credential</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              ID: {certificate.certificateId}
            </p>
          </div>

          <div className="space-y-1 text-center sm:text-right">
            <p className="text-xs font-bold text-slate-300 font-mono">{formattedDate}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Date of Graduation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
