import React from "react";
import moment from "moment";
import next from "immer";
import {
  max,
  min,
  filter,
  map,
  find,
  orderBy,
  ceil,
  groupBy,
  sumBy,
  floor,
  forEach,
  includes,
  maxBy,
  get
} from "lodash";
import { filterData, getHSLFromRange1 } from "../../../../common/util";
import { CustomTableTooltip } from "../../../../common/components/customTableTooltip";
import TableTooltipRow from "../../../../common/components/tooltip/TableTooltipRow";

const filterColumnsAccordingToRole = (columns, role) =>
  filter(columns, column => !includes(column.hiddenFromRole, role));

export const getInterval = maxValue => min([maxValue, 9]);

export const createTicks = (maxValue, interval) => {
  let maxTickRange = ceil(maxValue / interval) * interval;

  let ticks = [];

  ticks.push(maxTickRange + ceil(maxValue / interval));

  while (maxTickRange > 0) {
    ticks.push(maxTickRange);
    maxTickRange -= ceil(maxValue / interval);
  }

  return ticks;
};

export const getProficiencyBandData = bandInfo => {
  let proficiencyBandOptions = [{ key: "All", title: "All" }];

  if (bandInfo) {
    proficiencyBandOptions = proficiencyBandOptions.concat(
      map(bandInfo, band => ({
        key: band.name,
        title: band.name
      }))
    );
  }

  return proficiencyBandOptions;
};

const groupData = data => {
  const maxTotalScore = get(maxBy(data, "totalScore"), "totalScore", 0);

  let dataToPlotHashMap = {};

  let i = 0;

  while (maxTotalScore + 1 >= i) {
    dataToPlotHashMap[i] = {
      name: i,
      studentCount: 0
    };
    i++;
  }

  forEach(data, ({ totalScore }) => {
    const floorValue = floor(totalScore);
    if (dataToPlotHashMap[floorValue]) {
      dataToPlotHashMap[floorValue].studentCount++;
    }
  });

  return map(dataToPlotHashMap, dataItem => dataItem);
};

export const parseData = ({ studentMetricInfo = [] }, filter) => {
  const filteredData = filterData(studentMetricInfo, filter);
  const groupedData = groupData(filteredData);

  return groupedData.length ? groupedData : [{ name: 0, studentCount: 0 }];
};

const getLeastProficiency = (bandInfo = []) =>
  orderBy(bandInfo, "threshold", ["desc"])[bandInfo.length - 1] || { name: "" };

export const getProficiency = (item, bandInfo) => {
  for (const obj of bandInfo) {
    if ((item.totalScore / item.maxScore) * 100 >= obj.threshold) {
      return obj.name || getLeastProficiency(bandInfo).name;
    }
  }
};

export const normaliseTableData = (rawData, data) => {
  const { bandInfo = {}, metaInfo = [], schoolMetricInfo = [], studentMetricInfo = [], districtAvgPerf = 0 } = rawData;

  const classes = groupBy(studentMetricInfo, "groupId");

  return map(data, studentMetric => {
    const relatedGroup =
      find(metaInfo, meta => {
        return studentMetric.groupId == meta.groupId;
      }) || {};

    const relatedSchool =
      find(schoolMetricInfo, school => {
        return relatedGroup.schoolId == school.schoolId;
      }) || {};

    const classAvg = ceil(
      (sumBy(classes[studentMetric.groupId], "totalScore") / sumBy(classes[studentMetric.groupId], "maxScore")) * 100
    );
    let studentScore = 0;
    let assessmentScore = "Absent";
    let proficiencyBand = "Absent";
    if (studentMetric.progressStatus === 1) {
      studentScore = ceil((studentMetric.totalScore / studentMetric.maxScore) * 100);
      assessmentScore = `${studentMetric.totalScore.toFixed(2)} / ${studentMetric.maxScore.toFixed(2)}`;
      proficiencyBand = getProficiency(studentMetric, bandInfo);
    }

    return {
      ...studentMetric,
      student: `${studentMetric.firstName} ${studentMetric.lastName}`,
      proficiencyBand,
      school: relatedGroup.schoolName,
      teacher: relatedGroup.teacherName,
      className: relatedGroup.className,
      schoolAvg: ceil(relatedSchool.schoolAvgPerf || 0),
      districtAvg: ceil(districtAvgPerf || 0),
      studentScore,
      classAvg: classAvg,
      assessmentScore,
      assessmentDate: moment(parseInt(studentMetric.timestamp)).format("MMMM DD, YYYY")
    };
  });
};

