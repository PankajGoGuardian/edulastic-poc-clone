import { keyBy, identity, flatten, groupBy, sortBy, flattenDeep } from "lodash";
import { questionType } from "@edulastic/constants";
import { markQuestionLabel } from "../ClassBoard/Transformer";

const defaultManualGradedType = questionType.manuallyGradableQn;

const TEI = "Tech Enhanced Item";
const CR = "Constructed Response";

export const getOrderedQuestionsAndAnswers = (testItems, passages, type, filterQs) => {
  passages = keyBy(passages, "_id");
  markQuestionLabel(testItems);
  let questions = testItems?.reduce((acc, item, index) => {
    // if it's a passage type question, insert passage before the questions
    // also, if the current testItem has same passageId as previous one, dont insert the passage again!
    let qs = item?.data?.questions || [];
    if (type === "custom") {
      qs = qs.filter(q => filterQs.includes(q.qLabel));
    } else if (type === "manualGraded") {
      if (item.multipartItem || item.itemLevelScoring) {
        qs =
          qs.filter(q => defaultManualGradedType.includes(q.type) || q.validation?.automarkable === false).length > 0
            ? qs
            : [];
      } else {
        qs = qs.filter(q => defaultManualGradedType.includes(q.type) || q.validation?.automarkable === false);
      }
    }

    if (item.passageId && item.passageId !== testItems?.[index - 1]?.passageId) {
      const passageStructure = passages?.[item.passageId]?.structure;
      if (passageStructure?.tabs?.length) {
        const sortedTabContentIds = sortBy(passageStructure.widgets || [], ["tabIndex"]).map(con => con.reference);
        const data = passages?.[item.passageId]?.data || [];
        const sortedData = sortedTabContentIds.map(id => data.find(d => d.id === id));
        if (qs.length) {
          acc.push(...sortedData);
        }
      } else if (qs.length) {
        acc.push(...(passages?.[item.passageId]?.data || []));
      }
    }

    acc = [...acc, ...qs];
    return acc;
  }, []);

  let answers = questions
    .filter(q => ![questionType.PASSAGE, questionType.VIDEO, questionType.PROTRACTOR].includes(q.type))
    .map(q => ({
      qLabel: q.qLabel,
      answer: createAnswer(q)
    }));
  const allTEIAnswers = answers.filter(a => a.answer === TEI);
  if (allTEIAnswers.length === answers.length) {
    answers = [];
  }
  return {
    questions,
    answers
  };
};

const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");

const createAnswer = q => {
  switch (q.type) {
    case questionType.MULTIPLE_CHOICE:
      return createAnswerMultipleChoiceAnswer(q);
    case questionType.CLOZE_TEXT:
    case questionType.CLOZE_DROP_DOWN:
      return createClozeTextAnswerChoice(q);
    case questionType.ESSAY_RICH_TEXT:
    case questionType.HIGHLIGHT_IMAGE:
    case questionType.ESSAY_PLAIN_TEXT:
      return CR;
    default:
      return TEI;
  }
};

const createAnswerMultipleChoiceAnswer = (question = {}) => {
  const options = question?.options?.map(i => i.value);
  const altResp = (question?.validation?.altResponses || []).map(i => i?.value) || [];

  if (!question.multipleResponses) {
    // this will have to be modified, since True or false implementation is not proper now.
    if (question.title === "True or false") {
      const correct = question?.validation?.validResponse?.value?.[0] || "";
      return question?.options?.find(i => i.value === correct)?.label;
    }

    let answers = [...(question?.validation?.validResponse.value || []), ...flatten(altResp)]
      .filter(identity)

      .map(i => options.indexOf(i))
      .map(i => alphabets[i]?.toUpperCase())
      .filter(identity);

    return answers.join(" ");
  }

  // in case of multiple choice with multiple responses.

  let answers = [question?.validation?.validResponse?.value, ...altResp]
    .map(i => {
      let ans = i.map(j => options.indexOf(j)).map(j => alphabets[j]?.toUpperCase());
      return ans.join(",");
    })
    .join(" ");
  return answers;
};

const createClozeTextAnswerChoice = question => {
  const altResp = (question?.validation?.altResponses || []).map(i => i?.value) || [];
  const groupByKey = question.type === question.CLOZE_TEXT ? "index" : "id";
  let answers = groupBy([...(question?.validation?.validResponse.value || []), ...flatten(altResp)], groupByKey);
  let keys = Object.keys(answers);
  let index = 0;
  let answerString = "";
  for (let key of keys) {
    let tempAns = answers[key].map(i => i?.value).join(",");
    answerString = `${answerString} ${Number(++index)}. ${tempAns}`;
  }
  return answerString;
};

export const formatQuestionLists = (qs = "") =>
  qs
    .split(",")
    .map(q => {
      const range = q.split("-");
      let start = parseInt(range[0]);
      let end = parseInt(range[1]);
      if (start > end) {
        const temp = start;
        start = end;
        end = temp;
      }
      if (range.length > 1) {
        return Array.from({ length: (end || start) - start + 1 }, (_, i) => i + start);
      }
      return [start, end];
    })
    .flat()
    .filter(q => !isNaN(q));
