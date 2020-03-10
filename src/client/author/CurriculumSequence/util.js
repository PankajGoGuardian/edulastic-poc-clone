import { round } from "lodash";
import moment from "moment";

export const getSummaryData = (modules, playlistMetrics, isStudent) => {
  return modules?.map((mod, index) => {
    const { _id = "", title, data = [], hidden = false } = mod;
    const metricModule = playlistMetrics[_id] || [];
    const name = `Module ${index + 1}`;
    const scores = round(metricModule?.reduce((a, c) => a + c?.totalScore, 0) / metricModule.length);
    const value = round(
      (metricModule?.reduce((a, c) => a + (c?.totalScore / c?.maxScore || 0), 0) * 100) / metricModule.length,
      0
    );
    const maxScore = round(metricModule?.reduce((a, c) => a + c?.maxScore, 0) / metricModule.length);
    let tSpent = 0;
    if (isStudent) {
      const unHiddenTestIds = data?.filter(x => !x?.hidden).flatMap(x => x.contentId);
      tSpent = metricModule
        ?.filter(mm => unHiddenTestIds.includes(mm.testId))
        .reduce((a, c) => a + (parseInt(c?.timeSpent) || 0), 0);
    } else {
      tSpent = metricModule?.reduce((a, c) => a + (parseInt(c?.timeSpent) || 0), 0);
    }
    const assignments = data?.flatMap(x => x?.assignments) || [];
    const classes = assignments?.reduce((a, c) => a + (c?.class?.length || 0), 0) || "-";
    let submitted = "-";
    if (metricModule.length) {
      let totalGradedCount = 0;
      let totalAssignedCount = 0;
      for (let i = 0; i < metricModule.length; i++) {
        const { totalAssigned = 0, gradedCount = 0, assignmentId = "" } = metricModule[i];
        if (assignmentId.length) {
          totalGradedCount += gradedCount ? +gradedCount : 0;
          totalAssignedCount += totalAssigned ? +totalAssigned : 0;
        }
      }
      if (totalAssignedCount) {
        submitted = round((totalGradedCount / totalAssignedCount) * 100);
      }
    }
    const duration = moment.duration(tSpent);
    const h = duration.hours();
    let m = duration.minutes();
    const s = duration.seconds();
    if (s > 50) {
      m = m + 1;
    }

    const timeSpent = h > 0 ? `${h} H ${m} mins` : `${m} min`;

    return {
      title,
      name,
      value,
      timeSpent,
      classes,
      submitted,
      tSpent,
      index,
      hidden,
      scores,
      maxScore
    };
  });
};

export const getProgressData = (playlistMetrics, _id, contentId, assignments) => {
  const data = playlistMetrics?.[_id]?.find(x => x.testId === contentId) || {};
  const {
    assignmentId = "",
    gradedCount = 0,
    totalAssigned = 0,
    totalScore = 0,
    maxScore = 0,
    timeSpent: tSpent
  } = data;
  const submitted = assignmentId && totalAssigned ? round((gradedCount / totalAssigned) * 100, 0) : 0;
  const progress = maxScore ? round((totalScore / maxScore) * 100, 0) : 0;
  const classes = assignments.reduce((a, c) => a + (c?.["class"]?.length || 0), 0);
  const duration = moment.duration(parseInt(tSpent || 0, 10));
  const h = duration.hours();
  const m = duration.minutes();
  const s = duration.seconds();

  const timeSpent = h > 0 ? `${h}H ${m}min ${s}sec` : `${m} min ${s} sec`;

  return {
    submitted,
    progress,
    classes,
    scores: totalScore,
    timeSpent,
    maxScore
  };
};

// TODO - use color constants
export const getProgressColor = percentage => {
  if (percentage <= 30) {
    return "#EC0149";
  }
  if (percentage <= 70) {
    return "#FFD500";
  } else {
    return "#5e5B500";
  }
};

/**
 *
 * @param {any[]} assignedList
 * @param {string} testId
 *
 * @returns {any[]}
 */
export const matchAssigned = (assignedList, testId) => {
  return assignedList.filter(assigned => assigned.testId && testId && assigned.testId === testId);
};

/**
 *
 * @param {any[]} assignedList
 * @param {string[]} testIds
 *
 * @returns {number}
 */
export const getNumberOfAssigned = (assignedList = [], testIds) => {
  let count = 0;

  testIds.forEach(testId => {
    if (matchAssigned(assignedList, testId).length) {
      count += 1;
    }
  });

  return count;
};
