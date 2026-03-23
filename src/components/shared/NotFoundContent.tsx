import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

const NotFoundContent = async ({ text }: { text?: string }) => {
  const [t, c] = await Promise.all([
    getTranslations('common'),
    getTranslations('notFound'),
  ]);

  return (
    <div className="page bg-night flex flex-col items-center justify-center text-white text-center px-4">
      <h1 className="text-[10rem] font-black leading-none tracking-tight text-white/90 mb-4">
        404
      </h1>

      <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-10">
        {text ||
          c('notFoundMessage')}
      </p>

      <Link
        href="/"
        className="px-5 py-2.5 rounded-full text-sm font-semibold bg-orange-500 hover:bg-orange-400 transition-colors text-white"
      >
        {t('home')}
      </Link>
    </div>
  );
};

export default NotFoundContent;
