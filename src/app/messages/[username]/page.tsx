'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import MessageList from '@/components/messages/MessageList';
import MessageInput from '@/components/messages/MessageInput';
import { messageApi, userApi, type Message } from '@/lib/apiService';
import { useToast } from '@/components/ui/Toast';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function ConversationPage({ params }: PageProps) {
  const { username } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/messages/${username}`);
      return;
    }

    if (status === 'authenticated') {
      loadConversation();
    }
  }, [status, username, router]);

  const loadConversation = async () => {
    try {
      setIsLoading(true);

      // 获取对方用户信息
      const userResponse = await userApi.getUserByUsername(username);
      setOtherUser(userResponse.user);

      // 加载消息
      const messagesResponse = await messageApi.getMessages({
        otherUserId: userResponse.user.id,
        limit: 50,
      });
      setMessages(messagesResponse.messages);
    } catch (error) {
      console.error('加载对话失败:', error);
      showToast('error', '加载对话失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!otherUser || !session) return;

    try {
      const response = await messageApi.sendMessage({
        receiverId: otherUser.id,
        content,
      });

      // 添加新消息到列表
      setMessages((prev) => [...prev, response.message]);
      showToast('success', '消息已发送');
    } catch (error) {
      console.error('发送消息失败:', error);
      showToast('error', '发送消息失败，请重试');
      throw error;
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <Container>
          <div className="text-center py-20">
            <p className="text-warm-gray">加载中...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!session || !otherUser) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-0 flex flex-col">
      {/* 对话头部 */}
      <div className="bg-white border-b border-border-light sticky top-20 z-10">
        <Container>
          <div className="flex items-center gap-4 py-4">
            {/* 返回按钮 */}
            <Link
              href="/messages"
              className="text-warm-gray hover:text-terra-cotta transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>

            {/* 对方用户信息 */}
            <Link
              href={`/photographer/${username}`}
              className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
            >
              {otherUser.avatarUrl ? (
                <img
                  src={otherUser.avatarUrl}
                  alt={otherUser.displayName || otherUser.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-terra-cotta to-amber-gold flex items-center justify-center text-white font-medium">
                  {(otherUser.displayName || otherUser.username)[0]}
                </div>
              )}
              <div>
                <h2 className="font-medium text-charcoal">
                  {otherUser.displayName || otherUser.username}
                </h2>
                {otherUser.bio && (
                  <p className="text-sm text-warm-gray truncate max-w-xs">
                    {otherUser.bio}
                  </p>
                )}
              </div>
            </Link>
          </div>
        </Container>
      </div>

      {/* 消息列表容器 */}
      <div className="flex-1 bg-warm-beige/20 flex flex-col max-w-5xl mx-auto w-full">
        <MessageList
          messages={messages}
          currentUserId={session.user.id}
          isLoading={false}
        />

        {/* 消息输入框 */}
        <MessageInput
          onSend={handleSendMessage}
          placeholder={`给 ${otherUser.displayName || otherUser.username} 发消息...`}
        />
      </div>
    </div>
  );
}
