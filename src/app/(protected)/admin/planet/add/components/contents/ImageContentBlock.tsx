import { UpdateContentFn } from '@/lib/hooks/useLocalizedContent';
import { ImageContent, SupportedLanguage } from '@/types/planet';
import { useEffect, useState } from 'react';
import Label from '../shared/Label';
import Input from '../shared/Input';
import ImagePicker from '../shared/ImagePicker';

interface Props {
  content: ImageContent;
  onUpdate: UpdateContentFn;
  setPendingFiles: React.Dispatch<React.SetStateAction<Map<string, File>>>;
  locale: SupportedLanguage;
}
const ImageContentBlock = ({
  content,
  onUpdate,
  setPendingFiles,
  locale,
}: Props) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);

    // Store file for later upload
    const fileKey = `content-${locale}-${content.id}`;
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor={`image-content-title-${content.id}`}>Title</Label>
        <Input
          id={content.id}
          value={content.title || ''}
          onChange={e => onUpdate(content.id, { title: e.target.value })}
        />
      </div>
      <ImagePicker
        id={`image-upload-${content.id}`}
        altText={content.image.alt || ''}
        onAltChange={e =>
          onUpdate(content.id, {
            image: { ...content.image, alt: e.target.value },
          })
        }
        handleImageUpload={handleImageUpload}
        imagePreviewUrl={imagePreviewUrl}
      />
    </div>
  );
};

export default ImageContentBlock;
