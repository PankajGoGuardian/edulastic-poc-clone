import { get, keyBy, values, round, groupBy } from "lodash";
import next from "immer";
import { responseDisplayOption } from "./constants";
import { replaceVariables } from "../../../assessment/utils/variables";
import { questionType } from "@edulastic/constants";
import { formatToMathAnswer } from "../../../assessment/widgets/MathFormula/components/CorrectAnswerBox";

const CORRECT = "Correct";
const PARTIAL_CORRECT = "Partial Correct";
const INCORRECT = "Incorrect";

//format answers for doc based
const formatAnswerForDocBased = (value, q, options = {}) => {
  return options[value]?.label || value?.value || value || "-";
};

//to format correct/user answer
const formatAnswers = (data, options, q, qActivity = null, context = "") => {
  if ((!qActivity || qActivity.skipped) && context === "userResponse") {
    return "-";
  }
  const { type, title, isDocBased } = q;
  let responses = data;
  if (!Array.isArray(responses)) {
    responses = [responses];
  }

  const answer = responses.map((item, index) => {
    if (isDocBased) {
      return formatAnswerForDocBased(item, q, options);
    } else if (type === questionType.MULTIPLE_CHOICE) {
      //to check if 'True or false' qType have more then 2 options and option label othern then 'True' or 'False'
      //then considering it as standard multipleChoice type
      if (
        title === "True or false" &&
        Object.keys(options).length === 2 &&
        ["true", "false"].includes(options[item]?.label?.toLowerCase())
      ) {
        return options[item].label || "-";
      }
      return String.fromCharCode(65 + Object.keys(options).indexOf(item));
    } else if (type == questionType.MATH && title === "Units") {
      if (context === "userResponse") {
        if (typeof item === "string") {
          return item;
        }
        return `${item.expression || "-"}${item.unit || ""}`;
      }
      const value = item?.value;
      if (item.options) {
        const unit = Array.isArray(item.options) ? item.options.map(o => o.unit).join(",") : item.options?.unit;
        return `${value}${unit || ""}`;
      }
      return value;
    } else if (item?.value) {
      return item?.value;
    } else if (options && options[item]) {
      return options[item].label;
    } else if (options && item?.id && item?.index) {
      return options[(item?.id)][(item?.index)];
    } else if (typeof item === "string") {
      return item;
    }
    return "-";
  });

  let result = formatAnswertoDisplay(answer.length ? answer : "-", type, title);

  //to display 'Correct/PartialCorrect/Incorrect' for 'TEI' type question for user response
  //for qType = math, needs to reformat latex to correct format, so using formatToMathAnswer util function do this.
  if (result === "TEI" && context === "userResponse") {
    const { correct, partialCorrect } = qActivity || {};
    result = correct ? CORRECT : partialCorrect ? PARTIAL_CORRECT : INCORRECT;
  } else if (type === "math" && result !== "TEI") {
    result = Array.isArray(result) ? result.map(ans => formatToMathAnswer(ans)) : formatToMathAnswer(result);
  }
  return Array.isArray(result) ? result.join(", ") : result;
};

//use `replaceVariables` util function to replace variables from answers
const formatOptions = q => {
  let options = replaceVariables(q).options;
  if (Array.isArray(options)) {
    options = keyBy(options, "value");
  }
  return options;
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
            const options = formatOptions(q);
            const correctAnswers =
              get(qActivity, "correctAnswer.value") || get(q, "validation.validResponse.value", []);
            const userResponse = qActivity?.userResponse ? qActivity.userResponse : [];
            acc.yourAnswer = [...acc.yourAnswer, formatAnswers(userResponse, options, q, qActivity, "userResponse")];
            acc.correctAnswer = [...acc.correctAnswer, formatAnswers(correctAnswers, options, q)];
            acc.partialCorrect = acc.partialCorrect || qActivity?.partialCorrect;
            acc.correct = acc.correct || qActivity?.correct;
            acc.score += round(qActivity?.score || 0, 2);
            acc.itemLevelScoring = true;
            return acc;
          },
          { yourAnswer: [], correctAnswer: [], score: 0, maxScore: 0 }
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
          const options = formatOptions(q);
          const correctAnswers = get(qActivity, "correctAnswer.value") || get(q, "validation.validResponse.value");
          const userResponse = qActivity?.userResponse ? qActivity.userResponse : [];
          q.yourAnswer = [formatAnswers(userResponse, options, q, qActivity, "userResponse")];
          q.correctAnswer = [formatAnswers(correctAnswers, options, q)];
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

        //formatting uniq standards from each domain
        return domains.flatMap(d => {
          return (d.standards || []).map(std => ({
            ...std,
            domain: d.name,
            question: typeof q.qLabel === "string" ? q.qLabel?.substr(1) : q.qLabel,
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
    // this is to add score or maxScore of all questions belongs to same standard
    const formatScore = std.reduce(
      (acc, s) => {
        acc.question.push(s.question);
        acc.score += s.score;
        acc.maxScore += s.maxScore;
        const performance = Number(((acc.score / acc.maxScore) * 100).toFixed(2));
        acc.performance = !isNaN(performance) ? performance : 0;

        //calculating mastery
        let mastery = assignmentMastery.find((_item, index) => {
          if (acc.performance >= _item.threshold) {
            return true;
          }
        });
        if (mastery) {
          assignmentMasteryMap[mastery.masteryLevel].count++;
        }
        acc.masterySummary = mastery ? mastery.masteryLevel : "";
        return acc;
      },
      { question: [], score: 0, maxScore: 0 }
    );
    return {
      ...std[0],
      ...formatScore
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
