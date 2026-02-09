import {
  CreatePlanetData,
  ImageContent,
  SupportedLanguage,
} from '@/types/planet';
import { FileUp, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Updater } from 'use-immer';

interface Props {
  content: ImageContent;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}
const ImageContentBlock = ({ content, setPlanetData, locale }: Props) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Worked');
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log(imageUrl);
      setImagePreviewUrl(imageUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const updateContent = (id: string, updates: Partial<ImageContent>) => {
    setPlanetData(draft => {
      const content = draft.localized[locale].contents.find(c => c.id === id);
      if (!content) return;
      Object.assign(content, updates);
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Block Title
        </label>
        <input
          type="text"
          placeholder="Caption for the image..."
          value={content.title || ''}
          onChange={e => updateContent(content.id, { title: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <input
                type="file"
                id={`image-upload-${content.id}`}
                className="hidden"
                onChange={handleImageUpload}
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
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Alt Description
            </label>
            <input
              type="text"
              value={content.image.alt || ''}
              onChange={e =>
                updateContent(content.id, {
                  image: { ...content.image, alt: e.target.value },
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
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
  );
};

export default ImageContentBlock;
