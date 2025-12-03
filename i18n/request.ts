import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import fr from '../messages/fr.json'
import en from '../messages/en.json'
import ar from '../messages/ar.json'

const messages = {
  fr,
  en,
  ar,
}

type Locale = 'fr' | 'en' | 'ar'

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

