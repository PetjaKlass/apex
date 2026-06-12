import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Apex',
  description: 'Life Operating System for Solo Founders and Duos',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
