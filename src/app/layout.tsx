import './globals.css';
import { Noto_Serif_Bengali } from 'next/font/google';
import { QueryProvider } from '@/components/providers/QueryProvider';

const notoSerifBengali = Noto_Serif_Bengali({
  weight: ['400', '500', '600', '700'],
  subsets: ['bengali'],
  display: 'block',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata = {
  title: 'Madrasah Management',
  description: 'A comprehensive system for managing madrasahs'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#ffffff" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/_next/static/media/d29f4cb91eec06de-s.p.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
        />
      </head>
      <body className={notoSerifBengali.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
