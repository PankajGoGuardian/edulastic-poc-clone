/* eslint-disable no-unused-vars */
// @ts-check
import { keyBy, groupBy, get, values, flatten } from "lodash";
import { testActivityStatus, questionType } from "@edulastic/constants";
import DotProp from "dot-prop";

const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");

/**
 *
 * @param {{data:{questions:Object[]},itemLevelScoring?:boolean, itemLevelScore: number}[]}
 * @param {object[]} testItems
 */
export const markQuestionLabel = testItems => {
  for (let i = 0; i < testItems.length; i++) {
    const item = testItems[i];
    if (!(item.data && item.data.questions)) {
      continue;
    }
    if (item.data.questions.length === 1) {
      item.data.questions[0].qLabel = i + 1;
      item.data.questions[0].barLabel = `Q${i + 1}`;
    } else if (item.isDocBased) {
      item.data.questions = item.data.questions
        .filter(q => q.type !== questionType.SECTION_LABEL)
        .map((q, qIndex) => ({
          ...q,
          qLabel: `Q${qIndex + 1}`,
          barLabel: `Q${qIndex + 1}`
        }));
    } else {
      item.data.questions = item.data.questions.map((q, qIndex) => ({
        ...q,
        qLabel: qIndex === 0 ? i + 1 : null,
        qSubLabel: alphabets[qIndex],
        barLabel: item.itemLevelScoring ? `Q${i + 1}` : `Q${i + 1}.${alphabets[qIndex]}`
      }));
    }
  }
};

/**
 * @returns {{id:string,weight:number,disabled:boolean,qids?:string[],testItemId?:string,maxScore?: number,qLabel:string,barLabel:string}[]}
 */
