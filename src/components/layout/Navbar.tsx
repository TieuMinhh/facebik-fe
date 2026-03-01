'use client';

import Link from 'next/link';
import { Search, Home, Users, Store, Play, Menu, Bell, MessageCircle, LogOut, Settings, HelpCircle, Moon, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import authService from '@/features/auth/services/authService';
import { useRouter } from 'next/navigation';
import { useNotifications, useMarkAsRead } from '@/features/notification/hooks/useNotifications';
import { useSocket } from '@/providers/SocketProvider';
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSearch } from '@/features/user/hooks/useSearch';
import { useState } from 'react';

interface Notification {
  _id: string;
  senderId: {
    _id: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { socket } = useSocket();
  const { data: notificationsData, refetch } = useNotifications();
  const markAsRead = useMarkAsRead();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults, isLoading: isSearchLoading } = useSearch(searchQuery);

  const notifications: Notification[] = notificationsData?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      refetch();
    };

    socket.on('new_notification', handleNewNotification);
    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket, refetch]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleNotificationClick = (id: string) => {
    markAsRead.mutate(id);
  };

  return (
    <nav className="sticky top-0 z-50 flex h-14 w-full items-center justify-between bg-white px-4 shadow-sm dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
      {/* Left */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white transition-opacity hover:opacity-90">
          f
        </Link>
        <div className="hidden md:block relative">
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 dark:bg-zinc-800">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm trên Facebook"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm outline-none placeholder:text-gray-500 w-48 lg:w-60"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchQuery.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full min-w-[300px] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 z-50 overflow-hidden">
              <div className="max-h-[60vh] overflow-y-auto py-2">
                {isSearchLoading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded" />
                      </div>
                    ))}
                  </div>
                ) : searchResults?.data?.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm italic">
                    Không tìm thấy kết quả nào cho &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  searchResults?.data?.map((res: { _id: string; avatar?: string; displayName: string; username: string }) => (
                    <div
                      key={res._id}
                      onClick={() => {
                        router.push(`/profile/${res._id}`);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-2 mx-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={res.avatar} />
                        <AvatarFallback>{res.displayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {res.displayName}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          @{res.username}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-6 w-6" />
        </Button>
      </div>

      {/* Middle - Navigation */}
      <div className="hidden flex-1 items-center justify-center gap-2 md:flex max-w-lg lg:max-w-xl">
        <Link href="/" className="group relative flex h-14 w-24 items-center justify-center border-b-4 border-blue-600">
          <Home className="h-7 w-7 text-blue-600" />
          <span className="absolute -bottom-1 h-1 w-full rounded-t-lg bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></span>
        </Link>
        <Link href="/friends" className="flex h-14 w-24 items-center justify-center border-b-4 border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <Users className="h-7 w-7 text-gray-500" />
        </Link>
        <Link href="/watch" className="flex h-14 w-24 items-center justify-center border-b-4 border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <Play className="h-7 w-7 text-gray-500" />
        </Link>
        <Link href="/market" className="flex h-14 w-24 items-center justify-center border-b-4 border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <Store className="h-7 w-7 text-gray-500" />
        </Link>
        <Link href="/groups" className="hidden lg:flex h-14 w-24 items-center justify-center border-b-4 border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <Menu className="h-7 w-7 text-gray-500" />
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="icon" className="rounded-full bg-gray-100 dark:bg-zinc-800 lg:flex hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="secondary" size="icon" className="rounded-full bg-gray-100 dark:bg-zinc-800">
          <MessageCircle className="h-5 w-5" />
        </Button>
        
        {/* Notification Bell */}
        <Popover>
          <PopoverTrigger>
            <div className="relative cursor-pointer group flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
              <Bell className="h-5 w-5 text-gray-700 dark:text-zinc-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-white dark:border-zinc-900 shadow-sm transition-transform group-hover:scale-110">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 rounded-xl overflow-hidden shadow-2xl border-gray-200 dark:border-zinc-800 mt-2" align="end">
            <div className="p-4 flex items-center justify-between border-b dark:border-zinc-800 bg-white dark:bg-zinc-900">
               <h3 className="text-xl font-bold">Thông báo</h3>
               <Button variant="link" className="text-sm p-0 h-auto font-medium text-blue-600">Xem tất cả</Button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto scrollbar-hide py-2 dark:bg-zinc-900">
               {notifications.length === 0 ? (
                 <p className="p-10 text-center text-gray-500 italic text-sm">Bạn chưa có thông báo nào.</p>
               ) : (
                 notifications.map((notif: Notification) => (
                   <div 
                    key={notif._id} 
                    onClick={() => handleNotificationClick(notif._id)}
                    className={`flex items-start gap-3 p-3 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                     <Avatar className="h-14 w-14 border border-gray-100 dark:border-zinc-800">
                        <AvatarImage src={notif.senderId?.avatar} />
                        <AvatarFallback>{notif.senderId?.displayName?.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col flex-1 gap-0.5">
                        <p className={`text-[13px] leading-tight ${!notif.isRead ? 'font-semibold' : 'font-normal'}`}>
                          <span className="font-bold">{notif.senderId?.displayName}</span> {notif.content}
                        </p>
                        <span className={`text-[11px] ${!notif.isRead ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                        </span>
                     </div>
                     {!notif.isRead && (
                        <div className="mt-2 h-3 w-3 rounded-full bg-blue-600 self-center"></div>
                     )}
                   </div>
                 ))
               )}
            </div>
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-10 w-10 rounded-full p-0 flex cursor-pointer items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <Avatar className="h-10 w-10 border border-gray-200 dark:border-zinc-700">
              <AvatarImage src={user?.avatar} alt={user?.displayName} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {user?.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 rounded-xl shadow-2xl border-gray-200 dark:border-zinc-800" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal p-2">
                <div 
                  onClick={() => router.push(`/profile/${user?._id}`)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer shadow-sm transition-all bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800"
                >
                   <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} />
                   </Avatar>
                   <span className="font-bold text-base">{user?.displayName}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="p-2 space-y-1">
                <DropdownMenuItem className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800">
                   <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"><Settings className="h-5 w-5" /></div>
                      <span className="font-medium text-sm">Cài đặt & quyền riêng tư</span>
                   </div>
                   <ChevronRight className="h-5 w-5 text-gray-500" />
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800">
                   <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"><HelpCircle className="h-5 w-5" /></div>
                      <span className="font-medium text-sm">Trợ giúp & hỗ trợ</span>
                   </div>
                   <ChevronRight className="h-5 w-5 text-gray-500" />
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800">
                   <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"><Moon className="h-5 w-5" /></div>
                      <span className="font-medium text-sm">Màn hình & trợ năng</span>
                   </div>
                   <ChevronRight className="h-5 w-5 text-gray-500" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 transition-colors">
                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"><LogOut className="h-5 w-5" /></div>
                   <span className="font-bold text-sm">Đăng xuất</span>
                </DropdownMenuItem>
             </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
