import * as React from 'react';

import { localesConfig, usEnglish } from './config';
import type { IDynamicIntlContext } from './types';

export const DynamicIntlContext = React.createContext<IDynamicIntlContext>({
  selectedLocale: usEnglish,
  locales: localesConfig,
  setLocale: () => {
    // eslint-disable-next-line no-console
    console.warn('DynamicIntlContext not initialized/provided');
  },
});

export const useDynamicIntl = () => React.useContext(DynamicIntlContext);
