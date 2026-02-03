'use client';
import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Cpu, Moon, Sun, Home } from 'lucide-react';
import { navbarItems } from '@/lib/constants/navbarItems';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50">
        <div className="bg-[#030213]/40 backdrop-blur-xl border border-white/10 h-14 rounded-2xl flex items-center px-6 shadow-2xl">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            className="group flex items-center gap-3 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all">
              <Menu size={20} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
              Launch Menu
            </span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 h-9 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all cursor-pointer"
            >
              <Home size={16} />
              <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:block">
                Home
              </span>
            </Link>
            <div className="h-6 w-px bg-white/10 mx-1" />
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={
                isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <Motion.div
                  key={isDarkMode ? 'dark' : 'light'}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                </Motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

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
                {navbarItems.map((navItem, navItemIdx) => (
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
                            <Link
                              href={item.path}
                              className="flex items-center justify-between p-3 w-full h-full cursor-pointer decoration-none"
                              onClick={() => {
                                setIsOpen(false);
                              }}
                            >
                              <div className="text-slate-400 group-hover:text-white transition-colors flex items-center gap-3">
                                <div className="relative size-4">
                                  <Image
                                    src={item.icon}
                                    fill
                                    alt={item.label}
                                    className="object-cover object-center"
                                  />
                                </div>
                                {item.label}
                              </div>
                              <ArrowUpRight
                                size={14}
                                className="text-orange-500/0 group-hover:text-orange-500 transition-all"
                              />
                            </Link>
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
