import * as React from 'react';

import type { IUserForm } from '@changeme/components/UserForm';
import { useLogger } from '@changeme/providers/LoggerProvider';
import { User } from '@changeme/typeorm/entity';

import { useRepo } from '../repos';

export type CreateUserCallback = (
  formData: IUserForm,
) => Promise<User | undefined>;

export const useCreateUser = (): CreateUserCallback => {
  const log = useLogger();
  const userRepo = useRepo(User);

  return React.useCallback(
    async (userInput: IUserForm) => {
      if (!userRepo) {
        return undefined;
      }
      log?.debug('creating User', userInput);
      try {
        // Return existing competitor, if exists
        const existingUser = await userRepo.findOne({
          where: { email: userInput.email },
        });

        if (existingUser) {
          log?.debug(
            `Competitor already exists: ${existingUser.email}, ${existingUser.id}`,
          );
          return existingUser;
        }

        const newUser = new User();
        newUser.email = userInput.email;

        const savedUser = await userRepo.save(newUser);
        if (savedUser) {
          log?.debug('User saved', savedUser);
        } else {
          log?.warn('User not saved');
        }
        return savedUser;
      } catch (e) {
        log?.error('Error creating User', e);
      }
      return undefined;
    },
    [userRepo, log],
  );
};
