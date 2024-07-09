import { useRef } from 'react';

export default function useDebounce(defaultDelay = 1000) {
  const timeout = useRef<any>(null);

  function debounce(callback: () => any, delay = defaultDelay) {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(callback, delay);
  }

  return {
    debounce,
  };
}
