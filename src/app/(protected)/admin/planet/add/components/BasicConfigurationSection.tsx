import { CreatePlanetData, SupportedLanguage } from '@/types/planet';
import { FileUp, FolderPen, ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Updater } from 'use-immer';
import Image from 'next/image';

interface Props {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

const BasicConfigurationSection = ({
  planetData,
  setPlanetData,
  locale,
}: Props) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  return (
    <section className="bg-white/3 border border-white/10 rounded-2xl p-6 space-y-8">
      <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-4">
        <FolderPen size={16} />
        <span>Introduction</span>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Name
          </label>
          <input
            type="text"
            value={planetData.localized[locale].name}
            onChange={e =>
              setPlanetData(draft => {
                draft.localized[locale].name = e.target.value;
              })
            }
            className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white font-medium"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Description
          </label>
          <textarea
            value={planetData.localized[locale].description}
            onChange={e =>
              setPlanetData(draft => {
                draft.localized[locale].description = e.target.value;
              })
            }
            rows={4}
            className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white resize-none"
          />
        </div>

        {/* Sub-section: Planet Image */}
        <div className="pt-4 border-t border-white/5 space-y-6">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <ImageIcon size={14} />
            <span>Main Image</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="file"
                    id="main-image-upload"
                    className="hidden"
                    onChange={handleMainImageUpload}
                    accept="image/*"
                  />
                  <label
                    htmlFor="main-image-upload"
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-orange-500/50 rounded-xl px-4 py-4 outline-none transition-all text-slate-400 cursor-pointer group"
                  >
                    <FileUp
                      className="group-hover:text-orange-500 transition-colors"
                      size={20}
                    />
                    <span className="text-sm">Upload Image</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Alt Description
                </label>
                <input
                  type="text"
                  value={planetData.image.alt?.[locale] ?? ''}
                  onChange={e =>
                    setPlanetData(draft => {
                      if (draft.image.alt) {
                        draft.image.alt[locale] = e.target.value;
                      }
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white"
                />
              </div>
            </div>

            <div className="h-full rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center relative shadow-inner">
              {imagePreviewUrl ? (
                <Image
                  src={imagePreviewUrl}
                  fill
                  alt="Planet image preview"
                  className="object-cover object-center"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-700">
                  <ImageIcon size={40} strokeWidth={1} />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                    Waiting for Visual
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicConfigurationSection;
