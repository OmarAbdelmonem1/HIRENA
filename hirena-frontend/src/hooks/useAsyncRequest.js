import { useCallback, useRef, useState } from "react";
import getErrorMessage from "../utils/getErrorMessage";

export default function useAsyncRequest(request, options = {}) {
  const { initialData = null, onError } = options;
  const requestRef = useRef(request);
  requestRef.current = request;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError("");
    try {
      const result = await requestRef.current(...args);
      setData(result);
      return result;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      onError?.(requestError);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [onError]);

  return { data, setData, loading, error, setError, execute };
}
