import { StyleSheet } from 'react-native';

import EditScreenInfo from '@changeme/components/EditScreenInfo';
import { Separator } from '@changeme/components/Separator';
import { Text, View } from '@changeme/components/Themed';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Separator />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}
