import test from "ava";

import evaluator from "../src/clozeText";
import { cases } from "./data/clozeDropDown";

test("case 1: partial match with rounding down (partial score for user)", t => {
  const { partialMatch } = cases;
  const caseData = partialMatch[0];
  const result = evaluator(caseData);
  t.is(result.score, caseData.result.score, "score is incorrect");
  t.is(result.maxScore, caseData.result.maxScore, "max score is incorrect");
  t.deepEqual(result.evaluation, caseData.result.evaluation, "evaluation is correct");
});

test("case 2: partial match with rounding down (partial score for user)", t => {
  const { partialMatch } = cases;
  const caseData = partialMatch[1];
  const result = evaluator(caseData);
  t.is(result.score, caseData.result.score, "score is incorrect");
  t.is(result.maxScore, caseData.result.maxScore, "max score is incorrect");
  t.deepEqual(result.evaluation, caseData.result.evaluation, "evaluation is correct");
});

test("case 3: partial match with rounding down (full score for user)", t => {
  const { partialMatch } = cases;
  const caseData = partialMatch[2];
  const result = evaluator(caseData);
  t.is(result.score, caseData.result.score, "score is incorrect");
  t.is(result.maxScore, caseData.result.maxScore, "max score is incorrect");
  t.deepEqual(result.evaluation, caseData.result.evaluation, "evaluation is correct");
});

test("case 4: partial match with rounding down (full score for user)", t => {
  const { partialMatch } = cases;
  const caseData = partialMatch[3];
  const result = evaluator(caseData);
  t.is(result.score, caseData.result.score, "score is incorrect");
  t.is(result.maxScore, caseData.result.maxScore, "max score is incorrect");
  t.deepEqual(result.evaluation, caseData.result.evaluation, "evaluation is correct");
});
