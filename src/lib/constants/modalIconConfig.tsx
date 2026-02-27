import { ReactNode } from 'react';

export type ModalIcon = 'warning' | 'info' | 'question' | 'success';

export const modalIconConfig: Record<
  ModalIcon,
  { color: string; bg: string; border: string; glow: string; svg: ReactNode }
> = {
  warning: {
    color: '#f87171',
    bg: 'rgba(248,113,113,0.1)',
    border: 'rgba(248,113,113,0.25)',
    glow: 'rgba(248,113,113,0.06)',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke="#f87171"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  info: {
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.1)',
    border: 'rgba(96,165,250,0.25)',
    glow: 'rgba(96,165,250,0.06)',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#60a5fa" strokeWidth="1.5" />
        <path
          d="M12 8h.01M12 12v4"
          stroke="#60a5fa"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  question: {
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.25)',
    glow: 'rgba(167,139,250,0.06)',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#a78bfa" strokeWidth="1.5" />
        <path
          d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"
          stroke="#a78bfa"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  success: {
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.1)',
    border: 'rgba(74,222,128,0.25)',
    glow: 'rgba(74,222,128,0.06)',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#4ade80" strokeWidth="1.5" />
        <path
          d="M7 12l4 4 6-6"
          stroke="#4ade80"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};
