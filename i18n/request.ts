import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import fr from '../messages/fr.json'
import en from '../messages/en.json'
import ar from '../messages/ar.json'
import es from '../messages/es.json'
import pt from '../messages/pt.json'
import de from '../messages/de.json'
import it from '../messages/it.json'

const messages = {
  fr,
  en,
  ar,
  es,
  pt,
  de,
  it,
}

type Locale = 'fr' | 'en' | 'ar' | 'es' | 'pt' | 'de' | 'it'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: messages[locale as Locale]
  }
})

