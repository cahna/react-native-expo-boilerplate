import type { FC } from 'react';
import { StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';

import { View } from '@changeme/components/Themed';

const styles = StyleSheet.create({
  separator: {
    marginVertical: 16,
    height: 1,
    width: '100%',
  },
});

export const Separator: FC<ViewProps> = (props) => (
  <View
    style={styles.separator}
    lightColor="#eee"
    darkColor="rgba(255,255,255,0.1)"
    {...props}
  />
);
