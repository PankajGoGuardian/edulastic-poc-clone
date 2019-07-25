import { useEffect } from "react";

export const usefetchProgressHook = (settings, fetchAction) => {
  useEffect(() => {
    const { requestFilters = {} } = settings;
    const { termId = "" } = requestFilters;

    if (termId) {
      fetchAction(requestFilters);
    }
  }, [settings]);
};
