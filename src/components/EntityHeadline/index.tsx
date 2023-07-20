import * as React from 'react';
import { useIntl } from 'react-intl';
import { View } from 'react-native';
import { Headline, IconButton } from 'react-native-paper';

interface EntityHeadlineProps
  extends Omit<React.ComponentProps<typeof View>, 'children'> {
  title: React.ReactNode;
  createButtonLabel?: string;
  reloadLabel?: string;
  onCreatePress?: () => void;
  onReloadPress?: () => void;
  noReload?: boolean;
  noCreate?: boolean;
}

export const EntityHeadline: React.FC<EntityHeadlineProps> = ({
  title,
  createButtonLabel,
  reloadLabel,
  onCreatePress,
  onReloadPress,
  noCreate = false,
  noReload = false,
  ...rest
}) => {
  const intl = useIntl();
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      {...rest}
    >
      <Headline>{title}</Headline>
      <View>
        {!noReload && (
          <IconButton
            icon="reload"
            onPress={onReloadPress}
            accessibilityLabel={
              reloadLabel ??
              intl.formatMessage({
                defaultMessage: 'Reload',
                id: 'fdCS5/',
              })
            }
          />
        )}
        {!noCreate && (
          <IconButton
            icon="plus-circle-outline"
            onPress={onCreatePress}
            accessibilityLabel={
              createButtonLabel ??
              intl.formatMessage({
                defaultMessage: 'Add',
                id: '2/2yg+',
              })
            }
          />
        )}
      </View>
    </View>
  );
};
