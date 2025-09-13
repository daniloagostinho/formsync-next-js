import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import ConditionalTopbar from '@/components/ConditionalTopbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FormSync - Next.js',
  description: 'FormSync application built with Next.js, TypeScript, and modern React patterns',
  keywords: ['forms', 'sync', 'nextjs', 'typescript', 'react'],
  authors: [{ name: 'FormSync Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <div id="root">
            <ConditionalTopbar />
            <main>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}