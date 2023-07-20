import { useCallback, useMemo, useState } from 'react';

export const useDisclose = (initiallyOpen?: boolean) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen || false);
  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  const onToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return useMemo(
    () => ({
      isOpen,
      onOpen,
      onClose,
      onToggle,
    }),
    [isOpen, onOpen, onClose, onToggle],
  );
};
