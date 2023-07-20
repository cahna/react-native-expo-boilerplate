import { sum, values } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';

export interface UseLoadingStates {
  /** Whether any tasks are loading */
  loading: boolean;
  /** Return whether a specific task is loading */
  isTaskLoading: (key?: string) => boolean;

  setTaskLoading: (key?: string) => void;

  clearTaskLoading: (key?: string) => void;
}

export type LoadingStates = Record<string, number>;

const DEFAULT_LOADING_TASK_NAME = '_loading_' as const;

export const useLoadingStates = (
  initialState?: LoadingStates | (() => LoadingStates),
): UseLoadingStates => {
  const [tasksLoading, setTasksLoading] = useState<Record<string, number>>(
    initialState ?? {},
  );
  const numTasksLoading = useMemo(
    () => sum(values(tasksLoading)),
    [tasksLoading],
  );
  const isTaskLoading = useCallback(
    (key: string = DEFAULT_LOADING_TASK_NAME) => tasksLoading[key] > 0,
    [tasksLoading],
  );
  const loading = numTasksLoading > 0;
  const setTaskLoading = useCallback(
    (key: string = DEFAULT_LOADING_TASK_NAME) => {
      setTasksLoading((prevState) => ({
        ...prevState,
        [key]: (prevState[key] ?? 0) + 1,
      }));
    },
    [],
  );
  const clearTaskLoading = useCallback(
    (key: string = DEFAULT_LOADING_TASK_NAME) => {
      setTasksLoading((prevState) => ({
        ...prevState,
        [key]: (prevState[key] ?? 0) - 1,
      }));
    },
    [],
  );

  return {
    loading,
    setTaskLoading,
    clearTaskLoading,
    isTaskLoading,
  };
};
