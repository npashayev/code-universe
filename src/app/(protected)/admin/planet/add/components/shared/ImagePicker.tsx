import { FileUp, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent } from 'react';
import Label from './Label';
import Input from './Input';

interface Props {
  id: string;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  imagePreviewUrl: string;
  altText: string;
  onAltChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ImagePicker = ({
  id,
  handleImageUpload,
  altText,
  onAltChange,
  imagePreviewUrl,
}: Props) => {
  return (
    <div className="flex gap-6">
      <div className="space-y-4 flex-1">
        <div className="space-y-2">
          <div className="relative">
            <input
              type="file"
              id={`image-picker-${id}`}
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
            <label
              htmlFor={`image-picker-${id}`}
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
          <Label htmlFor={`image-alt-text-${id}`}>Alt Description</Label>
          <Input
            id={`image-alt-text-${id}`}
            value={altText}
            onChange={onAltChange}
          />
        </div>
      </div>

      <div className="rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center relative shadow-inner flex-1">
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
  );
};

export default ImagePicker;
