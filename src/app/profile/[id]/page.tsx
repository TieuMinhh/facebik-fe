'use client';

import { use, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Navbar from '@/components/layout/Navbar';
import ProfileHeader from '@/features/user/components/ProfileHeader';
import PostCard from '@/features/post/components/PostCard';
import CreatePost from '@/features/post/components/CreatePost';
import { useProfile, useUserPosts } from '@/features/user/hooks/useUser';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import EditProfileModal from '@/features/user/components/EditProfileModal';
import { useState } from 'react';

interface Post {
  _id: string;
  author: {
    _id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  images?: string[];
  likes: {
    userId: {
      _id: string;
      username: string;
      displayName: string;
      avatar?: string;
    };
    reactionType: string;
    createdAt: string;
  }[];
  commentsCount: number;
  createdAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: PageProps) {
  const { id: userId } = use(params);
  const { user: currentUser } = useAuthStore();
  const isOwnProfile = currentUser?._id === userId;

  const { data: profileData, isLoading: isProfileLoading } = useProfile(userId);
  const { 
    data: postsData, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    status: postsStatus 
  } = useUserPosts(userId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-zinc-950">
        <Navbar />
        <div className="max-w-[1100px] mx-auto p-4">
          <Skeleton className="h-[300px] w-full rounded-xl mt-4" />
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-40 w-40 rounded-full" />
            <div className="flex-1 space-y-4 py-8">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const user = profileData?.data;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-zinc-950">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-xl font-semibold text-gray-500">Không tìm thấy người dùng này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-zinc-950">
      <Navbar />
      
      <main className="flex flex-col">
        <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

        <div className="max-w-[1100px] mx-auto w-full px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Left Column - Intro & Photos */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-4">Giới thiệu</h3>
                <div className="space-y-4">
                   <p className="text-center text-gray-600 dark:text-zinc-400 italic">&quot;{user?.bio || 'Sống để cống hiến cho đam mê lập trình và Facebook Clone.'}&quot;</p>
                   {isOwnProfile && (
                     <Button 
                       variant="secondary" 
                       onClick={() => setIsEditModalOpen(true)}
                       className="w-full font-semibold"
                     >
                       Chỉnh sửa tiểu sử
                     </Button>
                   )}
                   <div className="space-y-2 text-sm text-gray-700 dark:text-zinc-300 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-500 underline decoration-dotted">Học tại:</span> Đại học Bách Khoa
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-500 underline decoration-dotted">Đến từ:</span> Hà Nội, Việt Nam
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-xl font-bold">Ảnh</h3>
                   <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium">Xem tất cả</Button>
                </div>
                <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
                   {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                     <div key={i} className="aspect-square bg-gray-200 dark:bg-zinc-800 border border-white dark:border-zinc-900"></div>
                   ))}
                </div>
              </div>
            </div>

            {/* Right Column - Timeline */}
            <div className="lg:col-span-3 space-y-4">
              {isOwnProfile && <CreatePost />}
              
              <div className="flex flex-col gap-4 mb-20">
                {postsStatus === 'pending' ? (
                  <div className="space-y-4">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                  </div>
                ) : (
                  postsData?.pages.map((page, i) => (
                    <div key={i} className="flex flex-col gap-4">
                      {page.data.map((post: Post) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                    </div>
                  ))
                )}

                {/* Infinite Scroll Trigger */}
                <div ref={ref} className="py-4 flex justify-center">
                  {isFetchingNextPage ? (
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                  ) : hasNextPage ? (
                    <div className="h-1" />
                  ) : (
                    <p className="text-gray-500 text-sm italic text-center py-6">
                      Bạn đã xem hết bài viết của người này.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isOwnProfile && user && (
        <EditProfileModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          user={{
            _id: user._id,
            displayName: user.displayName,
            bio: user.bio || ''
          }}
        />
      )}
    </div>
  );
}
