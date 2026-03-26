import { Link } from '@/lib/next-intl/navigation';
import type { PlanetCategory } from '@/types/planet';

interface Props {
  category: PlanetCategory;
  prevId: string | null;
  nextId: string | null;
  labels: Record<string, string>
}

const PlanetNavigation = ({ category, prevId, nextId, labels }: Props) => {
  return (
    <div className="flex justify-between gap-10 mt-20 px-[20%]">
      {prevId ? (
        <Link
          href={`/roadmap/${category}/${prevId}`}
          className="bg-green-600 text-white px-5 py-2 rounded font-semibold hover:bg-green-700 transition-colors"
        >
          ❮ {labels.previous}
        </Link>
      ) : (
        <span className="bg-green-600 text-white px-5 py-2 rounded font-semibold opacity-30 cursor-not-allowed">
          ❮ {labels.previous}
        </span>
      )}

      {nextId ? (
        <Link
          href={`/roadmap/${category}/${nextId}`}
          className="bg-green-600 text-white px-5 py-2 rounded font-semibold hover:bg-green-700 transition-colors"
        >
          {labels.next} ❯
        </Link>
      ) : (
        <span className="bg-green-600 text-white px-5 py-2 rounded font-semibold opacity-30 cursor-not-allowed">
          {labels.next} ❯
        </span>
      )}
    </div>
  );
};

export default PlanetNavigation;
