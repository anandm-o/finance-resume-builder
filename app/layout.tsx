import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FirebaseProvider } from '../contexts/FirebaseContext'
import Navigation from '../components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Finance Resume Builder',
  description: 'Turn your resume into a finance-recruiting machine. Upload your resume or start from scratch. Our AI shapes it into a polished, ATS-ready finance template.',
  keywords: 'finance resume, investment banking, private equity, asset management, corporate finance, ATS friendly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <Navigation />
          <div className="min-h-screen bg-finance-50">
            {children}
          </div>
        </FirebaseProvider>
      </body>
    </html>
  )
}
