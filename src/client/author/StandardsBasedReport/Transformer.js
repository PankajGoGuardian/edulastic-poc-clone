// @ts-check
import { groupBy } from "lodash";
import memoizeOne from "memoize-one";

export const getStandardWisePerformance = (testActivities, std) => {
  const performanceStudentWise = {};
  // filter out absent test activities
  const interestedTestActivities = testActivities.filter(x => x.status === "submitted" || x.status === "inProgress");
  const _questionActivities = interestedTestActivities.flatMap(({ studentId, questionActivities }) =>
    questionActivities.map(x => ({ ...x, studentId }))
  );

  if (std && std.qIds) {
    /**
     * if qAct.qActId not present, then its a generated uqa from frontend.
     * we shouldn't consider those, since reports aren't considering it
     */
    let filteredQuestionActivities = _questionActivities.filter(
      qAct =>
        !(qAct.scoringDisabled || qAct.disabled || !qAct.maxScore || (!qAct.score && qAct.score !== 0) || !qAct.qActId)
    );
    // check if any of the filtered question activities match the qIds from standard
    const checkForStdQids = filteredQuestionActivities.some(qAct => std.qIds.includes(qAct._id));
    // if the above check fails, flatMap qIds from filtered questionActivities
    if (!checkForStdQids) {
      filteredQuestionActivities = filteredQuestionActivities.flatMap(qAct =>
        qAct.qids ? qAct.qids.map(qid => ({ ...qAct, qids: [qid], _id: qid })) : qAct
      );
    }

    const questionActivitiesByQid = groupBy(filteredQuestionActivities, "_id");

    for (const qid of std.qIds) {
      const questionActs = questionActivitiesByQid[qid] || [];
      for (const qAct of questionActs) {
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
    performanceStudentWise[key] = maxScore ? score / maxScore : 0;
  }
  return performanceStudentWise;
};

export const getStandardWisePerformanceDetail = (testActivities, std, isPresentationMode = false) => {
  const performanceStudentWise = {};
  // filter out absent test activities
  const interestedTestActivities = testActivities.filter(x => x.status === "submitted" || x.status === "inProgress");
  const _questionActivities = interestedTestActivities.flatMap(
    ({ studentId, studentName, fakeName, questionActivities }) =>
      questionActivities.map(x => ({ ...x, studentId, studentName, fakeName }))
  );

  /**
   * if qAct.qActId not present, then its a generated uqa from frontend
   * we shouldn't consider those, since reports aren't considering it
   */
  let filteredQuestionActivities = _questionActivities.filter(
    qAct => !(qAct.scoringDisabled || qAct.disabled || qAct.maxScore == 0 || !qAct.qActId)
  );
  // check if any of the filtered question activities match the qIds from standard
  const checkForStdQids = filteredQuestionActivities.some(qAct => std.qIds.includes(qAct._id));
  // if the above check fails, flatMap qIds from filtered questionActivities
  if (!checkForStdQids) {
    filteredQuestionActivities = filteredQuestionActivities.flatMap(qAct =>
      qAct.qids ? qAct.qids.map(qid => ({ ...qAct, qids: [qid], _id: qid })) : qAct
    );
  }

  const questionActivitiesByQid = groupBy(filteredQuestionActivities, "_id");

  for (const qid of std.qIds) {
    const questionActs = questionActivitiesByQid[qid] || [];
    for (const qAct of questionActs) {
      const { studentId } = qAct;
      if (!performanceStudentWise[studentId]) {
        performanceStudentWise[studentId] = {
          score: qAct.score || 0,
          maxScore: qAct.maxScore,
          studentName: isPresentationMode ? qAct.fakeName : qAct.studentName,
          count: 1
        };
      } else {
        performanceStudentWise[studentId].score += qAct.score || 0;
        performanceStudentWise[studentId].maxScore += qAct.maxScore;
        performanceStudentWise[studentId].count += 1;
      }
    }
  }
  return performanceStudentWise;
};

export const getStandardWisePerformanceDetailMemoized = memoizeOne(getStandardWisePerformanceDetail);
export const getStandardWisePerformanceMemoized = memoizeOne(getStandardWisePerformance);
