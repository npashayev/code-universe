'use client';

import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="page bg-night flex flex-col items-center justify-center text-white text-center px-4">

            <h1 className="text-[10rem] font-black leading-none tracking-tight text-white/90 mb-4">
                500
            </h1>

            <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-10">
                {error.message || 'Something went wrong on our end.'}
            </p>

            <div className="flex items-center gap-3">
                <button
                    onClick={reset}
                    className="px-5 py-2.5 rounded-full text-sm border border-white/10 text-white/60 hover:bg-white/5 transition-colors"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="px-5 py-2.5 rounded-full text-sm font-semibold bg-orange-500 hover:bg-orange-400 transition-colors text-white"
                >
                    Home
                </Link>
            </div>
        </div>
    );
}