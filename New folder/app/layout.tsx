
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nails By Love Studio | Beauty, With Feeling',
  description: 'Thoughtful nail treatments, signature sets and personal artistry in Bengaluru.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
