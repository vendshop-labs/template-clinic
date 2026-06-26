import { type Locale } from './i18n/routing';

/**
 * Region bundles.
 *
 * The template bundles all six locales (see `src/i18n/routing.ts`), but a given
 * deployment only *activates* a subset. The active subset is chosen at runtime
 * via the `REGION_BUNDLE` server env var — no rebuild required, so one image
 * can serve every region.
 *
 * - `UA`  → Ukrainian-first store: uk, ru, en
 * - `EU`  → EU store: de (default), en, plus sk / cs where the country needs them
 */
export type RegionBundle = 'UA' | 'EU';

interface BundleConfig {
  /** Locales shown to the user, in display order. First-class subset of `routing.locales`. */
  locales: Locale[];
  /** Locale used when none is requested / negotiation fails. Must be in `locales`. */
  defaultLocale: Locale;
}

export const REGION_BUNDLES = {
  UA: { locales: ['uk', 'ru', 'en'], defaultLocale: 'uk' },
  EU: { locales: ['de', 'en', 'sk', 'cs'], defaultLocale: 'de' },
} satisfies Record<RegionBundle, BundleConfig>;

/**
 * The bundle this deployment runs as. Read on the server at request time
 * (middleware, RSC), so changing it + restarting flips active locales without
 * a rebuild. Falls back to `UA`.
 */
export const activeBundle: RegionBundle =
  process.env.REGION_BUNDLE === 'EU' ? 'EU' : 'UA';

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
