'use client';
import type { ComponentPropsWithoutRef } from 'react';

const ExitPreviewButton = (props: ComponentPropsWithoutRef<'button'>) => {
  return (
    <button
      className="fixed top-8 left-10 px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-900 border border-white/10"
      {...props}
    >
      Exit preview
    </button>
  );
};

export default ExitPreviewButton;
