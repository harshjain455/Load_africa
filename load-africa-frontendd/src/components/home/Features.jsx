import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, UserCheck } from 'lucide-react';

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="features" className="py-32 bg-slate-950 text-white relative overflow-hidden perspective-1000">
      {/* Decorative abstract shapes */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50" />
      
      {/* Animated glowing orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-[10%] top-[20%] w-[40vw] h-[40vw] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-[10%] bottom-[20%] w-[40vw] h-[40vw] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" 
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 relative z-10"
      >
        <div className="text-center mb-24">
          <span className="text-emerald-500 font-bold text-sm uppercase tracking-widest block mb-4">Security</span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Enterprise-Grade Trust</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">Your loads and payments are protected by state-of-the-art verification and escrow systems.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-blue-500/0" />

          <motion.div variants={itemVariants} className="flex flex-col items-center group relative">
            <div className="w-28 h-28 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 flex items-center justify-center mb-8 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] relative z-10">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <ShieldCheck className="h-12 w-12 text-emerald-400 relative z-10" />
            </div>
            <h4 className="text-2xl font-black mb-4 tracking-tight text-white group-hover:text-emerald-400 transition-colors">Verified Network</h4>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">Every transporter and operator undergoes strict KYC and vehicle verification to ensure maximum safety.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col items-center group relative">
            <div className="w-28 h-28 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 flex items-center justify-center mb-8 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-amber-500/50 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] relative z-10">
              <div className="absolute inset-0 bg-amber-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Zap className="h-12 w-12 text-amber-400 relative z-10" />
            </div>
            <h4 className="text-2xl font-black mb-4 tracking-tight text-white group-hover:text-amber-400 transition-colors">Instant Dispatch</h4>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">Our geographic algorithm finds the closest available drivers automatically, minimizing empty miles.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col items-center group relative">
            <div className="w-28 h-28 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 flex items-center justify-center mb-8 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-blue-500/50 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] relative z-10">
              <div className="absolute inset-0 bg-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <UserCheck className="h-12 w-12 text-blue-400 relative z-10" />
            </div>
            <h4 className="text-2xl font-black mb-4 tracking-tight text-white group-hover:text-blue-400 transition-colors">Secure Escrow</h4>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">Payments are held safely and only released upon valid Proof of Delivery, protecting all parties.</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
