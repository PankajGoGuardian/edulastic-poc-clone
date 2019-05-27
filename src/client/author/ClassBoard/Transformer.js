//@ts-check
import { keyBy, groupBy, get } from "lodash";
import { testActivityStatus } from "@edulastic/constants";
import DotProp from "dot-prop";

const getAllQids = (testItemIds, testItemsDataKeyed) => {
  let qids = [];
  for (let testItemId of testItemIds) {
    let questions = (testItemsDataKeyed[testItemId].data && testItemsDataKeyed[testItemId].data.questions) || [];
    qids = [...qids, ...questions.map(x => x.id)];
  }
  return qids;
};

/**
 * @returns {{id:string,weight:number,disabled:boolean,qids?:string[],testItemId?:string}[]}
 */
const getAllQidsAndWeight = (testItemIds, testItemsDataKeyed) => {
  let qids = [];
  for (let testItemId of testItemIds) {
    let questions = (testItemsDataKeyed[testItemId].data && testItemsDataKeyed[testItemId].data.questions) || [];
    if (testItemsDataKeyed[testItemId].itemLevelScoring) {
      qids = [
        ...qids,
        ...questions
          //.filter(x => !x.scoringDisabled)
          .map(x => ({
            id: x.id,
            weight: questions.length,
            disabled: x.scoringDisabled,
            testItemId,
            qids: questions.map(x => x.id)
          }))
      ];
    } else {
      qids = [...qids, ...questions.map(x => ({ id: x.id, weight: 1 }))];
    }
  }
  return qids;
};

/**
 * @returns {number}
 */
const getMaxScoreFromQuestion = question => {
  let possibleScores = [DotProp.get(question, "validation.valid_response.score", 0)];
  const alternateResponses = DotProp.get(question, "validation.alt_responses", false);
  if (alternateResponses) {
    possibleScores = possibleScores.concat(alternateResponses.map(r => r.score));
  }
  return Math.max(...possibleScores);
};

/**
 *
 * @param {string} qid
 * @param {Object[]} testItemsData
 */
export const getMaxScoreOfQid = (qid, testItemsData) => {
  for (let testItem of testItemsData) {
    let questions = get(testItem, ["data", "questions"], []);
    let questionNeeded = questions.find(x => x.id === qid);

    if (questionNeeded) {
      return getMaxScoreFromQuestion(questionNeeded);
    }
  }
  console.warn("no such qid for maxScore", qid);
  return 0;
};

/**
 * @returns {number}
 */
const getMaxScoreFromItem = testItem => {
  let total = 0;
  if (!testItem) {
    return total;
  }
  if (testItem.itemLevelScoring) {
    return testItem.itemLevelScore || 0;
  }
  if (!(testItem.data && testItem.data.questions)) {
    return total;
  }
  for (const question of testItem.data.questions) {
    total += getMaxScoreFromQuestion(question);
  }
  return total;
};

export const transformGradeBookResponse = ({
  test,
  testItemsData,
  students: studentNames,
  testActivities,
  testQuestionActivities
}) => {
  const testItemIds = test.testItems;
  const testItemsDataKeyed = keyBy(testItemsData, "_id");
  const qids = getAllQidsAndWeight(testItemIds, testItemsDataKeyed);

  const testMaxScore = testItemsData.reduce((prev, cur) => prev + getMaxScoreFromItem(cur), 0);

  const studentTestActivities = keyBy(testActivities, "userId");
  let testActivityQuestionActivities = groupBy(testQuestionActivities, "userId");
  //testActivityQuestionActivities = mapValues(testActivityQuestionActivities, v => keyBy(v, "qid"));

  //for students who hasn't even started the test
  const emptyQuestionActivities = qids.map(x => ({
    _id: x.id,
    weight: x.weight,
    notStarted: true,
    disabled: x.disabled,
    testItemId: x.testItemId
  }));

  return studentNames
    .map(({ _id: studentId, firstName: studentName }) => {
      if (!studentTestActivities[studentId]) {
        return {
          studentId,
          studentName,
          present: true,
          status: "notStarted",
          maxScore: testMaxScore,
          questionActivities: emptyQuestionActivities
        };
      }
      const testActivity = studentTestActivities[studentId];
      if (testActivity.redirect) {
        return {
          studentId,
          studentName,
          present: true,
          status: "redirected",
          redirected: true,
          maxScore: testMaxScore,
          questionActivities: emptyQuestionActivities
        };
      }
      //TODO: for now always present
      const present = true;
      //TODO: no graded status now. using submitted as a substitute for graded
      const graded = testActivity.status == testActivityStatus.SUBMITTED;
      const submitted = testActivity.status == testActivityStatus.SUBMITTED;
      const redirected = testActivity.redirected;
      const testActivityId = testActivity._id;

      const questionActivitiesRaw = testActivityQuestionActivities[studentId];

      const score = (questionActivitiesRaw && questionActivitiesRaw.reduce((e1, e2) => (e2.score || 0) + e1, 0)) || 0;

      const questionActivitiesIndexed = (questionActivitiesRaw && keyBy(questionActivitiesRaw, x => x.qid)) || {};

      const questionActivities = qids.map(({ id: el, weight, qids: _qids, disabled, testItemId }) => {
        const _id = el;

        if (!questionActivitiesIndexed[el]) {
          return { _id, notStarted: true, weight, disabled, testItemId };
        }
        let { skipped, correct, partiallyCorrect: partialCorrect, timeSpent, score } = questionActivitiesIndexed[el];
        if (_qids) {
          correct = _qids.map(x => questionActivitiesIndexed[x]).every(x => x.correct);
          if (!correct) {
            partialCorrect = _qids.map(x => questionActivitiesIndexed[x]).some(x => x.correct);
          }
        }
        const questionMaxScore = getMaxScoreOfQid(_id, testItemsData);
        return {
          _id,
          weight,
          skipped,
          correct,
          partialCorrect,
          score,
          maxScore: questionMaxScore,
          timeSpent,
          disabled,
          testItemId,
          qids: _qids
        };
      });

      return {
        studentId,
        studentName,
        status: submitted ? "submitted" : "inProgress",
        present,
        check: false,
        graded,
        maxScore: testMaxScore,
        score,
        testActivityId,
        redirected,
        questionActivities
      };
    })
    .filter(x => x);
};
