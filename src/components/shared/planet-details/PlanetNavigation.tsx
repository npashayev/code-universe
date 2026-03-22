import { getTranslations } from 'next-intl/server';

import { Link } from '@/lib/next-intl/navigation';
import type { PlanetCategory } from '@/types/planet';

interface Props {
  category: PlanetCategory;
  prevId: string | null;
  nextId: string | null;
}

const PlanetNavigation = async ({ category, prevId, nextId }: Props) => {
  const t = await getTranslations('planetDetails');

  return (
    <div className="flex justify-between gap-10 mt-20 px-[20%]">
      {prevId ? (
        <Link
          href={`/roadmap/${category}/${prevId}`}
          className="bg-green-600 text-white px-5 py-2 rounded font-semibold hover:bg-green-700 transition-colors"
        >
          ❮ {t('previous')}
        </Link>
      ) : (
        <span className="bg-green-600 text-white px-5 py-2 rounded font-semibold opacity-30 cursor-not-allowed">
          ❮ {t('previous')}
        </span>
      )}

      {nextId ? (
        <Link
          href={`/roadmap/${category}/${nextId}`}
          className="bg-green-600 text-white px-5 py-2 rounded font-semibold hover:bg-green-700 transition-colors"
        >
          {t('next')} ❯
        </Link>
      ) : (
        <span className="bg-green-600 text-white px-5 py-2 rounded font-semibold opacity-30 cursor-not-allowed">
          {t('next')}  ❯
        </span>
      )}
    </div>
  );
};

export default PlanetNavigation;
