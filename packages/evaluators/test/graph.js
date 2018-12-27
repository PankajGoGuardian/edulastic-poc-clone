import test from 'ava';
import { graph as evaluator } from '../src/index';
import { IgnoreRepeatedShapes } from '../src/graphs-comparison/constants/ignoreRepeatedShapes';

import {
  trueAnswerWith1Point, trueAnswerWith2Points,
  trueAnswerWith1Line, trueLineWithOtherPoints, secondTrueLine, errorLine,
  EV315_trueAnswer, EV315_testPoints,
  trueAnswerWith1Ray, trueRayWithOtherPoints, secondTrueRay, errorRay,
  trueAnswerWith1Segment, trueSegmentWithReversedPoints, secondTrueSegment, errorSegment,
  trueAnswerWith1Vector, vectorWithReversedPoints, secondTrueVector, errorVector,
  trueAnswerWith1Circle, trueCircleWithOtherPoints, secondTrueCircle, errorCircle,
  trueAnswerWith1Parabola, trueParabolaWithOtherPoints, secondTrueParabola, errorParabola,
  trueAnswerWith1Sine, trueSineWithOtherPoints, secondTrueSine, errorSine,
  trueAnswerWith1Polygon, truePolygonWithOtherOrderedPoints, secondTruePolygon, errorPolygon
} from './data/graph';

function clone(object) {
  return JSON.parse(JSON.stringify(object));
}

// Point ===========================================================================================

test('#GraphPoint: check 1 true point', async (t) => {
  // prepare data
  const eObj = {
    validation: trueAnswerWith1Point,
    userResponse: trueAnswerWith1Point.valid_response.value
  };
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_1').result, true);
});

test('#GraphPoint: check 1 error point', async (t) => {
  // prepare data
  const eObj = {
    validation: trueAnswerWith1Point,
    userResponse: clone(trueAnswerWith1Point.valid_response.value)
  };
  eObj.userResponse[0].x = -10;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_1').result, false);
});

test('#GraphPoint: check 2 true points', async (t) => {
  // prepare data
  const eObj = {
    validation: trueAnswerWith2Points,
    userResponse: trueAnswerWith2Points.valid_response.value
  };
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_1').result, true);
  t.is(result.details.find(item => item.id === 'lrn_2').result, true);
});

test('#GraphPoint: check 2 points: 1 - error point, 2: true point', async (t) => {
  // prepare data
  const eObj = {
    validation: trueAnswerWith2Points,
    userResponse: clone(trueAnswerWith2Points.valid_response.value)
  };
  eObj.userResponse[0].x = -10;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_1').result, false);
  t.is(result.details.find(item => item.id === 'lrn_2').result, true);
});

test('#GraphPoint: check 2 error points', async (t) => {
  // prepare data
  const eObj = {
    validation: trueAnswerWith2Points,
    userResponse: clone(trueAnswerWith2Points.valid_response.value)
  };
  eObj.userResponse[0].x = -10;
  eObj.userResponse[1].x = 20;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_1').result, false);
  t.is(result.details.find(item => item.id === 'lrn_2').result, false);
});

test('#GraphPoint: there are not all points', async (t) => {
  // prepare data
  const eObj = {
    validation: trueAnswerWith2Points,
    userResponse: trueAnswerWith1Point.valid_response.value
  };
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_1').result, true);
});

// Line ============================================================================================

test('#GraphLine: check 1 true line {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Line),
    userResponse: trueAnswerWith1Line.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphLine: check 1 true line {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Line),
    userResponse: trueAnswerWith1Line.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphLine: check 1 true line {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Line),
    userResponse: trueAnswerWith1Line.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphLine: check 1 error line {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Line),
    userResponse: errorLine
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphLine: check 1 error line {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Line),
    userResponse: errorLine
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphLine: check 1 error line {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Line),
    userResponse: errorLine
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphLine: check 1 true line, but in test answer 3 true lines {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Line),
    userResponse: clone(trueAnswerWith1Line.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Line.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueLineWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, false);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphLine: check 1 true line, but in test answer 3 true lines {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Line),
    userResponse: clone(trueAnswerWith1Line.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Line.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueLineWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, true);
});

test('#GraphLine: check 1 true line, but in test answer 3 true lines {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Line),
    userResponse: clone(trueAnswerWith1Line.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Line.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueLineWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphLine: check 2 true lines {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Line),
    userResponse: clone(trueAnswerWith1Line.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueLine);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(secondTrueLine);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_13').result, true);
});

