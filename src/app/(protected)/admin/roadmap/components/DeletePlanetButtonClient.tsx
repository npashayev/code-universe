import { useRouter } from 'next/navigation';

import DeletePlanetButton from '@/components/admin/ui/DeletePlanetButton';
import { type PlanetCategory } from '@/types/planet';

interface Props {
  planetId: string;
  category: PlanetCategory;
}

const DeletePlanetButtonClient = ({ planetId, category }: Props) => {
  const router = useRouter();
  return (
    <DeletePlanetButton
      planetId={planetId}
      category={category}
      onSuccess={() => router.refresh()}
    />
  );
};

export default DeletePlanetButtonClient;
