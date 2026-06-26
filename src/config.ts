import { type Locale } from './i18n/routing';

/**
 * Region bundles.
 *
 * A given deployment activates one bundle via `REGION_BUNDLE` env var — no
 * rebuild required, so one image can serve every market.
 *
 * - `SK`  → Slovak-first: sk, en, de, cs
 * - `EU`  → English-first: en, sk, de, cs
 */
export type RegionBundle = 'SK' | 'EU';

interface BundleConfig {
  /** Locales shown to the user, in display order. First-class subset of `routing.locales`. */
  locales: Locale[];
  /** Locale used when none is requested / negotiation fails. Must be in `locales`. */
  defaultLocale: Locale;
}

export const REGION_BUNDLES = {
  SK: { locales: ['sk', 'en', 'de', 'cs'], defaultLocale: 'sk' },
  EU: { locales: ['en', 'sk', 'de', 'cs'], defaultLocale: 'en' },
} satisfies Record<RegionBundle, BundleConfig>;

/**
 * The bundle this deployment runs as. Read on the server at request time
 * (middleware, RSC), so changing it + restarting flips active locales without
 * a rebuild. Falls back to `EU` (English-first).
 */
export const activeBundle: RegionBundle =
  process.env.REGION_BUNDLE === 'SK' ? 'SK' : 'EU';

/** Locales exposed to users for the active bundle (e.g. for a language switcher). */
export function getActiveLocales(): Locale[] {
  return REGION_BUNDLES[activeBundle].locales;
}

/** Default locale for the active bundle. */
export function getDefaultLocale(): Locale {
  return REGION_BUNDLES[activeBundle].defaultLocale;
}

/** Whether a locale is active for this deployment. */
export function isLocaleActive(locale: string): locale is Locale {
  return (getActiveLocales() as string[]).includes(locale);
}
