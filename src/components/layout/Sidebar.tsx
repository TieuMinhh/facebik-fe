'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, UserPlus, Heart, Flag, Bookmark, Info, Store, Play, Clock, ChevronDown } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode | string;
  label: string;
  href?: string;
  isAvatar?: boolean;
}

const SidebarItem = ({ icon, label, href = '#', isAvatar = false }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-800"
    >
      {isAvatar ? (
        <Avatar className="h-9 w-9 border border-gray-200 dark:border-zinc-700">
          <AvatarImage src={typeof icon === 'string' ? icon : undefined} />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold uppercase">
            {label.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full">
          {icon}
        </div>
      )}
      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  const { user } = useAuthStore();

  return (
    <div className="h-full w-full overflow-y-auto px-2 py-4 scrollbar-hide hover:scrollbar-default">
      {/* User Section */}
      <SidebarItem
        icon={user?.avatar || ''}
        label={user?.displayName || 'Người dùng'}
        href={`/profile/${user?._id}`}
        isAvatar
      />

      <div className="mt-2 flex flex-col gap-1">
        <SidebarItem
          icon={<Users className="h-9 w-9 text-blue-500" />}
          label="Bạn bè"
          href="/friends"
        />
        <SidebarItem
          icon={<UserPlus className="h-9 w-9 text-blue-400" />}
          label="Nhóm"
          href="/groups"
        />
        <SidebarItem
          icon={<Heart className="h-9 w-9 text-blue-500" />}
          label="Kỷ niệm"
          href="/memories"
        />
        <SidebarItem
          icon={<Bookmark className="h-9 w-9 text-purple-600" />}
          label="Đã lưu"
          href="/saved"
        />
        <SidebarItem
          icon={<Flag className="h-9 w-9 text-orange-600" />}
          label="Trang"
          href="/pages"
        />
        <SidebarItem
          icon={<Store className="h-9 w-9 text-blue-600" />}
          label="Marketplace"
          href="/market"
        />
        <SidebarItem
          icon={<Play className="h-9 w-9 text-blue-600" />}
          label="Video"
          href="/watch"
        />
        <SidebarItem
          icon={<Clock className="h-9 w-9 text-blue-300" />}
          label="Gần đây nhất"
          href="/recent"
        />
        <SidebarItem
          icon={<div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-800"><ChevronDown className="h-6 w-6" /></div>}
          label="Xem thêm"
        />
      </div>

      <div className="my-4 border-t border-gray-300 dark:border-zinc-800 mx-2" />

      <div className="px-2 pb-10">
        <h3 className="mb-2 text-base font-semibold text-gray-500 dark:text-zinc-400">
          Lối tắt của bạn
        </h3>
        {/* Placeholder group/game links */}
        <SidebarItem
          icon={<Info className="h-9 w-9 text-gray-400" />}
          label="Facebook Clone Pro"
          href="#"
        />
        <p className="mt-4 px-2 text-[12px] text-gray-500 dark:text-zinc-500 leading-tight">
          Quyền riêng tư · Điều khoản · Quảng cáo · Lựa chọn quảng cáo · Cookie · Xem thêm · Meta © 2026
        </p>
      </div>
    </div>
  );
}
