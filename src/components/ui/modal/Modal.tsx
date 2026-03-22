import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils/cn';

import ModalStars from './ModalStars';

interface Props {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const Modal = ({ children, className, onClose }: Props) => {
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative rounded-2xl p-8 w-max max-w-md overflow-hidden bg-[rgba(5,9,20,0.97)] border border-blue-400/25 shadow-[0_0_40px_rgba(96,165,250,0.06),0_24px_48px_rgba(0,0,0,0.6)] animate-[modalIn_0.2s_ease]',
          className,
        )}
      >
        <ModalStars />
        {children}
      </div>

      <style>
        {`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>,
    document.body,
  );
};

export default Modal;
