'use client'

import { useDeletePlanet } from '@/lib/hooks/queries/usePlanet';
import Dialog from '../ui/Dialog'
import RemoveButton from '../ui/RemoveButton'
import { useState } from 'react';

interface Props {
    planetId: string;
    onSuccess?: () => void;
}

const DeletePlanetButton = ({ planetId, onSuccess }: Props) => {
    const [modalOpen, setModalOpen] = useState(false);

    const { mutate: deletePlanet, isPending } = useDeletePlanet(onSuccess);
    return (
        <>
            {modalOpen && (
                <Dialog
                    icon="warning"
                    title="Delete Planet"
                    body="Are you sure you want to delete this planet?"
                    onConfirm={() => deletePlanet(planetId)}
                    onClose={() => setModalOpen(false)}
                />
            )}
            <RemoveButton
                isPending={isPending}
                onClick={() => setModalOpen(true)}
            />
        </>

    )
}

export default DeletePlanetButton