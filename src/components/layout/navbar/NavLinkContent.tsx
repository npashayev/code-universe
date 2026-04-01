import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

import type { NavLinkItem } from '@/lib/constants/navbarItems';

interface Props {
  item: NavLinkItem;
}

const NavLinkContent = ({ item }: Props) => {
  return (
    <>
      <div className="text-white transition-colors flex items-center gap-3">
        <div className="relative size-4">
          <Image
            src={item.icon}
            fill
            sizes="16px"
            alt={item.label}
            className="object-contain object-center"
          />
        </div>
        {item.label}
      </div>
      <ArrowUpRight
        size={14}
        className="text-orange-500/0 group-hover:text-orange-500 transition-all"
      />
    </>
  );
};

export default NavLinkContent;
