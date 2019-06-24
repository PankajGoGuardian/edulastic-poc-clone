import { ShapeTypes, FractionDigits } from "./constants";
import LineFunction from "./lineFunction";
import ParabolaFunction from "./parabolaFunction";
import EllipseFunction from "./ellipseFunction";
import HyperbolaFunction from "./hyperbolaFunction";
import ExponentFunction from "./exponentFunction";
import LogarithmFunction from "./logarithmFunction";
import PolynomFunction from "./polynomFunction";

const labelsAreEqual = (label1, label2) => {
  let text1 = typeof label1 === "string" ? label1 : "";
  let text2 = typeof label2 === "string" ? label2 : "";
  text1 = text1
    .replace(/<(.|\n)*?>/g, "")
    .trim()
    .toLowerCase();
  text2 = text2
    .replace(/<(.|\n)*?>/g, "")
    .trim()
    .toLowerCase();
  return text1 === text2;
};

class CompareShapes {
  constructor(trueAnswerValue, testAnswer, ignoreLabels) {
    this.trueAnswerValue = trueAnswerValue;
    this.testAnswer = testAnswer;
    this.ignoreLabels = ignoreLabels;
  }

  compare(testId, trueId, compareTestShapes = false) {
    const testShape = this.testAnswer.find(item => item.id === testId);
    const trueShape = compareTestShapes
      ? this.testAnswer.find(item => item.id === trueId)
      : this.trueAnswerValue.find(item => item.id === trueId);

    if (!testShape || !trueShape || testShape.type !== trueShape.type) {
      return {
        id: testId,
        result: false
      };
    }

    switch (testShape.type) {
      case ShapeTypes.POINT:
        return this.comparePoints(testShape, trueShape);
      case ShapeTypes.LINE:
        return this.compareLines(testShape, trueShape);
      case ShapeTypes.RAY:
        return this.compareRays(testShape, trueShape);
      case ShapeTypes.SEGMENT:
        return this.compareSegments(testShape, trueShape);
      case ShapeTypes.VECTOR:
        return this.compareVectors(testShape, trueShape);
      case ShapeTypes.CIRCLE:
        return this.compareCircles(testShape, trueShape);
      case ShapeTypes.PARABOLA:
        return this.compareParabolas(testShape, trueShape);
      case ShapeTypes.SINE:
      case ShapeTypes.TANGENT:
      case ShapeTypes.SECANT:
        return this.compareTrigonometrics(testShape, trueShape);
      case ShapeTypes.POLYGON:
        return this.comparePolygons(testShape, trueShape);
      case ShapeTypes.ELLIPSE:
        return this.compareEllipses(testShape, trueShape);
      case ShapeTypes.HYPERBOLA:
        return this.compareHyperbolas(testShape, trueShape);
      case ShapeTypes.EXPONENT:
        return this.compareExponents(testShape, trueShape);
      case ShapeTypes.LOGARITHM:
        return this.compareLogarithms(testShape, trueShape);
      case ShapeTypes.POLYNOM:
        return this.comparePolynoms(testShape, trueShape);
      default:
        return {
          id: testId,
          result: false
        };
    }
  }

  comparePoints(testPoint, truePoint) {
    if (
      testPoint.x === truePoint.x &&
      testPoint.y === truePoint.y &&
      (this.ignoreLabels || labelsAreEqual(testPoint.label, truePoint.label))
    ) {
      return {
        id: testPoint.id,
        relatedId: truePoint.id,
        result: true
      };
    }

    return {
      id: testPoint.id,
      result: false
    };
  }

