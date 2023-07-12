import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { isBoolean } from 'lodash-es';

import type { SupportedLocale } from '@changeme/constants/Locale';

export interface AppSettingsState {
  developer: {
    logging: {
      enabled?: boolean;
    };
    queryLogging: {
      enabled?: boolean;
    };
    queryCaching: {
      enabled?: boolean;
    };
    intlLogging: {
      enabled?: boolean;
    };
  };
  language: SupportedLocale;
  theme: {
    darkMode?: boolean;
    navigationAnimations?: boolean;
  };
}

const initialState: AppSettingsState = {
  developer: {
    logging: {
      enabled: false,
    },
    queryLogging: {
      enabled: false,
    },
    queryCaching: {
      enabled: false,
    },
    intlLogging: {
      /**
       * Helpful for finding missing translations
       */
      enabled: false,
    },
  },
  language: 'en',
  theme: {
    darkMode: true,
    navigationAnimations: true,
  },
};

export default createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    updateLocale: (state, action: PayloadAction<SupportedLocale>) => {
      state.language = action.payload;
    },
    toggleDarkMode: (state) => {
      state.theme.darkMode = !state.theme.darkMode;
    },
    toggleNavigationAnimations: (state) => {
      state.theme.navigationAnimations = !state.theme.navigationAnimations;
    },
    setNavigationAnimations: (state, action: PayloadAction<boolean>) => {
      if (isBoolean(action.payload)) {
        state.theme.navigationAnimations = !!action.payload;
      }
    },
    toggleQueryCaching: (state) => {
      state.developer.queryCaching.enabled =
        !state.developer.queryCaching.enabled;
    },
    toggleLogging: (state) => {
      state.developer.logging.enabled = !state.developer.logging.enabled;
    },
    toggleQueryLogging: (state) => {
      state.developer.queryLogging.enabled =
        !state.developer.queryLogging.enabled;
    },
    toggleIntlLogging: (state) => {
      state.developer.intlLogging.enabled =
        !state.developer.intlLogging.enabled;
    },
  },
});
