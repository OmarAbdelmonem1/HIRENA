import { useCallback, useEffect, useRef, useState } from "react";

export default function useNotice(duration = 4000) {
  const [notice, setNotice] = useState("");
  const timeoutRef = useRef(null);

  const showNotice = useCallback(
    (message) => {
      setNotice(message);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setNotice("");
        timeoutRef.current = null;
      }, duration);
    },
    [duration],
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return { notice, showNotice, clearNotice: () => setNotice("") };
}
