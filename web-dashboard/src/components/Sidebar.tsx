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
      width: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px', marginBottom: '32px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          🥗
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>AI Calorie</h1>
          <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>Tracker Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '14px',
                border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                width: '100%'
              }}
            >
              <Icon size={18} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              {item.label}
            </button>
          );
        })}

        <div style={{ margin: '16px 0', height: '1px', backgroundColor: 'var(--border-color)' }} />

        <button
          onClick={onOpenExport}
          className="btn btn-outline"
          style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 14px', fontSize: '13px' }}
        >
          📄 Xuất báo cáo PDF / CSV
        </button>
      </nav>

      {/* User info & Logout */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '14px'
          }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.fullName}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          title="Đăng xuất"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-dim)',
            padding: '6px'
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
