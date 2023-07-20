import { noop } from 'lodash-es';
import * as React from 'react';
import type { FC, PropsWithChildren } from 'react';
import { IntlProvider } from 'react-intl';

import { useLogger } from '@changeme/providers/LoggerProvider';
import { actions } from '@changeme/redux/features/app-settings';
import { useAppDispatch, useAppSelector } from '@changeme/redux/store';

import { localesConfig } from './config';
import { DynamicIntlContext } from './context';
import type { IDynamicIntlContext } from './types';

export const DynamicIntlProvider: FC<PropsWithChildren> = ({ children }) => {
  const log = useLogger();
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.appSettings.language);
  const loggingEnabled = useAppSelector(
    (state) => state.appSettings.developer.intlLogging?.enabled,
  );
  const handleChangeLocale = React.useCallback<
    IDynamicIntlContext['setLocale']
  >(
    (newLocale) => {
      log?.info(`Selected locale: ${newLocale}`);
      dispatch(actions.updateLocale(newLocale));
    },
    [dispatch, log],
  );
  const dynamicIntlContextValue = React.useMemo<IDynamicIntlContext>(
    () => ({
      selectedLocale: localesConfig[locale],
      locales: localesConfig,
      setLocale: handleChangeLocale,
    }),
    [locale, handleChangeLocale],
  );

  return (
    <DynamicIntlContext.Provider value={dynamicIntlContextValue}>
      <IntlProvider
        defaultLocale="en"
        locale={locale}
        onError={loggingEnabled ? undefined : noop}
        onWarn={loggingEnabled ? undefined : noop}
      >
        {children}
      </IntlProvider>
    </DynamicIntlContext.Provider>
  );
};
