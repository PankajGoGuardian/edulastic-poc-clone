

const shapeTypes = require('./constants/shapeTypes'); // import shapeTypes from './constants/shapeTypes';


const CompareShapes = require('./compare-shapes'); // import CompareShapes from './compare-shapes';


function checkAnswer(trueAnswer, testAnswer) {
  const result = {
    commonResult: false,
    details: []
  };
  const trueAnswerValue = trueAnswer.valid_response.value;
  const trueShapes = trueAnswerValue.filter(item => !item.subElement);
  const compareShapes = new CompareShapes(trueAnswerValue, testAnswer);
  testAnswer.filter(elem => !elem.subElement).forEach((testShape) => {
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
  }); // if result contain error shapes

  if (result.details.findIndex(item => !item.result) > -1) {
    result.commonResult = false;
    return result;
  } // check that all shapes are resolved


  const relatedIds = [];
  result.details.forEach((item) => {
    if (relatedIds.findIndex(id => id === item.relatedId) === -1) {
      relatedIds.push(item.relatedId);
    }
  });

  if (relatedIds.length < trueShapes.length) {
    result.commonResult = false;
    return result;
  } // compare by slope


  if (trueAnswer.ignore_repeated_shapes && trueAnswer.ignore_repeated_shapes === 'yes') {
    result.commonResult = true;
    return result;
  } // compare by points


  if (trueAnswer.ignore_repeated_shapes && trueAnswer.ignore_repeated_shapes === 'strict') {
    result.commonResult = true;

    const _loop = function _loop(i) {
      const sameShapes = result.details.filter(item => item.relatedId === relatedIds[i]);
      const sameShapesType = testAnswer.find(item => item.id === sameShapes[0].id).type;

      if (sameShapes.length > 1 && sameShapesType !== shapeTypes.POINT && sameShapesType !== shapeTypes.SEGMENT && sameShapesType !== shapeTypes.VECTOR && sameShapesType !== shapeTypes.POLYGON) {
        const allowedSubElementsIds = testAnswer.find(item => item.id === sameShapes[0].id).subElementsIds;

        const _loop2 = function _loop2(j) {
          const checkableShape = testAnswer.find(item => item.id === sameShapes[j].id);

          switch (checkableShape.type) {
            case shapeTypes.CIRCLE:
              if (checkableShape.subElementsIds.endPoint !== allowedSubElementsIds.endPoint) {
                sameShapes[j].result = false;
                result.commonResult = false;
              }

              break;

            case shapeTypes.PARABOLA:
            case shapeTypes.SINE:
            case shapeTypes.LINE:
            case shapeTypes.RAY:
            default:
              if (checkableShape.subElementsIds.startPoint !== allowedSubElementsIds.startPoint || checkableShape.subElementsIds.endPoint !== allowedSubElementsIds.endPoint) {
                sameShapes[j].result = false;
                result.commonResult = false;
              }
          }
        };

        for (let j = 1; j < sameShapes.length; j++) {
          _loop2(j);
        }
      }
    };

    for (var i = 0; i < relatedIds.length; i++) {
      _loop(i);
    }

    return result;
  } // compare by default


  result.commonResult = true;

  const _loop3 = function _loop3(i) {
    const sameShapes = result.details.filter(item => item.relatedId === relatedIds[i]);

    if (sameShapes.length > 1) {
      for (let j = 1; j < sameShapes.length; j++) {
        sameShapes[j].result = false;
        result.commonResult = false;
      }
    }
  };

  for (var i = 0; i < relatedIds.length; i++) {
    _loop3(i);
  }

  return result;
}

module.exports = {
  checkAnswer
}; // export default checkAnswer;
