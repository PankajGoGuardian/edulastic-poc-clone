import { getHSLFromRange1 } from "../../../../common/util";
import { groupBy, keyBy } from "lodash";
import { getFormattedTimeInMins } from "./helpers";

export const getChartData = (rawData = []) => {
  const groupedData = groupBy(rawData, "questionId");
  let arr = Object.keys(groupedData).map((item, index) => {
    const _item = groupedData[item].reduce(
      (total, currentValue, currentIndex) => {
        const { totalTotalMaxScore = 0, totalTotalScore = 0, totalTimeSpent = 0 } = total;
        const { totalMaxScore = 0, totalScore = 0, timeSpent = 0 } = currentValue;
        return {
          totalTotalScore: totalTotalScore + totalScore,
          totalTotalMaxScore: totalTotalMaxScore + totalMaxScore,
          totalTimeSpent: totalTimeSpent + parseInt(timeSpent)
        };
      },
      { totalTotalMaxScore: 0, totalTotalScore: 0, totalTimeSpent: 0 }
    );
    let avgPerformance = (_item.totalTotalScore / _item.totalTotalMaxScore) * 100;
    avgPerformance = !isNaN(avgPerformance) ? Math.round(avgPerformance) : 0;
    const avgIncorrect = Math.round(100 - avgPerformance);
    const districtAvg = Math.round(groupedData[item][0].districtAvgPerf);

    const avgTime = _item.totalTimeSpent / groupedData[item].length;
    const avgTimeMins = getFormattedTimeInMins(avgTime);
    return {
      ...groupedData[item][0],
      avgPerformance,
      avgIncorrect,
      avgTime: Math.floor(avgTime),
      avgTimeMins,
      districtAvg,
      fill: getHSLFromRange1(avgPerformance)
    };
  });

  arr = arr.sort((a, b) => {
    return a.avgPerformance - b.avgPerformance;
  });

  return arr;
};

export const getTableData = ({ metaInfo = [], metricInfo = [] }) => {
  const metaInfoGroupIdMap = keyBy(metaInfo, "groupId");
  const normalizedMetricInfo = metricInfo.map((item, index) => {
    return {
      ...item,
      ...metaInfoGroupIdMap[item.groupId]
    };
  });

  const groupedMetricInfo = groupBy(normalizedMetricInfo, "questionId");
  let arr = Object.keys(groupedMetricInfo).map((item, index) => {
    const groupedItem = groupedMetricInfo[item];
    const districtAvg = Math.round(groupedItem[0].districtAvgPerf);

    // -----|-----|-----|-----| SCHOOL BEGIN |-----|-----|-----|----- //
    let comparedBySchool;
    const groupedBySchool = groupBy(groupedItem, "schoolId");
    comparedBySchool = Object.keys(groupedBySchool).map(_item => {
      let __item = groupedBySchool[_item].reduce(
        (total, currentValue, currentIndex) => {
          const { totalTotalMaxScore = 0, totalTotalScore = 0, totalTimeSpent = 0 } = total;
          const { totalMaxScore = 0, totalScore = 0, timeSpent = 0 } = currentValue;
          return {
            totalTotalScore: totalTotalScore + totalScore,
            totalTotalMaxScore: totalTotalMaxScore + totalMaxScore,
            totalTimeSpent: totalTimeSpent + parseInt(timeSpent)
          };
        },
        {
          totalTotalMaxScore: 0,
          totalTotalScore: 0,
          totalTimeSpent: 0
        }
      );
      let avgPerformance = (__item.totalTotalScore / __item.totalTotalMaxScore) * 100;
      avgPerformance = !isNaN(avgPerformance) ? Math.round(avgPerformance) : 0;
      return {
        ...groupedBySchool[_item][0],
        ...__item,
        avgPerformance
      };
    });

    // -----|-----|-----|-----| SCHOOL ENDED |-----|-----|-----|----- //

    // -----|-----|-----|-----| TEACHER BEGIN |-----|-----|-----|----- //
    let comparedByTeacher;
    const groupedByTeacher = groupBy(groupedItem, "teacherId");
    comparedByTeacher = Object.keys(groupedByTeacher).map(_item => {
      let __item = groupedByTeacher[_item].reduce(
        (total, currentValue, currentIndex) => {
          const { totalTotalMaxScore = 0, totalTotalScore = 0, totalTimeSpent = 0 } = total;
          const { totalMaxScore = 0, totalScore = 0, timeSpent = 0 } = currentValue;
          return {
            totalTotalScore: totalTotalScore + totalScore,
            totalTotalMaxScore: totalTotalMaxScore + totalMaxScore,
            totalTimeSpent: totalTimeSpent + parseInt(timeSpent)
          };
        },
        {
          totalTotalMaxScore: 0,
          totalTotalScore: 0,
          totalTimeSpent: 0
        }
      );
      let avgPerformance = (__item.totalTotalScore / __item.totalTotalMaxScore) * 100;
      avgPerformance = !isNaN(avgPerformance) ? Math.round(avgPerformance) : 0;
      return {
        ...groupedByTeacher[_item][0],
        ...__item,
        avgPerformance
      };
    });
    // -----|-----|-----|-----| TEACHER ENDED |-----|-----|-----|----- //

    // -----|-----|-----|-----| CLASS ENDED |-----|-----|-----|----- //
    let comparedByClass;
    const groupedByClass = groupBy(groupedItem, "groupId");
    comparedByClass = Object.keys(groupedByClass).map(_item => {
      let __item = groupedByClass[_item].reduce(
        (total, currentValue, currentIndex) => {
          const { totalTotalMaxScore = 0, totalTotalScore = 0, totalTimeSpent = 0 } = total;
          const { totalMaxScore = 0, totalScore = 0, timeSpent = 0 } = currentValue;
          return {
            totalTotalScore: totalTotalScore + totalScore,
            totalTotalMaxScore: totalTotalMaxScore + totalMaxScore,
            totalTimeSpent: totalTimeSpent + parseInt(timeSpent)
          };
        },
        {
          totalTotalMaxScore: 0,
          totalTotalScore: 0,
          totalTimeSpent: 0
        }
      );
      let avgPerformance = (__item.totalTotalScore / __item.totalTotalMaxScore) * 100;
      avgPerformance = !isNaN(avgPerformance) ? Math.round(avgPerformance) : 0;
      return {
        ...groupedByClass[_item][0],
        ...__item,
        avgPerformance
      };
    });
    // -----|-----|-----|-----| CLASS ENDED |-----|-----|-----|----- //

    const reduced = groupedItem.reduce(
      (total, currentValue, currentIndex) => {
        const { totalTotalMaxScore = 0, totalTotalScore = 0, totalTimeSpent = 0 } = total;
        const { totalMaxScore = 0, totalScore = 0, timeSpent = 0 } = currentValue;
        return {
          totalTotalScore: totalTotalScore + totalScore,
          totalTotalMaxScore: totalTotalMaxScore + totalMaxScore,
          totalTimeSpent: totalTimeSpent + parseInt(timeSpent)
        };
      },
      {
        totalTotalMaxScore: 0,
        totalTotalScore: 0,
        totalTimeSpent: 0
      }
    );

    let avgPerformance = (reduced.totalTotalScore / reduced.totalTotalMaxScore) * 100;
    avgPerformance = !isNaN(avgPerformance) ? Math.round(avgPerformance) : 0;

    return {
      ...groupedMetricInfo[item][0],
      avgPerformance,
      districtAvg,
      comparedBySchool,
      comparedByTeacher,
      comparedByClass
    };
  });
  return arr;
};
