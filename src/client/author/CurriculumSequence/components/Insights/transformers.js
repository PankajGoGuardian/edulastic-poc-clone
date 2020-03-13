import { useMemo } from "react";
import { groupBy, keyBy, reduce, round, flatMap } from "lodash";
import { lightGreen7, lightBlue8, lightRed2 } from "@edulastic/colors";

export const getFilterData = (modules = []) => {
  const modulesData = modules.map(item => {
    let standards = [],
      groups = [],
      studentIds = [];
    item.data.forEach(ele => {
      standards.push(...ele.standards);
      ele.assignments.forEach(assignment =>
        assignment.class?.[0]?._id ? groups.push({ id: assignment.class[0]._id, name: assignment.class[0].name }) : null
      );
    });
    return {
      id: item._id,
      name: item.title,
      standards,
      groups
    };
  });

  const standardsData = Object.values(keyBy(flatMap(modulesData, item => item.standards), "standardId")).map(
    ({ standardId, name }) => ({ id: standardId.toString(), name })
  );
  const groupsData = Object.values(keyBy(flatMap(modulesData, item => item.groups), "id"));

  return {
    modulesData,
    standardsData,
    groupsData
  };
};

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

export const getFilteredMetrics = (metricInfo = [], studInfoMap = {}, filters = {}) => {
  const modules = filters.modules.map(item => item.key);
  const standards = filters.standards.map(item => item.key);
  const groups = filters.groups.map(item => item.key);

  // filter by groups
  const filteredMap = groups.length
    ? keyBy(Object.values(studInfoMap).filter(({ groupIds }) => groups.find(item => groupIds.includes(item))), userId)
    : studInfoMap;

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
    .filter(item => item && filteredMap[item.studentId]);
  // TODO: Remove the second check in the filter above if the data is consistent in metricInfo & studInfo

  return { filteredData, filteredMap, masteryList: filters.masteryList };
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

export const getCuratedMetrics = ({ filteredData = [], filteredMap = {}, masteryList = [], masteryData = [] }) => {
  if (!filteredData.length) {
    return [];
  }
  let minTimeSpent = filteredData[0].totalTimeSpent,
    maxTimeSpent = filteredData[0].totalTimeSpent,
    minPercentScore = filteredData[0].summedScore / filteredData[0].count,
    maxPercentScore = filteredData[0].summedScore / filteredData[0].count;

  let curatedMetrics = filteredData.map(item => {
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
      ...filteredMap[item.studentId]
    };
  });

  // filter based on mastery threshold
  const masteryToShow = masteryList.map(item => item.key);
  const masteryRangeToShow = [];
  masteryData.forEach((item, index) => {
    let max = 100,
      min = 0;
    if (index == 0) {
      min = item.threshold;
    } else {
      max = masteryData[index - 1].threshold;
      min = item.threshold;
    }
    if (masteryToShow.includes(item.id)) {
      masteryRangeToShow.push({ min, max });
    }
  });
  if (masteryRangeToShow.length) {
    curatedMetrics = curatedMetrics.filter(item => {
      let flag = false,
        pScore = round(item.percentScore, 2) * 100;
      masteryRangeToShow.forEach(({ min, max }) => {
        if (min <= pScore && pScore <= max) {
          flag = true;
        }
      });
      return flag;
    });
  }

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

export const getMasteryData = (scaleInfo = []) => {
  const defaultScaleInfo = [
    {
      score: 4,
      shortName: "E",
      threshold: 90,
      masteryLevel: "Exceeds Mastery",
      color: "#3db04e"
    },
    {
      score: 3,
      shortName: "M",
      threshold: 80,
      masteryLevel: "Mastered",
      color: "#74e27a"
    },
    {
      score: 2,
      shortName: "A",
      threshold: 70,
      masteryLevel: "Almost Mastered",
      color: "#ebdd54"
    },
    {
      score: 1,
      shortName: "N",
      threshold: 0,
      masteryLevel: "Not Mastered",
      color: "#fec571"
    }
  ];

  return (scaleInfo?.length ? scaleInfo : defaultScaleInfo).map(({ score, masteryLevel, threshold }) => ({
    id: score.toString(),
    name: masteryLevel,
    threshold
  }));
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
