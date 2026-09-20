import React, { useState, useRef } from 'react';
import { UploadCloud, Sparkles } from 'lucide-react';

interface AiScanDropzoneProps {
  onImageSelected: (file: File) => void;
  isLoading?: boolean;
  className?: string;
}

export const AiScanDropzone: React.FC<AiScanDropzoneProps> = ({
  onImageSelected,
  isLoading = false,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelected(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      className={`card-empty-state ${isDragOver ? 'drag-over' : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Khu vực kéo thả hoặc bấm để tải ảnh đĩa ăn phân tích calo bằng AI"
      style={{
        border: `2px dashed ${
          isDragOver ? 'var(--color-brand-primary)' : 'var(--color-border-default)'
        }`,
        backgroundColor: isDragOver
          ? 'var(--color-brand-tint)'
          : 'var(--color-bg-surface-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--spacing-8) var(--spacing-6)',
        cursor: 'pointer',
        outline: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 'var(--spacing-3)',
        transition: 'all 0.2s ease-out',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        aria-label="Chọn tệp ảnh đĩa ăn từ máy tính"
        tabIndex={-1}
      />

      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-brand-tint)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-brand-primary)',
          marginBottom: 'var(--spacing-1)',
        }}
      >
        {isLoading ? (
          <Sparkles size={28} className="animate-spin" aria-hidden="true" />
        ) : (
          <UploadCloud size={28} aria-hidden="true" />
        )}
      </div>

      <div>
        <h4
          style={{
            fontSize: 'var(--text-heading-3)',
            fontWeight: 'var(--font-weight-heading-3)',
            color: 'var(--color-text-primary)',
            marginBottom: '4px',
          }}
          className="text-balance"
        >
          {isLoading ? 'Đang phân tích ảnh món ăn...' : 'Kéo thả ảnh đĩa ăn vào đây'}
        </h4>
        <p
          style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-secondary)',
            maxWidth: '380px',
          }}
          className="text-pretty"
        >
          Hỗ trợ JPG, PNG, WEBP • AI tự động nhận diện thành phần, khối lượng gram và ước tính Calo
        </p>
      </div>

      <button
        type="button"
        className="btn btn-ai"
        style={{
          marginTop: 'var(--spacing-2)',
          padding: '10px 20px',
          fontSize: 'var(--text-body-medium)',
        }}
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        aria-label="Chọn ảnh từ thiết bị để bắt đầu phân tích calo"
        disabled={isLoading}
      >
        <Sparkles size={16} aria-hidden="true" />
        <span>{isLoading ? 'Đang xử lý AI...' : '✨ Bắt đầu phân tích Calo'}</span>
      </button>
    </div>
  );
};
