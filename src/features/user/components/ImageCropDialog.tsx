'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getCroppedImg } from '@/lib/cropImage';

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  aspect: number;
  onCropComplete: (croppedImage: Blob) => void;
  title?: string;
  shape?: 'rect' | 'round';
}

export default function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  aspect,
  onCropComplete,
  title = 'Cắt ảnh',
  shape = 'rect'
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const handleSave = async () => {
    try {
      if (!croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
        onOpenChange(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <DialogTitle className="text-xl font-bold text-center">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="relative h-[400px] w-full bg-gray-100 dark:bg-zinc-950">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={shape}
            showGrid={true}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Thu nhỏ</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="flex-1 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-sm font-medium text-gray-500">Phóng to</span>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-2 bg-gray-50 dark:bg-zinc-900/50">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="font-semibold"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
