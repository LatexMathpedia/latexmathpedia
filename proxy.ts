import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

// Rutas que requieren sesión iniciada
const protectedPaths = ['/dashboard/profile', '/dashboard/admin']
// Rutas que además requieren el rol de admin de Keycloak
const adminPaths = ['/dashboard/admin']
// Rutas de login/registro: si ya hay sesión se redirige al dashboard
const authPaths = ['/auth/login', '/auth/register']

const matches = (pathname: string, paths: string[]) =>
  paths.some(path => pathname === path || pathname.startsWith(`${path}/`))

const protectRoutes = auth((request) => {
  const { pathname, search } = request.nextUrl
  const session = request.auth
  const isAuthenticated = !!session && !session.error

  if (matches(pathname, protectedPaths) && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.nextUrl.origin)
    loginUrl.searchParams.set('redirect', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (matches(pathname, adminPaths) && !session?.isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin))
  }

  if (matches(pathname, authPaths) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin))
  }

  const response = NextResponse.next()

  // Headers para mejorar el manejo de cookies en Safari
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  return response
})

// Con la config lazy de auth.ts, auth(handler) devuelve una promesa del handler,
// así que hay que resolverla aquí: Next exige que el export sea una función.
export default async function proxy(request: NextRequest) {
  const handler = await protectRoutes
  return handler(request, { params: Promise.resolve({}) })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, incluidas las de Auth.js)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
