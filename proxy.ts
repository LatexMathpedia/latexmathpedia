import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  // Solo manejar redirecciones de autenticación y headers
  // La protección de rutas admin se maneja a nivel de componente
  
  // Para rutas de auth, redirigir al dashboard si ya está autenticado
  const authPaths = ['/auth/login', '/auth/register']
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isAuthPath) {
    // Como tu backend usa headers en lugar de cookies, 
    // no podemos verificar autenticación aquí de manera confiable
    // Los componentes se encargan de esta verificación
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