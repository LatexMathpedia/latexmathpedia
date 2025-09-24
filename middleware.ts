import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Rutas que requieren autenticación estricta (solo áreas de administración)
  const protectedPaths = ['/dashboard/admin']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Si es una ruta protegida, verificar autenticación
  if (isProtectedPath) {
    // Buscar la cookie de sesión (ajusta el nombre según tu backend)
    const sessionCookie = request.cookies.get('session') || 
                         request.cookies.get('auth-token') ||
                         request.cookies.get('connect.sid')

    // Si no hay cookie de sesión, redirigir al login
    if (!sessionCookie) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Para rutas de auth, redirigir al dashboard si ya está autenticado
  const authPaths = ['/auth/login', '/auth/register']
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isAuthPath) {
    const sessionCookie = request.cookies.get('session') || 
                         request.cookies.get('auth-token') ||
                         request.cookies.get('connect.sid')
    
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Configurar headers para mejorar compatibilidad con iOS/Safari
  const response = NextResponse.next()
  
  // Headers para mejorar el manejo de cookies en Safari
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}