'use client';

import { Camera, Edit2, Plus, MessageCircle, MoreHorizontal, UserPlus, UserCheck, Clock, UserX, UserMinus, ShieldAlert } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useChatStore } from '@/features/chat/components/ChatManager';
import { useGetOrCreateConversation } from '@/features/chat/hooks/useChat';
import { toast } from 'sonner';
import { 
  useSendFriendRequest, 
  useAcceptFriendRequest, 
  useCancelFriendRequest, 
  useUnfriend, 
  useFollow, 
  useUnfollow,
  useUpdateProfile 
} from '../hooks/useUser';
import EditProfileModal from './EditProfileModal';
import ImageCropDialog from './ImageCropDialog';
import { useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ProfileHeaderProps {
  user: {
    _id: string;
    username: string;
    displayName: string;
    avatar?: string;
    cover?: string;
    bio?: string;
    friendStatus?: 'none' | 'pending' | 'friends' | 'received';
    requestId?: string;
    isFollowing?: boolean;
    friends?: string[];
    mutualFriendsCount?: number;
  };
  isOwnProfile: boolean;
}

export default function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const { openChat } = useChatStore();
  const getOrCreateConversation = useGetOrCreateConversation();
  const sendFriendRequest = useSendFriendRequest();
  const acceptFriendRequest = useAcceptFriendRequest();
  const cancelFriendRequest = useCancelFriendRequest();
  const unfriend = useUnfriend();
  const follow = useFollow();
  const unfollow = useUnfollow();
  const updateProfile = useUpdateProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropAspect, setCropAspect] = useState(1);
  const [cropType, setCropType] = useState<'avatar' | 'cover'>('avatar');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setCropType(type);
        setCropAspect(type === 'avatar' ? 1 : 16 / 9);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
      // Reset input value so same file can be selected again
      e.target.value = '';
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append(cropType, croppedBlob, `${cropType}.jpg`);
      
      const promise = updateProfile.mutateAsync(formData);
      toast.promise(promise, {
        loading: `Đang tải ${cropType === 'avatar' ? 'ảnh đại diện' : 'ảnh bìa'} lên...`,
        success: `Đã cập nhật ${cropType === 'avatar' ? 'ảnh đại diện' : 'ảnh bìa'} thành công!`,
        error: `Không thể cập nhật ${cropType === 'avatar' ? 'ảnh đại diện' : 'ảnh bìa'}.`,
      });
    } catch {
      toast.error('Có lỗi xảy ra khi xử lý ảnh.');
    }
  };

  const handleMessageClick = async () => {
    try {
      const response = await getOrCreateConversation.mutateAsync(user?._id);
      openChat({
        conversationId: response.data._id,
        receiver: {
          _id: user?._id,
          displayName: user?.displayName,
          avatar: user?.avatar
        }
      });
    } catch {
      toast.error('Không thể mở cuộc trò chuyện.');
    }
  };

  const handleFriendAction = async () => {
    try {
      const status = user?.friendStatus || 'none';
      if (status === 'none') {
        await sendFriendRequest.mutateAsync(user?._id);
        toast.success('Đã gửi lời mời kết bạn.');
      } else if (status === 'received' && user?.requestId) {
        await acceptFriendRequest.mutateAsync(user.requestId);
        toast.success('Đã trở thành bạn bè.');
      }
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Thao tác không thành công.';
      toast.error(errorMessage);
    }
  };

  const renderFriendButton = () => {
    if (isOwnProfile) return null;

    switch (user.friendStatus) {
      case 'friends':
        return (
          <Button variant="secondary" className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-750 font-semibold flex gap-2">
            <UserCheck className="h-4 w-4" /> Bạn bè
          </Button>
        );
      case 'pending':
        return (
          <Button variant="secondary" className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-750 font-semibold flex gap-2">
            <Clock className="h-4 w-4" /> Đã gửi lời mời
          </Button>
        );
      case 'received':
        return (
          <Button onClick={handleFriendAction} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex gap-2">
            <UserPlus className="h-4 w-4" /> Chấp nhận lời mời
          </Button>
        );
      default:
        return (
          <Button onClick={handleFriendAction} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex gap-2">
            <UserPlus className="h-4 w-4" /> Thêm bạn bè
          </Button>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-zinc-800 pb-4">
      <div className="max-w-[1100px] mx-auto px-4">
        {/* Cover Photo */}
        <div className="relative h-[250px] md:h-[350px] lg:h-[400px] w-full rounded-b-xl overflow-hidden bg-gray-200 dark:bg-zinc-800 border-x border-b border-gray-200 dark:border-zinc-800">
           {user?.cover && (
             <Image 
               src={user?.cover} 
               alt="Cover" 
               fill 
               className="object-cover" 
             />
           )}
           {isOwnProfile && (
             <>
                <input 
                  type="file" 
                  ref={coverInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'cover')}
                />
                <Button 
                  variant="secondary" 
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute bottom-4 right-4 bg-white/90 hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-800 text-sm font-semibold flex gap-2"
                >
                  <Camera className="h-4 w-4" />
                  <span className="md:inline hidden">Thêm ảnh bìa</span>
                </Button>
             </>
           )}
        </div>

        {/* Profile Info Row */}
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4 -mt-12 md:-mt-8 px-4 md:px-8 pb-4 relative z-10">
          <div className="relative">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white dark:border-zinc-900 shadow-lg">
              <AvatarImage src={user?.avatar} alt={user?.displayName} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-4xl uppercase">
                {user?.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <>
                <input 
                  type="file" 
                  ref={avatarInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'avatar')}
                />
                <button 
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-gray-100 dark:bg-zinc-800 p-2 rounded-full border border-gray-200 dark:border-zinc-700 hover:bg-gray-200 transition-colors shadow-sm"
                >
                  <Camera className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mb-2 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-zinc-50">
              {user?.displayName}
            </h1>
            <div className="flex items-center gap-1 text-gray-500 font-medium text-sm md:text-base mt-1">
              <span>{user?.friends?.length || 0} bạn bè</span>
              {!isOwnProfile && user?.mutualFriendsCount !== undefined && user.mutualFriendsCount > 0 && (
                <>
                  <span className="mx-1">·</span>
                  <span>{user.mutualFriendsCount} bạn chung</span>
                </>
              )}
            </div>
            {user?.bio && <p className="mt-2 text-sm max-w-md italic text-gray-600 dark:text-zinc-400">{user?.bio}</p>}
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0 pb-2">
            {isOwnProfile ? (
              <>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex gap-2">
                  <Plus className="h-4 w-4" /> Thêm vào tin
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-750 font-semibold flex gap-2"
                >
                  <Edit2 className="h-4 w-4" /> Chỉnh sửa trang cá nhân
                </Button>
              </>
            ) : (
              <>
                {renderFriendButton()}
                <Button 
                  variant="secondary" 
                  onClick={handleMessageClick}
                  className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-750 font-semibold flex gap-2"
                >
                  <MessageCircle className="h-4 w-4" /> Nhắn tin
                </Button>
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-750 p-2 rounded-lg cursor-pointer">
                <MoreHorizontal className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-xl shadow-2xl border-gray-200 dark:border-zinc-800">
                {user.friendStatus === 'pending' && user.requestId && (
                  <DropdownMenuItem 
                    onClick={() => cancelFriendRequest.mutate(user.requestId!)}
                    className="flex items-center gap-3 p-3 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <UserX className="h-5 w-5" />
                    <span className="font-medium">Hủy lời mời kết bạn</span>
                  </DropdownMenuItem>
                )}
                
                {user.friendStatus === 'friends' && (
                  <DropdownMenuItem 
                    onClick={() => unfriend.mutate(user._id)}
                    className="flex items-center gap-3 p-3 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <UserMinus className="h-5 w-5" />
                    <span className="font-medium">Hủy kết bạn</span>
                  </DropdownMenuItem>
                )}

                {user.isFollowing ? (
                  <DropdownMenuItem 
                    onClick={() => unfollow.mutate(user._id)}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">Bỏ theo dõi</span>
                  </DropdownMenuItem>
                ) : (
                  !isOwnProfile && (
                    <DropdownMenuItem 
                      onClick={() => follow.mutate(user._id)}
                      className="flex items-center gap-3 p-3 cursor-pointer"
                    >
                      <Plus className="h-5 w-5" />
                      <span className="font-medium">Theo dõi</span>
                    </DropdownMenuItem>
                  )
                )}

                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer text-red-600">
                  <ShieldAlert className="h-5 w-5" />
                  <span className="font-medium">Chặn</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-2 border-t border-gray-200 dark:border-zinc-800">
           <div className="flex items-center gap-1 md:gap-4 overflow-x-auto scrollbar-hide py-1">
             {['Bài viết', 'Giới thiệu', 'Bạn bè', 'Ảnh', 'Video', 'Check-in', 'Xem thêm'].map((tab, i) => (
               <Button 
                key={tab} 
                variant="ghost" 
                className={`rounded-lg px-4 py-6 font-semibold transition-colors ${i === 0 ? 'text-blue-600 border-b-4 border-blue-600 rounded-none' : 'text-gray-500 dark:text-zinc-400'}`}
              >
                 {tab}
               </Button>
             ))}
           </div>
        </div>
      </div>

      {isOwnProfile && (
        <>
          <EditProfileModal 
            open={isEditModalOpen} 
            onOpenChange={setIsEditModalOpen} 
            user={{
              _id: user._id,
              displayName: user.displayName,
              bio: user.bio || ''
            }}
          />
          {selectedImage && (
            <ImageCropDialog
              open={cropModalOpen}
              onOpenChange={setCropModalOpen}
              imageSrc={selectedImage}
              aspect={cropAspect}
              shape={cropType === 'avatar' ? 'round' : 'rect'}
              onCropComplete={handleCropComplete}
              title={cropType === 'avatar' ? 'Chỉnh sửa ảnh đại diện' : 'Chỉnh sửa ảnh bìa'}
            />
          )}
        </>
      )}
    </div>
  );
}
