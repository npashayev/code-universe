import { useState } from 'react';
import type { Updater } from 'use-immer';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

import type { CreatePlanetData, Resource, SupportedLanguage } from '@/types/planet';
import { useLocalizedDragReorder } from '@/lib/hooks/admin/useLocalizedDragReorder';
import SortableList from '@/components/admin/planet-editor-layout/SortableList';

import SectionHeader from '../shared/SectionHeader';
import Input from '../shared/Input';
import AddButton from '../shared/AddButton';
import ListElement from '../shared/ListElement';

interface Props {
  resources?: Resource[];
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

export const ExternalResourcesSection = ({
  resources,
  setPlanetData,
  locale,
}: Props) => {
  const [currentResource, setCurrentResource] = useState({
    label: '',
    title: '',
    url: '',
  });

  const addResource = () => {
    if (!currentResource.label || !currentResource.url) return;
    setPlanetData((draft) => {
      draft.localized[locale].resources?.push({
        id: crypto.randomUUID(),
        ...currentResource,
      });
    });
    setCurrentResource({ label: '', title: '', url: '' });
  };

  const removeResource = (id: string) => {
    setPlanetData((draft) => {
      draft.localized[locale].resources = draft.localized[
        locale
      ].resources?.filter((r) => r.id !== id);
    });
  };

  const handleDragEnd = useLocalizedDragReorder(
    setPlanetData,
    locale,
    'resources',
  );

  const isValid =
    !!currentResource.label.trim() && !!currentResource.url.trim();

  return (
    <section className="admin-page-section">
      <SectionHeader>
        <BookOpen size={14} />
        <h2>External Resources</h2>
      </SectionHeader>

      <div className="flex gap-2 min-w-0 flex-wrap">
        <Input
          value={currentResource.title}
          onChange={(e) =>
            setCurrentResource({ ...currentResource, title: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') addResource();
          }}
          placeholder="Title (Optional)"
        />
        <Input
          value={currentResource.label}
          onChange={(e) =>
            setCurrentResource({ ...currentResource, label: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') addResource();
          }}
          placeholder="Link label"
        />
        <Input
          value={currentResource.url}
          onChange={(e) =>
            setCurrentResource({ ...currentResource, url: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') addResource();
          }}
          placeholder="URL"
        />
        <AddButton
          onClick={addResource}
          disabled={!isValid}
          className="shrink-0"
        >
          Add
        </AddButton>
      </div>

      <SortableList<Resource>
        id="resource-sortable-list"
        elements={resources || []}
        handleDragEnd={handleDragEnd}
        renderItem={(res) => (
          <ListElement onRemove={() => removeResource(res.id)}>
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-orange-500/15 flex items-center justify-center border border-orange-500/30">
                <BookOpen size={14} className="text-orange-500" />
              </div>
              <div className="min-w-0 overflow-hidden">
                {res.title && (
                  <span className="block text-[12px] text-slate-500 uppercase font-mono tracking-tighter truncate">
                    {res.title}
                  </span>
                )}
                <Link
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-orange-400 hover:underline font-medium truncate"
                >
                  {res.label}
                </Link>
              </div>
            </div>
          </ListElement>
        )}
      />

      {(!resources || resources.length === 0) && (
        <span className="admin-empty-state">No resources assigned yet.</span>
      )}
    </section>
  );
};

export default ExternalResourcesSection;
