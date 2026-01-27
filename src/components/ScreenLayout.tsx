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
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col relative">{children}</main>
    </div>
  );
}
