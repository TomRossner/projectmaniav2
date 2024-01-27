import type { Metadata } from 'next';
import { Teko } from 'next/font/google';
import './globals.css';
import { APP_VERSION } from '@/utils/constants';
import StoreProvider from './StoreProvider';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import MobileMenu from '@/components/MobileMenu';
import ErrorModal from '@/components/modals/ErrorModal';
import NewProjectModal from '@/components/modals/NewProjectModal';

const teko = Teko({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `ProjectMania v${APP_VERSION} - by Tom Rossner`,
  description: 'By Tom Rossner',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${teko.className}`}>
        <StoreProvider>
          <ErrorModal/>
          <NewProjectModal/>
          <Nav/>
          <MobileMenu/>
          {children}
          <Footer/>
        </StoreProvider>
      </body>
    </html>
  )
}
