import { CreatePlanetData, SupportedLanguage } from '@/types/planet';
import { FolderPen, ImageIcon } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { Updater } from 'use-immer';
import ImagePicker from '../shared/ImagePicker';
import Label from '../shared/Label';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import SectionHeader from '../shared/SectionHeader';

interface Props {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
  setPendingFiles: React.Dispatch<React.SetStateAction<Map<string, File>>>;
}

const BasicConfigurationSection = ({
  planetData,
  setPlanetData,
  locale,
  setPendingFiles,
}: Props) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);

    // Different fileKey for main image
    const fileKey = 'main-image';
    setPendingFiles(prev => {
      const newMap = new Map(prev);
      newMap.set(fileKey, file);
      return newMap;
    });
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  return (
    <section className="admin-page-section">
      <SectionHeader>
        <FolderPen size={16} />
        <h2>Introduction</h2>
      </SectionHeader>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="planet-name">Name</Label>
          <Input
            id="planet-name"
            value={planetData.localized[locale].name}
            onChange={e =>
              setPlanetData(draft => {
                draft.localized[locale].name = e.target.value;
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={planetData.localized[locale].description}
            onChange={e =>
              setPlanetData(draft => {
                draft.localized[locale].description = e.target.value;
              })
            }
          />
        </div>

        <div className="pt-4 border-t border-white/5 space-y-6">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <ImageIcon size={14} />
            <span>Main Image</span>
          </div>

          <ImagePicker
            id="main-image"
            handleImageUpload={handleImageUpload}
            altText={planetData.image.alt?.[locale]}
            onAltChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPlanetData(draft => {
                if (draft.image.alt) {
                  draft.image.alt[locale] = e.target.value;
                }
              })
            }
            imagePreviewUrl={imagePreviewUrl}
          />
        </div>
      </div>
    </section>
  );
};

export default BasicConfigurationSection;
