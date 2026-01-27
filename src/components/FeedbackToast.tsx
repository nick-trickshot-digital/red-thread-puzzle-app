'use client';

import React, { useEffect } from 'react';

interface FeedbackToastProps {
  type: 'success' | 'error';
  message: string;
  visible: boolean;
  onClose: () => void;
  accentColor?: string;
}

export default function FeedbackToast({
  type,
  message,
  visible,
  onClose,
  accentColor = '#ff2b2b',
}: FeedbackToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const bgColor = type === 'success' ? accentColor : '#dc2626';
  const animation = type === 'error' ? 'animate-shake' : '';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className={`px-8 py-4 rounded-2xl font-bold text-lg ${animation}`}
        style={{
          backgroundColor: bgColor,
          boxShadow: `0 0 40px ${bgColor}80`,
          color: 'white',
        }}
      >
        {message}
      </div>
    </div>
  );
}
