import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

import type { Resource } from '@/types/planet';

interface Props {
  resources: Resource[];
}

const Resources = ({ resources }: Props) => {
  return (
    <section>
      <h2 className="heading-secondary">Resources</h2>
      <ul className="list-none flex gap-4 flex-wrap">
        {resources.map((res) => (
          <li key={res.id} className="flex gap-3">
            {
              <Link
                href={res.url}
                className="group p-5 min-w-60 rounded-lg border border-slate-700 bg-slate-800/30 hover:border-blue-500 hover:shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  {res.title && (
                    <div className="text-sm text-slate-400">{res.title}:</div>
                  )}
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                </div>
                <div className="text-slate-300 leading-snug">{res.label}</div>
              </Link>
            }
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Resources;
