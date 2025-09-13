import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas protegidas que requerem autenticação
const protectedRoutes = [
  '/dashboard',
  '/formularios',
  '/template-manager',
  '/perfil',
  '/analytics',
  '/upload-csv'
];

// Rotas públicas que não devem ser acessadas quando logado
const publicRoutes = [
  '/login',
  '/registrar',
  '/verificar-codigo'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar se o usuário está autenticado
  // Como o Zustand salva no localStorage, vamos verificar se existe o token
  // O middleware não tem acesso direto ao localStorage, então vamos usar cookies
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;

  console.log('🔍 [MIDDLEWARE] Verificando rota:', pathname);
  console.log('🔍 [MIDDLEWARE] Token encontrado:', !!token);
  console.log('🔍 [MIDDLEWARE] Autenticado:', isAuthenticated);

  // Se está tentando acessar uma rota protegida sem estar autenticado
  if (protectedRoutes.some(route => pathname?.includes(route)) && !isAuthenticated) {
    console.log('🚫 [MIDDLEWARE] Redirecionando para login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se está autenticado e tentando acessar uma rota pública
  if (isAuthenticated && publicRoutes.some(route => pathname?.includes(route))) {
    console.log('🚀 [MIDDLEWARE] Redirecionando para dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
