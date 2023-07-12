import { createMigrate } from 'redux-persist';

type CreateMigrateParams = Parameters<typeof createMigrate>;

export type Migrations = CreateMigrateParams[0];

export const migrations: Migrations = {
  1: (state: any) => ({
    ...state,
    appSettings: {
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
    },
  }),
};
