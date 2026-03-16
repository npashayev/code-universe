'use client'

import DeletePlanetButton from "@/components/admin/ui/DeletePlanetButton"
import { useRouter } from "@/lib/next-intl/navigation";
import { PlanetCategory } from "@/types/planet";

interface Props {
    planetId: string;
    category: PlanetCategory;
}

const DeletePlanetButtonClient = ({ planetId, category }: Props) => {
    const router = useRouter();
    return <DeletePlanetButton
        planetId={planetId}
        onSuccess={() => router.push(`/roadmap/${category}`)}
    />
}

export default DeletePlanetButtonClient