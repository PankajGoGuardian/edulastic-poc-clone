import { keyBy, identity, flatten, groupBy, sortBy } from "lodash";
import { questionType } from "@edulastic/constants";
import { markQuestionLabel } from "../ClassBoard/Transformer";

export const getOrderedQuestionsAndAnswers = (testItems, passages) => {
  passages = keyBy(passages, "_id");
  markQuestionLabel(testItems);
  let questions = testItems?.reduce((acc, item, index) => {
    // if it's a passage type question, insert passage before the questions
    // also, if the current testItem has same passageId as previous one, dont insert the passage again!
    if (item.passageId && item.passageId !== testItems?.[index - 1]?.passageId) {
      const passageStructure = passages?.[item.passageId]?.structure;
      if (passageStructure?.tabs?.length) {
        const sortedTabContentIds = sortBy(passageStructure.widgets || [], ["tabIndex"]).map(con => con.reference);
        const data = passages?.[item.passageId]?.data || [];
        const sortedData = sortedTabContentIds.map(id => data.find(d => d.id === id));
        acc.push(...sortedData);
      } else {
        acc.push(...(passages?.[item.passageId]?.data || []));
      }
    }
    acc = [...acc, ...(item?.data?.questions || [])];
    return acc;
  }, []);

  const answers = questions
    .filter(q => ![questionType.PASSAGE, questionType.VIDEO, questionType.PROTRACTOR].includes(q.type))
    .map(q => ({
      qLabel: q.qLabel,
      answer: createAnswer(q)
    }));

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
      return "Constructed Response Question";
    default:
      return "Tech Enhanced Question";
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
