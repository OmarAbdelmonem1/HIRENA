import { useCallback, useState } from "react";

export default function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const setValue = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  }, []);

  const reset = useCallback((nextValues = initialValues) => {
    setValues(nextValues);
  }, [initialValues]);

  return { values, setValues, handleChange, setValue, reset };
}
