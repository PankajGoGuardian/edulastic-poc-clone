//@ts-check
import { keyBy, groupBy, get } from "lodash";
import { testActivityStatus } from "@edulastic/constants";
import DotProp from "dot-prop";
import produce from "immer";

const getAllQids = (testItemIds, testItemsDataKeyed) => {
  let qids = [];
  for (let testItemId of testItemIds) {
    let questions =
      (testItemsDataKeyed[testItemId] &&
        testItemsDataKeyed[testItemId].data &&
        testItemsDataKeyed[testItemId].data.questions) ||
      [];
    qids = [...qids, ...questions.map(x => x.id)];
  }
  return qids;
};

const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");

/**
 *
 * @param {{data:{questions:Object[]},itemLevelScoring?:boolean, itemLevelScore: number}[]}_testItemsData
 * @param {string[]} testItems
 */
export const markQuestionLabel = (_testItemsData, testItems) => {
  const testItemsData = keyBy(_testItemsData, "_id");
  for (let i = 0; i < testItems.length; i++) {
    const item = testItemsData[testItems[i]];
    if (!(item.data && item.data.questions)) {
      continue;
    }
    if (item.data.questions.length === 1) {
      item.data.questions[0].qLabel = `Q${i + 1}`;
      item.data.questions[0].barLabel = `Q${i + 1}`;
    } else {
      item.data.questions = item.data.questions.map((q, qIndex) => ({
        ...q,
        qLabel: `Q${i + 1}.${alphabets[qIndex]}`,
        barLabel: item.itemLevelScoring ? `Q${i + 1}` : `Q${i + 1}.${alphabets[qIndex]}`
      }));
    }
  }
};

/**
 * @returns {{id:string,weight:number,disabled:boolean,qids?:string[],testItemId?:string,maxScore?: number,qLabel:string,barLabel:string}[]}
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
          .map((x, index) => ({
            id: x.id,
            maxScore: index === 0 ? testItemsDataKeyed[testItemId].itemLevelScore : undefined,
            weight: questions.length,
            disabled: x.scoringDisabled || index > 0,
            testItemId,
            qids: questions.map(x => x.id),
            qLabel: x.qLabel,
            barLabel: x.barLabel
          }))
      ];
    } else {
      qids = [
        ...qids,
        ...questions.map(x => ({
          id: x.id,
          weight: 1,
          qids: [x.id],
          qLabel: x.qLabel,
          barLabel: x.barLabel
        }))
      ];
    }
  }
  return qids;
};

/**
 *
 * @param {{data:{questions:Object[]},itemLevelScoring?:boolean, itemLevelScore: number}[]} testItemsData
 * @param {string[]} testItems
 * @returns {{[qid:string]:{qLabel:string, barLabel: string } }}
 */
export const getQuestionLabels = (testItemsData, testItems) => {
  /**
   * @type {{[qid:string]:{qLabel:string, barLabel: string }  }}
   */
  const result = {};
  const testItemsdataKeyed = keyBy(testItemsData, "_id");
  for (let i = 0; i < testItems.length; i++) {
    const item = testItemsdataKeyed[testItems[i]];
    if (!(item.data && item.data.questions)) {
      continue;
    }
    if (item.data.questions.length === 1) {
      result[item.data.questions[0].id] = { qLabel: `Q${i + 1}`, barLabel: `Q${i + 1}` };
    } else {
      for (let qIndex = 0; qIndex < item.data.questions.length; qIndex++) {
        const q = item.data.questions[qIndex];
        result[q.id] = {
          qLabel: `Q${i + 1}.${alphabets[qIndex]}`,
          barLabel: item.itemLevelScoring ? `Q${i + 1}` : `Q${i + 1}.${alphabets[qIndex]}`
        };
      }
    }
  }

  return result;
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

export const getAvatarName = studentName => {
  if (!studentName) {
    console.warn("no name");
    return "";
  }
  const parts = studentName.split(" ");
  if (parts.length > 1) {
    return `${parts[0].trim().charAt(0)}${parts[1].trim().charAt(0)}`.toUpperCase();
  } else {
    const part = parts[0].trim();
    return `${part.charAt(0)}${part.charAt(1)}`.toUpperCase();
  }
};

export const getFirstName = studentName => {
  if (!studentName) {
    return "";
  }
  const parts = studentName.trim().split(" ");
  return parts[0];
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
    testItemId: x.testItemId,
    qids: x.qids,
    qLabel: x.qLabel,
    barLabel: x.barLabel
  }));

  return studentNames
    .map(({ _id: studentId, firstName: studentName, lastName, email, fakeFirstName, fakeLastName, icon }) => {
      const fullName = `${studentName}${lastName ? ` ${lastName}` : ""}`;
      const fakeName = `${fakeFirstName} ${fakeLastName}`;
      if (!studentTestActivities[studentId]) {
        return {
          studentId,
          studentName: fullName,
          email,
          fakeName,
          icon,
          color: fakeFirstName,
          present: true,
          status: "notStarted",
          maxScore: testMaxScore,
          questionActivities: emptyQuestionActivities
        };
      }
      const testActivity = studentTestActivities[studentId];
      if (testActivity.redirected) {
        return {
          studentId,
          studentName: fullName,
          email,
          fakeName,
          icon,
          color: fakeFirstName,
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
      const graded = testActivity.graded ? testActivity.graded === "GRADED" : undefined;
      const submitted = testActivity.status == testActivityStatus.SUBMITTED;
      const redirected = testActivity.redirected;
      const testActivityId = testActivity._id;

      const questionActivitiesRaw = testActivityQuestionActivities[studentId];

      const score = (questionActivitiesRaw && questionActivitiesRaw.reduce((e1, e2) => (e2.score || 0) + e1, 0)) || 0;

      const questionActivitiesIndexed = (questionActivitiesRaw && keyBy(questionActivitiesRaw, x => x.qid)) || {};

      const questionActivities = qids.map(
        ({ id: el, weight, qids: _qids, disabled, testItemId, maxScore, barLabel, qLabel }, index) => {
          const _id = el;

          if (!questionActivitiesIndexed[el]) {
            return { _id, notStarted: true, weight, disabled, testItemId, barLabel, qLabel };
          }
          let {
            skipped,
            correct,
            partiallyCorrect: partialCorrect,
            timeSpent,
            score,
            graded
          } = questionActivitiesIndexed[el];
          const questionMaxScore = maxScore ? maxScore : getMaxScoreOfQid(_id, testItemsData);
          if (score > 0 && skipped) {
            skipped = false;
          }
          if (_qids && _qids.length) {
            correct = score === questionMaxScore && score > 0;
            if (!correct) {
              partialCorrect = score > 0 && score <= questionMaxScore;
            }
          }

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
            qids: _qids,
            testActivityId,
            graded,
            qLabel,
            barLabel
          };
        }
      );

      let displayStatus = "inProgress";
      if (submitted) {
        displayStatus = "submitted";
      }

      return {
        studentId,
        studentName: fullName,
        email,
        fakeName,
        icon,
        color: fakeFirstName,
        status: displayStatus,
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
