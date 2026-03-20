import { useRouter } from 'next/navigation';

import DeletePlanetButton from '@/components/admin/ui/DeletePlanetButton';

interface Props {
  planetId: string;
}

const DeletePlanetButtonClient = ({ planetId }: Props) => {
  const router = useRouter();
  return (
    <DeletePlanetButton
      planetId={planetId}
      onSuccess={() => router.refresh()}
    />
  );
};

export default DeletePlanetButtonClient;
