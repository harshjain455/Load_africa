import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageSquare } from 'lucide-react';

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the pricing work?",
      a: "Pricing is calculated based on total distance, vehicle class, cargo weight, and current market supply. You will receive an official quotation from our brokers before any payment is required."
    },
    {
      q: "Do you offer goods-in-transit insurance?",
      a: "Yes. All verified transporters on our network are required to carry baseline Goods-in-Transit (GIT) insurance. Additional specialized insurance can be arranged for high-value loads via our broker team."
    },
    {
      q: "How do I track my delivery?",
      a: "Once your driver is en route, you can track them via the live map on your customer dashboard. The GPS feed updates in real-time until the load is signed off."
    },
    {
      q: "Can I register as a driver?",
      a: "Drivers must be registered under a verified Fleet Owner company. We do not accept independent drivers without a registered transport business entity."
    }
  ];

  return (
    <section id="faqs" className="py-32 bg-slate-50 text-left relative z-20 overflow-hidden">
      <div className="absolute -left-[20%] top-0 w-[50%] h-[100%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6 shadow-inner border border-amber-500/20">
            <MessageSquare className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">Questions? We have answers.</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium text-lg">Everything you need to know about the LoadAfrica platform.</p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-white border rounded-[1.5rem] overflow-hidden transition-all duration-300 ${openIndex === i ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300'}`}
            >
              <button 
                onClick={() => toggleFaq(i)}
                className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none group cursor-pointer"
              >
                <span className={`font-bold text-lg transition-colors ${openIndex === i ? 'text-amber-500' : 'text-slate-800 group-hover:text-slate-600'}`}>{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex-shrink-0 ml-4 p-2 rounded-full transition-colors ${openIndex === i ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-8 pb-8 pt-0">
                      <p className="text-slate-600 text-base font-medium leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
