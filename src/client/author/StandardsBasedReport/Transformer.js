//@ts-check
import { groupBy } from "lodash";
import memoizeOne from "memoize-one";

export const getStandardWisePerformance = (testActivities, std) => {
  const submittedTestActivities = testActivities.filter(x => x.status === "submitted");
  const questionActivities = submittedTestActivities.flatMap(({ studentId, questionActivities }) =>
    questionActivities.map(x => ({ ...x, studentId }))
  );

  const questionActivitiesByQid = groupBy(questionActivities, "_id");
  let performanceStudentWise = {};
  for (let qid of std.qIds) {
    const questionActs = questionActivitiesByQid[qid] || [];

    for (let qAct of questionActs) {
      const { studentId } = qAct;
      if (!performanceStudentWise[studentId]) {
        performanceStudentWise[studentId] = qAct.score / qAct.maxScore;
      } else {
        performanceStudentWise[studentId] = (performanceStudentWise[studentId] + qAct.score / qAct.maxScore) / 2;
      }
    }
  }

  return performanceStudentWise;
};

export const getStandardWisePerformanceDetail = (testActivities, std) => {
  const submittedTestActivities = testActivities.filter(x => x.status === "submitted");
  const questionActivities = submittedTestActivities.flatMap(({ studentId, studentName, questionActivities }) =>
    questionActivities.map(x => ({ ...x, studentId, studentName }))
  );

  const questionActivitiesByQid = groupBy(questionActivities, "_id");
  let performanceStudentWise = {};
  for (let qid of std.qIds) {
    const questionActs = questionActivitiesByQid[qid];

    for (let qAct of questionActs) {
      const { studentId } = qAct;
      if (!performanceStudentWise[studentId]) {
        performanceStudentWise[studentId] = {
          score: qAct.score / qAct.maxScore,
          maxScore: qAct.maxScore,
          studentName: qAct.studentName
        };
      } else {
        performanceStudentWise[studentId].score =
          (performanceStudentWise[studentId].score + qAct.score / qAct.maxScore) / 2;
        performanceStudentWise[studentId].maxScore = (performanceStudentWise[studentId].maxScore + qAct.maxScore) / 2;
      }
    }
  }
  return performanceStudentWise;
};
export const getStandardWisePerformanceDetailMemoized = memoizeOne(getStandardWisePerformanceDetail);
export const getStandardWisePerformanceMemoized = memoizeOne(getStandardWisePerformance);
