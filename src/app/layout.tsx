import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vault Codebreaker',
  description: 'Solve the clues and unlock the vault',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: '#141226',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Vault Codebreaker',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
