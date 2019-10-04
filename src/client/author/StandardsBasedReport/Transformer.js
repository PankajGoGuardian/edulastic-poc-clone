//@ts-check
import { groupBy } from "lodash";
import memoizeOne from "memoize-one";

export const getStandardWisePerformance = (testActivities, std) => {
  const questionActivities = testActivities.flatMap(({ studentId, questionActivities }) =>
    questionActivities.map(x => ({ ...x, studentId }))
  );

  const questionActivitiesByQid = groupBy(questionActivities, "_id");
  let performanceStudentWise = {};
  if (std && std.qIds) {
    for (let qid of std.qIds) {
      const questionActs = questionActivitiesByQid[qid] || [];
      for (let qAct of questionActs) {
        if (qAct.scoringDisabled || qAct.disabled) {
          continue;
        }
        const { studentId } = qAct;
        if (!performanceStudentWise[studentId]) {
          performanceStudentWise[studentId] = { score: qAct.score, maxScore: qAct.maxScore, count: 1 };
        } else {
          performanceStudentWise[studentId].score += qAct.score;
          performanceStudentWise[studentId].maxScore += qAct.maxScore;
          performanceStudentWise[studentId].count++;
        }
      }
    }
  }

  for (const key of Object.keys(performanceStudentWise)) {
    const { score, maxScore } = performanceStudentWise[key];
    performanceStudentWise[key] = score / maxScore;
  }

  return performanceStudentWise;
};

export const getStandardWisePerformanceDetail = (testActivities, std, isPresentationMode = false) => {
  const submittedTestActivities = testActivities.filter(x => x.status === "submitted");
  const questionActivities = submittedTestActivities.flatMap(
    ({ studentId, studentName, fakeName, questionActivities }) =>
      questionActivities.map(x => ({ ...x, studentId, studentName, fakeName }))
  );

  const questionActivitiesByQid = groupBy(questionActivities, "_id");
  let performanceStudentWise = {};
  for (let qid of std.qIds) {
    const questionActs = questionActivitiesByQid[qid] || [];
    for (let qAct of questionActs) {
      if (qAct.disabled || qAct.scoringDisabled || qAct.maxScore == 0) {
        continue;
      }
      const { studentId } = qAct;
      if (!performanceStudentWise[studentId]) {
        performanceStudentWise[studentId] = {
          score: qAct.score,
          maxScore: qAct.maxScore,
          studentName: isPresentationMode ? qAct.fakeName : qAct.studentName,
          count: 1
        };
      } else {
        performanceStudentWise[studentId].score += qAct.score;
        performanceStudentWise[studentId].maxScore += qAct.maxScore;
        performanceStudentWise[studentId].count += 1;
      }
    }
  }
  return performanceStudentWise;
};
export const getStandardWisePerformanceDetailMemoized = memoizeOne(getStandardWisePerformanceDetail);
export const getStandardWisePerformanceMemoized = memoizeOne(getStandardWisePerformance);
