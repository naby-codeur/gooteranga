import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest): Promise<NextResponse> {
  try {
    // Ne pas appliquer le middleware i18n sur les routes API
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
    
    // Appliquer le middleware d'internationalisation pour toutes les autres routes
    const response = await intlMiddleware(request);
    return response || NextResponse.next();
  } catch (error) {
    console.error('Proxy error:', error);
    // En cas d'erreur, continuer sans middleware i18n
    return NextResponse.next();
  }
}

export const config = {
  // Correspondre à tous les chemins sauf
  // - … ceux qui commencent par `/api`, `/_next` ou `/_vercel`
  // - … ceux contenant un point (ex: `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
