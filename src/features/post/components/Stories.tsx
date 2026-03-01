import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const dummyStories = [
  {
    id: 1,
    user: 'Alex Nguyễn',
    avatar: 'https://i.pravatar.cc/150?u=1',
    storyImage: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 2,
    user: 'Lâm Thanh Hải',
    avatar: 'https://i.pravatar.cc/150?u=2',
    storyImage: 'https://images.unsplash.com/photo-1469594292607-7bd90f8d3ba4?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 3,
    user: 'Bích Ngọc',
    avatar: 'https://i.pravatar.cc/150?u=3',
    storyImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 4,
    user: 'Hữu Tuấn',
    avatar: 'https://i.pravatar.cc/150?u=4',
    storyImage: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=300&auto=format&fit=crop',
  },
];

export default function Stories() {
  const { user } = useAuthStore();

  return (
    <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
      {/* Create Story Card */}
      <div className="group relative h-[192px] w-32 min-w-[128px] rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden cursor-pointer flex flex-col hover:shadow-md hover:opacity-95 transition-all">
        <div className="relative h-32 w-full bg-gray-100 overflow-hidden">
           {user?.avatar ? (
             <Image src={user.avatar} alt="Your avatar" fill sizes="128px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
           ) : (
             <div className="h-full w-full bg-blue-500 flex items-center justify-center text-white text-4xl uppercase font-bold">
               {user?.displayName?.charAt(0) || 'U'}
             </div>
           )}
        </div>
        <div className="relative flex flex-1 flex-col items-center justify-end pb-2">
          <div className="absolute -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 border-4 border-white dark:border-zinc-900 text-white shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-110">
            <Plus className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold mt-4 dark:text-zinc-200">Tạo tin</p>
        </div>
      </div>

      {/* Friend Story Cards */}
      {dummyStories.map((story) => (
        <div key={story.id} className="group relative h-[192px] w-32 min-w-[128px] rounded-xl overflow-hidden cursor-pointer flex flex-col">
          <Image 
            src={story.storyImage} 
            alt={story.user} 
            fill 
            sizes="128px"
            className="object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          
          <div className="absolute top-3 left-3 h-10 w-10 rounded-full border-4 border-blue-500 overflow-hidden shadow-sm bg-gray-200">
            <Image src={story.avatar} alt={story.user} fill sizes="40px" className="object-cover" />
          </div>
          
          <div className="absolute bottom-2 left-2 right-2 text-white font-semibold text-xs drop-shadow-md line-clamp-2">
            {story.user}
          </div>
        </div>
      ))}
    </div>
  );
}
