import { CONTENT_TYPE, CreatePlanetData, SupportedLanguage } from '@/types/planet';
import { Database } from 'lucide-react';
import { Updater } from 'use-immer';
import TextContentBlock from './contents/TextContentBlock';
import ContentHeading from './contents/ContentHeading';
import ImplementationTaskContentBlock from './contents/ImplementationTaskContentBlock';
import CodeContentBlock from './contents/CodeContentBlock';
import HtmlElementContentBlock from './contents/HtmlElementContentBlock';
import ImageContentBlock from './contents/ImageContentBlock';

interface Props {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

const ContentsSection = ({ planetData, setPlanetData, locale }: Props) => {
  const { contents } = planetData.localized[locale];



  return (
    <section className="space-y-8 pt-8 border-t border-white/10">
      <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight">
        <Database className="text-orange-500" size={24} />
        <span>Discovery Contents</span>
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
                setPlanetData={setPlanetData}
                locale={locale}
              />

              {content.type === CONTENT_TYPE.text && (
                <TextContentBlock
                  content={content}
                  setPlanetData={setPlanetData}
                  locale={locale}
                />
              )}
              {content.type === CONTENT_TYPE.implementationTask && (
                <ImplementationTaskContentBlock
                  content={content}
                  setPlanetData={setPlanetData}
                  locale={locale}
                />
              )}
              {content.type === CONTENT_TYPE.code && (
                <CodeContentBlock
                  content={content}
                  setPlanetData={setPlanetData}
                  locale={locale}
                />
              )}
              {content.type === CONTENT_TYPE.htmlElement && (
                <HtmlElementContentBlock
                  content={content}
                  setPlanetData={setPlanetData}
                  locale={locale}
                />
              )}
              {content.type === CONTENT_TYPE.image && (
                <ImageContentBlock
                  content={content}
                  setPlanetData={setPlanetData}
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
