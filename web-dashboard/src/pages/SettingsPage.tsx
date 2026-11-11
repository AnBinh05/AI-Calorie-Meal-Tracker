import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../types/theme';
import { Sun, Moon, Monitor, Sparkles, LogOut, Download, Check, ShieldCheck, LucideIcon } from 'lucide-react';

const AI_PREFS_STORAGE_KEY = 'nutriai_ai_prefs';

export interface AiPreferences {
  defaultExtraOil: boolean;
  prioritizeVietnameseCuisine: boolean;
  analysisDetail: 'fast' | 'standard' | 'detailed';
}

export function loadAiPreferences(): AiPreferences {
  try {
    const raw = localStorage.getItem(AI_PREFS_STORAGE_KEY);
    if (raw) {
      return {
        defaultExtraOil: false,
        prioritizeVietnameseCuisine: true,
        analysisDetail: 'standard',
        ...JSON.parse(raw),
      };
    }
  } catch {
    // Ignore storage read errors
  }
  return {
    defaultExtraOil: false,
    prioritizeVietnameseCuisine: true,
    analysisDetail: 'standard',
  };
}

interface SettingsPageProps {
  onOpenExport: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenExport }) => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [prefs, setPrefs] = useState<AiPreferences>(() => loadAiPreferences());
  const [savedNotice, setSavedNotice] = useState(false);

  const updatePref = <K extends keyof AiPreferences>(key: K, value: AiPreferences[K]) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    localStorage.setItem(AI_PREFS_STORAGE_KEY, JSON.stringify(updated));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const themeOptions: { value: Theme; label: string; icon: LucideIcon }[] = [
    { value: 'light', label: 'Sáng (Light)', icon: Sun },
    { value: 'dark', label: 'Tối (Dark)', icon: Moon },
    { value: 'system', label: 'Hệ thống', icon: Monitor },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Cài đặt hệ thống & AI</h2>
          <p className="page-subtitle">Tùy chỉnh giao diện, hành vi phân tích AI và quản lý phiên tài khoản</p>
        </div>
        {savedNotice && (
          <div
            role="status"
            aria-live="polite"
            className="badge badge-success"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px' }}
          >
            <Check size={14} aria-hidden="true" />
            <span>Đã lưu tùy chọn</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Theme Preferences */}
        <div className="card">
          <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '6px' }}>Giao diện hiển thị</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            Chuyển đổi tức thì giữa Light Mode, Dark Mode hoặc tự động theo thiết bị.
          </p>

          <div role="radiogroup" aria-label="Chọn chế độ giao diện" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const active = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTheme(opt.value)}
                  style={{
                    padding: '14px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: active ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border-default)',
                    backgroundColor: active ? 'var(--color-brand-tint)' : 'var(--color-bg-surface-subtle)',
                    color: active ? 'var(--color-brand-primary)' : 'var(--color-text-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  <Icon size={18} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Nutrition Preferences */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={18} color="var(--color-brand-primary)" aria-hidden="true" />
            <h3 style={{ fontSize: '17px', fontWeight: '800' }}>Tùy chọn AI Dinh dưỡng</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            Cấu hình mặc định áp dụng khi bóc tách món ăn từ ảnh bằng Gemini Vision.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Mặc định cộng thêm dầu mỡ & gia vị (+12%)</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Phù hợp với món xào/nướng ngoài hàng quán</div>
              </div>
              <input
                type="checkbox"
                checked={prefs.defaultExtraOil}
                onChange={(e) => updatePref('defaultExtraOil', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-brand-primary)' }}
              />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Ưu tiên nhận diện ẩm thực Việt Nam</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Phở, bún chả, cơm tấm, canh chua...</div>
              </div>
              <input
                type="checkbox"
                checked={prefs.prioritizeVietnameseCuisine}
                onChange={(e) => updatePref('prioritizeVietnameseCuisine', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-brand-primary)' }}
              />
            </label>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="ai-detail-level" className="form-label">Chế độ phân tích ảnh</label>
              <select
                id="ai-detail-level"
                className="form-select"
                value={prefs.analysisDetail}
                onChange={(e) => updatePref('analysisDetail', e.target.value as AiPreferences['analysisDetail'])}
              >
                <option value="fast">Nhanh (Ưu tiên tốc độ phản hồi)</option>
                <option value="standard">Tiêu chuẩn (Cân bằng tốc độ & độ chi tiết)</option>
                <option value="detailed">Chuyên sâu (Tách chi tiết gia vị & nước chấm)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account & Data Management */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShieldCheck size={18} color="var(--color-brand-primary)" aria-hidden="true" />
            <h3 style={{ fontSize: '17px', fontWeight: '800' }}>Tài khoản & Dữ liệu</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            Đang đăng nhập với tài khoản <strong>{user?.fullName}</strong> ({user?.email}).
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-outline" onClick={onOpenExport}>
              <Download size={16} aria-hidden="true" />
              <span>Xuất dữ liệu CSV / PDF</span>
            </button>

            <button type="button" className="btn btn-danger" onClick={logout}>
              <LogOut size={16} aria-hidden="true" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
