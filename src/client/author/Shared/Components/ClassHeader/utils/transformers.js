import { get, keyBy, values, groupBy, isEmpty } from "lodash";
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
      let correctAnswers = q.validation.valid_response.value;
      item.question = item.correct;
      item.questionNumber = i + 1;
      item.yourAnswer = item.userResponse.map((item, index) => options[item].label);
      item.correctAnswer = correctAnswers.map((item, index) => options[item].label);
      totalScore += item.maxScore;
      obtainedScore += item.score;
    }
  });

  return { questionTableData, totalScore, obtainedScore };
};

export const getChartAndStandardTableData = (studentResponse, author_classboard_testActivity) => {
  const standards = get(author_classboard_testActivity, "additionalData.standards", []);
  const standardsMap = keyBy(standards, "_id");

  const questionActivities = get(studentResponse, "data.questionActivities", []);

  const assignmentMastery = get(author_classboard_testActivity, "additionalData.assignmentMastery", []);
  const assignmentMasteryCopy = assignmentMastery.map(item => ({
    ...item,
    count: 0,
    total: questionActivities.length,
    fill: item.color
  }));
  let assignmentMasteryMap = keyBy(assignmentMasteryCopy, "masteryName");

  const standardsArr = questionActivities.flatMap((item, index) => {
    let performance = Number(((item.score / item.maxScore) * 100).toFixed(2));
    performance = !isNaN(performance) ? performance : 0;
    let mastery = assignmentMastery.find((_item, index) => {
      if (performance >= _item.threshold) {
        return true;
      }
    });
    if (mastery) {
      assignmentMasteryMap[mastery.masteryName].count++;
    }

    return item.standards.map(_item => ({
      ...item,
      question: index + 1,
      standardInfo: _item,
      standardId: _item.id
    }));
  });

  const groupedStandards = groupBy(standardsArr, "standardId");

  const standardsTableData = Object.keys(groupedStandards).map((key, index) => {
    const item = groupedStandards[key];
    const questions = item.map((_item, index) => _item.question);

    const totals = item.reduce(
      (total, _item, index) => {
        const { score = 0, maxScore = 0 } = _item;
        total.totalScore = total.totalScore + score;
        total.totalMaxScore = total.totalMaxScore + maxScore;
        return total;
      },
      { totalScore: 0, totalMaxScore: 0 }
    );

    let performance = (totals.totalScore / totals.totalMaxScore) * 100;
    performance = !isNaN(performance) ? performance : 0;
    const mastery = assignmentMastery.find((_item, index) => {
      if (performance >= _item.threshold) {
        return true;
      }
    });

    return {
      id: key,
      standardId: key,
      standardInfo: standardsMap[key],
      question: questions,
      masterySummary: mastery ? mastery.masteryName : "",
      performance: performance,
      score: totals.totalScore,
      maxScore: totals.totalMaxScore
    };
  });

  const chartData = values(assignmentMasteryMap);

  return { standardsTableData, chartData, assignmentMasteryMap, standardsMap };
};
