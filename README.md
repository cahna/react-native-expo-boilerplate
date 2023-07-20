# react-native-expo-boilerplate

![react-native-expo-boilerplate](https://github.com/cahna/react-native-expo-boilerplate/actions/workflows/main.yaml/badge.svg)

## Includes

- [React Native](https://reactnative.dev/) - Cross-platform app framework and tooling
- [Expo](https://expo.dev/) - Managed React Native service for building and deploying cross-playform apps
- [Expo Router](https://expo.github.io/router/docs/) **v2** - Routing library
- [Redux](https://redux.js.org/) - State container
- [redux-persist](https://github.com/rt2zz/redux-persist) - Persistent store with migrations support
- [redux-saga](https://redux-saga.js.org/docs/About) - Manage asynchronous workflows
- [react-native-ble-manager](https://github.com/innoveit/react-native-ble-manager) - BLE interface
- [react-native-paper](https://callstack.github.io/react-native-paper/3.0/) - UI Component library
- [TypeORM](https://typeorm.io/) - Database models, migrations, and ORM
- [jest](https://jestjs.io/) - Testing

## Development

1. Install prerequisites (ie: android sdk, nodejs, npm/npx, react-native, expo-cli)
2. Install dependencies: `npm install`
3. Run on android emulator: `npm run android --clear`

### Notes

- Avoid the Expo-GO-related commands (for Android, at least)
  - Expo GO builds cannot be used for development/deployment because custom native code must be included for BLE (and other) dependencies that are not included in the default build of Expo GO.
  - The commands are included for conventience, and possible future use with web or ios
  - Expo GO can be used if Bluetooth support is not needed and removed from the code

## Redux, redux-saga, & redux-persist

Related code:

<!-- prettier-ignore -->
| Location                    | Description                  |
| --------------------------- | ---------------------------- |
| `./src/redux/store.ts`      | Redux store configuration    |
| `./src/redux/features/*`    | Redux actions and reducers   |
| `./src/redux/migrations.ts` | Redux-persist migrations     |
| `./src/redux/sagas/*`       | Redux-saga actions and sagas |

## Bluetooth (BLE)

Related code:

<!-- prettier-ignore -->
| Location                              | Description         |
| ------------------------------------- | ------------------- |
| `./src/constants/BLE.ts`              | BLE configuration   |
| `./src/providers/BluetoothProvider/*` | Setup listeners for events from `BleManager` to dispatch redux actions |
| `./src/redux/features/bluetooth/*`    | Bluetooth slice     |
| `./src/redux/sagas/bluetooth/*`       | Core BLE async code |

## TypeORM

Related code:

<!-- prettier-ignore -->
| Location                      | Description                              |
| ----------------------------- | ---------------------------------------- |
| `./src/typeorm/entity/*`      | Entity classes (models)                  |
| `./src/typeorm/migrations/*`  | Database migrations                      |
| `./src/typeorm/transformer/*` | TypeORM [column transformers](https://typeorm.io/entities#column-options) |
| `./src/providers/TypeORM/*`   | React context provider and utility hooks |
