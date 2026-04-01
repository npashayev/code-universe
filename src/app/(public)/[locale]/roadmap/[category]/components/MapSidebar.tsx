'use client';

import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils/cn';
import type { PublicPlanetSummary } from '@/lib/planet/getPlanetList';

interface Props {
  planets: PublicPlanetSummary[];
}

const MapSidebar = ({ planets }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState(planets[0]?.id ?? '');
  const t = useTranslations('common');

  const scrollToPlanet = (planetId: string) => {
    setActiveId(planetId);
    const element = document.getElementById(`planet-${planetId}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  };

  return (
    <aside
      className={cn(
        'fixed right-0 top-0 z-map-sidebar h-screen w-100 transition-transform duration-500 px-6 pt-20 pb-16 flex flex-col items-start justify-start',
        'bg-night/60 backdrop-blur-2xl border-l border-white/5 shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.9)]',
        !sidebarOpen && 'translate-x-full',
      )}
    >
      <button
        className="absolute right-full top-1/4 p-2 rounded-tl-xl rounded-bl-xl bg-orange-500/80 backdrop-blur-2xl border border-white/5 shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.9)]"
        onClick={() => setSidebarOpen((p) => !p)}
      >
        <FontAwesomeIcon
          icon={faAngleLeft}
          className={cn(
            'transition-transform duration-500',
            sidebarOpen && 'rotate-180',
          )}
        />
      </button>
      <div className="mb-6 px-4">
        <h2 className="text-orange-500/80 font-bold uppercase tracking-[0.3em] mb-1">
          {t('sections')}
        </h2>
        <div className="h-0.5 w-10 bg-linear-to-r from-orange-500 to-transparent" />
      </div>
      <nav className="h-full w-full overflow-auto overscroll-contain flex flex-col gap-1 scrollbar-hide">
        {planets.map((planet, index) => {
          const { id } = planet;
          const { name } = planet.localized;
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => scrollToPlanet(id)}
              className={cn(
                'group relative flex items-center shrink-0 px-4 py-2 rounded-lg transition-all duration-300 overflow-hidden',
                'hover:bg-white/5',
                isActive
                  ? 'text-orange-400'
                  : 'text-slate-400 hover:text-slate-200',
              )}
            >
              {/* Active Indicator Background */}
              <AnimatePresence>
                {isActive && (
                  <Motion.div
                    layoutId="sidebar-active-highlight"
                    className="absolute inset-0 bg-linear-to-l from-orange-500/10 to-transparent border-r-4 border-orange-500 shadow-[inset_-10px_0_20px_-10px_rgba(249,115,22,0.3)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: 'spring',
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
              </AnimatePresence>
              <div className="flex items-center gap-3 z-10 font-mono tracking-tight">
                <span
                  className={cn(
                    'w-5 opacity-40 group-hover:opacity-100 transition-opacity',
                    isActive && 'opacity-100 text-orange-500/70',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'transition-transform duration-300 group-hover:translate-x-1 text-left',
                    isActive && 'translate-x-1',
                  )}
                >
                  {name}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default MapSidebar;
