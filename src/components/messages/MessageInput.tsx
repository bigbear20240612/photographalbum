'use client';

import { useState, FormEvent } from 'react';

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSend,
  disabled = false,
  placeholder = '输入消息...',
}: MessageInputProps) {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSending || disabled) {
      return;
    }

    setIsSending(true);
    try {
      await onSend(content.trim());
      setContent('');
    } catch (error) {
      console.error('发送消息失败:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter 发送
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border-light bg-white p-4">
      <div className="flex gap-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSending}
          rows={3}
          maxLength={2000}
          className="flex-1 px-4 py-3 rounded-lg border border-warm-gray/30
                     focus:border-terra-cotta focus:outline-none resize-none
                     disabled:bg-warm-beige/30 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!content.trim() || isSending || disabled}
          className="self-end px-6 py-3 bg-terra-cotta text-white rounded-lg
                     hover:bg-terra-cotta/90 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     font-medium whitespace-nowrap"
        >
          {isSending ? '发送中...' : '发送'}
        </button>
      </div>
      <p className="text-xs text-warm-gray mt-2">
        按 Ctrl/Cmd + Enter 快速发送 • {content.length}/2000
      </p>
    </form>
  );
}
