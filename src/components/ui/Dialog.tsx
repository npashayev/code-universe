'use client';
import { ModalIcon, modalIconConfig } from '@/lib/constants/modalIconConfig';
import { useModalStars } from '@/lib/hooks/ui/useModalStars';
import { hexToRgb } from '@/lib/utils/hexToRgb';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  title: string;
  body: ReactNode;
  icon?: ModalIcon;
  onConfirm?: () => void;
  onClose?: () => void;
  onOk?: () => void;
  confirmLabel?: string;
  closeLabel?: string;
  okLabel?: string;
}

interface ButtonProps {
  onClick: () => void;
  bg: string;
  border: string;
  color: string;
  hoverBg: string;
  children: ReactNode;
}

const ModalButton = ({
  onClick,
  bg,
  border,
  color,
  hoverBg,
  children,
}: ButtonProps) => (
  <button
    onClick={onClick}
    className="flex-1 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all"
    style={{ background: bg, border: `1px solid ${border}`, color }}
    onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
    onMouseLeave={e => (e.currentTarget.style.background = bg)}
  >
    {children}
  </button>
);

const Dialog = ({
  title,
  body,
  icon = 'info',
  onConfirm,
  onClose,
  onOk,
  confirmLabel = 'Confirm',
  closeLabel = 'Cancel',
  okLabel = 'OK',
}: Props) => {
  const stars = useModalStars();
  const theme = modalIconConfig[icon];

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl p-8 w-full max-w-md overflow-hidden bg-[rgba(5,9,20,0.97)] animate-[modalIn_0.2s_ease]"
        style={{
          border: `1px solid ${theme.border}`,
          boxShadow: `0 0 40px ${theme.glow}, 0 24px 48px rgba(0,0,0,0.6)`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Stars */}
        {stars.map(star => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: '50%',
              background: 'white',
              opacity: star.opacity,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-full"
            style={{
              background: theme.bg,
              border: `1px solid ${theme.border}`,
            }}
          >
            {theme.svg}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-bold mb-2 text-slate-100">
          {title}
        </h2>

        {/* Body */}
        <div className="text-center text-sm leading-relaxed mb-8 text-slate-400/80">
          {body}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {onClose && (
            <ModalButton
              onClick={onClose}
              bg="rgba(99,120,180,0.15)"
              border="rgba(147,163,220,0.3)"
              color="#a5b4fc"
              hoverBg="rgba(99,120,180,0.28)"
            >
              {closeLabel}
            </ModalButton>
          )}
          {onConfirm && (
            <ModalButton
              onClick={() => {
                onConfirm();
                onClose?.();
              }}
              bg={theme.bg}
              border={theme.border}
              color={theme.color}
              hoverBg={`rgba(${hexToRgb(theme.color)}, 0.28)`}
            >
              {confirmLabel}
            </ModalButton>
          )}
          {onOk && !onConfirm && (
            <ModalButton
              onClick={onOk}
              bg={theme.bg}
              border={theme.border}
              color={theme.color}
              hoverBg={`rgba(${hexToRgb(theme.color)}, 0.28)`}
            >
              {okLabel}
            </ModalButton>
          )}
        </div>

        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>,
    document.body,
  );
};

export default Dialog;
