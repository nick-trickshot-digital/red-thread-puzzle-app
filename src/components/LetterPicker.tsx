'use client';

import React, { useState, useRef, useEffect } from 'react';

interface LetterPickerProps {
  value: string;
  onPrev: () => void;
  onNext: () => void;
  onJumpToStart: () => void;
  onJumpToEnd: () => void;
  accentColor?: string;
}

export default function LetterPicker({
  value,
  onPrev,
  onNext,
  onJumpToStart,
  onJumpToEnd,
  accentColor = '#e30613',
}: LetterPickerProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onNext();
    }
    if (isRightSwipe) {
      onPrev();
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrev, onNext]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onPrev}
          className="w-16 h-16 flex items-center justify-center text-6xl text-white/70 hover:text-white active:text-white active:scale-90 transition-all touch-manipulation select-none"
          aria-label="Previous letter"
        >
          ‹
        </button>

        <div
          ref={centerRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="w-28 h-28 rounded-xl flex items-center justify-center text-6xl font-bold select-none touch-manipulation active:scale-95 transition-transform"
          style={{
            backgroundColor: '#1e1a3a',
            border: `3px solid ${accentColor}`,
            boxShadow: `0 0 20px ${accentColor}60, inset 0 0 20px rgba(0,0,0,0.5)`,
            color: '#ffffff',
          }}
          role="spinbutton"
          aria-label="Selected letter"
          aria-valuenow={value.charCodeAt(0)}
          aria-valuemin={65}
          aria-valuemax={90}
          aria-valuetext={value}
        >
          {value}
        </div>

        <button
          onClick={onNext}
          className="w-16 h-16 flex items-center justify-center text-6xl text-white/70 hover:text-white active:text-white active:scale-90 transition-all touch-manipulation select-none"
          aria-label="Next letter"
        >
          ›
        </button>
      </div>

      {/* Quick jump buttons */}
      <div className="flex items-center justify-between w-72">
        <button
          onClick={onJumpToStart}
          className="px-4 py-2 min-h-[44px] text-sm text-white/60 hover:text-white active:text-white transition-colors touch-manipulation select-none"
          aria-label="Jump to A"
        >
          «ABC
        </button>
        <button
          onClick={onJumpToEnd}
          className="px-4 py-2 min-h-[44px] text-sm text-white/60 hover:text-white active:text-white transition-colors touch-manipulation select-none"
          aria-label="Jump to Z"
        >
          XYZ»
        </button>
      </div>
    </div>
  );
}
