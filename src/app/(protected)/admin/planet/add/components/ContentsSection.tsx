import {
  CONTENT_TYPE,
  CreatePlanetData,
  PlanetContent,
  SupportedLanguage,
} from '@/types/planet';
import { Database } from 'lucide-react';
import { Updater } from 'use-immer';
import TextContentBlock from './contents/TextContentBlock';
import ContentHeading from './contents/ContentHeading';
import ImplementationTaskContentBlock from './contents/ImplementationTaskContentBlock';
import CodeContentBlock from './contents/CodeContentBlock';
import HtmlElementContentBlock from './contents/HtmlElementContentBlock';
import ImageContentBlock from './contents/ImageContentBlock';
import { useLocalizedContent } from '@/lib/hooks/useLocalizedContent';

interface Props {
  contents: PlanetContent[];
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
  setPendingFiles: React.Dispatch<React.SetStateAction<Map<string, File>>>;
}

const ContentsSection = ({
  contents,
  setPlanetData,
  locale,
  setPendingFiles,
}: Props) => {
  const { removeContent, updateContent } = useLocalizedContent({
    setPlanetData,
    locale,
  });

  return (
    <section className="space-y-8 pt-8 border-t border-white/10">
      <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight">
        <Database className="text-orange-500" size={24} />
        <span>Contents</span>
      </div>
      <div className="space-y-10">
        <div className="space-y-10">
          {contents.map((content, idx) => (
            <div
              key={content.id}
              id={content.id}
              className="p-8 bg-white/3 border border-white/10 rounded-3xl space-y-8 relative group hover:border-orange-500/30 transition-all"
            >
              <ContentHeading
                idx={idx}
                content={content}
                onUpdate={updateContent}
                onRemove={removeContent}
              />

              {content.type === CONTENT_TYPE.text && (
                <TextContentBlock
                  content={content}
                  setPlanetData={setPlanetData}
                  locale={locale}
                  onUpdate={updateContent}
                />
              )}
              {content.type === CONTENT_TYPE.implementationTask && (
                <ImplementationTaskContentBlock
                  content={content}
                  onUpdate={updateContent}
                />
              )}
              {content.type === CONTENT_TYPE.code && (
                <CodeContentBlock content={content} onUpdate={updateContent} />
              )}
              {content.type === CONTENT_TYPE.htmlElement && (
                <HtmlElementContentBlock
                  content={content}
                  onUpdate={updateContent}
                />
              )}
              {content.type === CONTENT_TYPE.image && (
                <ImageContentBlock
                  content={content}
                  onUpdate={updateContent}
                  setPendingFiles={setPendingFiles}
                  locale={locale}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentsSection;
