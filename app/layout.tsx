import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatbotWidget from '@/components/ai/ChatbotWidget';
import { AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { PaymentProvider } from '@/contexts/PaymentContext';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MH36 TRAVEL - Đặt tour du lịch toàn cầu',
  description: 'Khám phá thế giới cùng MH36 TRAVEL với những trải nghiệm du lịch tuyệt vời nhất.',
};

import LayoutWrapper from '@/components/layout/LayoutWrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col font-sans`}>
        <SettingsProvider>
          <PaymentProvider>
            <AuthProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </AuthProvider>
          </PaymentProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
