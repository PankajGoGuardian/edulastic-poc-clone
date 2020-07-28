import { useEffect } from "react";
import { get, isEmpty } from "lodash";
import { roleuser } from "@edulastic/constants";

export const usefetchProgressHook = (settings, fetchAction, user) => {
  useEffect(() => {
    const { requestFilters = {} } = settings;
    const { termId = "", schoolId } = requestFilters;
    let schoolIds = "";
    if (isEmpty(schoolId) && get(user, "role", "") === roleuser.SCHOOL_ADMIN) {
      schoolIds = get(user, "institutionIds", []).join(",");
    } else {
      schoolIds = schoolId;
    }
    if (termId) {
      fetchAction({ ...requestFilters, schoolIds });
    }
  }, [settings]);
};
