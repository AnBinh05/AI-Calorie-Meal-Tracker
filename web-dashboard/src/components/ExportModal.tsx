import React, { useState, useEffect, useRef } from 'react';
import { Download, FileText, Table, X } from 'lucide-react';
import { api } from '../services/api';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState<'csv' | 'pdf'>('pdf');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [exporting, setExporting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setExporting(true);
      await api.downloadExport(format, startDate, endDate);
      onClose();
    } catch (e) {
      alert('Không thể xuất báo cáo. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        aria-describedby="export-modal-desc"
        style={{
          maxWidth: '520px',
          padding: 'var(--spacing-6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-5)' }}>
          <div>
            <h3
              id="export-modal-title"
              style={{ fontSize: 'var(--text-heading-2)', fontWeight: 'var(--font-weight-heading-2)', color: 'var(--color-text-primary)' }}
            >
              Xuất báo cáo dinh dưỡng
            </h3>
            <p
              id="export-modal-desc"
              style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-secondary)', marginTop: '2px' }}
            >
              Tải xuống dữ liệu nhật ký bữa ăn và thống kê macro
            </p>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Đóng hộp thoại xuất báo cáo"
            type="button"
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="form-group">
          <label className="form-label" id="export-format-label">
            Định dạng tệp
          </label>
          <div
            role="radiogroup"
            aria-labelledby="export-format-label"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}
          >
            <button
              type="button"
              role="radio"
              aria-checked={format === 'pdf'}
              onClick={() => setFormat('pdf')}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: format === 'pdf' ? 'var(--color-brand-tint)' : 'var(--color-bg-surface-subtle)',
                border: format === 'pdf' ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border-default)',
                color: format === 'pdf' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <FileText size={18} aria-hidden="true" />
              Báo cáo PDF
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={format === 'csv'}
              onClick={() => setFormat('csv')}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: format === 'csv' ? 'var(--color-brand-tint)' : 'var(--color-bg-surface-subtle)',
                border: format === 'csv' ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border-default)',
                color: format === 'csv' ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Table size={18} aria-hidden="true" />
              Bảng tính CSV
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
          <div className="form-group">
            <label htmlFor="export-start-date" className="form-label">
              Từ ngày
            </label>
            <input
              id="export-start-date"
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="export-end-date" className="form-label">
              Đến ngày
            </label>
            <input
              id="export-end-date"
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-5)' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Hủy
          </button>
          <button type="button" className="btn btn-primary" onClick={handleExport} disabled={exporting}>
            <Download size={16} aria-hidden="true" />
            {exporting ? 'Đang tạo tệp...' : 'Tải xuống ngay'}
          </button>
        </div>
      </div>
    </div>
  );
};
