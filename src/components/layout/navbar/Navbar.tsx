'use client';
import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Cpu } from 'lucide-react';
import { navLinks } from '@/lib/constants/navbarItems';
import Link from 'next/link';

import NavLinkContent from './NavLinkContent';
import Header from './Header';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Header onOpen={() => setIsOpen(true)} />
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
            {/* Backdrop */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#030213]/90 backdrop-blur-3xl"
            />

            {/* Content Container */}
            <Motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl bg-[#0a091d] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="menu-title"
            >
              {/* Top Bar */}
              <div className="p-6 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                    <Cpu className="text-orange-500" size={20} />
                  </div>
                  <div>
                    <h2
                      id="menu-title"
                      className="text-white font-bold tracking-tight"
                    >
                      Menu
                    </h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                      Select what you want to learn
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <X
                    size={20}
                    className="group-hover:rotate-90 transition-transform duration-300"
                  />
                </button>
              </div>

              {/* Grid Content */}
              <nav
                className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8"
                aria-label="Main navigation"
              >
                {navLinks.map((navItem, navItemIdx) => (
                  <Motion.div
                    key={navItem.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + navItemIdx * 0.1 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex items-center gap-3">
                      <navItem.icon className="text-orange-500/60" size={18} />
                      <h3 className="text-lg font-bold text-white tracking-wide p-0">
                        {navItem.title}
                      </h3>
                    </div>

                    <ul className="flex flex-col gap-1 list-none p-0 m-0">
                      {navItem.items.map(item => (
                        <li key={item.label}>
                          <Motion.div
                            whileHover={{ x: 8 }}
                            className="group rounded-xl hover:bg-white/5 transition-all overflow-hidden"
                          >
                            {item.isActive ? (
                              <Link
                                href={item.path}
                                className="flex items-center justify-between p-3 w-full h-full decoration-none group"
                                onClick={() => {
                                  setIsOpen(false);
                                }}
                              >
                                <NavLinkContent item={item} />
                              </Link>
                            ) : (
                              <span className="flex items-center justify-between p-3 w-full h-full cursor-pointer decoration-none opacity-40">
                                <NavLinkContent item={item} />
                              </span>
                            )}
                          </Motion.div>
                        </li>
                      ))}
                    </ul>
                  </Motion.div>
                ))}
              </nav>

              {/* Footer Decor */}
              <div className="p-6 bg-white/2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-600"></div>

              {/* Background Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -z-10" />
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