export const getAllQidsAndWeight = (testItemIds, testItemsDataKeyed) => {
  let qids = [];
  for (const testItemId of testItemIds) {
    const questions =
      (testItemsDataKeyed[testItemId].data && testItemsDataKeyed[testItemId].data.questions) || [];
    if (!questions.length) {
      qids = [
        ...qids,
        {
          id: "",
          weight: 1,
          maxScore: 1,
          testItemId,
          qids: [],
          qLabel: "",
          barLabel: ""
        }
      ];
    } else if (testItemsDataKeyed[testItemId].itemLevelScoring) {
      qids = [
        ...qids,
        ...questions
          // .filter(x => !x.scoringDisabled)
          .map((x, index) => ({
            id: x.id,
            maxScore: index === 0 ? testItemsDataKeyed[testItemId].itemLevelScore : undefined,
            weight: questions.length,
            disabled: x.scoringDisabled || index > 0,
            testItemId,
            qids: questions.map(_x => _x.id),
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
          maxScore: get(x, ["validation", "validResponse", "score"], 0),
          testItemId,
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
 * @param {{itemId:string}[]} testItems
 * @returns {{[qid:string]:{qLabel:string, barLabel: string } }}
 */
export const getQuestionLabels = (testItemsData = []) => {
  /**
   * @type {{[qid:string]:{qLabel:string, barLabel: string }  }}
   */
  const result = {};
  for (let i = 0; i < testItemsData.length; i++) {
    const item = testItemsData[i];
    if (!item) {
      continue;
    }
    if (!(item.data && item.data.questions)) {
      continue;
    }
    if (item.data.questions.length === 1) {
      result[item.data.questions[0].id] = { qLabel: i + 1, barLabel: `Q${i + 1}` };
    } else {
      for (let qIndex = 0; qIndex < item.data.questions.length; qIndex++) {
        const q = item.data.questions[qIndex];
        if (item.isDocBased) {
          result[q.id] = {
            qLabel: `Q${qIndex + 1}`,
            barLabel: `Q${qIndex + 1}`
          };
        } else {
          result[q.id] = {
            qLabel: qIndex === 0 ? i + 1 : null,
            qSubLabel: alphabets[qIndex],
            barLabel: item.itemLevelScoring ? `Q${i + 1}` : `Q${i + 1}.${alphabets[qIndex]}`
          };
        }
      }
    }
  }

  return result;
};

/**
 * @returns {number}
 */
const getMaxScoreFromQuestion = question => {
  let possibleScores = [DotProp.get(question, "validation.validResponse.score", 0)];
  const alternateResponses = DotProp.get(question, "validation.altResponses", false);
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
export const getMaxScoreOfQid = (qid, testItemsData, qActivityMaxScore) => {
  if (!qid) {
    return qActivityMaxScore || 1;
  }
  for (const testItem of testItemsData) {
    const questions = get(testItem, ["data", "questions"], []);
    const questionNeeded = questions.find(x => x.id === qid);

    if (questionNeeded) {
      return getMaxScoreFromQuestion(questionNeeded);
    }
  }
  console.warn("no such qid for maxScore", qid);
  return 0;
};

const getSkippedStatusOfQuestion = (
  testItemId,
  questionActivitiesMap,
  testItems,
  questionActivityId
) => {
  const questionActivities = Object.values(questionActivitiesMap);
  const questions = questionActivities.filter(o => o.testItemId === testItemId);
  const item = testItems.find(o => o._id === testItemId);

  let skipCount = 0;
  if (item && item.itemLevelScoring) {
    for (const q of questions) {
      if (q.skipped === true) {
        skipCount++;
      }
    }
    if (skipCount === questions.length) {
      return true;
    }
    return false;
  }
  return questionActivitiesMap[questionActivityId].skipped;
};

/**
 * @returns {number}
 */
const getMaxScoreFromItem = testItem => {
  let total = 0;
  if (!testItem) {
    return total;
  }
  if (testItem?.itemLevelScoring) {
    return testItem.itemLevelScore || 0;
  }
  if (!testItem?.data?.questions) {
    return total;
  }
  for (const question of testItem?.data?.questions || []) {
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
  }
  const part = parts[0].trim();
  return `${part.charAt(0)}${part.charAt(1)}`.toUpperCase();
};

export const getFirstName = studentName => {
  if (!studentName) {
    return "";
  }
  const parts = studentName.trim().split(" ");
  return parts[0];
};

export const transformTestItems = ({ passageData, testItemsData }) => {
  const passagesKeyed = keyBy(passageData, "_id");

  for (const x of testItemsData) {
    if (x.passageId && passagesKeyed[x.passageId]) {
      x.rows.unshift(passagesKeyed[x.passageId].structure);
    }
  }
};

export const transformGradeBookResponse = (
  {
    test,
    testItemsData,
    students: studentNames,
    testActivities,
    testQuestionActivities,
    passageData,
    status: assignmentStatus,
    endDate
  },
  studentResponse
) => {
  /**
   * TODO: need to refactor
   */
  testItemsData = testItemsData.map(testItem => {
    if (testItem.data) {
      testItem.data.questions = testItem.data.questions.filter(
        q => q.type !== questionType.SECTION_LABEL
      );
      testItem.rows = testItem.rows.map(row => {
        row.widgets = row.widgets.filter(w => w.type !== questionType.SECTION_LABEL);
        return row;
      });
    }
    return testItem;
  });

  const testItemIds = testItemsData.map(o => o._id);
  const testItemIdsSet = new Set(testItemIds);
  testQuestionActivities = testQuestionActivities.filter(x => testItemIdsSet.has(x.testItemId));
  const testItemsDataKeyed = keyBy(testItemsData, "_id");
  const qids = getAllQidsAndWeight(testItemIds, testItemsDataKeyed);
  const testMaxScore = testItemsData.reduce((prev, cur) => prev + getMaxScoreFromItem(cur), 0);
  const questionActivitiesGrouped = groupBy(testQuestionActivities, "testItemId");

  for (const itemId of Object.keys(questionActivitiesGrouped)) {
    const notGradedQuestionActivities = questionActivitiesGrouped[itemId].filter(
      x => x.graded === false
    );

    const { itemLevelScoring } = testItemsDataKeyed[itemId];
    if (itemLevelScoring) {
      notGradedQuestionActivities.forEach(({ qid, testActivityId }) => {
        questionActivitiesGrouped[itemId]
          .filter(x => x.qid === qid && x.testActivityId === testActivityId)
          .forEach(x => {
            Object.assign(x, { graded: false, score: 0 });
          });
      });
    }
  }

  testQuestionActivities = flatten(values(questionActivitiesGrouped));

  const studentTestActivities = keyBy(testActivities, "userId");
  const testActivityQuestionActivities = groupBy(testQuestionActivities, "userId");
  // testActivityQuestionActivities = mapValues(testActivityQuestionActivities, v => keyBy(v, "qid"));

  // for students who hasn't even started the test
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
    .map(
      ({
        _id: studentId,
        firstName: studentName,
        lastName,
        email,
        username: userName,
        fakeFirstName,
        fakeLastName,
        icon
      }) => {
        const fullName = `${lastName ? `${lastName}, ` : ""}${studentName ? `${studentName}` : ""}`;
        const fakeName = `${fakeFirstName} ${fakeLastName}`;
        if (!studentTestActivities[studentId]) {
          const isAbsent = assignmentStatus === "DONE" || endDate < Date.now();
          return {
            studentId,
            studentName: fullName,
            userName,
            email,
            fakeName,
            icon,
            color: fakeFirstName,
            present: !isAbsent,
            status: isAbsent ? "absent" : "notStarted",
            maxScore: testMaxScore,
            questionActivities: emptyQuestionActivities.map(qact => ({
              ...qact,
              userId: studentId
            }))
          };
        }
        const testActivity = studentTestActivities[studentId];
        if (testActivity.redirect && !studentResponse) {
          return {
            studentId,
            studentName: fullName,
            userName,
            email,
            fakeName,
            icon,
            color: fakeFirstName,
            present: true,
            status: "redirected",
            redirected: true,
            maxScore: testMaxScore,
            questionActivities: emptyQuestionActivities.map(x => ({ ...x, userId: studentId }))
          };
        }

        // TODO: for now always present
        const present = true;
        // TODO: no graded status now. using submitted as a substitute for graded
        const { graded } = testActivity;
        const submitted = testActivity.status == testActivityStatus.SUBMITTED;
        const absent = testActivity.status === testActivityStatus.ABSENT;
        const { _id: testActivityId, groupId, previouslyRedirected: redirected } = testActivity;

        const questionActivitiesRaw = testActivityQuestionActivities[studentId];

        const score =
          (questionActivitiesRaw &&
            questionActivitiesRaw.reduce((e1, e2) => (e2.score || 0) + e1, 0)) ||
          0;

        const questionActivitiesIndexed =
          (questionActivitiesRaw && keyBy(questionActivitiesRaw, x => x.qid)) || {};
        const questionActivitiesKeyedByItemId =
          (questionActivitiesRaw && keyBy(questionActivitiesRaw, x => x.testItemId)) || {};

        const questionActivities = qids.map(
          (
            {
              id: el,
              weight,
              qids: _qids,
              disabled,
              testItemId,
              maxScore,
              barLabel,
              qLabel,
              _id: qActId
            },
            index
          ) => {
            const _id = el;
            const currentQuestionActivity =
              questionActivitiesIndexed[el] || questionActivitiesKeyedByItemId[testItemId];
            const questionMaxScore =
              maxScore || getMaxScoreOfQid(_id, testItemsData, currentQuestionActivity?.maxScore);

            if (!currentQuestionActivity) {
              return {
                _id,
                qid: _id,
                userId: studentId,
                weight,
                disabled,
                testItemId,
                barLabel,
                testActivityId,
                qActId,
                groupId,
                score: 0,
                qLabel,
                ...(submitted
                  ? { skipped: true, score: 0, maxScore: questionMaxScore }
                  : { notStarted: true, score: 0, maxScore: questionMaxScore })
              };
            }
            let { skipped, correct, partiallyCorrect: partialCorrect } = currentQuestionActivity;
            const {
              timeSpent,
              // eslint-disable-next-line no-shadow
              score,
              // eslint-disable-next-line no-shadow
              graded,
              pendingEvaluation,
              ...remainingProps
            } = currentQuestionActivity;
            skipped = getSkippedStatusOfQuestion(
              testItemId,
              questionActivitiesIndexed,
              testItemsData,
              el
            );

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
              ...(studentResponse ? remainingProps : {}),
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
              barLabel,
              pendingEvaluation,
              userId: studentId
            };
          }
        );

        let displayStatus = "inProgress";
        if (submitted) {
          displayStatus = "submitted";
        } else if (absent) {
          displayStatus = "absent";
        }

        return {
          studentId,
          studentName: fullName,
          userName,
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
      }
    )
    .filter(x => x);
};
