import { IgnoreLabels, IgnoreRepeatedShapes, ShapeTypes } from "./constants";
import CompareShapes from "./compareShapes";

const checkAnswer = (answer, userResponse, ignoreRepeatedShapes, ignoreLabels) => {
  const result = {
    commonResult: false,
    details: []
  };

  const trueAnswerValue = answer.value;
  const trueShapes = trueAnswerValue.filter(item => !item.subElement);

  const compareShapes = new CompareShapes(trueAnswerValue, userResponse, ignoreLabels !== IgnoreLabels.NO);

  userResponse
    .filter(elem => !elem.subElement)
    .forEach(testShape => {
      let compareResult = {
        id: testShape.id,
        result: false
      };
      for (let i = 0; i < trueShapes.length; i++) {
        compareResult = compareShapes.compare(testShape.id, trueShapes[i].id);
        if (compareResult.result) {
          break;
        }
      }

      result.details.push(compareResult);
    });

  // if result contain error shapes
  if (result.details.findIndex(item => !item.result) > -1) {
    result.commonResult = false;
    return result;
  }

  // check that all shapes are resolved
  const relatedIds = [];
  result.details.forEach(item => {
    if (relatedIds.findIndex(id => id === item.relatedId) === -1) {
      relatedIds.push(item.relatedId);
    }
  });

  if (relatedIds.length < trueShapes.length) {
    result.commonResult = false;
    return result;
  }

  // compare by slope
  if (ignoreRepeatedShapes && ignoreRepeatedShapes === IgnoreRepeatedShapes.COMPARE_BY_SLOPE) {
    result.commonResult = true;
    return result;
  }

  // compare by points
  if (ignoreRepeatedShapes && ignoreRepeatedShapes === IgnoreRepeatedShapes.COMPARE_BY_POINTS) {
    result.commonResult = true;

    for (let i = 0; i < relatedIds.length; i++) {
      const relatedShape = trueAnswerValue.find(item => item.id === relatedIds[i]);
      const sameShapes = result.details.filter(item => item.relatedId === relatedIds[i]);

      if (
        sameShapes.length > 1 &&
        relatedShape.type !== ShapeTypes.POINT &&
        relatedShape.type !== ShapeTypes.SEGMENT &&
        relatedShape.type !== ShapeTypes.VECTOR &&
        relatedShape.type !== ShapeTypes.POLYGON &&
        relatedShape.type !== ShapeTypes.POLYNOM
      ) {
        const firstShape = userResponse.find(item => item.id === sameShapes[0].id);
        for (let j = 1; j < sameShapes.length; j++) {
          const checkableShape = userResponse.find(item => item.id === sameShapes[j].id);
          switch (checkableShape.type) {
            case ShapeTypes.RAY:
            case ShapeTypes.PARABOLA:
            case ShapeTypes.CIRCLE:
            case ShapeTypes.EXPONENT:
            case ShapeTypes.LOGARITHM:
              if (
                !compareShapes.compare(firstShape.subElementsIds.endPoint, checkableShape.subElementsIds.endPoint, true)
                  .result
              ) {
                sameShapes[j].result = false;
                result.commonResult = false;
              }
              break;

            case ShapeTypes.ELLIPSE:
            case ShapeTypes.HYPERBOLA:
              if (!compareShapes.compare(firstShape.subElementsIds[2], checkableShape.subElementsIds[2], true).result) {
                sameShapes[j].result = false;
                result.commonResult = false;
              }
              break;

            case ShapeTypes.SINE:
            case ShapeTypes.TANGENT:
            case ShapeTypes.SECANT:
            case ShapeTypes.LINE:
            default:
              if (
                !(
                  compareShapes.compare(
                    firstShape.subElementsIds.startPoint,
                    checkableShape.subElementsIds.startPoint,
                    true
                  ).result &&
                  compareShapes.compare(
                    firstShape.subElementsIds.endPoint,
                    checkableShape.subElementsIds.endPoint,
                    true
                  ).result
                ) &&
                !(
                  compareShapes.compare(
                    firstShape.subElementsIds.startPoint,
                    checkableShape.subElementsIds.endPoint,
                    true
                  ).result &&
                  compareShapes.compare(
                    firstShape.subElementsIds.endPoint,
                    checkableShape.subElementsIds.startPoint,
                    true
                  ).result
                )
              ) {
                sameShapes[j].result = false;
                result.commonResult = false;
              }
          }
        }
      }
    }

    return result;
  }

  // compare by default
  result.commonResult = true;
  for (let i = 0; i < relatedIds.length; i++) {
    const sameShapes = result.details.filter(item => item.relatedId === relatedIds[i]);
    if (sameShapes.length > 1) {
      for (let j = 1; j < sameShapes.length; j++) {
        sameShapes[j].result = false;
        result.commonResult = false;
      }
    }
  }

  return result;
};

const evaluator = ({ userResponse, validation }) => {
  const { valid_response, alt_responses, ignore_repeated_shapes, ignore_labels } = validation;

  let score = 0;
  let maxScore = 1;

  const evaluation = {};

  let answers = [valid_response];
  if (alt_responses) {
    answers = answers.concat([...alt_responses]);
  }

  let result = {};

  answers.forEach((answer, index) => {
    result = checkAnswer(answer, userResponse, ignore_repeated_shapes, ignore_labels);
    if (result.commonResult) {
      score = Math.max(answer.score, score);
    }
    maxScore = Math.max(answer.score, maxScore);
    evaluation[index] = result;
  });

  return {
    score,
    maxScore,
    evaluation
  };
};

export default evaluator;