test('#GraphLine: check 2 lines: 1 - true line, 2 - error line {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Line),
    userResponse: clone(trueAnswerWith1Line.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueLine);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(errorLine);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphLine: there are not all lines', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Line),
    userResponse: trueAnswerWith1Line.valid_response.value
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueLine);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphLine: EV-315', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(EV315_trueAnswer),
    userResponse: EV315_testPoints
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, true);
  t.is(result.details.find(item => item.id === 'lrn_9').result, true);
});

// Ray =============================================================================================

test('#GraphRay: check 1 true ray {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Ray),
    userResponse: trueAnswerWith1Ray.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphRay: check 1 true ray {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Ray),
    userResponse: trueAnswerWith1Ray.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphRay: check 1 true ray {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Ray),
    userResponse: trueAnswerWith1Ray.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphRay: check 1 error ray {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Ray),
    userResponse: errorRay
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphRay: check 1 error ray {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Ray),
    userResponse: errorRay
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphRay: check 1 error ray {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Ray),
    userResponse: errorRay
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphRay: check 1 true ray, but in test answer 3 true rays {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Ray),
    userResponse: clone(trueAnswerWith1Ray.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Ray.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueRayWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, false);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphRay: check 1 true ray, but in test answer 3 true rays {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Ray),
    userResponse: clone(trueAnswerWith1Ray.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Ray.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueRayWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, true);
});

test('#GraphRay: check 1 true ray, but in test answer 3 true rays {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Ray),
    userResponse: clone(trueAnswerWith1Ray.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Ray.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueRayWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphRay: check 2 true ray {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Ray),
    userResponse: clone(trueAnswerWith1Ray.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueRay);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(secondTrueRay);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_13').result, true);
});

test('#GraphRay: check 2 ray: 1 - true ray, 2 - error ray {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Ray),
    userResponse: clone(trueAnswerWith1Ray.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueRay);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(errorRay);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphRay: there are not all rays', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Ray),
    userResponse: trueAnswerWith1Ray.valid_response.value
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueRay);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

// Segment =========================================================================================

test('#GraphSegment: check 1 true segment {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Segment),
    userResponse: trueAnswerWith1Segment.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphSegment: check 1 true segment {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Segment),
    userResponse: trueAnswerWith1Segment.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphSegment: check 1 true segment {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Segment),
    userResponse: trueAnswerWith1Segment.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphSegment: check 1 error segment {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Segment),
    userResponse: errorSegment
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphSegment: check 1 error segment {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Segment),
    userResponse: errorSegment
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphSegment: check 1 error segment {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Segment),
    userResponse: errorSegment
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphSegment: check 1 true segment, but in test answer 3 true segments {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Segment),
    userResponse: clone(trueAnswerWith1Segment.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Segment.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse.push(trueSegmentWithReversedPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, false);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphSegment: check 1 true segment, but in test answer 3 true segments {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Segment),
    userResponse: clone(trueAnswerWith1Segment.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Segment.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse.push(trueSegmentWithReversedPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, true);
});

test('#GraphSegment: check 1 true segment, but in test answer 3 true segments {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Segment),
    userResponse: clone(trueAnswerWith1Segment.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Segment.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse.push(trueSegmentWithReversedPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, true);
});

test('#GraphSegment: check 2 true segment {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Segment),
    userResponse: clone(trueAnswerWith1Segment.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueSegment);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(secondTrueSegment);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_13').result, true);
});

test('#GraphSegment: check 2 segment: 1 - true segment, 2 - error segment {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Segment),
    userResponse: clone(trueAnswerWith1Segment.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueSegment);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(errorSegment);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphSegment: there are not all segments', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Segment),
    userResponse: trueAnswerWith1Segment.valid_response.value
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueSegment);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

// Vector ==========================================================================================

test('#GraphVector: check 1 true vector {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: trueAnswerWith1Vector.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphVector: check 1 true vector {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: trueAnswerWith1Vector.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphVector: check 1 true vector {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: trueAnswerWith1Vector.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphVector: check 1 error vector {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: errorVector
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphVector: check 1 error vector {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: errorVector
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphVector: check 1 error vector {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: errorVector
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphVector: check 1 true vector, but in test answer 2 true vectors {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: clone(trueAnswerWith1Vector.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Vector.valid_response.value[2], { id: 'lrn_10' }));
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, false);
});

test('#GraphVector: check 1 true vector, but in test answer 2 true vectors {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: clone(trueAnswerWith1Vector.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Vector.valid_response.value[2], { id: 'lrn_10' }));
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
});