  compareLines(testShape, trueShape) {
    const positiveResult = {
      id: testShape.id,
      relatedId: trueShape.id,
      result: true
    };

    const negativeResult = {
      id: testShape.id,
      result: false
    };

    const testShapePointStart = this.testAnswer.find(item => item.id === testShape.subElementsIds.startPoint);
    const testShapePointEnd = this.testAnswer.find(item => item.id === testShape.subElementsIds.endPoint);

    const trueShapePointStart = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.startPoint);
    const trueShapePointEnd = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.endPoint);

    if (!this.ignoreLabels) {
      if (
        labelsAreEqual(testShape.label, trueShape.label) &&
        ((this.comparePoints(testShapePointStart, trueShapePointStart).result &&
          this.comparePoints(testShapePointEnd, trueShapePointEnd).result) ||
          (this.comparePoints(testShapePointStart, trueShapePointEnd).result &&
            this.comparePoints(testShapePointEnd, trueShapePointStart).result))
      ) {
        return positiveResult;
      }
      return negativeResult;
    }

    const testShapePoints = {
      x1: +testShapePointStart.x,
      y1: +testShapePointStart.y,
      x2: +testShapePointEnd.x,
      y2: +testShapePointEnd.y
    };

    const trueShapePoints = {
      x1: +trueShapePointStart.x,
      y1: +trueShapePointStart.y,
      x2: +trueShapePointEnd.x,
      y2: +trueShapePointEnd.y
    };

    const testShapeFunc = new LineFunction(testShapePoints);
    const trueShapeFunc = new LineFunction(trueShapePoints);

    if (
      testShapeFunc.getKoefA() === trueShapeFunc.getKoefA() &&
      testShapeFunc.getKoefB() === trueShapeFunc.getKoefB()
    ) {
      return positiveResult;
    }
    return negativeResult;
  }

  compareRays(testShape, trueShape) {
    const positiveResult = {
      id: testShape.id,
      relatedId: trueShape.id,
      result: true
    };

    const negativeResult = {
      id: testShape.id,
      result: false
    };

    const testShapePointStart = this.testAnswer.find(item => item.id === testShape.subElementsIds.startPoint);
    const testShapePointEnd = this.testAnswer.find(item => item.id === testShape.subElementsIds.endPoint);

    const trueShapePointStart = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.startPoint);
    const trueShapePointEnd = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.endPoint);

    if (!this.ignoreLabels) {
      if (
        labelsAreEqual(testShape.label, trueShape.label) &&
        this.comparePoints(testShapePointStart, trueShapePointStart).result &&
        this.comparePoints(testShapePointEnd, trueShapePointEnd).result
      ) {
        return positiveResult;
      }
      return negativeResult;
    }

    const testShapePoints = {
      x1: +testShapePointStart.x,
      y1: +testShapePointStart.y,
      x2: +testShapePointEnd.x,
      y2: +testShapePointEnd.y
    };

    const trueShapePoints = {
      x1: +trueShapePointStart.x,
      y1: +trueShapePointStart.y,
      x2: +trueShapePointEnd.x,
      y2: +trueShapePointEnd.y
    };

    const testRayParams = {
      deltaX: testShapePoints.x2 - testShapePoints.x1,
      deltaY: testShapePoints.y2 - testShapePoints.y1
    };
    testRayParams.koef =
      testRayParams.deltaX === 0 ? "NaN" : (testRayParams.deltaY / testRayParams.deltaX).toFixed(FractionDigits);

    const trueRayParams = {
      deltaX: trueShapePoints.x2 - trueShapePoints.x1,
      deltaY: trueShapePoints.y2 - trueShapePoints.y1
    };
    trueRayParams.koef =
      trueRayParams.deltaX === 0 ? "NaN" : (trueRayParams.deltaY / trueRayParams.deltaX).toFixed(FractionDigits);

    if (
      testShapePoints.x1 === trueShapePoints.x1 &&
      testShapePoints.y1 === trueShapePoints.y1 &&
      testRayParams.koef === trueRayParams.koef &&
      Math.sign(testRayParams.deltaX) === Math.sign(trueRayParams.deltaX) &&
      Math.sign(testRayParams.deltaY) === Math.sign(trueRayParams.deltaY)
    ) {
      return positiveResult;
    }
    return negativeResult;
  }

  compareSegments(testShape, trueShape) {
    const testShapePointStart = this.testAnswer.find(item => item.id === testShape.subElementsIds.startPoint);
    const testShapePointEnd = this.testAnswer.find(item => item.id === testShape.subElementsIds.endPoint);

    const trueShapePointStart = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.startPoint);
    const trueShapePointEnd = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.endPoint);

    if (
      labelsAreEqual(testShape.label, trueShape.label) &&
      ((this.comparePoints(testShapePointStart, trueShapePointStart).result &&
        this.comparePoints(testShapePointEnd, trueShapePointEnd).result) ||
        (this.comparePoints(testShapePointStart, trueShapePointEnd).result &&
          this.comparePoints(testShapePointEnd, trueShapePointStart).result))
    ) {
      return {
        id: testShape.id,
        relatedId: trueShape.id,
        result: true
      };
    }

    return {
      id: testShape.id,
      result: false
    };
  }

  compareVectors(testShape, trueShape) {
    const testShapePointStart = this.testAnswer.find(item => item.id === testShape.subElementsIds.startPoint);
    const testShapePointEnd = this.testAnswer.find(item => item.id === testShape.subElementsIds.endPoint);

    const trueShapePointStart = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.startPoint);
    const trueShapePointEnd = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.endPoint);

    if (
      labelsAreEqual(testShape.label, trueShape.label) &&
      this.comparePoints(testShapePointStart, trueShapePointStart).result &&
      this.comparePoints(testShapePointEnd, trueShapePointEnd).result
    ) {
      return {
        id: testShape.id,
        relatedId: trueShape.id,
        result: true
      };
    }

    return {
      id: testShape.id,
      result: false
    };
  }

  compareCircles(testShape, trueShape) {
    const positiveResult = {
      id: testShape.id,
      relatedId: trueShape.id,
      result: true
    };

    const negativeResult = {
      id: testShape.id,
      result: false
    };

    const testShapePointStart = this.testAnswer.find(item => item.id === testShape.subElementsIds.startPoint);
    const testShapePointEnd = this.testAnswer.find(item => item.id === testShape.subElementsIds.endPoint);

    const trueShapePointStart = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.startPoint);
    const trueShapePointEnd = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.endPoint);

    if (!this.ignoreLabels) {
      if (
        labelsAreEqual(testShape.label, trueShape.label) &&
        this.comparePoints(testShapePointStart, trueShapePointStart).result &&
        this.comparePoints(testShapePointEnd, trueShapePointEnd).result
      ) {
        return positiveResult;
      }
      return negativeResult;
    }

    const testShapePoints = {
      startX: +testShapePointStart.x,
      startY: +testShapePointStart.y,
      endX: +testShapePointEnd.x,
      endY: +testShapePointEnd.y
    };

    const trueShapePoints = {
      startX: +trueShapePointStart.x,
      startY: +trueShapePointStart.y,
      endX: +trueShapePointEnd.x,
      endY: +trueShapePointEnd.y
    };

    let deltaX = testShapePoints.startX - testShapePoints.endX;
    let deltaY = testShapePoints.startY - testShapePoints.endY;
    const testCircleRadius = Math.sqrt(deltaX * deltaX + deltaY * deltaY).toFixed(FractionDigits);

    deltaX = trueShapePoints.startX - trueShapePoints.endX;
    deltaY = trueShapePoints.startY - trueShapePoints.endY;
    const trueCircleRadius = Math.sqrt(deltaX * deltaX + deltaY * deltaY).toFixed(FractionDigits);

    if (
      testShapePoints.startX === trueShapePoints.startX &&
      testShapePoints.startY === trueShapePoints.startY &&
      testCircleRadius === trueCircleRadius
    ) {
      return positiveResult;
    }
    return negativeResult;
  }

  compareParabolas(testShape, trueShape) {
    const positiveResult = {
      id: testShape.id,
      relatedId: trueShape.id,
      result: true
    };

    const negativeResult = {
      id: testShape.id,
      result: false
    };

    const testShapePointStart = this.testAnswer.find(item => item.id === testShape.subElementsIds.startPoint);
    const testShapePointEnd = this.testAnswer.find(item => item.id === testShape.subElementsIds.endPoint);

    const trueShapePointStart = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.startPoint);
    const trueShapePointEnd = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.endPoint);

    if (!this.ignoreLabels) {
      if (
        labelsAreEqual(testShape.label, trueShape.label) &&
        this.comparePoints(testShapePointStart, trueShapePointStart).result &&
        this.comparePoints(testShapePointEnd, trueShapePointEnd).result
      ) {
        return positiveResult;
      }
      return negativeResult;
    }

    const testShapePoints = {
      startX: +testShapePointStart.x,
      startY: +testShapePointStart.y,
      endX: +testShapePointEnd.x,
      endY: +testShapePointEnd.y
    };

    const trueShapePoints = {
      startX: +trueShapePointStart.x,
      startY: +trueShapePointStart.y,
      endX: +trueShapePointEnd.x,
      endY: +trueShapePointEnd.y
    };

    const testFunc = new ParabolaFunction(testShapePoints);
    const trueFunc = new ParabolaFunction(trueShapePoints);

    if (
      testShapePoints.startX === trueShapePoints.startX &&
      testShapePoints.startY === trueShapePoints.startY &&
      testFunc.getKoefA() === trueFunc.getKoefA() &&
      testFunc.getDirection() === trueFunc.getDirection()
    ) {
      return positiveResult;
    }
    return negativeResult;
  }

  compareTrigonometrics(testShape, trueShape) {
    const positiveResult = {
      id: testShape.id,
      relatedId: trueShape.id,
      result: true
    };

    const negativeResult = {
      id: testShape.id,
      result: false
    };

    const testShapePointStart = this.testAnswer.find(item => item.id === testShape.subElementsIds.startPoint);
    const testShapePointEnd = this.testAnswer.find(item => item.id === testShape.subElementsIds.endPoint);

    const trueShapePointStart = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.startPoint);
    const trueShapePointEnd = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.endPoint);

    if (!this.ignoreLabels) {
      if (
        labelsAreEqual(testShape.label, trueShape.label) &&
        ((this.comparePoints(testShapePointStart, trueShapePointStart).result &&
          this.comparePoints(testShapePointEnd, trueShapePointEnd).result) ||
          (this.comparePoints(testShapePointStart, trueShapePointEnd).result &&
            this.comparePoints(testShapePointEnd, trueShapePointStart).result))
      ) {
        return positiveResult;
      }
      return negativeResult;
    }

    const testShapePoints = {
      startX: +testShapePointStart.x,
      startY: +testShapePointStart.y,
      endX: +testShapePointEnd.x,
      endY: +testShapePointEnd.y
    };

    const trueShapePoints = {
      startX: +trueShapePointStart.x,
      startY: +trueShapePointStart.y,
      endX: +trueShapePointEnd.x,
      endY: +trueShapePointEnd.y
    };

    // amplitudes
    const testAmpl = Math.abs(testShapePoints.endY - testShapePoints.startY);
    const trueAmpl = Math.abs(trueShapePoints.endY - trueShapePoints.startY);
    // center lines
    const testCenterLine = testShapePoints.startY;
    const trueCenterLine = trueShapePoints.startY;
    // periods
    const testPeriod = (testShapePoints.endX - testShapePoints.startX) * 4;
    const truePeriod = (trueShapePoints.endX - trueShapePoints.startX) * 4;
    // offsets
    const testNormalX =
      testShapePoints.endY < testShapePoints.startY ? testShapePoints.startX + testPeriod / 2 : testShapePoints.startX;
    const trueNormalX =
      trueShapePoints.endY < trueShapePoints.startY ? trueShapePoints.startX + truePeriod / 2 : trueShapePoints.startX;
    let testOffset = testNormalX % testPeriod;
    if (testOffset < 0) {
      testOffset += testPeriod;
    }
    let trueOffset = trueNormalX % truePeriod;
    if (trueOffset < 0) {
      trueOffset += truePeriod;
    }

    if (
      testAmpl === trueAmpl &&
      testCenterLine === trueCenterLine &&
      testPeriod === truePeriod &&
      testOffset === trueOffset
    ) {
      return positiveResult;
    }
    return negativeResult;
  }

  comparePolygons(testShape, trueShape) {
    const negativeResult = {
      id: testShape.id,
      result: false
    };

    const positiveResult = {
      id: testShape.id,
      relatedId: trueShape.id,
      result: true
    };

    let testPolygonPoints = [];
    Object.getOwnPropertyNames(testShape.subElementsIds).forEach(value => {
      const pointId = testShape.subElementsIds[value];
      const point = this.testAnswer.find(item => item.id === pointId);
      testPolygonPoints.push({ x: point.x, y: point.y, label: point.label });
    });

    const truePolygonPoints = [];
    Object.getOwnPropertyNames(trueShape.subElementsIds).forEach(value => {
      const pointId = trueShape.subElementsIds[value];
      const point = this.trueAnswerValue.find(item => item.id === pointId);
      truePolygonPoints.push({ x: point.x, y: point.y, label: point.label });
    });

    if (testPolygonPoints.length !== truePolygonPoints.length) {
      return negativeResult;
    }

    // find first equal point
    let startIndex = -1;
    for (let i = 0; i < testPolygonPoints.length; i++) {
      if (
        testPolygonPoints[i].x === truePolygonPoints[0].x &&
        testPolygonPoints[i].y === truePolygonPoints[0].y &&
        (this.ignoreLabels || labelsAreEqual(testPolygonPoints[i].label, truePolygonPoints[0].label))
      ) {
        startIndex = i;
        break;
      }
    }

    if (startIndex === -1) {
      return negativeResult;
    }

    // set start point to array beginning
    const removed = testPolygonPoints.splice(0, startIndex);
    testPolygonPoints = testPolygonPoints.concat(removed);

    // check direct order
    let equalCount = 0;
    for (let i = 0; i < testPolygonPoints.length; i++) {
      if (
        testPolygonPoints[i].x === truePolygonPoints[i].x &&
        testPolygonPoints[i].y === truePolygonPoints[i].y &&
        (this.ignoreLabels || labelsAreEqual(testPolygonPoints[i].label, truePolygonPoints[i].label))
      ) {
        equalCount++;
      }
    }
    if (
      equalCount === truePolygonPoints.length &&
      (this.ignoreLabels || labelsAreEqual(testShape.label, trueShape.label))
    ) {
      return positiveResult;
    }

    // check reverse order
    testPolygonPoints.reverse();
    const last = testPolygonPoints.splice(testPolygonPoints.length - 1, 1);
    testPolygonPoints.unshift(last[0]);

    equalCount = 0;
    for (let i = 0; i < testPolygonPoints.length; i++) {
      if (
        testPolygonPoints[i].x === truePolygonPoints[i].x &&
        testPolygonPoints[i].y === truePolygonPoints[i].y &&
        (this.ignoreLabels || labelsAreEqual(testPolygonPoints[i].label, truePolygonPoints[i].label))
      ) {
        equalCount++;
      }
    }
    if (
      equalCount === truePolygonPoints.length &&
      (this.ignoreLabels || labelsAreEqual(testShape.label, trueShape.label))
    ) {
      return positiveResult;
    }

    return negativeResult;
  }

  compareEllipses(testShape, trueShape) {
    const positiveResult = {
      id: testShape.id,
      relatedId: trueShape.id,
      result: true
    };

    const negativeResult = {
      id: testShape.id,
      result: false
    };

    const testShapeFocusPoint1 = this.testAnswer.find(item => item.id === testShape.subElementsIds[0]);
    const testShapeFocusPoint2 = this.testAnswer.find(item => item.id === testShape.subElementsIds[1]);
    const testShapeLinePoint = this.testAnswer.find(item => item.id === testShape.subElementsIds[2]);

    const trueShapeFocusPoint1 = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds[0]);
    const trueShapeFocusPoint2 = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds[1]);
    const trueShapeLinePoint = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds[2]);

    if (!this.ignoreLabels) {
      if (
        labelsAreEqual(testShape.label, trueShape.label) &&
        this.comparePoints(testShapeLinePoint, trueShapeLinePoint).result &&
        ((this.comparePoints(testShapeFocusPoint1, trueShapeFocusPoint1).result &&
          this.comparePoints(testShapeFocusPoint2, trueShapeFocusPoint2).result) ||
          (this.comparePoints(testShapeFocusPoint1, trueShapeFocusPoint2).result &&
            this.comparePoints(testShapeFocusPoint2, trueShapeFocusPoint1).result))
      ) {
        return positiveResult;
      }
      return negativeResult;
    }

    const testShapePoints = {
      focusPoint1X: +testShapeFocusPoint1.x,
      focusPoint1Y: +testShapeFocusPoint1.y,
      focusPoint2X: +testShapeFocusPoint2.x,
      focusPoint2Y: +testShapeFocusPoint2.y,
      linePointX: +testShapeLinePoint.x,
      linePointY: +testShapeLinePoint.y
    };

    const trueShapePoints = {
      focusPoint1X: +trueShapeFocusPoint1.x,
      focusPoint1Y: +trueShapeFocusPoint1.y,
      focusPoint2X: +trueShapeFocusPoint2.x,
      focusPoint2Y: +trueShapeFocusPoint2.y,
      linePointX: +trueShapeLinePoint.x,
      linePointY: +trueShapeLinePoint.y
    };

    const testFunc = new EllipseFunction(testShapePoints);
    const trueFunc = new EllipseFunction(trueShapePoints);

    const focusPointsAreMatched =
      (testShapePoints.focusPoint1X === trueShapePoints.focusPoint1X &&
        testShapePoints.focusPoint1Y === trueShapePoints.focusPoint1Y &&
        testShapePoints.focusPoint2X === trueShapePoints.focusPoint2X &&
        testShapePoints.focusPoint2Y === trueShapePoints.focusPoint2Y) ||
      (testShapePoints.focusPoint1X === trueShapePoints.focusPoint2X &&
        testShapePoints.focusPoint1Y === trueShapePoints.focusPoint2Y &&
        testShapePoints.focusPoint2X === trueShapePoints.focusPoint1X &&
        testShapePoints.focusPoint2Y === trueShapePoints.focusPoint1Y);

    if (focusPointsAreMatched && testFunc.getR1R2Sum() === trueFunc.getR1R2Sum()) {
      return positiveResult;
    }
    return negativeResult;
  }

  compareHyperbolas(testShape, trueShape) {
    const positiveResult = {
      id: testShape.id,
      relatedId: trueShape.id,
      result: true
    };

    const negativeResult = {
      id: testShape.id,
      result: false
    };

    const testShapeFocusPoint1 = this.testAnswer.find(item => item.id === testShape.subElementsIds[0]);
    const testShapeFocusPoint2 = this.testAnswer.find(item => item.id === testShape.subElementsIds[1]);
    const testShapeLinePoint = this.testAnswer.find(item => item.id === testShape.subElementsIds[2]);

    const trueShapeFocusPoint1 = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds[0]);
    const trueShapeFocusPoint2 = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds[1]);
    const trueShapeLinePoint = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds[2]);

    if (!this.ignoreLabels) {
      if (
        labelsAreEqual(testShape.label, trueShape.label) &&
        this.comparePoints(testShapeLinePoint, trueShapeLinePoint).result &&
        ((this.comparePoints(testShapeFocusPoint1, trueShapeFocusPoint1).result &&
          this.comparePoints(testShapeFocusPoint2, trueShapeFocusPoint2).result) ||
          (this.comparePoints(testShapeFocusPoint1, trueShapeFocusPoint2).result &&
            this.comparePoints(testShapeFocusPoint2, trueShapeFocusPoint1).result))
      ) {
        return positiveResult;
      }
      return negativeResult;
    }

    const testShapePoints = {
      focusPoint1X: +testShapeFocusPoint1.x,
      focusPoint1Y: +testShapeFocusPoint1.y,
      focusPoint2X: +testShapeFocusPoint2.x,
      focusPoint2Y: +testShapeFocusPoint2.y,
      linePointX: +testShapeLinePoint.x,
      linePointY: +testShapeLinePoint.y
    };

    const trueShapePoints = {
      focusPoint1X: +trueShapeFocusPoint1.x,
      focusPoint1Y: +trueShapeFocusPoint1.y,
      focusPoint2X: +trueShapeFocusPoint2.x,
      focusPoint2Y: +trueShapeFocusPoint2.y,
      linePointX: +trueShapeLinePoint.x,
      linePointY: +trueShapeLinePoint.y
    };

    const testFunc = new HyperbolaFunction(testShapePoints);
    const trueFunc = new HyperbolaFunction(trueShapePoints);

    const focusPointsAreMatched =
      (testShapePoints.focusPoint1X === trueShapePoints.focusPoint1X &&
        testShapePoints.focusPoint1Y === trueShapePoints.focusPoint1Y &&
        testShapePoints.focusPoint2X === trueShapePoints.focusPoint2X &&
        testShapePoints.focusPoint2Y === trueShapePoints.focusPoint2Y) ||
      (testShapePoints.focusPoint1X === trueShapePoints.focusPoint2X &&
        testShapePoints.focusPoint1Y === trueShapePoints.focusPoint2Y &&
        testShapePoints.focusPoint2X === trueShapePoints.focusPoint1X &&
        testShapePoints.focusPoint2Y === trueShapePoints.focusPoint1Y);

    if (focusPointsAreMatched && testFunc.getR1R2Diff() === trueFunc.getR1R2Diff()) {
      return positiveResult;
    }
    return negativeResult;
  }

  compareExponents(testShape, trueShape) {
    const positiveResult = {
      id: testShape.id,
      relatedId: trueShape.id,
      result: true
    };

    const negativeResult = {
      id: testShape.id,
      result: false
    };

    const testShapePointStart = this.testAnswer.find(item => item.id === testShape.subElementsIds.startPoint);
    const testShapePointEnd = this.testAnswer.find(item => item.id === testShape.subElementsIds.endPoint);

    const trueShapePointStart = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.startPoint);
    const trueShapePointEnd = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.endPoint);

    if (!this.ignoreLabels) {
      if (
        labelsAreEqual(testShape.label, trueShape.label) &&
        this.comparePoints(testShapePointStart, trueShapePointStart).result &&
        this.comparePoints(testShapePointEnd, trueShapePointEnd).result
      ) {
        return positiveResult;
      }
      return negativeResult;
    }

    const testShapePoints = {
      startX: +testShapePointStart.x,
      startY: +testShapePointStart.y,
      endX: +testShapePointEnd.x,
      endY: +testShapePointEnd.y
    };

    const trueShapePoints = {
      startX: +trueShapePointStart.x,
      startY: +trueShapePointStart.y,
      endX: +trueShapePointEnd.x,
      endY: +trueShapePointEnd.y
    };

    const testFunc = new ExponentFunction(testShapePoints);
    const trueFunc = new ExponentFunction(trueShapePoints);

    if (
      testShapePoints.startX === trueShapePoints.startX &&
      testShapePoints.startY === trueShapePoints.startY &&
      testFunc.getBC() === trueFunc.getBC()
    ) {
      return {
        id: testShape.id,
        relatedId: trueShape.id,
        result: true
      };
    }
    return negativeResult;
  }

  compareLogarithms(testShape, trueShape) {
    const positiveResult = {
      id: testShape.id,
      relatedId: trueShape.id,
      result: true
    };

    const negativeResult = {
      id: testShape.id,
      result: false
    };

    const testShapePointStart = this.testAnswer.find(item => item.id === testShape.subElementsIds.startPoint);
    const testShapePointEnd = this.testAnswer.find(item => item.id === testShape.subElementsIds.endPoint);

    const trueShapePointStart = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.startPoint);
    const trueShapePointEnd = this.trueAnswerValue.find(item => item.id === trueShape.subElementsIds.endPoint);

    if (!this.ignoreLabels) {
      if (
        labelsAreEqual(testShape.label, trueShape.label) &&
        this.comparePoints(testShapePointStart, trueShapePointStart).result &&
        this.comparePoints(testShapePointEnd, trueShapePointEnd).result
      ) {
        return positiveResult;
      }
      return negativeResult;
    }

    const testShapePoints = {
      startX: +testShapePointStart.x,
      startY: +testShapePointStart.y,
      endX: +testShapePointEnd.x,
      endY: +testShapePointEnd.y
    };

    const trueShapePoints = {
      startX: +trueShapePointStart.x,
      startY: +trueShapePointStart.y,
      endX: +trueShapePointEnd.x,
      endY: +trueShapePointEnd.y
    };

    const testFunc = new LogarithmFunction(testShapePoints);
    const trueFunc = new LogarithmFunction(trueShapePoints);

    if (
      testShapePoints.startX === trueShapePoints.startX &&
      testShapePoints.startY === trueShapePoints.startY &&
      testFunc.getBC() === trueFunc.getBC()
    ) {
      return {
        id: testShape.id,
        relatedId: trueShape.id,
        result: true
      };
    }
    return negativeResult;
  }

  comparePolynoms(testShape, trueShape) {
    const positiveResult = {
      id: testShape.id,
      relatedId: trueShape.id,
      result: true
    };

    const negativeResult = {
      id: testShape.id,
      result: false
    };

    const testShapePoints = [];
    Object.getOwnPropertyNames(testShape.subElementsIds).forEach(value => {
      const pointId = testShape.subElementsIds[value];
      const point = this.testAnswer.find(item => item.id === pointId);
      testShapePoints.push({ x: point.x, y: point.y, label: point.label });
    });

    const trueShapePoints = [];
    Object.getOwnPropertyNames(trueShape.subElementsIds).forEach(value => {
      const pointId = trueShape.subElementsIds[value];
      const point = this.trueAnswerValue.find(item => item.id === pointId);
      trueShapePoints.push({ x: point.x, y: point.y, label: point.label });
    });

    if (!this.ignoreLabels) {
      if (testShapePoints.length !== trueShapePoints.length) {
        return negativeResult;
      }

      let equalCount = 0;
      testShapePoints.forEach(testPoint => {
        equalCount += trueShapePoints.filter(
          truePoint =>
            testPoint.x === truePoint.x &&
            testPoint.y === truePoint.y &&
            labelsAreEqual(testPoint.label, truePoint.label)
        ).length;
      });

      if (equalCount === trueShapePoints.length && labelsAreEqual(testShape.label, trueShape.label)) {
        return positiveResult;
      }
      return negativeResult;
    }

    const testFunc = new PolynomFunction(testShapePoints);
    const trueFunc = new PolynomFunction(trueShapePoints);

    const allX = testShapePoints.map(point => point.x).concat(trueShapePoints.map(point => point.x));
    const xMin = Math.min(...allX) - 0.5;
    const xMax = Math.max(...allX) + 0.5;

    let x = xMin;
    while (x <= xMax) {
      if (testFunc.getYbyX(x) !== trueFunc.getYbyX(x)) {
        return negativeResult;
      }
      x += 0.1;
    }

    return {
      id: testShape.id,
      relatedId: trueShape.id,
      result: true
    };
  }
}

export default CompareShapes;
