'use client';

import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Smile, MapPin, UserPlus, MoreHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { useCreatePost } from '../services/usePosts';
import { toast } from 'sonner';
import Image from 'next/image';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostModal({ isOpen, onClose }: PostModalProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createPostMutation = useCreatePost();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (!content.trim() && selectedImages.length === 0) return;

    try {
      await createPostMutation.mutateAsync({
        content,
        images: selectedImages
      });
      
      toast.success('Đăng bài thành công!');
      setContent('');
      setSelectedImages([]);
      setPreviews([]);
      onClose();
    } catch {
      toast.error('Có lỗi xảy ra khi đăng bài.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border-none">
        <DialogHeader className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <DialogTitle className="text-center text-lg font-bold">Tạo bài viết</DialogTitle>
        </DialogHeader>

        <div className="p-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold uppercase">
                {user?.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user?.displayName}</span>
              <div className="bg-gray-200 dark:bg-zinc-800 rounded-md px-2 py-0.5 text-[12px] font-medium flex items-center gap-1 w-fit">
                <span>Công khai</span>
              </div>
            </div>
          </div>

          <textarea
            className="w-full min-h-[120px] text-xl bg-transparent outline-none resize-none placeholder:text-gray-500"
            placeholder={`${user?.displayName} ơi, bạn đang nghĩ gì thế?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {previews.length > 0 && (
            <div className="relative border border-gray-200 dark:border-zinc-800 rounded-lg p-2 grid grid-cols-2 gap-2">
              {previews.map((preview, i) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden">
                  <Image 
                    src={preview} 
                    alt="Preview" 
                    fill 
                    unoptimized 
                    className="object-cover" 
                  />
                  <button 
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 z-10 bg-white/80 dark:bg-zinc-900/80 rounded-full p-1 hover:bg-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="aspect-square flex flex-col gap-1 border-dashed"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">Thêm ảnh</span>
              </Button>
            </div>
          )}

          <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-3 flex items-center justify-between shadow-sm">
            <span className="text-sm font-semibold">Thêm vào bài viết của bạn</span>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-green-500"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-blue-500">
                <UserPlus className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-yellow-500">
                <Smile className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-red-500">
                <MapPin className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-gray-500">
                <MoreHorizontal className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 pt-0">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 disabled:bg-gray-300 disabled:text-gray-500" 
            disabled={(!content.trim() && selectedImages.length === 0) || createPostMutation.isPending}
            onClick={handleSubmit}
          >
            {createPostMutation.isPending ? 'Đang đăng...' : 'Đăng'}
          </Button>
        </DialogFooter>

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageSelect}
        />
      </DialogContent>
    </Dialog>
  );
}
