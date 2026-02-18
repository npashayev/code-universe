import { Globe, Database, Terminal } from 'lucide-react';
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

export const navbarItems = [
  {
    title: 'Frontend',
    icon: Globe,
    items: [
      {
        label: 'HTML',
        icon: html,
        path: '/roadmap/html',
      },
      {
        label: 'CSS',
        icon: css,
        path: '/roadmap/css',
      },
      {
        label: 'JavaScript',
        icon: js,
        path: '/roadmap/javascript',
      },
      {
        label: 'React',
        icon: react,
        path: '/roadmap/react',
      },
      {
        label: 'Next.js',
        icon: nextjs,
        path: '/roadmap/nextjs',
      },
      {
        label: 'Tailwind',
        icon: tw,
        path: '/roadmap/tailwind',
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
      },
      {
        label: 'Java',
        icon: java,
        path: '/roadmap/java',
      },
      {
        label: 'C#',
        icon: cs,
        path: '/roadmap/charp',
      },
      {
        label: 'Python',
        icon: py,
        path: '/roadmap/python',
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
      },
      {
        label: 'Git',
        icon: git,
        path: '/roadmap/git',
      },
      {
        label: 'Github',
        icon: gh,
        path: '/roadmap/github',
      },
    ],
  },
];
