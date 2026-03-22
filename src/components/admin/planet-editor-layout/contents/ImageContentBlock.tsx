import type { Dispatch } from 'react';

import type { UpdateContentFn } from '@/lib/hooks/admin/useLocalizedContent';
import type { ImageContent, PendingContentImageEntry } from '@/types/planet';
import type { PendingImageOption } from '@/types/reactSelectOptions';

import Label from '../shared/Label';
import Input from '../shared/Input';
import ImagePicker from '../shared/ImagePicker';
import Textarea from '../shared/Textarea';
import { PendingImageSelector } from '../../Selectors';

interface Props {
  content: ImageContent;
  onUpdate: UpdateContentFn;
  pendingContentImages: Map<string, PendingContentImageEntry>;
  setPendingContentImages: Dispatch<
    React.SetStateAction<Map<string, PendingContentImageEntry>>
  >;
}

const ImageContentBlock = ({
  content,
  onUpdate,
  pendingContentImages,
  setPendingContentImages,
}: Props) => {
  const pendingImageOptions: PendingImageOption[] = Array.from(
    pendingContentImages.keys(),
  ).map((fileName) => ({
    value: fileName,
    label: fileName,
  }));

  const selectedPendingOption: PendingImageOption | null =
    content.pendingImageId
      ? {
          value: content.pendingImageId,
          label: content.pendingImageId,
        }
      : null;

  const imagePreviewUrl =
    content.pendingImageId &&
    pendingContentImages.get(content.pendingImageId)?.previewUrl;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const previewUrl = URL.createObjectURL(file);

    setPendingContentImages((prev) => {
      const next = new Map(prev);
      // Revoke old blob URL when overwriting same filename
      const existing = next.get(fileName);
      if (existing) {
        URL.revokeObjectURL(existing.previewUrl);
      }
      next.set(fileName, { previewUrl, file });
      return next;
    });
    onUpdate(content.id, {
      pendingImageId: fileName,
      image: { ...content.image },
    });
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(content.id, {
      image: { ...content.image, alt: e.target.value },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor={`image-content-title-${content.id}`}>
          Title (Optional)
        </Label>
        <Input
          id={`image-content-title-${content.id}`}
          value={content.title || ''}
          onChange={(e) => onUpdate(content.id, { title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`image-content-description-${content.id}`}>
          Description (Optional)
        </Label>
        <Textarea
          id={`image-content-description-${content.id}`}
          rows={2}
          value={content.description ?? ''}
          onChange={(e) =>
            onUpdate(content.id, { description: e.target.value })
          }
        />
      </div>

      {pendingImageOptions.length > 0 && (
        <div className="space-y-2">
          <Label>Use same as existing image</Label>
          <PendingImageSelector
            options={pendingImageOptions}
            value={selectedPendingOption}
            onChange={(option) =>
              onUpdate(content.id, {
                pendingImageId: option?.value,
              })
            }
          />
        </div>
      )}

      <ImagePicker
        id={`image-upload-${content.id}`}
        altText={content.image.alt || ''}
        onAltChange={handleAltChange}
        handleImageUpload={handleImageUpload}
        imageRealUrl={content.image.url}
        imagePreviewUrl={imagePreviewUrl ?? ''}
      />
    </div>
  );
};

export default ImageContentBlock;
