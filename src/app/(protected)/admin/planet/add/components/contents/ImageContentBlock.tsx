import { UpdateContentFn } from '@/lib/hooks/useLocalizedContent';
import { ImageContent, SupportedLanguage } from '@/types/planet';
import { PendingImageOption } from '@/types/reactSelectOptions';
import Label from '../shared/Label';
import Input from '../shared/Input';
import ImagePicker from '../shared/ImagePicker';
import Textarea from '../shared/Textarea';
import { PendingImageSelector } from '../Selectors';

type PendingContentImageEntry = {
  previewUrl: string;
  file: File;
  alt: string;
};

interface Props {
  content: ImageContent;
  onUpdate: UpdateContentFn;
  pendingContentImages: Map<string, PendingContentImageEntry>;
  setPendingContentImages: React.Dispatch<
    React.SetStateAction<Map<string, PendingContentImageEntry>>
  >;
  locale: SupportedLanguage;
}

const ImageContentBlock = ({
  content,
  onUpdate,
  pendingContentImages,
  setPendingContentImages,
  locale,
}: Props) => {
  const pendingImageOptions: PendingImageOption[] = Array.from(
    pendingContentImages.entries(),
  ).map(([id, { alt }]) => ({
    value: id,
    label: alt || '(No alt)',
  }));

  const selectedPendingOption: PendingImageOption | null = content.pendingImageId
    ? (pendingImageOptions.find(o => o.value === content.pendingImageId) ?? {
      value: content.pendingImageId,
      label:
        pendingContentImages.get(content.pendingImageId)?.alt || '(No alt)',
    })
    : null;

  const imagePreviewUrl =
    content.pendingImageId &&
    pendingContentImages.get(content.pendingImageId)?.previewUrl;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const id = crypto.randomUUID();
    const previewUrl = URL.createObjectURL(file);

    setPendingContentImages(prev =>
      new Map(prev).set(id, {
        previewUrl,
        file,
        alt: content.image.alt || '',
      }),
    );
    onUpdate(content.id, {
      pendingImageId: id,
      image: { ...content.image, alt: content.image.alt || '' },
    });
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAlt = e.target.value;
    onUpdate(content.id, {
      image: { ...content.image, alt: newAlt },
    });
    if (content.pendingImageId) {
      setPendingContentImages(prev => {
        const m = new Map(prev);
        const entry = m.get(content.pendingImageId!);
        if (entry) m.set(content.pendingImageId!, { ...entry, alt: newAlt });
        return m;
      });
    }
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
          onChange={e => onUpdate(content.id, { title: e.target.value })}
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
          onChange={e => onUpdate(content.id, { description: e.target.value })}
        />
      </div>

      {pendingImageOptions.length > 0 && (
        <div className="space-y-2">
          <Label>Use same as existing image</Label>
          <PendingImageSelector
            options={pendingImageOptions}
            value={selectedPendingOption}
            onChange={option =>
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
        imagePreviewUrl={imagePreviewUrl ?? ''}
      />
    </div>
  );
};

export default ImageContentBlock;
