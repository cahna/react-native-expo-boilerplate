export type SupportedLocale = 'en' | 'de' | 'zh';

export interface ILocaleConfig {
  locale: SupportedLocale;
  label: string | JSX.Element;
  countryFlagIsoCode: string;
}

export interface IDynamicIntlContext {
  selectedLocale: ILocaleConfig;
  locales: Partial<Record<SupportedLocale, ILocaleConfig>>;
  setLocale: (locale: SupportedLocale) => void;
}
