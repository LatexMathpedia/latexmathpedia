import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-context'
import { ThemeProvider } from '@/components/theme-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Math Texpedia',
  description: 'Aprende matemáticas de manera interactiva',
  keywords: ['Mathtexpedia', 'Math Texpedia', 'Math and Text encyclopedia', 'Math resources', 'uniovi', 'Matemáticas uniovi', 'Ciencias uniovi', 'Ciencias', 'Latex uniovi', 'Latex', 'Matemáticas', 'Matemáticas interactivas', 'Matemáticas y texto', 'Matemáticas y texto interactivo']

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

