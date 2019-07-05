import next from "immer";
import { groupBy, sumBy, round, forEach, get, maxBy, find, map, orderBy, includes, filter, ceil } from "lodash";
import { ceilingPercentage, processGroupIds, processSchoolIds, processTeacherIds } from "../../../../common/util";

const analyseKeys = {
  masteryScore: "Mastery Score",
  score: "Avg.Score(%)",
  rawScore: "Avg.Score",
  masteryLevel: "Mastery Level"
};

const getCompareByKey = compareBy => {
  switch (compareBy.toLowerCase()) {
    case "school":
      return "schoolId";
    case "teacher":
      return "teacherId";
    case "group":
      return "groupId";
    case "student":
      return "studentId";
    default:
      return "";
  }
};

export const getTicks = maxScore => {
  let ticks = [];

  for (let i = 0; i <= maxScore; i++) {
    ticks.push(i);
  }

  return ticks;
};

export const getOptionFromKey = (options, key) => find(options, option => option.key === key) || options[0];

export const getMaxMasteryScore = (scaleInfo = []) => {
  const maxMasteryScore = get(maxBy(scaleInfo, "score"), "score", 0);
  return maxMasteryScore;
};

export const getMasteryLevelOptions = scaleInfo => {
  let options = [
    { key: "all", title: "All" },
    ...map(scaleInfo, masteryLevel => ({
      key: masteryLevel.masteryLabel,
      title: masteryLevel.masteryName
    }))
  ];
  return options;
};

export const groupedByDomain = (metricInfo = [], maxScore, scaleInfo = [], selectedDomains, rawDomainData) => {
  const domains = groupBy(metricInfo, "domainId");
  return Object.keys(domains).map(domainId => {
    const domainData = domains[domainId];

    const masteryScore = getOverallMasteryScore(domainData);
    const score = ceilingPercentage(sumBy(domainData, "totalScore"), sumBy(domainData, "maxScore"));
    const rawScore = `${sumBy(domainData, "totalScore")} / ${sumBy(domainData, "maxScore")}`;
    const masteryLevel = getRecordMasteryLevel(domainData, scaleInfo).masteryLabel;
    const domainMetaInformation = find(rawDomainData, rawDomain => rawDomain.tloId === domainId);

    return {
      domainId: domainId,
      domainName: domainMetaInformation ? domainMetaInformation.tloIdentifier : "",
      masteryScore: masteryScore,
      diffMasteryScore: maxScore - round(masteryScore, 2),
      score: score,
      rawScore,
      masteryLevel,
      records: domainData,
      fill:
        includes(selectedDomains, domainId) || !selectedDomains.length
          ? getMasteryLevel(masteryScore, scaleInfo).color
          : "#cccccc"
    };
  });
};

// Table data utils

const getRowInfo = (dataSource, compareByKey, value) => {
  switch (compareByKey) {
    case "studentId":
      return find(dataSource.studInfo, student => student.studentId === value);
    case "teacherId":
    case "schoolId":
    case "groupId":
      return find(dataSource.orgData, org => org[compareByKey] === value);
  }
};

const getRowName = (compareByKey, rowInfo = {}) => {
  switch (compareByKey) {
    case "studentId":
      return `${rowInfo.firstName} ${rowInfo.lastName}`;
    case "teacherId":
      return `${rowInfo.teacherName}`;
    case "schoolId":
      return `${rowInfo.schoolName}`;
    case "groupId":
      return `${rowInfo.groupName}`;
  }
};

export const getCompareByData = (metricInfo = [], compareBy, filterData) => {
  const compareByKey = getCompareByKey(compareBy);

  if (!compareByKey) {
    return [];
  }

  const compareByData = groupBy(metricInfo, compareByKey);

  return Object.keys(compareByData).map((itemId, index) => {
    const records = compareByData[itemId];
    const domainData = {};

    forEach(records, domain => {
      domainData[domain.domainId] = domain;
    });

    const rowInfo = getRowInfo(filterData, compareByKey, itemId) || {};

    return {
      id: itemId,
      name: getRowName(compareByKey, rowInfo) || "",
      domainData,
      records,
      rowInfo
    };
  });
};

