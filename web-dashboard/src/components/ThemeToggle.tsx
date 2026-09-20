import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      aria-label={`Chuyển sang giao diện ${resolvedTheme === 'dark' ? 'Sáng' : 'Tối'}`}
      title={`Chuyển sang giao diện ${resolvedTheme === 'dark' ? 'Sáng' : 'Tối'}`}
      type="button"
    >
      {resolvedTheme === 'dark' ? (
        <Sun size={18} className="theme-toggle-icon" />
      ) : (
        <Moon size={18} className="theme-toggle-icon" />
      )}
    </button>
  );
};
