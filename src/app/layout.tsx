import type { Metadata } from 'next';
import { Lato, Oswald, Outfit, Poppins, Roboto_Condensed, Teko, Ubuntu, Ubuntu_Condensed,  } from 'next/font/google';
import './globals.css';
import { APP_VERSION } from '@/utils/constants';
import StoreProvider from './StoreProvider';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import MobileMenu from '@/components/MobileMenu';
import ErrorModal from '@/components/modals/ErrorModal';
import NewProjectModal from '@/components/modals/NewProjectModal';
import '@greguintow/react-tippy/dist/tippy.css';

const teko = Teko({ subsets: ['latin'] })
const poppins = Poppins({weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], subsets: ['latin']})
const lato = Lato({weight: ['100', '300', '400', '700', '900'], subsets: ['latin']})
const oswald = Oswald({weight: ['200', '300', '400', '700'], subsets: ['latin']})
const ubuntu = Ubuntu({weight: ['300', '400', '500', '700', '400'], subsets: ['latin']})
const ubuntuCondensed = Ubuntu_Condensed({weight: ['400'], subsets: ['latin']})
const outfit = Outfit({weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], subsets: ['latin']})

export const metadata: Metadata = {
  title: `Project Mania v${APP_VERSION} - by Tom Rossner`,
  description: 'By Tom Rossner',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className}`}>
        <StoreProvider>
          <ErrorModal />
          <NewProjectModal />
          <Nav />
          <MobileMenu />
          <main>
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  )
}
