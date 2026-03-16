'use client';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import DialogIcon, { type DialogIconType } from './DialogIcon';
import ModalButton from './ModalButton';
import Modal from './Modal';

interface Props {
  title: string;
  body: ReactNode;
  icon?: DialogIconType;
  onConfirm?: () => void;
  onClose?: () => void;
  onOk?: () => void;
  confirmLabel?: string;
  closeLabel?: string;
  okLabel?: string;
}

const Dialog = ({
  title,
  body,
  icon,
  onConfirm,
  onClose,
  onOk,
  confirmLabel = 'Confirm',
  closeLabel = 'Cancel',
  okLabel = 'OK',
}: Props) => {
  return createPortal(
    <Modal className="px-12" onClose={onClose}>
      <DialogIcon icon={icon} />

      {/* Title */}
      <h2 className="text-center text-xl font-bold mb-2 text-slate-100">
        {title}
      </h2>

      {/* Body */}
      <h2 className="text-center text-sm leading-relaxed mb-8 text-slate-400/80">
        {body}
      </h2>

      {/* Buttons */}
      <div className="flex gap-3">
        {onClose && (
          <ModalButton
            onClick={onClose}
            className="bg-rose-500/10 border border-rose-500/40 text-rose-300 hover:bg-rose-500/20"
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
            className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20"
          >
            {confirmLabel}
          </ModalButton>
        )}
        {onOk && !onConfirm && (
          <ModalButton
            onClick={onOk}
            className="bg-blue-500/10 border border-blue-500/40 text-blue-300 hover:bg-blue-500/20"
          >
            {okLabel}
          </ModalButton>
        )}
      </div>
    </Modal>,
    document.body,
  );
};

export default Dialog;
