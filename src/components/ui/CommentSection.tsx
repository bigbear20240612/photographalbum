'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { commentApi, type Comment } from '@/lib/apiService';
import { useToast } from './Toast';
import { ApiError } from '@/lib/api';
import Button from './Button';

interface CommentSectionProps {
  photoId: string;
  className?: string;
}

export default function CommentSection({ photoId, className = '' }: CommentSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // 获取评论列表
  useEffect(() => {
    fetchComments();
  }, [photoId]);

  const fetchComments = async () => {
    try {
      const response = await commentApi.getComments(photoId);
      setComments(response.comments);
    } catch (error) {
      console.error('获取评论失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 发表评论
  const handleSubmitComment = async () => {
    if (!session) {
      showToast('info', '请先登录');
      router.push('/login');
      return;
    }

    if (!newComment.trim()) {
      showToast('error', '评论内容不能为空');
      return;
    }

    setIsSubmitting(true);

    try {
      await commentApi.createComment(photoId, {
        content: newComment.trim(),
        parentId: replyTo || undefined,
      });

      showToast('success', replyTo ? '回复成功' : '评论成功');
      setNewComment('');
      setReplyTo(null);
      fetchComments();
    } catch (error) {
      if (error instanceof ApiError) {
        showToast('error', error.message);
      } else {
        showToast('error', '发表评论失败');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 更新评论
  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) {
      showToast('error', '评论内容不能为空');
      return;
    }

    try {
      await commentApi.updateComment(commentId, editContent.trim());
      showToast('success', '评论更新成功');
      setEditingId(null);
      setEditContent('');
      fetchComments();
    } catch (error) {
      if (error instanceof ApiError) {
        showToast('error', error.message);
      } else {
        showToast('error', '更新评论失败');
      }
    }
  };

  // 删除评论
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗?')) return;

    try {
      await commentApi.deleteComment(commentId);
      showToast('success', '评论已删除');
      fetchComments();
    } catch (error) {
      if (error instanceof ApiError) {
        showToast('error', error.message);
      } else {
        showToast('error', '删除评论失败');
      }
    }
  };

  // 渲染单条评论
  const renderComment = (comment: Comment, isReply = false) => {
    const isEditing = editingId === comment.id;
    const isOwner = session?.user?.id === comment.userId;

    return (
      <div
        key={comment.id}
        className={`${isReply ? 'ml-12 mt-4' : 'mt-4'} p-4 rounded-lg bg-white/5`}
      >
        <div className="flex items-start gap-3">
          {/* 头像 */}
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
            {comment.user.displayName?.[0] || comment.user.username?.[0]}
          </div>

          <div className="flex-1">
            {/* 用户名和时间 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{comment.user.displayName || comment.user.username}</span>
              <span className="text-sm text-white/50">
                {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
              </span>
            </div>

            {/* 评论内容 */}
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdateComment(comment.id)}>
                    保存
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setEditContent('');
                    }}
                  >
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-white/80">{comment.content}</p>
            )}

            {/* 操作按钮 */}
            {!isEditing && (
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  回复
                </button>
                {isOwner && (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      删除
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 回复列表 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className={`text-center py-8 ${className}`}>加载评论中...</div>;
  }

  return (
    <div className={className}>
      <h3 className="text-xl font-semibold mb-4">评论 ({comments.length})</h3>

      {/* 评论输入框 */}
      {session ? (
        <div className="mb-6">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 text-sm text-white/70">
              <span>回复评论</span>
              <button onClick={() => setReplyTo(null)} className="text-red-400 hover:text-red-300">
                取消
              </button>
            </div>
          )}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyTo ? '写下你的回复...' : '写下你的评论...'}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <Button onClick={handleSubmitComment} disabled={isSubmitting}>
              {isSubmitting ? '发表中...' : replyTo ? '发表回复' : '发表评论'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-lg bg-white/5 text-center">
          <p className="text-white/70 mb-2">登录后即可评论</p>
          <Button onClick={() => router.push('/login')}>立即登录</Button>
        </div>
      )}

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-white/50 py-8">暂无评论,快来发表第一条评论吧!</p>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
}
