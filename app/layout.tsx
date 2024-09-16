// next-amazona-v2/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import DrawerButton from '@/components/DrawerButton';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Cookies from '@/components/cookies/Cookies';
import GoogleCaptchaWrapper from './GoogleCaptchaWrapper';
import HeaderMobile from '@/components/header/HeaderMobile';
import BuilderWrapper from '@/app/BuilderWrapper'; 
import DeveloperModeWrapper from './DeveloperModeWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Amazona V2',
  description: 'Modern ECommerce Website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleCaptchaWrapper>
        <body className={inter.className}>
          <Providers>
            <div className="drawer">
              <DrawerButton />
              <div className="drawer-content">
                <BuilderWrapper> 
                  <Header />
                  <HeaderMobile />
                  <DeveloperModeWrapper>
                    {children}
                  </DeveloperModeWrapper>
                  </BuilderWrapper>
                <Cookies />
                <Footer />
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="my-drawer"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <Sidebar />
              </div>
            </div>
          </Providers>
        </body>
      </GoogleCaptchaWrapper>
    </html>
  );
}
