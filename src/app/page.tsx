'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import CreatePost from '@/features/post/components/CreatePost';
import PostCard from '@/features/post/components/PostCard';
import Stories from '@/features/post/components/Stories';
import { usePosts } from '@/features/post/services/usePosts';

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

import RightSidebar from '@/components/layout/RightSidebar';

export default function Home() {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    status 
  } = usePosts();
  
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F2F5] dark:bg-zinc-950 transition-colors duration-200">
      <Navbar />

      <main className="flex w-full flex-1 max-w-[1920px] mx-auto">
        {/* Left Sidebar */}
        <aside className="hidden w-[280px] lg:w-[320px] xl:w-[360px] flex-col lg:flex sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden">
          <Sidebar />
        </aside>

        {/* Center - Feed */}
        <section className="flex flex-1 flex-col items-center py-6 px-2 md:px-4 lg:px-8">
           <div className="flex w-full max-w-[680px] flex-col gap-4">
             {/* Stories Section */}
             <Stories />

             <CreatePost />

             <div className="flex flex-col gap-4">
                {status === 'pending' ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-[300px] w-full rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 animate-pulse" />
                  ))
                ) : status === 'error' ? (
                  <div className="p-10 text-center text-gray-500">Lỗi khi tải bảng tin. Vui lòng thử lại sau.</div>
                ) : (
                  data?.pages.map((page, i) => (
                    <div key={i} className="flex flex-col gap-4">
                      {page.data.map((post: Post) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                    </div>
                  ))
                )}
             </div>
             
             {/* Infinite Scroll Trigger */}
             <div ref={ref} className="py-4 flex justify-center">
                {isFetchingNextPage ? (
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                ) : hasNextPage ? (
                  <div className="h-1" />
                ) : (
                  <p className="text-gray-500 text-sm italic">Hết rồi đạo hữu ơi! Đăng thêm bài đi nào.</p>
                )}
             </div>
           </div>
        </section>

        {/* Right Sidebar - Contacts */}
        <aside className="hidden xl:flex w-[280px] xl:w-[340px] sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden">
          <RightSidebar />
        </aside>
      </main>
    </div>
  );
}