test('#GraphVector: check 1 true vector, but in test answer 2 true vectors {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: clone(trueAnswerWith1Vector.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Vector.valid_response.value[2], { id: 'lrn_10' }));
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
});

test('#GraphVector: check 2 true vectors {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: clone(trueAnswerWith1Vector.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueVector);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(secondTrueVector);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_13').result, true);
});

test('#GraphVector: check 2 vectors: 1 - true vector, 2 - error vector {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: clone(trueAnswerWith1Vector.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueVector);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(errorVector);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphVector: check 2 vectors: 1 - true vector, 2 - reversed vector {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: clone(trueAnswerWith1Vector.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueVector);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse.push(vectorWithReversedPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphVector: there are not all vectors', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Vector),
    userResponse: trueAnswerWith1Vector.valid_response.value
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueVector);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

// Circle ==========================================================================================

test('#GraphCircle: check 1 true circle {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Circle),
    userResponse: trueAnswerWith1Circle.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphCircle: check 1 true circle {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Circle),
    userResponse: trueAnswerWith1Circle.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphCircle: check 1 true circle {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Circle),
    userResponse: trueAnswerWith1Circle.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphCircle: check 1 error circle {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Circle),
    userResponse: errorCircle
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphCircle: check 1 error circle {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Circle),
    userResponse: errorCircle
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphCircle: check 1 error circle {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Circle),
    userResponse: errorCircle
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphCircle: check 1 true circle, but in test answer 3 true circles {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Circle),
    userResponse: clone(trueAnswerWith1Circle.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Circle.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueCircleWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, false);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphCircle: check 1 true circle, but in test answer 3 true circles {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Circle),
    userResponse: clone(trueAnswerWith1Circle.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Circle.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueCircleWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, true);
});

test('#GraphCircle: check 1 true circle, but in test answer 3 true circles {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Circle),
    userResponse: clone(trueAnswerWith1Circle.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Circle.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueCircleWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphCircle: check 2 true circles {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Circle),
    userResponse: clone(trueAnswerWith1Circle.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueCircle);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(secondTrueCircle);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_13').result, true);
});

test('#GraphCircle: check 2 circles: 1 - true circle, 2 - error circle {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Circle),
    userResponse: clone(trueAnswerWith1Circle.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueCircle);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(errorCircle);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphCircle: there are not all circles', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Circle),
    userResponse: trueAnswerWith1Circle.valid_response.value
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueCircle);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

// Parabola ========================================================================================

test('#GraphParabola: check 1 true parabola {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Parabola),
    userResponse: trueAnswerWith1Parabola.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphParabola: check 1 true parabola {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Parabola),
    userResponse: trueAnswerWith1Parabola.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphParabola: check 1 true parabola {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Parabola),
    userResponse: trueAnswerWith1Parabola.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphParabola: check 1 error parabola {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Parabola),
    userResponse: errorParabola
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphParabola: check 1 error parabola {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Parabola),
    userResponse: errorParabola
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphParabola: check 1 error parabola {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Parabola),
    userResponse: errorParabola
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphParabola: check 1 true parabola, but in test answer 3 true parabolas {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Parabola),
    userResponse: clone(trueAnswerWith1Parabola.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Parabola.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueParabolaWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, false);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphParabola: check 1 true parabola, but in test answer 3 true parabolas {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Parabola),
    userResponse: clone(trueAnswerWith1Parabola.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Parabola.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueParabolaWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, true);
});

test('#GraphParabola: check 1 true parabola, but in test answer 3 true parabolas {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Parabola),
    userResponse: clone(trueAnswerWith1Parabola.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Parabola.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueParabolaWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphParabola: check 2 true parabolas {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Parabola),
    userResponse: clone(trueAnswerWith1Parabola.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueParabola);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(secondTrueParabola);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_13').result, true);
});

test('#GraphParabola: check 2 parabolas: 1 - true parabola, 2 - error parabola {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Parabola),
    userResponse: clone(trueAnswerWith1Parabola.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueParabola);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(errorParabola);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphParabola: there are not all parabolas', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Parabola),
    userResponse: trueAnswerWith1Parabola.valid_response.value
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueParabola);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

// Sine ============================================================================================

