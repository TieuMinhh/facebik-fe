'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, Video, Smile } from 'lucide-react';
import PostModal from './PostModal';

export default function CreatePost() {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="w-full shadow-sm rounded-xl border-gray-200 dark:border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border border-gray-100 dark:border-zinc-800">
              <AvatarImage src={user?.avatar} alt={user?.displayName || 'User'} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold uppercase">
                {user?.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 rounded-full bg-gray-100 px-4 py-2 hover:bg-gray-200 cursor-pointer transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <span className="text-base text-gray-500 dark:text-zinc-400">
                {user?.displayName} ơi, bạn đang nghĩ gì thế?
              </span>
            </div>
          </div>
          
          <div className="mt-3 border-t border-gray-200 dark:border-zinc-800 pt-3 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex gap-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors py-6"
            >
              <Video className="h-6 w-6 text-red-500" />
              <span className="font-semibold lg:block hidden">Video trực tiếp</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex gap-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors py-6"
            >
              <ImageIcon className="h-6 w-6 text-green-500" />
              <span className="font-semibold lg:block hidden">Ảnh/video</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex gap-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors py-6"
            >
              <Smile className="h-6 w-6 text-yellow-500" />
              <span className="font-semibold lg:block hidden">Cảm xúc/hoạt động</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <PostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
