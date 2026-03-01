'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserPlus, Gift, List, Settings, ChevronRight, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFriends } from '../hooks/useFriends';

const sidebarItems = [
  {
    icon: <Users className="h-5 w-5" />,
    label: 'Trang chủ',
    href: '/friends',
    activePath: '/friends',
  },
  {
    icon: <UserCheck className="h-5 w-5" />,
    label: 'Lời mời kết bạn',
    href: '/friends/requests',
    activePath: '/friends/requests',
  },
  {
    icon: <UserPlus className="h-5 w-5" />,
    label: 'Gợi ý',
    href: '/friends/suggestions',
    activePath: '/friends/suggestions',
  },
  {
    icon: <List className="h-5 w-5" />,
    label: 'Tất cả bạn bè',
    href: '/friends/all',
    activePath: '/friends/all',
  },
  {
    icon: <Gift className="h-5 w-5" />,
    label: 'Sinh nhật',
    href: '/friends/birthdays',
    activePath: '/friends/birthdays',
  },
  {
    icon: <List className="h-5 w-5" />,
    label: 'Danh sách tùy chỉnh',
    href: '/friends/custom',
    activePath: '/friends/custom',
  },
];

export default function FriendsSidebar() {
  const pathname = usePathname();
  const { requests } = useFriends();
  const pendingCount = requests?.length || 0;

  return (
    <div className="fixed left-0 top-14 hidden h-[calc(100vh-3.5rem)] w-[280px] flex-col border-r border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bạn bè</h1>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
           <Settings className="h-5 w-5 text-gray-600 dark:text-zinc-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.activePath;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-2 py-3 transition-colors",
                isActive 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                  : "text-gray-700 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  isActive ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-zinc-800"
                )}>
                  {item.icon}
                </div>
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.label === 'Lời mời kết bạn' && pendingCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
                    {pendingCount}
                  </span>
                )}
                <ChevronRight className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-gray-400")} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
