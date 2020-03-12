import { useMemo } from "react";
import { groupBy, keyBy, reduce, round } from "lodash";
import { lightGreen7, lightBlue8, lightRed2 } from "@edulastic/colors";

const calcTrendAngle = trendSlope => {
  return round((Math.atan(trendSlope || 0) * 360) / Math.PI);
};

export const getMergedTrendMap = (studInfo, trendData) => {
  return useMemo(() => {
    const studentMap = keyBy(studInfo, "userId");
    trendData.forEach(item => {
      if (studentMap[item.id]) {
        studentMap[item.id].trendAngle = calcTrendAngle(item.slope);
      }
    });
    return studentMap;
  }, [studInfo, trendData]);
};

export const getFilteredMetrics = (metricInfo = [], standards = []) => {
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
    .filter(item => item);

  return filteredData;
};

// TODO: use itemCount to get a mulFactor if there is a large volume of data to be normalized
const getNormalizedValue = (item, mean, range) => {
  // for mulFactor = 800 => range = [-400, 400]
  const mulFactor = 800;
  return item === mean ? 0 : round((mulFactor * (item - mean)) / range);
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
  // mulFactor to keep all the data inside the graph
  // should be close to {sqrt(2) * limit}
  const scaleFactor = 1.65,
    threshFactor = 0.2;

  // limits for rendering the graph
  let eLimit = 50,
    pLimit = 50;
  data.map(item => {
    if (eLimit < Math.abs(item.effort)) eLimit = Math.abs(item.effort);
    if (pLimit < Math.abs(item.performance)) pLimit = Math.abs(item.performance);
  });

  eLimit = Math.round(eLimit * scaleFactor);
  pLimit = Math.round(pLimit * scaleFactor);

  // nearby threshold for axes to prevent labels from being cut off
  const eThresh = Math.round(eLimit * threshFactor),
    pThresh = Math.round(pLimit * threshFactor);

  // initialize quadsData with domains
  const quads = [
    {
      domainX: [-eLimit, eThresh],
      domainY: [-pThresh, pLimit],
      color: lightBlue8,
      data: []
    },
    {
      domainX: [-eThresh, eLimit],
      domainY: [-pThresh, pLimit],
      color: lightGreen7,
      data: []
    },
    {
      domainX: [-eLimit, eThresh],
      domainY: [-pLimit, pThresh],
      color: lightRed2,
      data: []
    },
    {
      domainX: [-eThresh, eLimit],
      domainY: [-pLimit, pThresh],
      color: lightBlue8,
      data: []
    }
  ];

  data.map(item => {
    // push the data into their respective quads
    if (item.effort < 0 && item.performance > 0) {
      quads[0].data.push(item);
    } else if (item.effort > 0 && item.performance > 0) {
      quads[1].data.push(item);
    } else if (item.effort < 0 && item.performance < 0) {
      quads[2].data.push(item);
    } else {
      quads[3].data.push(item);
    }
  });

  return quads;
};
