import { Edit } from "lucide-react";
import Link from "next/link"

interface Props {
    planetId: string;
}

const UpdatePlanetLink = ({ planetId }: Props) => {
    return (
        <Link
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/15 rounded-lg transition-all"
            href={`/admin/planet/update/${planetId}`}
            target="_blank"
            rel="noreferrer"
        >
            <Edit size={18} />
        </Link>
    )
}

export default UpdatePlanetLink