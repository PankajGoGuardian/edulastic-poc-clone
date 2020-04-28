import { get, keyBy, values, round, groupBy } from "lodash";
import next from "immer";
import { responseDisplayOption } from "./constants";

//to format correct/user answer
const formatAnswers = (data, options, type, title) => {
  let responses = data;
  if (!Array.isArray(responses)) {
    responses = [responses];
  }

  const answer = responses.map((item, index) => {
    if (type === "multipleChoice") {
      if (title === "True or false") {
        return options[item].label;
      }
      return String.fromCharCode(65 + Object.keys(options).indexOf(item));
    } else if (item?.value) {
      return item?.value;
    } else if (options[item]) {
      return options[item].label;
    } else if (item?.id && item?.index) {
      return options[(item?.id)][(item?.index)];
    }
    return "";
  });
  const result = formatAnswertoDisplay(answer.length ? answer : "", type, title);
  return Array.isArray(result) ? result : [result];
};

export const getQuestionTableData = (studentResponse, author_classboard_testActivity) => {
  const testItemsData = get(author_classboard_testActivity, "data.testItemsData", []);
  const questionActivities = get(studentResponse, "data.questionActivities", []);
  const qActivityById = keyBy(questionActivities, "qid");
  let totalScore = 0;
  let obtainedScore = 0;

  const questionTableData = testItemsData
    .map(item => {
      const { isPassageWithQuestions, itemLevelScoring, multipartItem } = item;
      const questions = item.data.questions || [];

      //for question type isPassageWithQuestions or multipartItem, and itemLevelScoring, then all questions response needs to show in one row
      // so, converted to one row
      if ((isPassageWithQuestions || multipartItem) && itemLevelScoring) {
        const data = questions.reduce(
          (acc, q) => {
            const qActivity = qActivityById[q.id];
            const options = keyBy(q.options, "value");
            const correctAnswers = get(q, "validation.validResponse.value", []);
            const userResponse = qActivity?.userResponse ? qActivity.userResponse : [];
            acc.yourAnswer = [...acc.yourAnswer, ...formatAnswers(userResponse, options, q.type, q.title)];
            acc.correctAnswer = [...acc.correctAnswer, ...formatAnswers(correctAnswers, options, q.type, q.title)];
            acc.partialCorrect = acc.partialCorrect || qActivity?.partialCorrect;
            acc.correct = acc.correct || qActivity?.correct;
            acc.score += round(qActivity?.score || 0, 2);
            acc.itemLevelScoring = true;
            return acc;
          },
          { yourAnswer: [], correctAnswer: [], score: 0 }
        );

        totalScore += questions[0]?.itemScore || 0;
        obtainedScore += data.score;

        return {
          ...(questions[0] || {}),
          ...data,
          maxScore: questions[0]?.itemScore || 0,
          questionNumber: `${questions[0]?.barLabel?.substr(1)}`
        };
      }

      //for other question type other the above mentioned
      return next(questions, arr => {
        for (let i = 0; i < arr.length; i++) {
          const q = arr[i];
          const qActivity = qActivityById[q.id];
          const options = keyBy(q.options, "value");
          const correctAnswers = get(q, "validation.validResponse.value", []);
          const userResponse = qActivity?.userResponse ? qActivity.userResponse : [];
          q.yourAnswer = formatAnswers(userResponse, options, q.type, q.title);
          q.correctAnswer = formatAnswers(correctAnswers, options, q.type, q.title);
          q.maxScore = get(q, "validation.validResponse.score", 0);
          q.score = round(qActivity?.score || 0, 2);
          q.isCorrect = qActivity?.score;
          q.correct = qActivity?.correct;
          q.partialCorrect = qActivity?.partialCorrect;
          q.questionNumber = `${q.barLabel?.substr(1)}${q.qSubLabel || ""}`;
          totalScore += q.maxScore;
          obtainedScore += q.score;
        }
      });
    })
    .flat();

  return { questionTableData, totalScore, obtainedScore };
};

export const getChartAndStandardTableData = (studentResponse, author_classboard_testActivity) => {
  const testItems = get(author_classboard_testActivity, "data.testItemsData", []);
  const questionActivities = get(studentResponse, "data.questionActivities", []);

  //formatting all mastery types
  const assignmentMastery = get(author_classboard_testActivity, "additionalData.assignmentMastery", []);
  const assignmentMasteryCopy = assignmentMastery.map(item => ({
    ...item,
    count: 0,
    total: questionActivities.length,
    fill: item.color
  }));
  let assignmentMasteryMap = keyBy(assignmentMasteryCopy, "masteryLevel");

  // contains all test standards to display
  const standardsTableData = groupBy(
    testItems.reduce((acc, item) => {
      const questions = item.data.questions;

      //fetching all uniq standards from questions
      const allStandards = questions.flatMap(q => {
        //finding all doamins from question alignment
        const domains = (q.alignment || []).map(ali => ali.domains || []).flat();
        const qActivity = questionActivities.filter(qa => qa.qid === q.id)[0] || {};

        //calculating performace percentage
        let { score = 0, maxScore } = qActivity;
        if (!maxScore) {
          maxScore = q.validation?.validResponse?.score;
        }
        let performance = Number(((score / maxScore) * 100).toFixed(2));
        performance = !isNaN(performance) ? performance : 0;

        //calculating mastery
        let mastery = assignmentMastery.find((_item, index) => {
          if (performance >= _item.threshold) {
            return true;
          }
        });
        if (mastery) {
          assignmentMasteryMap[mastery.masteryLevel].count++;
        }

        //formatting uniq standards from each domain
        return domains.flatMap(d => {
          return (d.standards || []).map(std => ({
            ...std,
            domain: d.name,
            question: q.qLabel,
            masterySummary: mastery ? mastery.masteryLevel : "",
            performance: performance,
            score: round(score, 2),
            maxScore
          }));
        });
      });

      return [...acc, ...allStandards];
    }, []),
    "id"
  );

  const data = Object.values(standardsTableData).flatMap(std => {
    return {
      ...std[0],
      question: std.map(s => s.question)
    };
  });

  const chartData = values(assignmentMasteryMap);
  return { standardsTableData: data, chartData, assignmentMasteryMap };
};

//to return data for 'Your answer' and 'Correct Anser', as per question Type
//Responses: 'ETI'/'CR'/<User response>
export const formatAnswertoDisplay = (value, type, title) => {
  const matchedType = responseDisplayOption[type];
  if (matchedType) {
    if (!matchedType.titles || (matchedType.titles && matchedType.titles.includes(title))) {
      return matchedType.value;
    }
    return value;
  }
  return value;
};
