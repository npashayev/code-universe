import { NavLinkItem } from '@/lib/constants/navbarItems';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

interface Props {
  item: NavLinkItem;
}

const NavLinkContent = ({ item }: Props) => {
  return (
    <>
      <div className="text-slate-400 group-hover:text-white transition-colors flex items-center gap-3">
        <div className="relative size-4">
          <Image
            src={item.icon}
            fill
            alt={item.label}
            className="object-cover object-center"
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
