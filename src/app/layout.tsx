import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlobalAIChatAssistant from '@/components/GlobalAIChatAssistant';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'PropAI Estate — Real Estate Property Listing Platform',
  description: 'AI-assisted web-based platform connecting buyers, sellers, agents, and admins.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <GlobalAIChatAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
