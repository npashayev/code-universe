'use client';
import { ReactNode, useLayoutEffect, useState } from 'react';

type ModalIcon = 'warning' | 'info' | 'question' | 'success';

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

interface Star {
    id: number;
    top: number;
    left: number;
    size: number;
    opacity: number;
}

const iconConfig: Record<ModalIcon, { color: string; bg: string; border: string; glow: string; svg: ReactNode }> = {
    warning: {
        color: '#f87171',
        bg: 'rgba(248,113,113,0.1)',
        border: 'rgba(248,113,113,0.25)',
        glow: 'rgba(248,113,113,0.06)',
        svg: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                <path d="M12 8h.01M12 12v4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
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
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
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
                <path d="M7 12l4 4 6-6" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
};

const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

interface ButtonProps {
    onClick: () => void;
    bg: string;
    border: string;
    color: string;
    hoverBg: string;
    children: ReactNode;
}

const ModalButton = ({ onClick, bg, border, color, hoverBg, children }: ButtonProps) => (
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

const Modal = ({
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
    const theme = iconConfig[icon];
    const [stars, setStars] = useState<Star[]>([]);


    useLayoutEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStars(
            Array.from({ length: 15 }, (_, i) => ({
                id: i,
                top: Math.random() * 100,
                left: Math.random() * 100,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.4 + 0.1,
            }))
        );
    }, []);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="relative rounded-2xl p-8 w-full max-w-md overflow-hidden"
                style={{
                    background: 'rgba(5, 9, 20, 0.97)',
                    border: `1px solid ${theme.border}`,
                    boxShadow: `0 0 40px ${theme.glow}, 0 24px 48px rgba(0,0,0,0.6)`,
                    animation: 'modalIn 0.2s ease',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Stars */}
                {stars.map(star => (
                    <div key={star.id} style={{
                        position: 'absolute',
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        borderRadius: '50%',
                        background: 'white',
                        opacity: star.opacity,
                        pointerEvents: 'none',
                    }} />
                ))}

                {/* Nebula glow */}
                <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '150px', height: '150px', borderRadius: '50%',
                    background: theme.glow, filter: 'blur(40px)', pointerEvents: 'none',
                }} />

                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full"
                        style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
                        {theme.svg}
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-center text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>
                    {title}
                </h2>

                {/* Body */}
                <div className="text-center text-sm leading-relaxed mb-8" style={{ color: 'rgba(148,163,184,0.8)' }}>
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
                                onClose?.()
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
        </div>
    );
};

export default Modal;