import { round, compact } from "lodash";
import moment from "moment";

export const getSummaryData = (modules, playlistMetrics, isStudent) =>
  modules?.map((mod, index) => {
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
        .reduce((a, c) => a + (parseInt(c?.timeSpent, 10) || 0), 0);
    } else {
      tSpent = metricModule?.reduce((a, c) => a + (parseInt(c?.timeSpent, 10) || 0), 0);
    }
    const assignments = compact(data?.flatMap(x => x?.assignments)) || [];
    const classes = assignments?.reduce((a, c) => a + (c?.class?.length || 0), 0) || "-";
    const classAssignmentData = assignments.flatMap(a => a.class) || [];
    let submitted = "-";
    if (classAssignmentData.length) {
      let totalGradedCount = 0;
      let totalAssignedCount = 0;
      let totalInGrading = 0;
      for (let i = 0; i < classAssignmentData.length; i++) {
        const { assignedCount = 0, gradedNumber = 0, inGradingNumber = 0 } = classAssignmentData[i];
        totalGradedCount += gradedNumber ? +gradedNumber : 0;
        totalAssignedCount += assignedCount ? +assignedCount : 0;
        totalInGrading += inGradingNumber ? +inGradingNumber : 0;
      }
      if (totalAssignedCount) {
        submitted = round(((totalGradedCount + totalInGrading) / totalAssignedCount) * 100);
      }
    }
    const duration = moment.duration(tSpent);
    const h = Math.floor(duration.asHours());
    let m = duration.minutes();
    const s = duration.seconds();
    if (s > 50) {
      m += 1;
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

export const getProgressData = (playlistMetrics, _id, contentId, assignments) => {
  const classAssignmentData = assignments.flatMap(a => a.class) || [];
  const data = playlistMetrics?.[_id]?.filter(x => x.testId === contentId) || [];
  const totalScore = data.reduce((a, c) => a + parseInt(c.totalScore || 0, 10), 0);
  const maxScore = data.reduce((a, c) => a + parseInt(c.maxScore || 0, 10), 0);
  const progress = maxScore ? round((totalScore / maxScore) * 100, 0) : 0;
  const classes = assignments.reduce((a, c) => a + (c?.["class"]?.length || 0), 0);
  const tSpent = data.reduce((a, c) => a + parseInt(c.timeSpent || 0, 10), 0);
  const totalAssigned = classAssignmentData.reduce((a, c) => a + parseInt(c.assignedCount || 0, 10), 0);
  const totalGraded = classAssignmentData.reduce((a, c) => a + parseInt(c.gradedNumber || 0, 10), 0);
  const totalInGrading = classAssignmentData.reduce((a, c) => a + parseInt(c.inGradingNumber || 0, 10), 0);
  const submitted =
    (totalAssigned && totalGraded && round(((totalGraded + totalInGrading) / totalAssigned) * 100, 0)) || 0;
  const duration = moment.duration(parseInt(tSpent || 0, 10));
  const h = Math.floor(duration.asHours());
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
  }
  return "#5eB500";
};

/**
 *
 * @param {any[]} assignedList
 * @param {string} testId
 *
 * @returns {any[]}
 */
export const matchAssigned = (assignedList, testId) =>
  assignedList.filter(assigned => assigned.testId && testId && assigned.testId === testId);

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
