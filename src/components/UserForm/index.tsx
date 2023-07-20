import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash-es';
import * as React from 'react';
import { FormProvider, Resolver, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { IUserForm, emptyForm, makeSchema } from './schema.yup';

export type { IUserForm } from './schema.yup';

export interface UserFormProps {
  initialValue?: IUserForm;
  onSubmit?: (formData: IUserForm) => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialValue,
  onSubmit,
}) => {
  const intl = useIntl();
  const schema = React.useMemo(() => makeSchema({ intl }), [intl]);
  const formMethods = useForm<IUserForm>({
    resolver: yupResolver(schema) as Resolver<IUserForm>,
    defaultValues: async () => ({
      ...emptyForm,
      ...initialValue,
    }),
  });
  const { handleSubmit, formState, register } = formMethods;

  const canSubmit =
    formState.isDirty && formState.isValid && isEmpty(formState.errors);

  return (
    <FormProvider {...formMethods}>
      <View style={{ width: '100%' }}>
        <TextInput {...register('email')} />
        <HelperText type="error" visible={!!formState.errors.email}>
          Email address is invalid!
        </HelperText>
      </View>
      <View style={{ width: '100%', marginVertical: 2 }}>
        <Button
          onPress={onSubmit ? handleSubmit(onSubmit) : undefined}
          disabled={!canSubmit}
          style={{ flex: 1 }}
        >
          {intl.formatMessage({
            defaultMessage: 'Submit',
            id: 'wSZR47',
          })}
        </Button>
      </View>
    </FormProvider>
  );
};
