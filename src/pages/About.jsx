import React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiAward, FiUsers, FiClock, FiUser } from 'react-icons/fi';

const About = () => {
  const stats = [
    { label: 'Registered Students', value: '15,000+', icon: <FiUsers size={22} /> },
    { label: 'Offered Courses', value: '50+', icon: <FiBookOpen size={22} /> },
    { label: 'Certificates Granted', value: '8,000+', icon: <FiAward size={22} /> },
    { label: 'Weekly Study Hours', value: '120k+', icon: <FiClock size={22} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 text-left">
      
      {/* Intro section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <motion.div 
          className="lg:col-span-7 space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-emerald-400 font-semibold tracking-wider text-xs sm:text-sm uppercase">
            About Study Point
          </span>
          <h1 className="font-poppins font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-100 leading-tight">
            Empowering the Future of <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Learning</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
            Study Point is an advanced, dynamic online learning platform designed to revolutionize how education is perceived and delivered. It offers a diverse selection of courses spanning various disciplines, including Mathematics, Science, English, and modern web technologies like HTML, CSS, JavaScript, Python, and Angular.
          </p>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Our platform emphasizes practical knowledge. For instance, our technology courses do not just focus on theoretical aspects but are designed to be hands-on, encouraging students to build real-world projects. Learners can engage in activities like creating responsive web designs, developing interactive web applications, and mastering the latest frameworks.
          </p>
        </motion.div>

        {/* Brand visual showcase image */}
        <motion.div 
          className="lg:col-span-5 aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
            alt="Colleague Learning"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* Stats Board */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-8 sm:py-12 border-y border-slate-800/80">
        {stats.map((st, idx) => (
          <div key={idx} className="flex items-center space-x-3.5 sm:space-x-4 p-4 sm:p-5 rounded-2xl glass border border-slate-800">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              {st.icon}
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-bold font-poppins text-slate-100 truncate">{st.value}</div>
              <div className="text-xs text-slate-400 mt-0.5 truncate">{st.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Meet Instructors */}
      <section className="space-y-8 sm:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
          <h2 className="font-poppins font-extrabold text-2xl sm:text-3xl text-slate-100">
            Our Elite Mentorship Team
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Instructors from top research and development fields who care about your career path.
          </p>
        </div>

        <div className="max-w-md mx-auto p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-950/40 text-center space-y-4 glass">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto border border-slate-700/50 shrink-0">
            <FiUser size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="font-poppins font-bold text-lg sm:text-xl text-slate-100">Coming Soon</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Instructor information will be available soon.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
