import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Nails By Love Studio | Owner Dashboard', description: 'Private studio management workspace' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
