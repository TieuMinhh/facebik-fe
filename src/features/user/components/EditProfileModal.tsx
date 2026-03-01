'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateProfile } from '../hooks/useUser';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    _id: string;
    displayName: string;
    bio: string;
  };
}

export default function EditProfileModal({ open, onOpenChange, user }: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio || '');
  const updateProfile = useUpdateProfile();

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error('Tên hiển thị không được để trống');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('displayName', displayName);
      formData.append('bio', bio);

      await updateProfile.mutateAsync(formData);
      toast.success('Cập nhật thông tin thành công');
      onOpenChange(false);
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <DialogHeader className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <DialogTitle className="text-xl font-bold text-center">Chỉnh sửa thông tin cá nhân</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                Tên hiển thị
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:ring-blue-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                Tiểu sử
              </Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Mô tả về bản thân..."
                className="w-full min-h-[100px] p-3 text-sm bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 text-right">{bio.length}/101</p>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-2">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="font-semibold text-gray-600 hover:text-gray-900"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={updateProfile.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
