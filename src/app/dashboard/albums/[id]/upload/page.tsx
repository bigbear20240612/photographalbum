'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { albumApi, photoApi } from '@/lib/apiService';
import type { Album } from '@/types';

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  title: string;
  description: string;
}

export default function UploadPhotosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 加载专辑数据
  useEffect(() => {
    const loadAlbum = async () => {
      try {
        const response = await albumApi.getAlbumById(id);
        console.log('Loaded album:', response.album); // Debug log
        setAlbum(response.album);
      } catch (error: any) {
        console.error('加载专辑失败:', error);
        toast.error('加载专辑失败');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadAlbum();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-soft-white pt-24 pb-16">
        <Container>
          <div className="text-center py-16">
            <p className="text-warm-gray">加载中...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-soft-white pt-24 pb-16">
        <Container>
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              专辑不存在
            </h2>
            <Button variant="primary" onClick={() => router.push('/dashboard')}>
              返回工作台
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addPhotos(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addPhotos(files);
  };

  const addPhotos = (files: File[]) => {
    const imageFiles = files.filter((file) =>
      file.type.startsWith('image/')
    );

    const newPhotos: UploadedPhoto[] = imageFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: '',
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const updatePhoto = (photoId: string, field: 'title' | 'description', value: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, [field]: value } : p))
    );
  };

  const handleUpload = async () => {
    if (photos.length === 0) {
      toast.error('请先选择照片');
      return;
    }

    setIsUploading(true);

    try {
      // 准备上传数据
      const files = photos.map(p => p.file);
      const metadata = photos.map(p => ({
        title: p.title,
        description: p.description || undefined,
      }));

      // 调用真实的 API 上传照片
      const response = await photoApi.uploadPhotos({
        albumId: id,
        files,
        metadata,
      });

      const successCount = response.results.filter(r => r.success).length;
      const failCount = response.results.length - successCount;

      if (failCount > 0) {
        toast.error(`${successCount} 张照片上传成功，${failCount} 张失败`);
      } else {
        toast.success(`成功上传 ${successCount} 张照片！`);
      }

      // 跳转到专辑详情页
      router.push(`/dashboard`);
    } catch (error: any) {
      console.error('上传照片失败:', error);
      toast.error(error.message || '上传照片失败，请稍后重试');
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-white pt-24 pb-16">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">
              上传照片
            </h1>
            <p className="text-warm-gray">
              上传照片到专辑 &quot;{album?.title || '未命名专辑'}&quot;
            </p>
          </div>

          {/* 上传区域 */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              isDragging
                ? 'border-terra-cotta bg-terra-cotta/5'
                : 'border-border-medium bg-warm-beige/20 hover:border-terra-cotta hover:bg-warm-beige/40'
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="pointer-events-none">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-terra-cotta to-amber-gold flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">
                {isDragging ? '松开鼠标上传' : '拖拽照片到这里'}
              </h3>
              <p className="text-warm-gray mb-4">
                或点击选择文件
              </p>
              <p className="text-sm text-light-gray">
                支持 JPG、PNG 格式，单次最多上传 50 张
              </p>
            </div>
          </div>

          {/* 已选择的照片列表 */}
          {photos.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-charcoal">
                  已选择 {photos.length} 张照片
                </h2>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setPhotos([])}
                >
                  清空
                </Button>
              </div>

              <div className="space-y-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="glass-light rounded-xl p-4 flex gap-4"
                  >
                    {/* 缩略图 */}
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-warm-beige">
                      <img
                        src={photo.preview}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* 照片信息 */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1">
                          照片标题
                        </label>
                        <input
                          type="text"
                          value={photo.title}
                          onChange={(e) =>
                            updatePhoto(photo.id, 'title', e.target.value)
                          }
                          placeholder="为这张照片起个名字"
                          className="w-full px-3 py-2 rounded-lg border border-border-light bg-white focus:border-terra-cotta focus:outline-none focus:ring-2 focus:ring-terra-cotta/20 transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1">
                          照片描述（可选）
                        </label>
                        <textarea
                          value={photo.description}
                          onChange={(e) =>
                            updatePhoto(photo.id, 'description', e.target.value)
                          }
                          placeholder="描述拍摄场景、相机参数等..."
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-border-light bg-white focus:border-terra-cotta focus:outline-none focus:ring-2 focus:ring-terra-cotta/20 transition-colors text-sm resize-none"
                        />
                      </div>
                    </div>

                    {/* 删除按钮 */}
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-red-50 text-warm-gray hover:text-red-600 transition-colors flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* 上传按钮 */}
              <div className="flex gap-4 mt-8">
                <Button
                  variant="secondary"
                  onClick={() => router.back()}
                  disabled={isUploading}
                >
                  取消
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? '上传中...' : `上传 ${photos.length} 张照片`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
