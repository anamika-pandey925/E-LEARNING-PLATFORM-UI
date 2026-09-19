import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSquareWhatsapp, FaInstagram, FaTelegram, FaTwitter } from 'react-icons/fa6';
import { FiBookOpen, FiMail } from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const socialLinks = [
    { icon: <FaSquareWhatsapp size={24} />, url: 'https://wa.me/#', label: 'Whatsapp', color: 'hover:text-green-500' },
    { icon: <FaInstagram size={24} />, url: 'https://instagram.com/#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: <FaTelegram size={24} />, url: 'https://t.me/#', label: 'Telegram', color: 'hover:text-blue-400' },
    { icon: <FaTwitter size={24} />, url: 'https://twitter.com/#', label: 'Twitter', color: 'hover:text-sky-400' },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-12 sm:pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 sm:mb-16">
        
        {/* Brand & Brief */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-3 text-slate-100">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/10 shrink-0">
              <FiBookOpen size={20} className="stroke-[2.5]" />
            </div>
            <span className="font-poppins font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              Study Point
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Revolutionizing education through modern, interactive, and certification-backed online learning. Learn at your own pace anytime, anywhere.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-slate-100 font-semibold tracking-wider uppercase text-sm">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
            </li>
            <li>
              <Link to="/assignments" className="hover:text-emerald-400 transition-colors">Assignments</Link>
            </li>
            <li>
              <Link to="/videos" className="hover:text-emerald-400 transition-colors">Videos</Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Student Dashboard</Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="space-y-4">
          <h3 className="text-slate-100 font-semibold tracking-wider uppercase text-sm">Support</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link>
            </li>
            <li>
              <span className="block text-slate-500">Email: Coming Soon</span>
            </li>
            <li>
              <span className="block text-slate-500">Mentorship: Coming Soon</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <h3 className="text-slate-100 font-semibold tracking-wider uppercase text-sm">Newsletter</h3>
          <p className="text-sm text-slate-400">Subscribe to get course updates, tech news, and certificates notifications.</p>
          <form onSubmit={handleSubscribe} className="relative flex items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-4 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 p-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-md transition-colors"
              aria-label="Subscribe"
            >
              <FiMail size={16} />
            </button>
          </form>
          {subscribed && (
            <span className="block text-xs text-emerald-400 font-medium">
              Thank you for subscribing to our newsletter!
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 sm:gap-0 text-center sm:text-left">
        <div>
          <p>© {new Date().getFullYear()} Study Point. All rights reserved. Empowering future learning.</p>
        </div>
        
        {/* Social Icons */}
        <div className="flex items-center space-x-6 mt-2 sm:mt-0 flex-wrap justify-center">
          {socialLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              onClick={(e) => {
                if (item.url.endsWith('#')) {
                  e.preventDefault();
                  alert('Social links will be available soon.');
                }
              }}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-slate-400 ${item.color} transition-all duration-300 transform hover:scale-110 p-1`}
              aria-label={item.label}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
