import type { ILocaleConfig, SupportedLocale } from './types';

export const usEnglish: ILocaleConfig = {
  locale: 'en',
  label: 'English',
  countryFlagIsoCode: 'us',
};

export const localesConfig: Record<SupportedLocale, ILocaleConfig> = {
  en: usEnglish,
  de: {
    locale: 'de',
    label: 'Deutsch',
    countryFlagIsoCode: 'de',
  },
  zh: {
    locale: 'zh',
    label: '中文',
    countryFlagIsoCode: 'cn',
  },
};
