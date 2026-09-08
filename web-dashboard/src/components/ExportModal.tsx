import React, { useState } from 'react';
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Xuất báo cáo dinh dưỡng</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Định dạng tệp</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setFormat('pdf')}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: format === 'pdf' ? 'rgba(16, 185, 129, 0.15)' : '#090d16',
                border: format === 'pdf' ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                color: format === 'pdf' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <FileText size={18} />
              Báo cáo PDF
            </button>

            <button
              type="button"
              onClick={() => setFormat('csv')}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: format === 'csv' ? 'rgba(16, 185, 129, 0.15)' : '#090d16',
                border: format === 'csv' ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                color: format === 'csv' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Table size={18} />
              Bảng tính CSV
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Từ ngày</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Đến ngày</label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Hủy
          </button>
          <button type="button" className="btn btn-primary" onClick={handleExport} disabled={exporting}>
            <Download size={16} />
            {exporting ? 'Đang tạo tệp...' : 'Tải xuống ngay'}
          </button>
        </div>
      </div>
    </div>
  );
};
