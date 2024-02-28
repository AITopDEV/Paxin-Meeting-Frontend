import React, { FC, forwardRef, useImperativeHandle, useState } from 'react';
import Image from 'next/image';
import { BsCloudUpload } from 'react-icons/bs';
import { LiaTimesSolid } from 'react-icons/lia';

import { Button } from '../ui/button';
import { Label } from '../ui/label';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PreviewImageProps {
  src: string;
  name?: string;
  size?: number;
  uploading?: boolean;
  disabled?: boolean;
  onRemove: () => void;
}

export const PreviewImage: FC<PreviewImageProps> = ({
  src,
  name,
  size,
  uploading,
  disabled,
  onRemove,
}) => (
  <div className='relative size-24'>
    <Image src={src} alt='' style={{ objectFit: 'cover' }} fill />
    <Button
      variant='destructive'
      className='absolute right-1 top-1 z-10 size-6 rounded-full'
      onClick={onRemove}
      type='button'
      size='icon'
      disabled={uploading || disabled}
    >
      <LiaTimesSolid className='size-4' />
    </Button>
    <div className='absolute left-1 top-1 flex w-16 flex-col'>
      <span className='line-clamp-1 text-sm text-secondary-foreground'>
        {name && name}
      </span>
      <span className='line-clamp-1 text-xs text-muted-foreground'>
        {size && `${(size / 1024).toFixed(2)}KB`}
      </span>
    </div>
    {uploading && (
      <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-black/80'>
        <Loader2 className='animate-spin text-secondary-foreground' />
      </div>
    )}
  </div>
);

type ImageUploadProps = {
  value?: File[];
  onChange?: (value: File[]) => void;
  disabled?: boolean;
};

export const ImageUpload = forwardRef<
  { handleUpload: () => Promise<any> },
  ImageUploadProps
>(({ value, onChange, disabled }, ref) => {
  const t = useTranslations('main');
  const [images, setImages] = useState<File[]>(value || []);
  const [uploading, setUploading] = useState(false);
  const hiddenFileInputRef = React.useRef<any>();

  const onClick = () => {
    console.log('SDF', disabled);
    if (disabled) return;
    hiddenFileInputRef.current.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const duplicate = newFiles.some((newFile) =>
      images.some(
        (existingFile) =>
          existingFile.name === newFile.name &&
          existingFile.size === newFile.size &&
          existingFile.type === newFile.type
      )
    );

    if (!duplicate) {
      setImages([...images, ...Array.from(e.target.files)]);
    }

    onChange && onChange([...images, ...Array.from(e.target.files)]);

    e.target.value = '';
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;

    e.preventDefault();

    if (!e.dataTransfer.files) return;

    setImages([...images, ...Array.from(e.dataTransfer.files)]);

    onChange && onChange([...images, ...Array.from(e.dataTransfer.files)]);
  };

  const removeImage = (index: number) => {
    setImages(images.splice(index, 1));

    onChange && onChange(images.splice(index, 1));
  };

  const handleUpload = async () => {
    setUploading(true);

    const formData = new FormData();

    images.forEach((image) => {
      formData.append('files', image);
    });

    try {
      const res = await axios.post('/api/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        setUploading(false);

        return res.data;
      }

      setUploading(false);

      return null;
    } catch (error) {
      setUploading(false);

      return null;
    }
  };

  const handleReset = () => {
    setImages([]);
    onChange && onChange([]);
  };

  useImperativeHandle(ref, () => ({
    handleUpload,
    handleReset,
  }));

  return (
    <div className='flex flex-col items-center space-y-4'>
      <div
        className='flex w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6'
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className='flex flex-col items-center space-y-1'>
          <div className='rounded-full bg-primary/10 p-3 text-primary'>
            <BsCloudUpload className='size-8' />
          </div>
          <div className='flex flex-col items-center'>
            <Label htmlFor='file-upload' className='text-lg'>
              <Button
                variant='link'
                type='button'
                className='p-0'
                onClick={onClick}
                disabled={uploading || disabled}
              >
                {t('click_to_upload')}
              </Button>{' '}
            </Label>
            <span className='text-sm text-muted-foreground'>
              {t('or_drag_and_drop')} ({t('upload_no_more_than_10')})
            </span>
          </div>
        </div>
        <input
          className='hidden'
          ref={hiddenFileInputRef}
          type='file'
          id='file-upload'
          name='file-upload'
          multiple
          onChange={onFileChange}
          disabled={uploading || disabled}
        />
      </div>

      <div className='flex max-w-full flex-wrap items-center justify-center gap-2'>
        {images.map((file, index) => (
          <PreviewImage
            key={index}
            src={URL.createObjectURL(file)}
            name={file.name}
            size={file.size}
            uploading={uploading}
            disabled={uploading || disabled}
            onRemove={() => removeImage(index)}
          />
        ))}
      </div>
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';
