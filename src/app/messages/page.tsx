'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import ConversationCard from '@/components/messages/ConversationCard';
import { messageApi, type Conversation } from '@/lib/apiService';
import { useToast } from '@/components/ui/Toast';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/messages');
      return;
    }

    if (status === 'authenticated') {
      loadConversations();
    }
  }, [status, router]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await messageApi.getConversations();
      setConversations(response.conversations);
    } catch (error) {
      console.error('加载对话列表失败:', error);
      showToast('error', '加载对话列表失败');
    } finally {
      setIsLoading(false);
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

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* 页头 */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal">
              消息
            </h1>
            <p className="text-warm-gray mt-2">与其他摄影师交流</p>
          </div>

          {/* 对话列表 */}
          <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
            {conversations.length === 0 ? (
              <div className="text-center py-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-warm-gray/30 mx-auto mb-4"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <line x1="9" y1="10" x2="15" y2="10" />
                  <line x1="12" y1="14" x2="12" y2="14" />
                </svg>
                <p className="text-warm-gray text-lg">暂无对话</p>
                <p className="text-warm-gray/70 text-sm mt-2">
                  访问摄影师的个人主页，点击"发私信"开始对话
                </p>
              </div>
            ) : (
              <div>
                {conversations.map((conversation) => (
                  <ConversationCard
                    key={conversation.id}
                    conversation={conversation}
                    currentUserId={session.user.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
