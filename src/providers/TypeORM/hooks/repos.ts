import * as React from 'react';
import { ObjectLiteral, ObjectType } from 'typeorm';

import { useTypeORM } from '../context';

export const useDataSource = () => useTypeORM().AppDataSource;

export const useRepository = <T extends ObjectLiteral = ObjectLiteral>(
  entityClass: ObjectType<T>,
) => {
  const ds = useDataSource();
  return React.useMemo(() => ds?.getRepository(entityClass), [entityClass, ds]);
};

export const useRepo = useRepository;
