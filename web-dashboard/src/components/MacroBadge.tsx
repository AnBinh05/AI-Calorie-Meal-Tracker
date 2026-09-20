import React from 'react';

export type MacroType = 'carbs' | 'protein' | 'fat' | 'calories' | 'ai' | 'manual';

interface MacroBadgeProps {
  type: MacroType;
  label?: string;
  value?: string | number;
  unit?: string;
  className?: string;
}

export const MacroBadge: React.FC<MacroBadgeProps> = ({
  type,
  label,
  value,
  unit,
  className = '',
}) => {
  const getBadgeClass = () => {
    switch (type) {
      case 'carbs':
        return 'badge-carbs';
      case 'protein':
        return 'badge-protein';
      case 'fat':
        return 'badge-fat';
      case 'ai':
        return 'badge-ai';
      case 'manual':
        return 'badge-manual';
      default:
        return 'badge-success';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()} ${className}`}>
      {label && <span>{label}: </span>}
      {value !== undefined && <strong className="tabular-nums">{value}{unit}</strong>}
    </span>
  );
};
