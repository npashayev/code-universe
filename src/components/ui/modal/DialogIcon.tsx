import { ReactNode } from 'react';
const iconSvgClass = 'size-6';

const dialogIcons: Record<DialogIconType, ReactNode> = {
  warning: (
    <svg viewBox="0 0 24 24" fill="none" className={iconSvgClass}>
      <path
        d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" className={iconSvgClass}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 8h.01M12 12v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  question: (
    <svg viewBox="0 0 24 24" fill="none" className={iconSvgClass}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" fill="none" className={iconSvgClass}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 12l4 4 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export type DialogIconType = 'warning' | 'info' | 'question' | 'success';

interface Props {
  icon?: DialogIconType;
}

const DialogIcon = ({ icon = 'info' }: Props) => {
  return (
    <div className="flex justify-center mb-5">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-400">
        {dialogIcons[icon]}
      </div>
    </div>
  );
};

export default DialogIcon;
