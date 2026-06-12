import type { Metadata } from 'next';
import { cssVariablesAll } from '@apex/design-tokens';
import { Providers } from '@/components/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Apex',
  description: 'Life Operating System for Solo Founders and Duos',
};

// Pre-Paint: Akzent aus localStorage setzen, bevor gerendert wird (kein Flash).
const accentScript = `(function(){try{var a=localStorage.getItem('apex-accent');if(a)document.documentElement.setAttribute('data-accent',a);}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-accent="gold" suppressHydrationWarning>
      <head>
        <style id="apex-tokens" dangerouslySetInnerHTML={{ __html: cssVariablesAll }} />
        <script dangerouslySetInnerHTML={{ __html: accentScript }} />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
