import test from 'ava';
import { multipleChoice as mcqEvaluator } from '../src/index';

import { emObj1, emObj2, emObj3 } from './data/mcq';

test('#MCQ:exactMatch', async t => {
  // case 1
  const result = mcqEvaluator(emObj1);
  t.is(result.score, 1, 'incorrect score');
  t.is(result.maxScore, 1, 'incorrect maxScore');
  t.deepEqual(result.evaluation, { 0: true, 1: true }, 'incorrect evaluation');

  // case 2
  const result2 = mcqEvaluator(emObj2);
  t.is(result2.maxScore, 3, 'incorrect maxScore');
  t.is(result2.score, 0, 'incorrect score');
  t.deepEqual(result2.evaluation, { 1: false }, 'incorrect evaluation');

  // case 3
  const result3 = mcqEvaluator(emObj3);
  t.is(result3.maxScore, 3, 'incorrect maxScore');
  t.is(result3.score, 0, 'incorrect score');
  t.deepEqual(
    result3.evaluation,
    { 1: false, 0: true },
    'incorrect evaluation'
  );
});
