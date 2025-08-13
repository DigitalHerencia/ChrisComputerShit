import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Chris Romero's Computer Shit",
  description: 'Construction Management Dashboard'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
