import { uniqBy, filter } from "lodash";

export const getDomains = domains => uniqBy(filter(domains, item => item.tloId), "tloId");
