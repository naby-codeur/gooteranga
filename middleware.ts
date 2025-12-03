import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const intlMiddleware = createMiddleware(routing);

// Routes publiques (ne nécessitent pas d'authentification)
const publicRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/auth/callback',
];

// Routes protégées qui nécessitent une authentification
const protectedRoutes = [
  '/dashboard',
];

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Extraire la locale et le chemin sans locale
  const localeMatch = pathname.match(/^\/(fr|en|ar)(\/.*)?$/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
  const pathWithoutLocale = localeMatch ? (localeMatch[2] || '/') : pathname;

  // Vérifier si c'est une route protégée
  const isProtectedRoute = protectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );

  // Créer le client Supabase pour le middleware
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si Supabase est configuré, vérifier l'authentification
  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setAll(_cookiesToSet) {
          // Le middleware ne peut pas modifier les cookies directement
          // Les cookies seront mis à jour par Supabase lors de la navigation
        },
      },
    });

    // Si c'est une route protégée, vérifier l'authentification
    if (isProtectedRoute && !isPublicRoute) {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Rediriger vers la page de login avec le chemin de retour
          const loginUrl = new URL(`/${locale}/login`, request.url);
          loginUrl.searchParams.set('next', pathname);
          return NextResponse.redirect(loginUrl);
        }
      } catch (error) {
        console.error('Auth check error in middleware:', error);
        // En cas d'erreur, rediriger vers login pour sécuriser
        const loginUrl = new URL(`/${locale}/login`, request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Permettre l'accès aux pages login/signup même si l'utilisateur est connecté
    // Les pages elles-mêmes peuvent gérer la redirection si nécessaire
    // Cela permet de changer de compte ou de se reconnecter avec un autre rôle

    // Protection des dashboards selon le rôle
    if (pathWithoutLocale.startsWith('/dashboard')) {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // On laisse les layouts de dashboard gérer les redirections selon le rôle
          // car ils ont accès à Prisma pour récupérer le rôle complet
        }
      } catch {
        // Continuer normalement
      }
    }
  }

  // Appliquer le middleware d'internationalisation
  return intlMiddleware(request);
}

export const config = {
  // Correspondre à tous les chemins sauf
  // - … ceux qui commencent par `/api`, `/_next` ou `/_vercel`
  // - … ceux contenant un point (ex: `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};


