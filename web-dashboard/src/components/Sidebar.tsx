import React from 'react';
import { LayoutDashboard, History, LineChart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenExport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenExport }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'history', label: 'Lịch sử bữa ăn', icon: History },
    { id: 'analytics', label: 'Phân tích & Xu hướng', icon: LineChart },
    { id: 'profile', label: 'Hồ sơ & BMR/TDEE', icon: User },
  ];

  return (
    <aside style={{
      width: 'var(--sidebar-width-desktop)',
      backgroundColor: 'var(--color-bg-surface)',
      borderRight: '1px solid var(--color-border-default)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--spacing-6) var(--spacing-4)',
      height: '100dvh',
      position: 'sticky',
      top: 0,
      transition: 'background-color 0.2s ease-out, border-color 0.2s ease-out'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: '0 var(--spacing-2)', marginBottom: 'var(--spacing-8)' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          🥗
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-primary)' }}>NutriAI</h1>
          <p style={{ fontSize: '12px', color: 'var(--color-brand-primary)', fontWeight: '600' }}>Calorie & Meal Tracker</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-3)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--color-brand-tint)' : 'transparent',
                color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? '700' : '500',
                fontSize: 'var(--text-body-medium)',
                border: isActive ? '1px solid var(--color-brand-primary)' : '1px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease-out',
                width: '100%'
              }}
            >
              <Icon size={18} color={isActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)'} />
              {item.label}
            </button>
          );
        })}

        <div style={{ margin: 'var(--spacing-4) 0', height: '1px', backgroundColor: 'var(--color-border-default)' }} />

        <button
          onClick={onOpenExport}
          className="btn btn-outline"
          type="button"
          style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', fontSize: '13px' }}
        >
          📄 Xuất báo cáo PDF / CSV
        </button>
      </nav>

      {/* User info & Logout */}
      <div style={{
        backgroundColor: 'var(--color-bg-surface-subtle)',
        padding: 'var(--spacing-3)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', overflow: 'hidden' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-brand-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '14px',
            flexShrink: 0
          }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.fullName}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          title="Đăng xuất"
          aria-label="Đăng xuất khỏi hệ thống"
          type="button"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            padding: '6px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
