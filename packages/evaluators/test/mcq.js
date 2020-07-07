import test from "ava";
import { multipleChoice as mcqEvaluator } from "../src/index";

import { emObj1, emObj2, emObj3, emObj4, emObj5, pmObj1, pmObj2, pmObj3, pmObj4, pmObj5 } from "./data/mcq";

test("#MCQ:exactMatch no user answer", async t => {
  // case 1
  const result = mcqEvaluator(emObj1);
  t.is(result.maxScore, 1, "incorrect maxScore");
  t.is(result.score, 0, "incorrect score");
  t.deepEqual(result.evaluation, {}, "incorrect evaluation");
});

test("#MCQ:exactMatch correct with alternate answer", async t => {
  // case 2
  const result2 = mcqEvaluator(emObj2);
  t.is(result2.maxScore, 3, "incorrect maxScore");
  t.is(result2.score, 3, "incorrect score");
  t.deepEqual(result2.evaluation, { 0: true }, "incorrect evaluation");
});

test("#MCQ:exactMatch partially correct with correct answer", async t => {
  // case 3
  const result3 = mcqEvaluator(emObj3);
  t.is(result3.maxScore, 2, "incorrect maxScore");
  t.is(result3.score, 0, "incorrect score");
  t.deepEqual(result3.evaluation, { 0: true }, "incorrect evaluation");
});

test("#MCQ:exactMatch all correct with correct answer", async t => {
  // case 4
  const result4 = mcqEvaluator(emObj4);
  t.is(result4.maxScore, 2, "incorrect maxScore");
  t.is(result4.score, 2, "incorrect score");
  t.deepEqual(result4.evaluation, { 0: true }, "incorrect evaluation");
});

test("#MCQ:exactMatch incorrect answer", async t => {
  // case 5
  const result5 = mcqEvaluator(emObj5);
  t.is(result5.maxScore, 2, "incorrect maxScore");
  t.is(result5.score, 0, "incorrect score");
  t.deepEqual(result5.evaluation, { 0: false }, "incorrect evaluation");
});

test("#MCQ:partialMatch no answer", async t => {
  // case 6
  const result6 = mcqEvaluator(pmObj1);
  t.is(result6.maxScore, 1, "incorrect maxScore");
  t.is(result6.score, 0, "incorrect score");
  t.deepEqual(result6.evaluation, {}, "incorrect evaluation");
});

test("#MCQ:partialMatch partially correct answer no penalty", async t => {
  // case 7
  const result7 = mcqEvaluator(pmObj2);
  t.is(result7.maxScore, 1, "incorrect maxScore");
  t.is(result7.score, 0.5, "incorrect score");
  t.deepEqual(result7.evaluation, { 0: true }, "incorrect evaluation");
});

test("#MCQ:partialMatch full match with correct answer", async t => {
  // case 8
  const result8 = mcqEvaluator(pmObj3);
  t.is(result8.maxScore, 1, "incorrect maxScore");
  t.is(result8.score, 1, "incorrect score");
  t.deepEqual(result8.evaluation, { 0: true, 1: true }, "incorrect evaluation");
});

test("#MCQ:partialMatch full match with alternate answer", async t => {
  // case 9
  const result9 = mcqEvaluator(pmObj4);
  t.is(result9.maxScore, 1, "incorrect maxScore");
  t.is(result9.score, 1, "incorrect score");
  t.deepEqual(result9.evaluation, { 0: true, 1: true }, "incorrect evaluation");
});

test("#MCQ:partialMatch partial match with correct answer with penalty", async t => {
  // case 10
  const result10 = mcqEvaluator(pmObj5);
  t.is(result10.maxScore, 1, "incorrect maxScore");
  t.is(result10.score, 0, "incorrect score");
  t.deepEqual(result10.evaluation, { 0: true, 1: false }, "incorrect evaluation");
});
