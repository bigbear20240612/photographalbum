'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/apiService';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
}

export default function MessageList({
  messages,
  currentUserId,
  isLoading = false,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-warm-gray">加载消息中...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-warm-gray/30 mx-auto mb-4"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p className="text-warm-gray">暂无消息，开始对话吧</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => {
        const isSentByMe = message.senderId === currentUserId;

        return (
          <div
            key={message.id}
            className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] ${
                isSentByMe
                  ? 'bg-terra-cotta text-white'
                  : 'bg-warm-beige text-charcoal'
              } rounded-2xl px-4 py-3`}
            >
              {/* 发送者信息 */}
              {!isSentByMe && (
                <div className="flex items-center gap-2 mb-2">
                  {message.sender.avatarUrl ? (
                    <img
                      src={message.sender.avatarUrl}
                      alt={message.sender.displayName || message.sender.username}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-terra-cotta to-amber-gold flex items-center justify-center text-white text-xs font-medium">
                      {(message.sender.displayName || message.sender.username)[0]}
                    </div>
                  )}
                  <span className="text-sm font-medium">
                    {message.sender.displayName || message.sender.username}
                  </span>
                </div>
              )}

              {/* 消息内容 */}
              <p className="whitespace-pre-wrap break-words">{message.content}</p>

              {/* 时间戳 */}
              <p
                className={`text-xs mt-2 ${
                  isSentByMe ? 'text-white/70' : 'text-warm-gray'
                }`}
              >
                {formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                  locale: zhCN,
                })}
                {isSentByMe && !message.read && ' · 未读'}
                {isSentByMe && message.read && ' · 已读'}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
