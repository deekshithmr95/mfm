import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ToastContainer from '@/components/Toast'
import QueryProvider from '@/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'Mysore Farmer Market - Fresh & Local',
  description: 'Buy directly from local farmers around Mysore. Farm-fresh organic produce, dairy, spices, and artisanal goods delivered to your doorstep.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  )
}

