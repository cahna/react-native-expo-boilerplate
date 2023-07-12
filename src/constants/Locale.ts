export type SupportedLocale = 'en' | 'de' | 'zh';

export const SUPPORTED_LOCALES: Readonly<SupportedLocale[]> = [
  'en',
  'de',
  'zh',
] as const;
