import { groupBy, map, intersection, find, keys } from "lodash";

export const getDomainOptions = domains => {};

export const augumentDomainData = () => {};

export const getDomains = (metricInfo = [], skillInfo = []) => {
  const groupedByDomain = groupBy(metricInfo, "domainId");
  const groupedSkillsByDomain = groupBy(skillInfo, "domainId");

  const validDomains = intersection(keys(groupedByDomain), keys(groupedSkillsByDomain));

  const domains = map(validDomains, domainId => {
    const standardsInfo = groupedSkillsByDomain[domainId];
    const standards = groupedByDomain[domainId];

    const standardsWithInfo = map(standards, standard => {
      return find(standardsInfo, standardInfo => standard.standardId == standardInfo.standardId);
    }).filter(standard => standard);

    return {
      domainId,
      standards,
      standardsWithInfo
    };
  });

  console.log(domains);

  return domains;
};
