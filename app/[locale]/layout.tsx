import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // S'assurer que la locale entrante est valide
  if (!routing.locales.includes(locale as 'fr' | 'en' | 'ar')) {
    notFound();
  }

  // Fournir tous les messages au client
  // est la façon la plus simple de commencer
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ConditionalLayout>
        {children}
      </ConditionalLayout>
    </NextIntlClientProvider>
  );
}


