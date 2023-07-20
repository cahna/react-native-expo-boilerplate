import { useCallback, useMemo, useState } from 'react';

export const useLoadingState = () => {
  const [state, setState] = useState(false);
  const toggleLoading = useCallback(() => {
    setState((prev) => !prev);
  }, []);
  const setLoading = useCallback((loading: boolean = true) => {
    setState(loading);
  }, []);
  const clearLoading = useCallback(() => {
    setState(false);
  }, []);
  return useMemo(
    () => ({ loading: state, setLoading, clearLoading, toggleLoading }),
    [state, setLoading, clearLoading, toggleLoading],
  );
};
