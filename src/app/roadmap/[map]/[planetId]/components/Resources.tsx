import { Resource } from '@/types/planet';
import Link from 'next/link';

interface Props {
  resources: Resource[];
}

const Resources = ({ resources }: Props) => {
  return (
    <section>
      <h2 className="text-2xl mb-3 font-bold">Resources</h2>
      <ul className="list-inside ml-8">
        {resources.map(res => (
          <li key={res.id} className="flex gap-2">
            {res.title && <p className="font-bold">{res.title}:</p>}
            {
              <Link
                href={res.url}
                className="text-blue-300 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {res.label}
              </Link>
            }
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Resources;
