import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiAward, FiBookOpen, FiActivity, FiUsers } from 'react-icons/fi';
import HeroSection from '../components/HeroSection';
import Button from '../components/Button';

const Home = () => {
  const features = [
    {
      icon: <FiBookOpen size={24} />,
      title: "Diverse Course Selection",
      description: "From academic subjects like Mathematics & Science to professional tracks like Web Development and Python."
    },
    {
      icon: <FiAward size={24} />,
      title: "Official Certification",
      description: "Validate your skills and academic achievements with industry-recognized certificates upon completion."
    },
    {
      icon: <FiActivity size={24} />,
      title: "Interactive Progress",
      description: "Monitor your completion rates across videos, assignments, and mock test preparations dynamically."
    },
    {
      icon: <FiUsers size={24} />,
      title: "Mentorship & Community",
      description: "Access forums, code reviews, and competitive exam strategies designed by elite educators."
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24 pb-16 sm:pb-20 overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Legacy Details / About Platform Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Illustration Content */}
          <motion.div 
            className="lg:col-span-5 order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative group max-w-md mx-auto aspect-video lg:aspect-square overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl shadow-emerald-500/5">
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors duration-300 z-10" />
              <img 
                src="/image/code.jpg" 
                alt="Coding Platform" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            className="lg:col-span-7 space-y-4 sm:space-y-6 text-left order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-emerald-400 font-semibold tracking-wider text-xs sm:text-sm uppercase">
              Hands-On Learning Experience
            </span>
            <h2 className="font-poppins font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-100 leading-snug">
              Why Learn With Study Point?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed">
              Study Point is an online platform that provides all subjects like Mathematics, Science, English, and competitive exam preparation. It is also designed for tech enthusiasts eager to learn HTML, CSS, JavaScript, Angular, and Python, offering course validation with certifications. Learn how to create professional websites from scratch.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-start sm:items-center space-x-3 text-slate-300 text-xs sm:text-sm md:text-base">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
                  <FiCheck size={14} className="stroke-[3]" />
                </span>
                <span>Practical hands-on coding challenges & assignments</span>
              </li>
              <li className="flex items-start sm:items-center space-x-3 text-slate-300 text-xs sm:text-sm md:text-base">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
                  <FiCheck size={14} className="stroke-[3]" />
                </span>
                <span>Structured path for board and competitive exams</span>
              </li>
              <li className="flex items-start sm:items-center space-x-3 text-slate-300 text-xs sm:text-sm md:text-base">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
                  <FiCheck size={14} className="stroke-[3]" />
                </span>
                <span>Learn at your own pace with 24/7 video access</span>
              </li>
            </ul>

            <div className="pt-2 sm:pt-4">
              <Button to="/about" variant="secondary" className="w-full sm:w-auto justify-center">
                Learn More About Us
              </Button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-slate-950/40 rounded-2xl sm:rounded-3xl border border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <h2 className="font-poppins font-extrabold text-2xl sm:text-3xl text-slate-100">
            A Complete Learning Ecosystem
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
            We provide everything you need to succeed, whether in academics or tech-industry careers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              className="glass p-5 sm:p-6 rounded-2xl border border-slate-800/80 hover:border-emerald-500/20 hover:shadow-lg transition-all duration-300 text-left space-y-3.5 sm:space-y-4 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 shadow-md shrink-0">
                {feat.icon}
              </div>
              <h3 className="font-poppins font-bold text-base sm:text-lg text-slate-100 group-hover:text-emerald-400 transition-colors">
                {feat.title}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-5 sm:px-8 py-10 sm:py-12 md:py-16 text-center space-y-4 sm:space-y-6 shadow-2xl shadow-emerald-500/10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
          
          <h2 className="font-poppins font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-950 max-w-3xl mx-auto">
            Ready to Begin Your Educational Journey?
          </h2>
          <p className="text-slate-900 font-medium text-xs sm:text-base md:text-lg max-w-2xl mx-auto">
            Unlock certificate courses in programming, competitive preparation, mathematics, science, and english today.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Button to="/courses" variant="secondary" className="!bg-slate-950 !text-slate-100 hover:!bg-slate-900 !border-none w-full sm:w-auto justify-center">
              Get Started
            </Button>
            <Button to="/signup" variant="outline" className="!border-slate-950 !text-slate-950 hover:!bg-slate-950 hover:!text-slate-100 w-full sm:w-auto justify-center">
              Sign Up Free
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
