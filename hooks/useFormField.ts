import { useState } from 'react';

export function useFormField(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | undefined>();

  const reset = () => {
    setValue(initialValue);
    setError(undefined);
  };

  return {
    value,
    setValue,
    error,
    setError,
    reset,
  };
}
