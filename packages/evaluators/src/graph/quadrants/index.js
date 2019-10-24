import axios from "axios";
import { IgnoreLabels, IgnoreRepeatedShapes, ShapeTypes } from "./constants";
import CompareShapes from "./compareShapes";

const evaluateApi = data =>
  axios
    .post(`${process.env.MATH_API_URI}evaluate`, data, {
      headers: {
        Authorization: "Bearer Token: U4aJ6616mlTFKK"
      }
    })
    .then(result => result.data.result);

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
        relatedShape.type !== ShapeTypes.POLYNOM &&
        relatedShape.type !== ShapeTypes.EQUATION
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

const getParabolaThirdPoint = (startPoint, endPoint) => {
  if (startPoint.x < endPoint.x && startPoint.y <= endPoint.y) {
    return {
      x: endPoint.x - (endPoint.x - startPoint.x) * 2,
      y: endPoint.y
    };
  }
  if (startPoint.x >= endPoint.x && startPoint.y < endPoint.y) {
    return {
      x: endPoint.x,
      y: endPoint.y - (endPoint.y - startPoint.y) * 2
    };
  }
  if (startPoint.x > endPoint.x && startPoint.y >= endPoint.y) {
    return {
      x: endPoint.x + (startPoint.x - endPoint.x) * 2,
      y: endPoint.y
    };
  }
  return {
    x: endPoint.x,
    y: endPoint.y + (startPoint.y - endPoint.y) * 2
  };
};

const serialize = (shapes, lineTypes, points) => {
  const getShape = shape => (shape[0] === "eqn" ? `['eqn','${shape[1]}']` : `['${shape[0]}',[${shape[1].join(",")}]]`);

  return `[${shapes.map(getShape).join(",")}],[${lineTypes.map(x => `'${x}'`).join(",")}],[${points.join(",")}]`;
};

const buildGraphApiResponse = (elements = []) => {
  const allowedShapes = [
    ShapeTypes.PARABOLA,
    ShapeTypes.EQUATION,
    ShapeTypes.POLYNOM,
    ShapeTypes.SECANT,
    ShapeTypes.TANGENT,
    ShapeTypes.LOGARITHM,
    ShapeTypes.EXPONENT,
    ShapeTypes.HYPERBOLA,
    ShapeTypes.ELLIPSE,
    ShapeTypes.CIRCLE,
    ShapeTypes.LINE,
    ShapeTypes.POLYGON,
    ShapeTypes.SINE,
    ShapeTypes.AREA
  ];

  const more2PointShapes = [ShapeTypes.POLYNOM, ShapeTypes.HYPERBOLA, ShapeTypes.ELLIPSE, ShapeTypes.POLYGON];

  const shapes = [];
  const lineTypes = [];
  const points = [];

  elements.forEach(el => {
    if (!allowedShapes.includes(el.type)) {
      return;
    }

    if (el.type === ShapeTypes.AREA) {
      points.push(`(${+el.x.toFixed(4)},${+el.y.toFixed(4)})`);
      return;
    }

    if (el.type === ShapeTypes.EQUATION) {
      shapes.push(["eqn", el.latex]);
      lineTypes.push(el.latex.indexOf(">") > -1 || el.latex.indexOf("<") > -1 ? "dashed" : "solid");
      return;
    }

    const shapePoints = [];
    if (more2PointShapes.includes(el.type)) {
      Object.values(el.subElementsIds).forEach(id => {
        const point = elements.find(x => x.id === id);
        if (point) {
          shapePoints.push(`(${+point.x.toFixed(4)},${+point.y.toFixed(4)})`);
        }
      });
    } else {
      const startPoint = elements.find(x => x.id === el.subElementsIds.startPoint);
      if (startPoint) {
        shapePoints.push(`(${+startPoint.x.toFixed(4)},${+startPoint.y.toFixed(4)})`);
      }
      const endPoint = elements.find(x => x.id === el.subElementsIds.endPoint);
      if (endPoint) {
        shapePoints.push(`(${+endPoint.x.toFixed(4)},${+endPoint.y.toFixed(4)})`);
      }
      if (el.type === ShapeTypes.PARABOLA) {
        const thirdPoint = getParabolaThirdPoint(startPoint, endPoint);
        shapePoints.push(`(${+thirdPoint.x.toFixed(4)},${+thirdPoint.y.toFixed(4)})`);
      }
    }

    shapes.push([el.type, shapePoints]);
    lineTypes.push(el.dashed ? "dashed" : "solid");
  });

  return serialize(shapes, lineTypes, points);
};

const checkEquations = async (answer, userResponse) => {
  // const apiResult = await graphEvaluateApi.evaluate({
  //   input: "[['line',[(2.0,2.0),(0.0,4.0)]]],['dashed'],[(6.0,0.0)]",
  //   expected: "[['eqn','x+y \\gt 4']],['dashed'],[(5,0)]",
  //   checks: "evaluateGraphEquations"
  // });

  const apiResult = await evaluateApi({
    input: buildGraphApiResponse(userResponse),
    expected: buildGraphApiResponse(answer),
    checks: "evaluateGraphEquations"
  });

  if (apiResult === "true") {
    return {
      commonResult: true,
      details: userResponse.map(x => ({ id: x.id, result: true }))
    };
  }

  return {
    commonResult: false,
    details: userResponse.map(x => ({ id: x.id, result: false }))
  };
};

const evaluator = async ({ userResponse, validation }) => {
  const { validResponse, altResponses, ignore_repeated_shapes, ignoreLabels } = validation;

  let score = 0;
  let maxScore = 1;

  const evaluation = {};

  let answers = [validResponse];
  if (altResponses) {
    answers = answers.concat([...altResponses]);
  }

  let result = {};

  for (const [index, answer] of answers.entries()) {
    if (userResponse.some(x => x.type === ShapeTypes.AREA)) {
      result = await checkEquations(answer.value, userResponse);
    } else {
      result = checkAnswer(answer, userResponse, ignore_repeated_shapes, ignoreLabels);
    }

    if (result.commonResult) {
      score = Math.max(answer.score, score);
    }
    maxScore = Math.max(answer.score, maxScore);
    evaluation[index] = result;
  }

  return {
    score,
    maxScore,
    evaluation
  };
};

export default evaluator;
