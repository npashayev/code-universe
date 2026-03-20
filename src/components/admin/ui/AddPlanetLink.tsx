import { Plus } from 'lucide-react';
import Link from 'next/link';

import type { PlanetCategory } from '@/types/planet';

interface Props {
  category?: PlanetCategory;
}

const AddPlanetLink = ({ category = 'html' }: Props) => (
  <Link
    href={`/admin/planet/add?initialCategory=${category}`}
    className="header-button bg-orange-500 hover:bg-orange-600"
    target="_blank"
    rel="noreferrer"
  >
    <Plus size={16} />
    Add Planet
  </Link>
);

export default AddPlanetLink;
