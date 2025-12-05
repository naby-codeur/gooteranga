import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // Appliquer le middleware d'internationalisation uniquement
  // L'authentification est désactivée en mode développement
  return intlMiddleware(request);
}

export const config = {
  // Correspondre à tous les chemins sauf
  // - … ceux qui commencent par `/api`, `/_next` ou `/_vercel`
  // - … ceux contenant un point (ex: `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
