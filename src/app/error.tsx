'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // This is where you'd send the error to Sentry/Log Rocket
    console.error('Global Error Boundary:', error);
  }, [error]);

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white px-6 py-12 text-center">
      {/* Visual background flair - subtle and global */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-xl w-full">
        {/* Technical code for context, but styled as a design element */}
        <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-[10px] font-medium tracking-[0.2em] uppercase text-white/40 mb-6">
          System Error
        </span>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Something went wrong
        </h1>

        <p className="text-white/50 text-base md:text-lg mb-10 leading-relaxed">
          The application encountered an unexpected error.
          {isDev
            ? ' Check the details below for debugging.'
            : " We've been notified and are looking into it."}
        </p>

        {/* Error Detail Section */}
        <div className="mb-10 text-left">
          {isDev ? (
            <div className="bg-white/3 border border-white/10 rounded-xl p-5 overflow-hidden">
              <p className="text-xs font-mono text-red-400 mb-2 font-bold uppercase tracking-wider">
                Runtime Exception:
              </p>
              <pre className="text-xs font-mono text-white/70 overflow-x-auto whitespace-pre-wrap break-all leading-normal">
                {error.name}: {error.message}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
                Reference Code
              </span>
              <span className="px-4 py-2 bg-white/2 border border-white/5 rounded-lg font-mono text-xs text-white/40 select-all">
                {error.digest || 'GENERIC_SERVER_ERROR'}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            Try again
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all active:scale-95"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <footer className="mt-20">
        <p className="text-[10px] text-white/20 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Internal Systems
        </p>
      </footer>
    </div>
  );
}