const filterStudents = (rawData, appliedFilters, range, selectedProficiency) => {
  const { bandInfo = {}, studentMetricInfo = [] } = rawData;
  // filter according to Filters applied by user
  let filteredData = filterData(studentMetricInfo, appliedFilters);

  // filter according to proficiency
  if (selectedProficiency !== "All") {
    filteredData = filter(filteredData, item => {
      return getProficiency(item, bandInfo) === selectedProficiency;
    });
  }

  let dataBetweenRange = filteredData;

  const rangeMax = max([range.left, range.right]);
  const rangeMin = min([range.left, range.right]);

  // filter according to range
  if (rangeMax && range.left !== "" && range.right !== "") {
    dataBetweenRange = filter(filteredData, studentMetric => {
      return rangeMax > studentMetric.totalScore && studentMetric.totalScore >= rangeMin;
    });
  }

  return dataBetweenRange;
};

export const getTableData = (rawData, appliedFilters, range, selectedProficiency = "All") => {
  const filteredData = filterStudents(rawData, appliedFilters, range, selectedProficiency);
  const normalisedData = normaliseTableData(rawData, filteredData);
  const sortedData = orderBy(normalisedData, ["totalScore"], ["desc"]);

  return sortedData;
};

export const getSorter = (columnType, columnKey) => {
  switch (columnType) {
    case "percentage":
    case "number":
      return (a, b) => a[columnKey] - b[columnKey];
    case "string":
      return (a, b) => a[columnKey].localeCompare(b[columnKey]);
    case "name":
      return (a, b) => a["lastName"].localeCompare(b["lastName"]);
    default:
      return null;
  }
};

const getDisplayValue = (columnType, text) => {
  switch (columnType) {
    case "percentage":
      return `${text}%`;
    default:
      return text;
  }
};

const getCellContents = ({ printData, colorKey }) => {
  return <div style={{ backgroundColor: getHSLFromRange1(parseInt(colorKey)) }}>{printData}</div>;
};

const getColorCell = (columnKey, columnType, assessmentName) => (text, record) => {
  const toolTipText = record => {
    let lastItem = {
      title: "District: ",
      value: `${record.districtAvg}%`
    };

    switch (columnKey) {
      case "schoolAvg":
        lastItem = {
          title: "School: ",
          value: `${record.schoolAvg}%`
        };
        break;
      case "classAvg":
        lastItem = {
          title: "Class: ",
          value: `${record.classAvg}%`
        };
        break;
    }

    return (
      <div>
        <TableTooltipRow title={"Assessment Name: "} value={assessmentName} />
        <TableTooltipRow title={"Performance: "} value={record.assessmentScore} />
        <TableTooltipRow title={"Performance Band: "} value={record.proficiencyBand} />
        <TableTooltipRow title={"Student Name: "} value={record.student} />
        <TableTooltipRow title={"Class Name: "} value={record.className} />
        <TableTooltipRow {...lastItem} />
      </div>
    );
  };

  return (
    <CustomTableTooltip
      printData={getDisplayValue(columnType, text)}
      colorKey={text}
      placement="top"
      title={toolTipText(record)}
      getCellContents={getCellContents}
    />
  );
};

export const getColumns = (columns, assessmentName, role) => {
  const filteredColumns = filterColumnsAccordingToRole(columns, role);

  return next(filteredColumns, columnsDraft => {
    forEach(columnsDraft, column => {
      if (column.sortable) {
        column.sorter = getSorter(column.type, column.dataIndex);
      }
      if (column.showToolTip) {
        column.render = getColorCell(column.dataIndex, column.type, assessmentName);
      }
    });
  });
};
