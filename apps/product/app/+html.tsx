import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/** Server-gerendertes HTML-Gerüst (Expo Router Web). PWA-Meta + SW-Registrierung. */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        {/* Typografie: Cabinet Grotesk (Display) · Inter (UI) · JetBrains Mono (Zahlen) — wie Prototyp */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#08080A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Apex" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <ScrollViewStyleReset />
        {/* No-Flash: Canvas-Farbe vor Hydration setzen (Light #ECEAE6 / Dark #08080A) — verhindert weißes Aufblitzen */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('apex-theme')||'light';var d=s==='dark'||(s==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);var c=d?'#08080A':'#ECEAE6';document.documentElement.style.background=c;}catch(e){}})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/service-worker.js').catch(function(){})})}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
