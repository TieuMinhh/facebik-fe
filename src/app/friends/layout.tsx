import FriendsSidebar from '@/features/friends/components/FriendsSidebar';
import Navbar from '@/components/layout/Navbar';

export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F0F2F5] dark:bg-zinc-950">
      <Navbar />
      <div className="flex flex-1 pt-14">
        <FriendsSidebar />
        <main className="flex-1 lg:ml-[280px]">
          {children}
        </main>
      </div>
    </div>
  );
}
