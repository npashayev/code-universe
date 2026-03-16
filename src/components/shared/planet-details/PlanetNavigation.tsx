import { Link } from "@/lib/next-intl/navigation";
import { PlanetCategory } from "@/types/planet";

interface Props {
    category: PlanetCategory
    prevId: string | null;
    nextId: string | null;
}

const PlanetNavigation = ({ category, prevId, nextId }: Props) => {
    return (
        <div className="flex justify-between gap-10 mt-20 px-[20%]">
            {prevId ? (
                <Link
                    href={`/roadmap/${category}/${prevId}`}
                    className="bg-green-600 text-white px-5 py-2 rounded font-semibold hover:bg-green-700 transition-colors"
                >
                    ❮ Previous
                </Link>
            ) : (
                <span className="bg-green-600 text-white px-5 py-2 rounded font-semibold opacity-30 cursor-not-allowed">
                    ❮ Previous
                </span>
            )}

            {nextId ? (
                <Link
                    href={`/roadmap/${category}/${nextId}`}
                    className="bg-green-600 text-white px-5 py-2 rounded font-semibold hover:bg-green-700 transition-colors"
                >
                    Next ❯
                </Link>
            ) : (
                <span className="bg-green-600 text-white px-5 py-2 rounded font-semibold opacity-30 cursor-not-allowed">
                    Next ❯
                </span>
            )}
        </div>
    )
}

export default PlanetNavigation