export const getTableData = (metricInfo = [], appliedFilters, filterData) => {
  const { scaleInfo = [] } = filterData;

  const compareByData = getCompareByData(metricInfo, appliedFilters.compareBy.key, filterData);
  let filteredData = compareByData;

  if (appliedFilters.masteryLevel.key && appliedFilters.masteryLevel.key !== "all") {
    filteredData = filter(
      compareByData,
      item => getRecordMasteryLevel(item.records, scaleInfo).masteryLabel === appliedFilters.masteryLevel.key
    );
  }

  return filteredData;
};

// Table column related utils
export const getScore = record => ceilingPercentage(record.totalScore, record.maxScore);
export const getOverallScore = records => ceilingPercentage(sumBy(records, "totalScore"), sumBy(records, "maxScore"));
export const getMasteryScore = record => round(record.fmSum / parseInt(record.fmCount), 2);
export const getMasteryScoreColor = (domain, scaleInfo) => getMasteryLevel(getMasteryScore(domain), scaleInfo).color;
export const getAnalyseByTitle = key => analyseKeys[key] || "";
export const getLeastMasteryLevel = (scaleInfo = []) =>
  orderBy(scaleInfo, "score", ["desc"])[scaleInfo.length - 1] || { masteryLabel: "" };

export const getOverallMasteryScore = records =>
  records.length ? round(sumBy(records, "fmSum") / sumBy(records, domain => parseInt(domain.fmCount)), 2) : 0;

export const getOverallValue = (record = [], analyseByKey, scaleInfo) => {
  switch (analyseByKey) {
    case "masteryScore":
      return getOverallMasteryScore(record.records);
    case "score":
      return `${getOverallScore(record.records)}%`;
    case "rawScore":
      return `${sumBy(record.records, "totalScore")} / ${sumBy(record.records, "maxScore")}`;
    case "masteryLevel":
      return getRecordMasteryLevel(record.records, scaleInfo).masteryLabel;
    default:
      return analyseByKey;
  }
};

export const getMasteryLevel = (score, scaleInfo) => {
  for (const obj of scaleInfo) {
    if (ceil(score) >= obj.score) {
      return obj || getLeastMasteryLevel(scaleInfo);
    }
  }

  return getLeastMasteryLevel(scaleInfo);
};

const getRecordMasteryLevel = (records, scaleInfo) => {
  const score = getOverallMasteryScore(records);
  return getMasteryLevel(score, scaleInfo);
};

export const getParsedData = (
  metricInfo,
  maxMasteryScore,
  tableFilters,
  selectedDomains,
  rawDomainData,
  filterData
) => {
  return {
    domainsData: groupedByDomain(metricInfo, maxMasteryScore, filterData.scaleInfo, selectedDomains, rawDomainData),
    tableData: getTableData(metricInfo, tableFilters, filterData)
  };
};

export const getDropDownData = (orgData = [], role = "") => {
  let groupdIds = processGroupIds(orgData);

  let dropDownDataOptions = [];

  let filterInitState = {};

  if (role !== "teacher") {
    const schoolIds = processSchoolIds(orgData);
    const groupIds = processTeacherIds(orgData);

    filterInitState = next(filterInitState, draft => {
      draft["schoolId"] = schoolIds[0];
      draft["teacherId"] = groupIds[0];
    });

    dropDownDataOptions = next(dropDownDataOptions, draft => {
      draft.push(
        {
          key: "schoolId",
          title: "School",
          data: schoolIds
        },
        {
          key: "teacherId",
          title: "Teacher",
          data: groupIds
        }
      );
    });
  }

  dropDownDataOptions = next(dropDownDataOptions, draft => {
    draft.push({
      key: "groupId",
      title: "Class",
      data: processGroupIds(orgData)
    });
  });

  filterInitState = next(filterInitState, draft => {
    draft["groupId"] = groupdIds[0];
  });

  return [dropDownDataOptions, filterInitState];
};
