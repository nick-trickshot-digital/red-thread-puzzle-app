'use client';

import React from 'react';

interface ResetLinkProps {
  onReset: () => void;
}

export default function ResetLink({ onReset }: ResetLinkProps) {
  return (
    <button
      onClick={onReset}
      className="text-zinc-500 text-sm underline hover:text-zinc-300 transition-colors"
    >
      Reset progress
    </button>
  );
}