test('#GraphSine: check 1 true sine {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Sine),
    userResponse: trueAnswerWith1Sine.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphSine: check 1 true sine {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Sine),
    userResponse: trueAnswerWith1Sine.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphSine: check 1 true sine {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Sine),
    userResponse: trueAnswerWith1Sine.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphSine: check 1 error sine {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Sine),
    userResponse: errorSine
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphSine: check 1 error sine {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Sine),
    userResponse: errorSine
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphSine: check 1 error sine {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Sine),
    userResponse: errorSine
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphSine: check 1 true sine, but in test answer 3 true sines {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Sine),
    userResponse: clone(trueAnswerWith1Sine.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Sine.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueSineWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, false);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphSine: check 1 true sine, but in test answer 3 true sines {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Sine),
    userResponse: clone(trueAnswerWith1Sine.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Sine.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueSineWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, true);
});

test('#GraphSine: check 1 true sine, but in test answer 3 true sines {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Sine),
    userResponse: clone(trueAnswerWith1Sine.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Sine.valid_response.value[2], { id: 'lrn_10' }));
  eObj.userResponse = eObj.userResponse.concat(trueSineWithOtherPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphSine: check 2 true sines {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Sine),
    userResponse: clone(trueAnswerWith1Sine.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueSine);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(secondTrueSine);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_13').result, true);
});

test('#GraphSine: check 2 sines: 1 - true sine, 2 - error sine {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Sine),
    userResponse: clone(trueAnswerWith1Sine.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueSine);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(errorSine);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphSine: there are not all sines', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Sine),
    userResponse: trueAnswerWith1Sine.valid_response.value
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTrueSine);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

// Polygon =========================================================================================

test('#GraphPolygon: check 1 true polygon {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Polygon),
    userResponse: trueAnswerWith1Polygon.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphPolygon: check 1 true polygon {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Polygon),
    userResponse: trueAnswerWith1Polygon.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphPolygon: check 1 true polygon {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Polygon),
    userResponse: trueAnswerWith1Polygon.valid_response.value
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});

test('#GraphPolygon: check 1 error polygon {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Polygon),
    userResponse: errorPolygon
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphPolygon: check 1 error polygon {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Polygon),
    userResponse: errorPolygon
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphPolygon: check 1 error polygon {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Polygon),
    userResponse: errorPolygon
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphPolygon: check 1 true polygon, but in test answer 3 true polygons {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Polygon),
    userResponse: clone(trueAnswerWith1Polygon.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Polygon.valid_response.value[4], { id: 'lrn_10' }));
  eObj.userResponse.push(truePolygonWithOtherOrderedPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, false);
  t.is(result.details.find(item => item.id === 'lrn_6').result, false);
});

test('#GraphPolygon: check 1 true polygon, but in test answer 3 true polygons {ignoreRepeatedShapes = COMPARE_BY_SLOPE}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Polygon),
    userResponse: clone(trueAnswerWith1Polygon.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_SLOPE;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Polygon.valid_response.value[4], { id: 'lrn_10' }));
  eObj.userResponse.push(truePolygonWithOtherOrderedPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, true);
});

test('#GraphPolygon: check 1 true polygon, but in test answer 3 true polygons {ignoreRepeatedShapes = COMPARE_BY_POINTS}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Polygon),
    userResponse: clone(trueAnswerWith1Polygon.valid_response.value)
  };
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.COMPARE_BY_POINTS;
  eObj.userResponse.push(Object.assign({}, trueAnswerWith1Polygon.valid_response.value[4], { id: 'lrn_10' }));
  eObj.userResponse.push(truePolygonWithOtherOrderedPoints);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_10').result, true);
  t.is(result.details.find(item => item.id === 'lrn_6').result, true);
});

test('#GraphPolygon: check 2 true polygons {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Polygon),
    userResponse: clone(trueAnswerWith1Polygon.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTruePolygon);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(secondTruePolygon);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, true);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_13').result, true);
});

test('#GraphPolygon: check 2 polygons: 1 - true polygon, 2 - error polygon {ignoreRepeatedShapes = NO}', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Polygon),
    userResponse: clone(trueAnswerWith1Polygon.valid_response.value)
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTruePolygon);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  eObj.userResponse = eObj.userResponse.concat(errorPolygon);
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
  t.is(result.details.find(item => item.id === 'lrn_9').result, false);
});

test('#GraphPolygon: there are not all polygons', async (t) => {
  // prepare data
  const eObj = {
    validation: clone(trueAnswerWith1Polygon),
    userResponse: trueAnswerWith1Polygon.valid_response.value
  };
  eObj.validation.valid_response.value = eObj.validation.valid_response.value.concat(secondTruePolygon);
  eObj.validation.ignore_repeated_shapes = IgnoreRepeatedShapes.NO;
  // action
  const result = evaluator(eObj);
  // check
  t.is(result.commonResult, false);
  t.is(result.details.find(item => item.id === 'lrn_3').result, true);
});
