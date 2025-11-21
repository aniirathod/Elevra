import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SmoothScrolling from '@/components/SmoothScolling';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Elevra | AI Resume Builder & Analyzer',
  description: 'Build ATS-friendly resumes and get AI analysis against job descriptions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <SmoothScrolling>
          <main>{children}</main>
        </SmoothScrolling>
      </body>
    </html>
  );
}
