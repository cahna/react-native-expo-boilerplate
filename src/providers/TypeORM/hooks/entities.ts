import { useFocusEffect } from 'expo-router';
import { identity } from 'lodash-es';
import * as React from 'react';
import { InteractionManager } from 'react-native';
import { ObjectLiteral, ObjectType, SelectQueryBuilder } from 'typeorm';

import { useLogger } from '@changeme/providers/LoggerProvider';

import {
  CreateQueryBuilderConfig,
  FindAndCountOpts,
  FindOneOpts,
  ObjectTypeOrConfig,
  isConfigOpt,
  useFindAndCount,
  useFindOne,
  useQueryBuilderCount,
  useQueryBuilderGetMany,
  useQueryBuilderGetOne,
} from './repo-methods';

type UseEntitiesOptions<T extends ObjectLiteral = ObjectLiteral> = Partial<
  FindAndCountOpts<T>
>;

export interface StatefulOptions {
  lazy?: boolean;
}

export interface UseEntitiesState<T extends ObjectLiteral = ObjectLiteral> {
  entities?: T[];
  count?: number;
  load: (opts?: UseEntitiesOptions<T>) => Promise<void>;
  reload: () => Promise<void>;
  isLoading: boolean;
  initialLoadComplete: boolean;
  opts?: FindAndCountOpts<T>;
}

export const useEntities = <T extends ObjectLiteral = ObjectLiteral>(
  entityType: ObjectType<T>,
  { lazy = false, ...opts }: UseEntitiesOptions<T> & StatefulOptions = {},
): UseEntitiesState<T> => {
  const log = useLogger();
  const [isLoading, setIsLoading] = React.useState(0);
  const [initialLoadAttempted, setInitialLoadAttempted] = React.useState(false);
  const findAndCount = useFindAndCount(entityType);
  const [optsState, setOptsState] = React.useState(() => opts);
  const [state, setState] = React.useState<
    Omit<UseEntitiesState<T>, 'load' | 'reload'>
  >({
    isLoading: false,
    initialLoadComplete: false,
  });

  const loadEntities = React.useCallback(
    async (invokeOpts?: UseEntitiesOptions<T>) => {
      if (!findAndCount) {
        return;
      }
      setIsLoading((n) => n + 1);
      try {
        const [loadedEntities, count] = await findAndCount({
          cache: true,
          ...(invokeOpts as any),
        });
        setState((prev) => ({
          ...prev,
          entities: loadedEntities,
          count,
          initialLoadAttempted: true,
          initialLoadComplete: true,
        }));
        setOptsState(invokeOpts as any);
      } catch (e) {
        log?.error('Error loading Entities', e);
      } finally {
        setIsLoading((n) => n - 1);
      }
    },
    [findAndCount, log],
  );

  useFocusEffect(
    React.useCallback(() => {
      if (lazy || initialLoadAttempted) {
        return undefined;
      }
      setInitialLoadAttempted(true);
      const task = InteractionManager.runAfterInteractions(() =>
        loadEntities(optsState),
      );

      return () => task.cancel();
    }, [initialLoadAttempted, lazy, loadEntities, optsState]),
  );

  return {
    entities: state.entities,
    count: state.count,
    load: loadEntities,
    reload: () => loadEntities(optsState),
    isLoading: isLoading > 0,
    initialLoadComplete: !!state.initialLoadComplete,
    opts: optsState as FindAndCountOpts<T>,
  };
};

type UseEntityOptions<T extends ObjectLiteral = ObjectLiteral> = Partial<
  FindOneOpts<T>
>;

export interface UseEntityState<T extends ObjectLiteral = ObjectLiteral> {
  entity?: T | null;
  load: (opts?: UseEntityOptions<T>) => Promise<void>;
  reload: () => Promise<void>;
  isLoading: boolean;
  initialLoadComplete: boolean;
  opts?: FindOneOpts<T>;
}

export const useEntity = <T extends ObjectLiteral = ObjectLiteral>(
  entityType: ObjectType<T>,
  entityId?: string,
  { lazy = false, ...opts }: UseEntityOptions<T> & StatefulOptions = {},
): UseEntityState<T> => {
  const log = useLogger();
  const [isLoading, setIsLoading] = React.useState(0);
  const [initialLoadAttempted, setInitialLoadAttempted] = React.useState(false);
  const findOne = useFindOne(entityType);
  const [optsState, setOptsState] = React.useState(() => opts);
  const [state, setState] = React.useState<
    Pick<UseEntityState<T>, 'entity' | 'isLoading' | 'initialLoadComplete'>
  >({
    entity: null,
    initialLoadComplete: false,
    isLoading: false,
  });

  const loadEntity = React.useCallback(
    async (invokeOpts?: UseEntityOptions<T>) => {
      if (!findOne) {
        return;
      }
      setIsLoading((n) => n + 1);
      try {
        const entity = await findOne({
          cache: true,
          where: { id: entityId },
          ...(invokeOpts as any),
        });
        setState((prev) => ({
          ...prev,
          entity,
          initialLoadAttempted: true,
          initialLoadComplete: true,
        }));
        setOptsState(invokeOpts as any);
      } catch (e) {
        log?.error(`Error loading entity: ${entityId}`, e);
      } finally {
        setIsLoading((n) => n - 1);
      }
    },
    [entityId, findOne, log],
  );

  useFocusEffect(
    React.useCallback(() => {
      if (lazy || initialLoadAttempted) {
        return undefined;
      }
      setInitialLoadAttempted(true);
      const task = InteractionManager.runAfterInteractions(() =>
        loadEntity(optsState),
      );

      return () => task.cancel();
    }, [initialLoadAttempted, lazy, loadEntity, optsState]),
  );

  return {
    entity: state.entity,
    load: loadEntity,
    reload: () => loadEntity(optsState),
    isLoading: isLoading > 0,
    initialLoadComplete: !!state.initialLoadComplete,
    opts: optsState as FindAndCountOpts<T>,
  };
};

