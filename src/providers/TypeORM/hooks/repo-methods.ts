import { has, isPlainObject } from 'lodash-es';
import * as React from 'react';
import {
  ObjectLiteral,
  ObjectType,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { useLogger } from '@changeme/providers/LoggerProvider';

import { useRepo } from './repos';

export type FindAndCountOpts<T extends ObjectLiteral> = Parameters<
  Repository<T>['findAndCount']
>[0];

export const useFindAndCount = <T extends ObjectLiteral = ObjectLiteral>(
  entityType: ObjectType<T>,
) => {
  const log = useLogger();
  const entityRepo = useRepo(entityType);

  return React.useCallback(
    async (invokeOpts?: FindAndCountOpts<T>): Promise<[T[], number]> => {
      if (!entityRepo) {
        return [[], 0];
      }
      try {
        return await entityRepo.findAndCount(invokeOpts as any);
      } catch (e) {
        log?.error('Error loading Entities', e);
      }
      return [[], 0];
    },
    [entityRepo, log],
  );
};

export type FindOneOpts<T extends ObjectLiteral> = Parameters<
  Repository<T>['findOne']
>[0];

export const useFindOne = <T extends ObjectLiteral = ObjectLiteral>(
  entityType: ObjectType<T>,
) => {
  const log = useLogger();
  const entityRepo = useRepo(entityType);

  return React.useCallback(
    async (invokeOpts?: FindOneOpts<T>): Promise<T | null | undefined> => {
      if (!entityRepo) {
        return undefined;
      }
      try {
        return await entityRepo.findOne(invokeOpts as any);
      } catch (e) {
        log?.error('Error loading entity', e);
      }
      return undefined;
    },
    [entityRepo, log],
  );
};

export type CreateQueryBuilder<T extends ObjectLiteral = ObjectLiteral> =
  Repository<T>['createQueryBuilder'];

export type CreateQueryBuilderConfig<T extends ObjectLiteral = ObjectLiteral> =
  {
    entityType: ObjectType<T>;
    entityAlias: string;
  };
export type ObjectTypeOrConfig<T extends ObjectLiteral = ObjectLiteral> =
  | ObjectType<T>
  | CreateQueryBuilderConfig<T>;

export const isConfigOpt = <T extends ObjectLiteral = ObjectLiteral>(
  o: any,
): o is CreateQueryBuilderConfig<T> =>
  isPlainObject(o) && has(o, 'entityType') && has(o, 'entityAlias');

export const getConfig = <T extends ObjectLiteral = ObjectLiteral>(
  o: ObjectTypeOrConfig<T>,
): CreateQueryBuilderConfig<T> => {
  if (isConfigOpt(o)) {
    return o;
  }
  return {
    entityType: o,
    entityAlias: 'entity',
  };
};

export const useQueryBuilderGetMany = <T extends ObjectLiteral = ObjectLiteral>(
  entityTypeOrConfig: ObjectTypeOrConfig<T>,
  buildQuery: (qb: SelectQueryBuilder<T>) => typeof qb,
) => {
  const { entityType, entityAlias } = getConfig(entityTypeOrConfig);
  const log = useLogger();
  const entityRepo = useRepo(entityType);

  return React.useCallback(async () => {
    if (!entityRepo) {
      return undefined;
    }
    try {
      return await buildQuery(
        entityRepo.createQueryBuilder(entityAlias),
      ).getMany();
    } catch (e) {
      log?.error('Error loading entities via useQueryBuilderGetMany', e);
    }
    return undefined;
  }, [buildQuery, entityAlias, entityRepo, log]);
};

export const useQueryBuilderGetOne = <T extends ObjectLiteral = ObjectLiteral>(
  entityTypeOrConfig: ObjectTypeOrConfig<T>,
  entityId: string | null | undefined,
  buildQuery: (qb: SelectQueryBuilder<T>) => typeof qb,
) => {
  const { entityType, entityAlias } = getConfig(entityTypeOrConfig);
  const log = useLogger();
  const entityRepo = useRepo(entityType);

  return React.useCallback(async () => {
    if (!entityRepo) {
      return undefined;
    }
    try {
      return await buildQuery(entityRepo.createQueryBuilder(entityAlias))
        .where({ id: entityId })
        .getOne();
    } catch (e) {
      log?.error('Error loading entities via useQueryBuilderGetOne', e);
    }
    return undefined;
  }, [buildQuery, entityAlias, entityId, entityRepo, log]);
};

export const useQueryBuilderCount = <T extends ObjectLiteral = ObjectLiteral>(
  entityTypeOrConfig: ObjectTypeOrConfig<T>,
  buildQuery: (qb: SelectQueryBuilder<T>) => typeof qb,
) => {
  const { entityType, entityAlias } = getConfig(entityTypeOrConfig);
  const log = useLogger();
  const entityRepo = useRepo(entityType);

  return React.useCallback(async () => {
    if (!entityRepo) {
      return undefined;
    }
    try {
      return await buildQuery(
        entityRepo.createQueryBuilder(entityAlias),
      ).getCount();
    } catch (e) {
      log?.error('Error counting entities via useQueryBuilderCount', e);
    }
    return undefined;
  }, [buildQuery, entityAlias, entityRepo, log]);
};
