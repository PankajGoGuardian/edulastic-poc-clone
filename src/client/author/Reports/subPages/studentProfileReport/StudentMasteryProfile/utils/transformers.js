import { groupBy, map, intersection } from "lodash";

export const getDomainOptions = domains => {};

export const augumentDomainData = () => {};

export const getDomains = (metricInfo = [], rawDomainData = []) => {
  const groupedByDomain = groupBy(metricInfo, "domainId");
  const groupedRawDataByDomain = groupBy(rawDomainData, "tloId");

  const domainWithInformation = intersection(Object.keys(groupedRawDataByDomain), Object.keys(groupedByDomain));

  const domains = map(domainWithInformation, domainId => {
    const standardsInfo = groupedRawDataByDomain[domainId];
    const standards = groupedByDomain[domainId];

    const standardsWithInfo = map(standards, standard => {
      return find(standardsInfo, standardInfo => standard.standardId == standardInfo.eloId) || {};
    });

    return {
      domainId,
      standards,
      standardsWithInfo
    };
  });

  return domains;
};
