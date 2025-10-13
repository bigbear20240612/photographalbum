'use client';

import Link from 'next/link';
import type { Conversation } from '@/lib/apiService';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ConversationCardProps {
  conversation: Conversation;
  currentUserId: string;
  isActive?: boolean;
}

export default function ConversationCard({
  conversation,
  currentUserId,
  isActive = false,
}: ConversationCardProps) {
  const { otherUser, lastMessage, unreadCount, lastMessageAt } = conversation;

  // 截取最后一条消息预览
  const messagePreview = lastMessage
    ? lastMessage.content.length > 50
      ? lastMessage.content.slice(0, 50) + '...'
      : lastMessage.content
    : '暂无消息';

  // 判断最后一条消息是否是我发送的
  const lastMessageFromMe = lastMessage?.senderId === currentUserId;

  return (
    <Link
      href={`/messages/${otherUser.username}`}
      className={`block p-4 border-b border-border-light hover:bg-warm-beige/30 transition-colors ${
        isActive ? 'bg-warm-beige/50' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* 用户头像 */}
        <div className="flex-shrink-0">
          {otherUser.avatarUrl ? (
            <img
              src={otherUser.avatarUrl}
              alt={otherUser.displayName || otherUser.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terra-cotta to-amber-gold flex items-center justify-center text-white font-medium">
              {(otherUser.displayName || otherUser.username)[0]}
            </div>
          )}
        </div>

        {/* 对话信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-charcoal truncate">
              {otherUser.displayName || otherUser.username}
            </h3>
            {lastMessageAt && (
              <span className="text-xs text-warm-gray flex-shrink-0 ml-2">
                {formatDistanceToNow(new Date(lastMessageAt), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p
              className={`text-sm truncate ${
                unreadCount > 0 ? 'text-charcoal font-medium' : 'text-warm-gray'
              }`}
            >
              {lastMessageFromMe && '我: '}
              {messagePreview}
            </p>
            {unreadCount > 0 && (
              <span className="flex-shrink-0 ml-2 px-2 py-0.5 bg-terra-cotta text-white text-xs rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
