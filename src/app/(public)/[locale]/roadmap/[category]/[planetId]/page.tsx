import { notFound } from 'next/navigation';

import { getPlanet } from '@/lib/planet/getPlanet';
import { isPlanetCategory } from '@/lib/utils/isPlanetCategory';
import { Link } from '@/lib/next-intl/navigation';
import UpdateLink from '@/components/admin/ui/UpdateLink';
import PrivateComponent from '@/components/admin/PrivateComponent';
import DeletePlanetButtonClient from '@/components/shared/planet-details/DeletePlanetButtonClient';
import PlanetDetails from '@/components/shared/planet-details/PlanetDetails';

interface Props {
  params: Promise<{
    category: string;
    planetId: string;
  }>;
}

export default async function PlanetPage({ params }: Props) {
  const { planetId, category } = await params;

  if (!isPlanetCategory(category)) notFound();

  const planet = await getPlanet(planetId, category);

  return (
    <>
      <div className="fixed z-1 top-8 left-0 px-30 flex justify-between w-full items-center">
        <Link
          className="px-3 py-1 rounded bg-slate-800 border border-white/10 hover:bg-slate-900"
          href={`/roadmap/${category}`}
        >
          Go back
        </Link>

        <PrivateComponent roles={['ADMIN']}>
          <div className="flex gap-2 items-center bg-slate-950 px-2 py-1 rounded-lg border border-white/10">
            <DeletePlanetButtonClient
              planetId={planet.id}
              category={category}
            />
            <UpdateLink href={`/admin/planet/update/${planet.id}`} />
          </div>
        </PrivateComponent>
      </div>

      <PlanetDetails planet={planet} />
    </>
  );
}
