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
    <div className="h-screen h-[100dvh] flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
