import type { IntlShape } from 'react-intl';
import * as yup from 'yup';

export interface MakeUserFormSchemaOpts {
  intl?: IntlShape;
}

const pickDefaultMessage = (md: { defaultMessage: string }) =>
  md.defaultMessage ?? '';

export const makeSchema = ({ intl }: MakeUserFormSchemaOpts) => {
  const formatMessage = intl?.formatMessage ?? pickDefaultMessage;
  return yup.object().shape({
    id: yup.string().optional(),
    email: yup
      .string()
      .trim()
      .email(
        formatMessage({
          defaultMessage: 'Please enter a valid email',
          id: 'prBAWB',
        }),
      )
      .required(
        formatMessage({
          defaultMessage: 'Email is required',
          id: 'cU/aSG',
        }),
      ),
    scoreValue: yup
      .string()
      .trim()
      .matches(
        /^\d+\.?\d*$/,
        formatMessage({
          defaultMessage: 'Enter a valid time',
          id: 'boYj75',
        }) ?? 'Enter a valid time',
      )
      .default('0'),
  });
};

export type IUserForm = yup.InferType<ReturnType<typeof makeSchema>>;

export const emptyForm: IUserForm = {
  id: '',
  email: '',
  scoreValue: '0',
};
