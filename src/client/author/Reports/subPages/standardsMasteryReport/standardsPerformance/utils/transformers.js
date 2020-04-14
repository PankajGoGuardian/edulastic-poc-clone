import next from "immer";
import { groupBy, sumBy, round, forEach, get, maxBy, find, map, orderBy, includes, filter } from "lodash";
import {
  roundedPercentage,
  processClassAndGroupIds,
  processSchoolIds,
  processTeacherIds
} from "../../../../common/util";

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
    case "class":
      return "groupId";
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

export const getLeastMasteryLevel = (scaleInfo = []) =>
  orderBy(scaleInfo, "score", ["desc"])[scaleInfo.length - 1] || { masteryLabel: "" };

export const getOverallMasteryScore = records =>
  records.length ? (sumBy(records, "fmSum") / sumBy(records, domain => parseInt(domain.fmCount, 10))).toFixed(2) : 0;

export const getMasteryLevel = (score, scaleInfo) => {
  for (const obj of scaleInfo) {
    if (round(score) === obj.score) {
      return obj || getLeastMasteryLevel(scaleInfo);
    }
  }

  return getLeastMasteryLevel(scaleInfo);
};

export const getRecordMasteryLevel = (records, scaleInfo) => {
  const score = getOverallMasteryScore(records);
  return getMasteryLevel(score, scaleInfo);
};

export const getOptionFromKey = (options, key) => find(options, option => option.key === key) || options[0];

export const getMaxMasteryScore = (scaleInfo = []) => {
  const maxMasteryScore = get(maxBy(scaleInfo, "score"), "score", 0);
  return maxMasteryScore;
};

export const getMasteryLevelOptions = scaleInfo => {
  const options = [
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
  return Object.keys(domains)
    .map(domainId => {
      const domainData = domains[domainId];

      const masteryScore = getOverallMasteryScore(domainData);
      const score = round((sumBy(domainData, "totalScore") / sumBy(domainData, "maxScore")) * 100);
      const rawScore = `${sumBy(domainData, "totalScore").toFixed(2)} / ${sumBy(domainData, "maxScore")}`;
      const masteryLevel = getRecordMasteryLevel(domainData, scaleInfo).masteryLabel;
      const domainMetaInformation = find(rawDomainData, rawDomain => `${rawDomain.tloId}` === `${domainId}`);

      return {
        domainId,
        domainName: domainMetaInformation ? domainMetaInformation.tloIdentifier : "",
        masteryScore,
        diffMasteryScore: maxScore - round(masteryScore, 2),
        score,
        rawScore,
        masteryLevel,
        records: domainData,
        fill:
          includes(selectedDomains, domainId) || !selectedDomains.length
            ? getMasteryLevel(masteryScore, scaleInfo).color
            : "#cccccc"
      };
    })
    .sort((a, b) => a.domainName.localeCompare(b.domainName));
};

// Table data utils
const getFormattedName = name => {
  const nameArr = (name || "").trim().split(" ");
  const lName = nameArr.splice(nameArr.length - 1)[0];
  return nameArr.length ? lName + ", " + nameArr.join(" ") : lName;
};

const getRowInfo = (dataSource, compareByKey, value) => {
  switch (compareByKey) {
    case "studentId":
      return find(dataSource.studInfo, student => student.studentId === value);
    case "teacherId":
    case "schoolId":
      return find(dataSource.orgData, org => org[compareByKey] === value);
    case "classId":
      return find(dataSource.orgData, org => org[compareByKey] === value && org.groupType === "class");
    case "groupId":
      return find(dataSource.orgData, org => org[compareByKey] === value && org.groupType === "custom");
  }
};

const getRowName = (compareByKey, rowInfo = {}) => {
  switch (compareByKey) {
    case "studentId":
      return getFormattedName(`${rowInfo.firstName || ""} ${rowInfo.lastName || ""}`);
    case "teacherId":
      return `${rowInfo.teacherName}`;
    case "schoolId":
      return `${rowInfo.schoolName}`;
    case "classId":
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

export const getTableData = (metricInfo = [], appliedFilters, filterData, scaleInfo = []) => {
  const compareByData = getCompareByData(metricInfo, appliedFilters.compareBy.key, filterData);
  let filteredData = compareByData;

  if (appliedFilters.masteryLevel.key && appliedFilters.masteryLevel.key !== "all") {
    filteredData = filter(
      compareByData,
      item => getRecordMasteryLevel(item.records, scaleInfo).masteryLabel === appliedFilters.masteryLevel.key
    );
  }

  return filteredData.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
};

// Table column related utils
export const getScore = record => roundedPercentage(record.totalScore, record.maxScore);
export const getOverallScore = records => roundedPercentage(sumBy(records, "totalScore"), sumBy(records, "maxScore"));
export const getOverallRawScore = records => {
  const maxScoreSum = sumBy(records, "maxScore");
  const totalScoreSum = sumBy(records, "totalScore") || 0;
  return maxScoreSum ? `${totalScoreSum.toFixed(2)} / ${maxScoreSum}` : 0;
};
export const getMasteryScore = record => round(record.fmSum / parseInt(record.fmCount, 10), 2);
export const getMasteryScoreColor = (domain, scaleInfo) => getMasteryLevel(getMasteryScore(domain), scaleInfo).color;
export const getAnalyseByTitle = key => analyseKeys[key] || "";

export const getOverallValue = (record = [], analyseByKey, scaleInfo) => {
  switch (analyseByKey) {
    case "masteryScore":
      return getOverallMasteryScore(record.records);
    case "score":
      return `${getOverallScore(record.records)}%`;
    case "rawScore":
      return getOverallRawScore(record.records);
    case "masteryLevel":
      return getRecordMasteryLevel(record.records, scaleInfo).masteryLabel;
    default:
      return analyseByKey;
  }
};

export const getParsedData = (
  metricInfo,
  maxMasteryScore,
  tableFilters,
  selectedDomains,
  rawDomainData,
  filterData,
  scaleInfo = []
) => {
  return {
    domainsData: groupedByDomain(metricInfo, maxMasteryScore, scaleInfo, selectedDomains, rawDomainData),
    tableData: getTableData(metricInfo, tableFilters, filterData, scaleInfo)
  };
};

export const getDropDownData = (orgData = [], role = "") => {
  const [classIdsArr, groupIdsArr] = processClassAndGroupIds(orgData);

  let dropDownDataOptions = [],
    filterInitState = {};

  if (role !== "teacher") {
    const schoolIds = processSchoolIds(orgData);
    const teacherIds = processTeacherIds(orgData);

    filterInitState = next(filterInitState, draft => {
      draft["schoolId"] = schoolIds[0];
      draft["teacherId"] = teacherIds[0];
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
          data: teacherIds
        }
      );
    });
  }

  dropDownDataOptions = next(dropDownDataOptions, draft => {
    draft.push(
      {
        key: "classId",
        title: "Class",
        data: classIdsArr
      },
      {
        key: "groupId",
        title: "Group",
        data: groupIdsArr
      }
    );
  });

  filterInitState = next(filterInitState, draft => {
    draft["classId"] = classIdsArr[0];
    draft["groupId"] = groupIdsArr[0];
  });

  return [dropDownDataOptions, filterInitState];
};
