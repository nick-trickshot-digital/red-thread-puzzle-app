import React from 'react';

interface ScreenLayoutProps {
  children: React.ReactNode;
  showVaultHeader?: boolean;
  accentColor?: string;
}

export default function ScreenLayout({
  children,
}: ScreenLayoutProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <div className="w-full h-full max-h-[1000px] flex flex-col relative">
        <main className="flex-1 flex flex-col relative">{children}</main>
      </div>
    </div>
  );
}
