import React from "react";
import { Link } from "react-router-dom";
import next from "immer";
import { max, min, filter, map, find, orderBy, ceil, groupBy, sumBy, floor, forEach, maxBy, get, round } from "lodash";
import { filterData, getHSLFromRange1, filterAccordingToRole, formatDate } from "../../../../common/util";
import { CustomTableTooltip } from "../../../../common/components/customTableTooltip";
import TableTooltipRow from "../../../../common/components/tooltip/TableTooltipRow";

export const getInterval = maxValue => min([maxValue, 9]);

export const createTicks = (maxValue, interval) => {
  let maxTickRange = (ceil(maxValue / interval) || 0) * interval;

  let ticks = [];

  ticks.push(maxTickRange + (ceil(maxValue / interval) || 0));

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
    if (totalScore || totalScore === 0) {
      const floorValue = floor(totalScore);
      if (dataToPlotHashMap[floorValue]) {
        dataToPlotHashMap[floorValue].studentCount++;
      }
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

export const getFormattedName = name => {
  const nameArr = (name || "").trim().split(" ");
  const lName = nameArr.splice(nameArr.length - 1)[0];
  return nameArr.length ? lName + ", " + nameArr.join(" ") : lName;
};

export const normaliseTableData = (rawData, data) => {
  const { bandInfo = {}, metaInfo = [], schoolMetricInfo = [], studentMetricInfo = [], districtAvgPerf = 0 } = rawData;

  const classes = groupBy(studentMetricInfo, "groupId");

  return map(data, studentMetric => {
    const relatedGroup =
      find(metaInfo, meta => {
        return studentMetric.groupId === meta.groupId;
      }) || {};

    const relatedSchool =
      find(schoolMetricInfo, school => {
        return relatedGroup.schoolId === school.schoolId;
      }) || {};

    // progressStatus = 2 is for absent student, needs to be excluded
    const classAvg =
      round(
        (sumBy(classes[studentMetric.groupId], "totalScore") /
          sumBy(classes[studentMetric.groupId], o => (o.progressStatus === 2 ? 0 : o.maxScore))) *
          100
      ) || 0;
    let studentScore = 0;
    let assessmentScore = "Absent";
    let proficiencyBand = "Absent";
    if (studentMetric.progressStatus === 1) {
      studentScore = round((studentMetric.totalScore / studentMetric.maxScore) * 100);
      assessmentScore = `${studentMetric.totalScore.toFixed(2)} / ${studentMetric.maxScore.toFixed(2)}`;
      proficiencyBand = getProficiency(studentMetric, bandInfo);
    }

    return {
      ...studentMetric,
      student: getFormattedName(`${studentMetric.firstName || ""} ${studentMetric.lastName || ""}`),
      proficiencyBand,
      school: relatedGroup.schoolName,
      teacher: relatedGroup.teacherName,
      groupName: relatedGroup.groupName,
      schoolAvg: round(relatedSchool.schoolAvgPerf || 0),
      districtAvg: round(districtAvgPerf || 0),
      studentScore,
      classAvg,
      assessmentScore,
      assessmentDate: formatDate(studentMetric.timestamp)
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
  const sortedData = orderBy(normalisedData, ["totalScore"], ["desc"]).sort((a, b) =>
    a.student.toLowerCase().localeCompare(b.student.toLowerCase())
  );
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
      // primary sort is on lastName & secondary sort is on firstName
      return (a, b) => a.student.toLowerCase().localeCompare(b.student.toLowerCase());
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
        <TableTooltipRow title={"Class Name: "} value={record.groupName} />
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
  const filteredColumns = filterAccordingToRole(columns, role);

  return next(filteredColumns, columnsDraft => {
    columnsDraft[1].render = (data, record) =>
      record.totalScore || record.totalScore === 0 ? (
        <Link to={`/author/classboard/${record.assignmentId}/${record.groupId}/test-activity/${record.testActivityId}`}>
          {data}
        </Link>
      ) : (
        data
      );

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
