import type { FC } from 'react';

import { Text, TextProps } from './Themed';

export const MonoText: FC<TextProps> = ({ style, ...props }) => (
  <Text {...props} style={[style, { fontFamily: 'SpaceMono' }]} />
);
