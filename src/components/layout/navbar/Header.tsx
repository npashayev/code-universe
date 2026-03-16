import LogoutButton from '../../admin/ui/LogoutButton';
import DashboardLink from '@/components/admin/ui/DashboardLink';
import PrivateComponent from '../../admin/PrivateComponent';
import HomeLink from '@/components/ui/HomeLink';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Menu, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import { useTranslations } from 'next-intl';

interface Props {
  onOpen: () => void;
}

const Header = ({ onOpen }: Props) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const t = useTranslations('navbar');
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#030213]/40 backdrop-blur-xl border border-white/10 h-14 rounded-2xl flex items-center px-6 shadow-2xl gap-30 min-w-2xl">
      <button
        onClick={onOpen}
        aria-label="Open navigation menu"
        className="group flex items-center gap-3 text-white/70 hover:text-white transition-all cursor-pointer"
      >
        <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all">
          <Menu size={20} />
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
          {t('launchMenu')}
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <HomeLink />

        <PrivateComponent roles={['ADMIN']}>
          <DashboardLink />
          <LogoutButton />
        </PrivateComponent>

        <div className="h-7 w-px bg-white/10" />

        <LanguageSelector />

        {/* <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label={
            isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
          }
          className="nav-item w-9 aspect-square"
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
        </button> */}
      </div>
    </header>
  );
};

export default Header;
