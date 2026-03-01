'use client';
import { cn } from '@/lib/utils/cn';
import { ComponentPropsWithoutRef } from 'react';


const baseClasses =
    'flex-1 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all';

const ModalButton = ({ className, children, ...props }: ComponentPropsWithoutRef<'button'>) => (
    <button
        type="button"
        {...props}
        className={cn(baseClasses, className)}
    >
        {children}
    </button>
);

export default ModalButton;
