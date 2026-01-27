import React from 'react';

interface ProgressCirclesProps {
  count: number;
  letters: string[];
  accentColor?: string;
}

export default function ProgressCircles({
  count,
  letters,
  accentColor = '#e30613',
}: ProgressCirclesProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-sm font-bold tracking-widest text-white/80">
        VAULT CODE
      </div>
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, i) => {
          const letter = letters[i] || '';
          const isFilled = letter !== '';

          return (
            <div
              key={i}
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300"
              style={{
                border: `2px solid ${accentColor}`,
                backgroundColor: isFilled ? `${accentColor}30` : 'transparent',
                boxShadow: `0 0 10px ${accentColor}50, inset 0 0 10px ${accentColor}20`,
                color: isFilled ? '#ffffff' : 'transparent',
              }}
            >
              {letter}
            </div>
          );
        })}
      </div>
    </div>
  );
}
