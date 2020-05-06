import { keyBy, sortBy, get } from "lodash";
import { questionType } from "@edulastic/constants";
import { markQuestionLabel } from "../ClassBoard/Transformer";
import { formatAnswers, formatOptions } from "../StudentsReportCard/utils/transformers";
import { replaceVariables } from "../../assessment/utils/variables";

const defaultManualGradedType = questionType.manuallyGradableQn;

const TEI = "Tech Enhanced Item";
const CR = "Constructed Response Item";

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

  let answers = questions.map(q => {
    const { options, validResponse, altResponse } = formatOptions(q);
    const answer = formatAnswers(validResponse, options, q);
    const formatedAltResponse = altResponse.map(res => formatAnswers(res, options, q));
    return {
      qLabel: `${q.qLabel || q.barLabel?.substr(1) || ""}${q.qSubLabel || ""}`,
      answers: [answer, ...formatedAltResponse]
    };
  });

  answers = answers.reduce((acc, a) => {
    if (!a.qLabel) {
      return [...acc];
    }
    const answers = a.answers.map(ans => {
      if (ans === "TEI") {
        return TEI;
      } else if (ans === "Constructed Response") {
        return CR;
      }
      return ans;
    });
    a.answers = answers;
    return [...acc, a];
  }, []);
  return {
    questions,
    answers
  };
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
