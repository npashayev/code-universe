'use client';
import { useState } from 'react';

import { useDeletePlanet } from '@/lib/hooks/admin/queries/usePlanet';
import { type PlanetCategory } from '@/types/planet';

import Dialog from '../../ui/modal/Dialog';

import RemoveButton from './RemoveButton';

interface Props {
  planetId: string;
  category: PlanetCategory;
  onSuccess?: () => void;
}

const DeletePlanetButton = ({ planetId, category, onSuccess }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { mutate: deletePlanet, isPending } = useDeletePlanet(onSuccess);
  return (
    <>
      {modalOpen && (
        <Dialog
          icon="warning"
          title="Delete Planet"
          body="Are you sure you want to delete this planet?"
          onConfirm={() =>
            deletePlanet({
              planetId,
              category,
            })
          }
          onClose={() => setModalOpen(false)}
        />
      )}
      <RemoveButton isPending={isPending} onClick={() => setModalOpen(true)} />
    </>
  );
};

export default DeletePlanetButton;
