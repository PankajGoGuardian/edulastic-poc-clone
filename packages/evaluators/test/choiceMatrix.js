import test from "ava";
import evaluator from "../src/choiceMatrix";
import { exactMatch, partialMatch } from "./data/choiceMatrix";

test("exact match: case #1", t => {
  const result = evaluator(exactMatch.multipleResponsesOff[0]);

  t.is(result.score, 0, "incorrect score for case #1");
  t.is(result.maxScore, 1, "incorrect max score for case #1");
  t.deepEqual(result.evaluation, [[true], [true], [false], [false]]);
});

test("exact match: case #2", t => {
  const result = evaluator(exactMatch.multipleResponsesOff[1]);

  t.is(result.score, 0, "incorrect score for case #2");
  t.is(result.maxScore, 1, "incorrect max score for case #2");
  t.deepEqual(
    result.evaluation,
    [[undefined, false], [true], [undefined, true], [false]],
    "evaluation is incorrect for case #2 "
  );
});

test("exact match: case #3 ", t => {
  const result = evaluator(exactMatch.multipleResponsesOff[2]);

  t.is(result.score, 0, "incorrect score for case #3");
  t.is(result.maxScore, 1, "incorrect max score for case #3");
  t.deepEqual(result.evaluation, [], "evaluation is incorrect for case #3 ");
});

test("exact match: case #4 ", t => {
  const result = evaluator(exactMatch.multipleResponsesOff[3]);
  t.is(result.score, 0, "incorrect score for case #4");
  t.is(result.maxScore, 4, "incorrect max score for case #4");
  t.deepEqual(
    result.evaluation,
    [[undefined, false], [undefined, true], [undefined, false], [undefined, true]],
    "evaluation is incorrect for case #4 "
  );
});

test("exact match: case #5 against alternate answer", t => {
  const result = evaluator(exactMatch.multipleResponsesOff[4]);
  t.is(result.score, 4, "incorrect score for case #5");
  t.is(result.maxScore, 4, "incorrect max score for case #5");
  t.deepEqual(
    result.evaluation,
    [[undefined, true], [true], [undefined, true], [true]],
    "evaluation is incorrect for case #5 "
  );
});

test("exact match: case #6 no user response", t => {
  const result = evaluator(exactMatch.multipleResponsesOff[5]);
  t.is(result.score, 0, "incorrect score for case #6");
  t.is(result.maxScore, 1, "incorrect max score for case #6");
  t.deepEqual(result.evaluation, [], "evaluation is incorrect for case #6");
});

test("partial match: case #1 all correct against (correct answer)", t => {
  const result = evaluator(partialMatch.multipleResponsesOff[0]);
  t.is(result.score, 1, "incorrect score for case #1");
  t.is(result.maxScore, 1, "incorrect max score for case #1");
  t.deepEqual(
    result.evaluation,
    [[true], [undefined, true], [true], [undefined, true]],
    "evaluation is incorrect for case #1"
  );
});

test("partial match: case #2 no user response", t => {
  const result = evaluator(partialMatch.multipleResponsesOff[1]);
  t.is(result.score, 0, "incorrect score for case #2");
  t.is(result.maxScore, 1, "incorrect max score for case #2");
  t.deepEqual(result.evaluation, [], "evaluation is incorrect for case #2");
});

test("partial match: case #3 half correct against correct answer (no penalty)", t => {
  const result = evaluator(partialMatch.multipleResponsesOff[2]);
  t.is(result.score, 0.5, "incorrect score for case #3");
  t.is(result.maxScore, 1, "incorrect max score for case #3");
  t.deepEqual(
    result.evaluation,
    [[true], [undefined, true], [undefined, false], [false]],
    "evaluation is incorrect for case #3"
  );
});

test("partial match: case #4 half correct against correct answer (with penalty)", t => {
  const result = evaluator(partialMatch.multipleResponsesOff[3]);
  t.is(result.score, 0, "incorrect score for case #4");
  t.is(result.maxScore, 1, "incorrect max score for case #4");
  t.deepEqual(
    result.evaluation,
    [[true], [undefined, true], [undefined, false], [false]],
    "evaluation is incorrect for case #4"
  );
});
