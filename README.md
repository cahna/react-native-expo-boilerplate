# react-native-expo-boilerplate

![react-native-expo-boilerplate](https://github.com/cahna/react-native-expo-boilerplate/actions/workflows/main.yaml/badge.svg)

## Includes

- [React Native](https://reactnative.dev/) - UI Framework and cross-platform tooling
- [Expo](https://expo.dev/) - Managed React Native service for building and deploying cross-playform apps
- [Expo Router](https://expo.github.io/router/docs/) **v2** - Routing library
- [Redux](https://redux.js.org/) - State container
- [redux-persist](https://github.com/rt2zz/redux-persist) - Persistent store with migrations support
- [redux-saga](https://redux-saga.js.org/docs/About) - Manage asynchronous workflows
- [react-native-ble-manager](https://github.com/innoveit/react-native-ble-manager) - BLE interface
- [react-native-paper](https://callstack.github.io/react-native-paper/3.0/) - UI Component library
- [TypeORM](https://typeorm.io/) - ORM and database migrations

## Development

1. Install prerequisites (ie: android sdk, nodejs, npm/npx, react-native, expo-cli)
2. Install dependencies: `npm install`
3. Run on android emulator: `npm run android --clear`

### Notes

- Avoid the Expo GO-related commands (for Android, at least)
  - Expo GO builds cannot be used for development/deployment because custom native code must be included for BLE (and other) dependencies that are not included in the default build of Expo GO.
  - The commands are included for conventience, and possible future use with web or ios
  - Expo GO can be used if Bluetooth support is not needed and removed from the code
