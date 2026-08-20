import React from 'react';
import { Truck, MapPin, Search, HardHat, Briefcase, Zap } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TiltCard = ({ role }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white/40 backdrop-blur-3xl rounded-[2rem] p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-shadow duration-500 overflow-hidden flex flex-col cursor-pointer h-full"
    >
      {/* Glare effect */}
      <motion.div 
        style={{ left: glareX, top: glareY }}
        className="absolute w-40 h-40 bg-white/60 blur-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div className={`absolute -inset-px bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-[2rem] pointer-events-none`} />
      
      <div 
        style={{ transform: "translateZ(40px)" }}
        className={`w-16 h-16 rounded-2xl ${role.bgColor} flex items-center justify-center mb-8 shadow-inner border border-white/50 relative z-10`}
      >
        <role.icon className={`h-8 w-8 ${role.iconColor}`} />
      </div>
      
      <h3 style={{ transform: "translateZ(30px)" }} className="text-2xl font-black text-slate-900 mb-3 relative z-10">{role.title}</h3>
      <p style={{ transform: "translateZ(20px)" }} className={`text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r ${role.color} uppercase tracking-widest mb-5 block relative z-10`}>
        {role.tagline}
      </p>
      
      <p style={{ transform: "translateZ(10px)" }} className="text-slate-600 font-medium mb-4 leading-relaxed flex-grow relative z-10">
        {role.description}
      </p>
    </motion.div>
  );
};

export default function RolesMatrix() {
  const roles = [
    {
      id: 'customer',
      title: 'Customer',
      tagline: 'Book Transport & Plant Hire',
      description: 'Instant quotes, live tracking, and verified transporters. Whether you need a bakkie for a couch or a tipper for construction, we have you covered.',
      icon: Search,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500'
    },
    {
      id: 'fleet',
      title: 'Fleet Owner',
      tagline: 'Grow Your Logistics Business',
      description: 'Access a massive load board. Dispatch your drivers, track vehicles, and get paid securely upon delivery confirmation.',
      icon: Truck,
      color: 'from-amber-400 to-amber-600',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-500'
    },
    {
      id: 'driver',
      title: 'Driver',
      tagline: 'Get Dispatched to Premium Loads',
      description: 'Apply to drive for verified fleets. Get dispatch instructions straight to your phone, navigate, and upload PODs effortlessly.',
      icon: MapPin,
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'broker',
      title: 'Broker',
      tagline: 'Orchestrate African Logistics',
      description: 'Manage shipments for enterprise clients, negotiate rates with fleet owners, and earn commissions on every successful load.',
      icon: Briefcase,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500'
    },
    {
      id: 'plant',
      title: 'Plant Owner',
      tagline: 'Monetize Your Yellow Metal',
      description: 'Rent out your heavy machinery and yellow metal equipment. Access high-value construction and mining contracts across SA.',
      icon: Zap,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500'
    },
    {
      id: 'operator',
      title: 'Machine Operator',
      tagline: 'Find Operator Jobs',
      description: 'Are you qualified to operate heavy machinery? Find lucrative contracts and jobs with Plant Owners looking for your skills.',
      icon: HardHat,
      color: 'from-slate-600 to-slate-800',
      bgColor: 'bg-slate-500/10',
      iconColor: 'text-slate-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <section id="roles-matrix" className="py-32 bg-slate-100 relative z-20 rounded-t-[3rem] overflow-hidden perspective-1000">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white to-transparent opacity-80 pointer-events-none" />
      <div className="absolute top-20 right-[-10%] w-[40%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-[-10%] w-[40%] h-[60%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <span className="text-amber-500 font-bold text-sm uppercase tracking-widest block mb-4">Ecosystem</span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">The Complete Network</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">Join thousands of verified partners across South Africa. Our platform unifies every role in the logistics supply chain.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {roles.map((role) => (
            <TiltCard key={role.id} role={role} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
