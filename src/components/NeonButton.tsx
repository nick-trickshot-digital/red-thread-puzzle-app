import React from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  accentColor?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

export default function NeonButton({
  children,
  onClick,
  variant = 'primary',
  accentColor = '#ff2b2b',
  disabled = false,
  type = 'button',
  fullWidth = false,
}: NeonButtonProps) {
  const baseClasses =
    'px-8 py-4 min-h-[56px] rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation select-none';

  const widthClass = fullWidth ? 'w-full' : '';

  if (variant === 'primary') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${widthClass} text-white`}
        style={{
          backgroundColor: accentColor,
          boxShadow: disabled
            ? 'none'
            : `0 0 20px ${accentColor}80, 0 0 40px ${accentColor}40`,
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${widthClass} border-2 text-white`}
      style={{
        borderColor: accentColor,
        color: accentColor,
      }}
    >
      {children}
    </button>
  );
}
