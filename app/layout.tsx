import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Brawl Stars Analyzer',
  description: 'Analyze your Brawl Stars profile and get recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
