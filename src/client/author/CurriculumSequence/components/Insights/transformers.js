import { useMemo } from "react";
import { groupBy, keyBy, reduce, round } from "lodash";
import { lightGreen7, lightBlue8, lightRed2 } from "@edulastic/colors";

const calcTrendAngle = trendSlope => {
  return round((Math.atan(trendSlope || 0) * 360) / Math.PI);
};

export const getMergedTrendMap = (studInfo = [], trendData = []) => {
  return useMemo(() => {
    const studentMap = groupBy(studInfo, "userId");
    // reduce multiple entries and club their groupIds
    Object.keys(studentMap).map(sId => {
      studentMap[sId] = reduce(
        studentMap[sId],
        (res, ele) => {
          res.firstName = res.firstName || ele.firstName;
          res.lastName = res.lastName || ele.lastName;
          res.groupIds.push(ele.groupId);
          return res;
        },
        {
          userId: sId,
          firstName: "",
          lastName: "",
          groupIds: [],
          trendAngle: 0
        }
      );
    });
    trendData.forEach(item => {
      if (studentMap[item.id]) {
        studentMap[item.id].trendAngle = calcTrendAngle(item.slope);
      }
    });
    return studentMap;
  }, [studInfo, trendData]);
};

export const getFilteredMetrics = (metricInfo = [], standards = [], studInfoMap = {}) => {
  const groupedData = groupBy(metricInfo, "studentId");

  const filteredData = Object.keys(groupedData)
    .map(sId => {
      // filter by standards
      groupedData[sId] = groupedData[sId].filter(item => {
        if (standards.length && !standards.includes(item.standardId)) {
          return false;
        } else {
          return true;
        }
      });
      if (groupedData[sId].length) {
        // reduce to a single object if not null
        groupedData[sId] = reduce(
          groupedData[sId],
          (res, ele) => {
            res.standardIds.push(ele.standardId);
            res.summedScore += ele.totalScore / ele.maxScore;
            res.totalTimeSpent += parseInt(ele.timeSpent);
            res.count += 1;
            return res;
          },
          {
            studentId: sId,
            standardIds: [],
            count: 0,
            summedScore: 0,
            totalTimeSpent: 0
          }
        );
      } else {
        groupedData[sId] = null;
      }
      return groupedData[sId];
    })
    .filter(item => item && studInfoMap[item.studentId]);
  // TODO: Remove the studInfoMap param
  // & the second check in the filter above if the data is consistent in metricInfo & studInfo

  return filteredData;
};

// for domainRange = 800 => range = [-400, 400]
export const domainRange = 800;
// scaleFactor to keep all the data inside the graph
// should be close to {sqrt(2) * limit}
export const scaleFactor = 1.8;

// TODO: use itemCount to get a domainRange if there is a large volume of data to be normalized
const getNormalizedValue = (item, mean, range) => {
  return item === mean ? 0 : round((domainRange * (item - mean)) / range);
};

export const getCuratedMetrics = (filteredMetrics = [], studInfoMap = {}) => {
  if (!filteredMetrics.length) {
    return [];
  }
  let minTimeSpent = filteredMetrics[0].totalTimeSpent,
    maxTimeSpent = filteredMetrics[0].totalTimeSpent,
    minPercentScore = filteredMetrics[0].summedScore / filteredMetrics[0].count,
    maxPercentScore = filteredMetrics[0].summedScore / filteredMetrics[0].count;

  const curatedMetrics = filteredMetrics.map(item => {
    const percentScore = item.summedScore / item.count;
    if (item.totalTimeSpent < minTimeSpent) {
      minTimeSpent = item.totalTimeSpent;
    }
    if (percentScore < minPercentScore) {
      minPercentScore = percentScore;
    }
    if (item.totalTimeSpent > maxTimeSpent) {
      maxTimeSpent = item.totalTimeSpent;
    }
    if (percentScore > maxPercentScore) {
      maxPercentScore = percentScore;
    }
    return {
      ...item,
      percentScore,
      ...studInfoMap[item.studentId]
    };
  });

  const timeRange = maxTimeSpent - minTimeSpent,
    percentRange = maxPercentScore - minPercentScore;
  const timeMean = (maxTimeSpent + minTimeSpent) / 2,
    percentMean = (maxPercentScore + minPercentScore) / 2;

  return curatedMetrics.map(item => {
    const fName = item.firstName && item.firstName.trim();
    const lName = item.lastName && item.lastName.trim();
    const name = [fName ? fName[0] + "." : "", lName || (fName ? "" : "-")].join(" ").trim();
    const effort = getNormalizedValue(item.totalTimeSpent, timeMean, timeRange);
    const performance = getNormalizedValue(item.percentScore, percentMean, percentRange);
    return { name, ...item, effort, performance };
  });
};

export const getBoxedSummaryData = ({ up, flat, down }) => {
  const summaryData = [
    {
      label: "Exceeding",
      count: up
    },
    {
      label: "Meeting",
      count: flat
    },
    {
      label: "At Risk",
      count: down
    }
  ];
  return summaryData;
};

export const getQuadsData = data => {
  return data.map(item => {
    // add the color and quad info
    if (item.effort < 0 && item.performance > 0) {
      return { ...item, color: lightBlue8, quad: 1 };
    } else if (item.effort > 0 && item.performance > 0) {
      return { ...item, color: lightGreen7, quad: 2 };
    } else if (item.effort < 0 && item.performance < 0) {
      return { ...item, color: lightRed2, quad: 3 };
    } else {
      return { ...item, color: lightBlue8, quad: 4 };
    }
  });
};

export const calcArrowPosition = ({ cx, cy, name, trendAngle }) => {
  let x = cx,
    y = cy;
  if (trendAngle > 160 || trendAngle < -160) {
    x += round((name.length + 3.5) * 5);
    y -= trendAngle > 160 ? 6 : 4;
  } else if (trendAngle > 90 || trendAngle < -90) {
    x += round(name.length * 4.3);
    y -= trendAngle > 90 ? 4 : 6;
  } else if (trendAngle > 30 || trendAngle < -30) {
    x += round(name.length * 4);
    y -= trendAngle > 0 ? 3 : 6;
  } else {
    x += round(name.length * 3.7);
    y -= 2;
  }
  return `${x} ${y}`;
};
