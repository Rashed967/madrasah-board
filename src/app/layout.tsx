import './globals.css';
import { Noto_Serif_Bengali } from 'next/font/google';

const notoSerifBengali = Noto_Serif_Bengali({
  weight: ['400', '500', '600', '700'],
  subsets: ['bengali'],
  display: 'swap',
});

export const metadata = {
  title: 'Madrasah Management',
  description: 'A comprehensive system for managing madrasahs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className={notoSerifBengali.className}>{children}</body>
    </html>
  );
}
