import { keyBy, identity, flatten } from "lodash";
import { questionType } from "@edulastic/constants";
import { markQuestionLabel } from "../ClassBoard/Transformer";

export const getOrderedQuestionsAndAnswers = (testItems, passages) => {
  passages = keyBy(passages, "_id");
  markQuestionLabel(testItems);
  let questions = testItems?.reduce((acc, item) => {
    // if it's a passage type question, insert passage before the questions
    if (item.passageId) {
      acc.push(...(passages?.[item.passageId]?.data || []));
    }
    acc = [...acc, ...(item?.data?.questions || [])];
    return acc;
  }, []);

  const answers = questions.map(q => ({
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
