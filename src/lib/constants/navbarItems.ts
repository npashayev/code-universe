import { Globe, Database, Terminal, type LucideIcon } from 'lucide-react';
import type { StaticImageData } from 'next/image';

import algorithm from '@/assets/nav-icons/algorithm.png';
import cs from '@/assets/nav-icons/cs.png';
import css from '@/assets/nav-icons/css.png';
import gh from '@/assets/nav-icons/gh.png';
import html from '@/assets/nav-icons/html.png';
import git from '@/assets/nav-icons/git.png';
import java from '@/assets/nav-icons/java.png';
import js from '@/assets/nav-icons/js.png';
import nextjs from '@/assets/nav-icons/nextjs.png';
import node from '@/assets/nav-icons/node.png';
import py from '@/assets/nav-icons/py.png';
import react from '@/assets/nav-icons/react.png';
import tw from '@/assets/nav-icons/tw.png';

export type NavLinkItem = {
  label: string;
  icon: StaticImageData;
  path: string;
  isActive: boolean;
};

export type NavLinkGroup = {
  title: string;
  icon: LucideIcon;
  items: NavLinkItem[];
};

export const navLinks: NavLinkGroup[] = [
  {
    title: 'Frontend',
    icon: Globe,
    items: [
      {
        label: 'HTML',
        icon: html,
        path: '/roadmap/html',
        isActive: true,
      },
      {
        label: 'CSS',
        icon: css,
        path: '/roadmap/css',
        isActive: false,
      },
      {
        label: 'JavaScript',
        icon: js,
        path: '/roadmap/javascript',
        isActive: false,
      },
      {
        label: 'React',
        icon: react,
        path: '/roadmap/react',
        isActive: false,
      },
      {
        label: 'Next.js',
        icon: nextjs,
        path: '/roadmap/nextjs',
        isActive: false,
      },
      {
        label: 'Tailwind',
        icon: tw,
        path: '/roadmap/tailwind',
        isActive: false,
      },
    ],
  },
  {
    title: 'Backend',
    icon: Database,
    items: [
      {
        label: 'Node.js',
        icon: node,
        path: '/roadmap/nodejs',
        isActive: false,
      },
      {
        label: 'Java',
        icon: java,
        path: '/roadmap/java',
        isActive: false,
      },
      {
        label: 'C#',
        icon: cs,
        path: '/roadmap/charp',
        isActive: false,
      },
      {
        label: 'Python',
        icon: py,
        path: '/roadmap/python',
        isActive: false,
      },
    ],
  },
  {
    title: 'General',
    icon: Terminal,
    items: [
      {
        label: 'Algorithms',
        icon: algorithm,
        path: '/roadmap/algorithms',
        isActive: false,
      },
      {
        label: 'Git',
        icon: git,
        path: '/roadmap/git',
        isActive: false,
      },
      {
        label: 'Github',
        icon: gh,
        path: '/roadmap/github',
        isActive: false,
      },
    ],
  },
];
