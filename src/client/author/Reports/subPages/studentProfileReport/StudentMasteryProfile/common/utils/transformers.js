import { map } from "lodash";

export const getDomainOptions = domains => {
  return [
    { key: "All", title: "All" },
    ...map(domains, domain => ({
      key: domain.domainId,
      title: domain.name
    }))
  ];
};
