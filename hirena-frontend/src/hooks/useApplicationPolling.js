import { useEffect } from "react";

export default function useApplicationPolling(load, enabled, interval = 3000) {
  useEffect(() => {
    if (!enabled) return undefined;

    const poll = window.setInterval(load, interval);
    return () => window.clearInterval(poll);
  }, [enabled, interval, load]);
}
