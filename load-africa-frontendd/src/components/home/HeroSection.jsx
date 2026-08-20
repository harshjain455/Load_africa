import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function HeroSection({ user, handleDashboardClick }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // -10 to 10
      const y = (e.clientY / innerHeight - 0.5) * 20; // -10 to 10
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const smoothX = useSpring(mousePosition.x, { damping: 20, stiffness: 100 });
  const smoothY = useSpring(mousePosition.y, { damping: 20, stiffness: 100 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div ref={ref} className="relative pt-32 pb-24 lg:pt-40 lg:pb-36 overflow-hidden bg-slate-50 flex items-center min-h-screen perspective-1000">
      
      {/* Deep Parallax Background */}
      <motion.div style={{ y: yBg, opacity, scale }} className="absolute inset-0 z-0 pointer-events-none">
        
        {/* Abstract Liquid Gradients for Light Theme */}
        <div className="absolute inset-0 opacity-60 mix-blend-multiply">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-30%] left-[-20%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(249,156,0,0.15)_0%,transparent_70%)] blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-40%] right-[-20%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] blur-[120px]" 
          />
        </div>
        
        {/* Mercedes Truck Image Background */}
        <img 
          src="/images/hero-bg.jpg" 
          alt="Connected Logistics Fleet" 
          className="w-full h-full object-cover opacity-100 scale-110 saturate-[1.1]"
        />
        
        {/* Very light overlay to keep it bright and NO BLUR */}
        <div className="absolute inset-0 bg-white/40 z-10" />
        
        {/* Bottom fade into the next section */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/40 to-transparent z-10" />
      </motion.div>

      {/* Floating 3D Elements based on Mouse Parallax */}
      <motion.div 
        style={{ x: smoothX, y: smoothY }} 
        className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
      >
        <div className="relative w-full max-w-7xl h-full">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[10%] w-32 h-32 rounded-3xl bg-gradient-to-br from-[#f99c00]/20 to-transparent border border-[#f99c00]/30 backdrop-blur-md shadow-xl shadow-[#f99c00]/10" 
          />
          <motion.div 
            animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] left-[10%] w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent border border-blue-500/30 backdrop-blur-md shadow-xl shadow-blue-500/10" 
          />
        </div>
      </motion.div>
      
      {/* Main Content layer */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 max-w-7xl mx-auto px-6 text-center w-full"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200 backdrop-blur-md mb-8 shadow-md">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">Enterprise Logistics Software</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-slate-900 leading-[1.1] tracking-tighter mb-6 drop-shadow-xl">
          The Operating System <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f99c00] via-amber-500 to-[#e08b00]">
            For Africa's Freight.
          </span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-800 max-w-3xl mx-auto mb-12 font-bold leading-relaxed drop-shadow-lg">
          The all-in-one software platform for shippers, carriers, and brokers. Automate your operations, book loads instantly, and track every shipment in real-time.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-6">
          {user ? (
             <motion.button
               onClick={handleDashboardClick}
               whileHover={{ scale: 1.02, y: -2 }}
               whileTap={{ scale: 0.98 }}
               className="w-full sm:w-auto px-10 py-5 bg-[#f99c00] text-white font-black rounded-2xl shadow-lg shadow-[#f99c00]/30 hover:shadow-xl hover:shadow-[#f99c00]/40 transition-all flex justify-center items-center gap-3 group cursor-pointer relative overflow-hidden"
             >
               <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out" />
               <span className="relative z-10 flex items-center gap-2 text-lg">Enter Dashboard <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" /></span>
             </motion.button>
          ) : (
            <>
              <motion.button
                onClick={() => navigate('/customer/register')}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-10 py-5 bg-[#f99c00] text-white font-black rounded-2xl shadow-lg shadow-[#f99c00]/30 hover:shadow-xl hover:shadow-[#f99c00]/40 transition-all flex justify-center items-center gap-3 group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out" />
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  <Package className="h-6 w-6" /> Book a Load Now
                </span>
              </motion.button>

              <motion.button
                onClick={() => {
                  document.getElementById('roles-matrix')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.02, y: -2, backgroundColor: "rgba(0,0,0,0.02)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-800 font-bold rounded-2xl hover:border-slate-300 shadow-sm transition-all flex justify-center items-center gap-3 group cursor-pointer relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 text-lg">Explore Software</span>
              </motion.button>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Fade into next section */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-slate-50 to-transparent z-30 pointer-events-none" />
    </div>
  );
}
