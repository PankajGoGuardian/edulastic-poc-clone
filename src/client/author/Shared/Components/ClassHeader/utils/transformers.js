import { get, keyBy, values, groupBy, isEmpty, uniqBy } from "lodash";
import next from "immer";

export const getQuestions = author_classboard_testActivity => {
  const testItemsData = get(author_classboard_testActivity, "data.testItemsData", []);
  const arrOfArr = testItemsData.map((item, index) => {
    if (item.data && item.data.questions) {
      return item.data.questions;
    }
    return [];
  });
  let questionsArr = [];

  for (let item of arrOfArr) {
    questionsArr = [...questionsArr, ...item];
  }

  return questionsArr;
};

export const getQuestionTableData = (studentResponse, questionArr) => {
  const questionActivities = get(studentResponse, "data.questionActivities", []);
  const questions = keyBy(questionArr, "id");
  let totalScore = 0;
  let obtainedScore = 0;
  const questionTableData = next(questionActivities, arr => {
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      let q = questions[item.qid];
      let options = keyBy(q.options, "value");
      let correctAnswers = get(q, "validation.validResponse.value", []);
      const userResponse = item.userResponse ? item.userResponse : [];
      item.questionNumber = i + 1;
      item.yourAnswer = Array.isArray(userResponse)
        ? userResponse.map((item, index) => (options[item] ? options[item].label : ""))
        : [];
      item.correctAnswer = correctAnswers.map((item, index) => (options[item] ? options[item].label : ""));
      totalScore += item.maxScore;
      obtainedScore += item.score;
    }
  });

  return { questionTableData, totalScore, obtainedScore };
};

export const getChartAndStandardTableData = (studentResponse, author_classboard_testActivity) => {
  const testItems = get(author_classboard_testActivity, "data.testItemsData", []);
  const questionActivities = get(studentResponse, "data.questionActivities", []);
  const assignmentMastery = get(author_classboard_testActivity, "additionalData.assignmentMastery", []);
  const assignmentMasteryCopy = assignmentMastery.map(item => ({
    ...item,
    count: 0,
    total: questionActivities.length,
    fill: item.color
  }));
  let assignmentMasteryMap = keyBy(assignmentMasteryCopy, "masteryLevel");

  const standardsTableData = uniqBy(testItems.reduce((acc, item) => {
    const questions = item.data.questions;
    const allDomains = questions.map(q => {
      const domains = (q.alignment || []).map(ali => ali.domains || []).flat();
      const qActivity = questionActivities.filter(qa => qa.qid === q.id)[0] || {};
      let { score = 0, maxScore } = qActivity;
      if (!maxScore) {
        maxScore = q.validation?.validResponse?.score;
      }
      let performance = Number(((score / maxScore) * 100).toFixed(2));
      performance = !isNaN(performance) ? performance : 0;
      let mastery = assignmentMastery.find((_item, index) => {
        if (performance >= _item.threshold) {
          return true;
        }
      });
      if (mastery) {
        assignmentMasteryMap[mastery.masteryLevel].count++;
      }

      return domains.map(d => {
        return (d.standards || []).map(std => (
          {
            ...std,
            domain: d.name,
            question: q.qLabel,
            masterySummary: mastery ? mastery.masteryLevel : "",
            performance: performance,
            score,
            maxScore
          }));
      }).flat();
    }).flat();
    
    return [...acc, ...allDomains];
  }, []), "id");
  console.log("standardsTableData", standardsTableData);

  const chartData = values(assignmentMasteryMap);

  return { standardsTableData, chartData, assignmentMasteryMap };
};
