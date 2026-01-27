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
    <div className="min-h-screen min-h-[100dvh] flex flex-col overflow-x-hidden">
      <main className="flex-1 flex flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