export type ObjectTypeOrConfigStateful<
  T extends ObjectLiteral = ObjectLiteral,
> = ObjectTypeOrConfig<T> & StatefulOptions;

export const useQBStateGetMany = <T extends ObjectLiteral = ObjectLiteral>(
  entityTypeOrConfig: ObjectTypeOrConfigStateful<T>,
  buildQuery: (qb: SelectQueryBuilder<T>) => typeof qb,
) => {
  const [state, setState] = React.useState<UseEntitiesState<T>>({
    load: async () => {},
    reload: async () => {},
    isLoading: false,
    initialLoadComplete: false,
  });
  const runQuery = useQueryBuilderGetMany(entityTypeOrConfig, buildQuery);
  const reload = React.useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    InteractionManager.runAfterInteractions(async () => {
      const entities = await runQuery();
      setState((prev) => ({
        ...prev,
        entities,
        count: entities?.length ?? 0,
        initialLoadComplete: true,
        isLoading: false,
      }));
    });
  }, [runQuery]);

  useFocusEffect(
    React.useCallback(() => {
      if (entityTypeOrConfig?.lazy === true) {
        return undefined;
      }
      const task = InteractionManager.runAfterInteractions(async () =>
        reload(),
      );
      return () => task.cancel();
    }, [entityTypeOrConfig?.lazy, reload]),
  );

  return {
    ...state,
    reload,
  };
};

export interface UseQBStateGetOne<T extends ObjectLiteral = ObjectLiteral> {
  entity?: T | null;
  load: (opts?: UseEntitiesOptions<T>) => Promise<void>;
  reload: () => Promise<void>;
  isLoading: boolean;
  initialLoadComplete: boolean;
  opts?: FindAndCountOpts<T>;
}

const isStatefulConfigOpt = <T extends ObjectLiteral = ObjectLiteral>(
  o: any,
): o is CreateQueryBuilderConfig<T> => isConfigOpt(o);

const getStatefulConfig = <T extends ObjectLiteral = ObjectLiteral>(
  o: ObjectTypeOrConfigStateful<T>,
): CreateQueryBuilderConfig<T> & StatefulOptions => {
  if (isStatefulConfigOpt(o)) {
    return o;
  }
  return {
    entityType: o,
    entityAlias: 'entity',
  };
};

const asyncNoop = async () => {};

export const useQBStateGetOne = <T extends ObjectLiteral = ObjectLiteral>(
  entityTypeOrConfig: ObjectTypeOrConfigStateful<T>,
  entityId: string | null | undefined,
  buildQuery: (qb: SelectQueryBuilder<T>) => typeof qb,
): UseQBStateGetOne<T> => {
  const opts = getStatefulConfig(entityTypeOrConfig);
  const [state, setState] = React.useState<UseQBStateGetOne<T>>(() => ({
    entity: null,
    load: asyncNoop,
    reload: asyncNoop,
    isLoading: false,
    initialLoadComplete: false,
  }));
  const runQuery = useQueryBuilderGetOne(
    entityTypeOrConfig,
    entityId,
    buildQuery,
  );
  const reload = React.useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const entity = await runQuery();
    setState((prevState) => ({
      ...prevState,
      entity,
      initialLoadComplete: true,
      isLoading: false,
    }));
  }, [runQuery]);

  useFocusEffect(
    React.useCallback(() => {
      if (opts?.lazy) {
        return undefined;
      }
      const task = InteractionManager.runAfterInteractions(async () =>
        reload(),
      );
      return () => task.cancel();
    }, [opts?.lazy, reload]),
  );

  return {
    ...state,
    reload,
  };
};

export interface UseQBStateCount<T extends ObjectLiteral = ObjectLiteral> {
  count?: number | null;
  load: (opts?: UseEntitiesOptions<T>) => Promise<void>;
  reload: () => Promise<void>;
  isLoading: boolean;
  initialLoadComplete: boolean;
  opts?: FindAndCountOpts<T>;
}

export const useQBCount = <T extends ObjectLiteral = ObjectLiteral>(
  entityTypeOrConfig: ObjectTypeOrConfigStateful<T>,
  buildQuery: (qb: SelectQueryBuilder<T>) => typeof qb = identity,
): UseQBStateCount<T> => {
  const opts = getStatefulConfig(entityTypeOrConfig);
  const [state, setState] = React.useState<UseQBStateCount<T>>(() => ({
    count: null,
    load: asyncNoop,
    reload: asyncNoop,
    isLoading: false,
    initialLoadComplete: false,
  }));
  const runQuery = useQueryBuilderCount(entityTypeOrConfig, buildQuery);
  const reload = React.useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const count = await runQuery();
    setState((prevState) => ({
      ...prevState,
      count,
      initialLoadComplete: true,
      isLoading: false,
    }));
  }, [runQuery]);

  useFocusEffect(
    React.useCallback(() => {
      if (opts?.lazy) {
        return undefined;
      }
      const task = InteractionManager.runAfterInteractions(async () =>
        reload(),
      );
      return () => task.cancel();
    }, [opts?.lazy, reload]),
  );

  return {
    ...state,
    reload,
  };
};
