import { groupBy, map, intersection, find, keys, filter, orderBy, round } from "lodash";
import { getProficiencyBand, percentage } from "../../../../../common/util";

export const getDomainOptions = domains => {
  return [
    { key: "All", title: "All" },
    ...map(domains, domain => ({
      key: domain.domainId,
      title: domain.name
    }))
  ];
};

export const getMaxScale = (scaleInfo = []) => orderBy(scaleInfo, "thresold", ["desc"])[0] || {};

export const getOverallMasteryPercentage = (records, maxScale) => {
  const masteredStandards = filter(records, record => record.scale.masteryName === maxScale.masteryName);
  return percentage(masteredStandards.length, records.length);
};

const augmentStandardMetaInfo = (standards = [], skillInfo = [], scaleInfo) => {
  const groupedSkillsByStandard = groupBy(skillInfo, "standardId");

  const standardsWithInfo = map(standards, standard => {
    const currentStandardRecords = groupedSkillsByStandard[standard.standardId] || [];
    if (currentStandardRecords[0]) {
      const score = percentage(standard.totalScore, standard.maxScore);
      const scale = getProficiencyBand(score, scaleInfo);

      return {
        ...standard,
        ...currentStandardRecords[0],
        masteryName: scale.masteryName,
        score: round(score),
        scoreFormatted: `${round(score)}%`,
        assessmentCount: 0,
        totalQuestions: 0,
        scale
      };
    } else {
      return null;
    }
  }).filter(standard => standard);

  return standardsWithInfo;
};

export const getDomains = (metricInfo = [], skillInfo = [], scaleInfo = []) => {
  if (!metricInfo.length) {
    return [[], []];
  }

  const metricWithStandardInfo = augmentStandardMetaInfo(metricInfo, skillInfo, scaleInfo);
  const groupedByDomain = groupBy(metricWithStandardInfo, "domainId");
  const maxScale = getMaxScale(scaleInfo);

  const domains = map(keys(groupedByDomain), domainId => {
    const standards = groupedByDomain[domainId];
    const { domainName = "", domain = "" } = standards[0] || {};
    const masteryScore = getOverallMasteryPercentage(standards, maxScale);

    return {
      domainId,
      standards,
      masteryScore,
      name: domain,
      description: domainName
    };
  });

  return [domains, metricWithStandardInfo];
};

export const getStudentPerformancePieData = (metricInfo = [], scaleInfo = []) => {
  const groupedByMastery = groupBy(metricInfo, metric => metric.scale.masteryLabel);
  const pieData = map(groupedByMastery, (records, masteryLabel) => {
    const { masteryName = "", color = "" } = records[0].scale;
    return {
      percentage: round(percentage(records.length, metricInfo.length)),
      count: records.length,
      masteryLabel,
      masteryName,
      color
    };
  });
  return pieData;
};
