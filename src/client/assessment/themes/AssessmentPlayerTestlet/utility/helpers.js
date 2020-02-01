import JXG from "jsxgraph";
import uuidv4 from "uuid/v4";

export const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

export const getLineFromExpression = (
  expressions,
  points = [
    {
      p0: 1,
      p1: 6
    }
  ],
  labels = []
) => {
  const getLines = (expression, index = 0) => {
    if (!expression) {
      return [];
    }

    const getPoint = (x, y, label = false) => ({
      _type: JXG.OBJECT_TYPE_POINT,
      type: "point",
      x,
      y,
      id: uuidv4(),
      label,
      subElement: true
    });

    const getPoints = (x, label) => {
      if (expression === "x=1") {
        return getPoint(1, x, label);
      }
      const _expression = expression.replace(new RegExp("x", "g"), x);
      try {
        // eslint-disable-next-line no-eval
        const y = eval(_expression);
        return getPoint(x, y, label);
      } catch (err) {
        return {};
      }
    };

    const getLine = (p1, p2) => ({
      type: "line",
      _type: JXG.OBJECT_TYPE_LINE,
      id: uuidv4(),
      label: labels[index] || false,
      subElementsIds: {
        startPoint: p1.id,
        endPoint: p2.id
      }
    });
    const point1 = getPoints(points[index]?.p0);
    const point2 = getPoints(points[index]?.p1);
    const line = getLine(point1, point2);
    return [line, point1, point2];
  };

  if (typeof expressions === "string") {
    return getLines(expressions);
  }

  if (Array.isArray(expressions)) {
    return expressions.reduce((lines, expression, lineIdex) => {
      const line = getLines(expression, lineIdex);
      return [...lines, ...line];
    }, []);
  }
  return [];
};

export const getPoinstFromString = (expression, labels = []) => {
  const pointRegex = new RegExp("([^()]+)", "g");

  const getPoint = str => {
    if (!str) {
      return [];
    }
    return (str.match(pointRegex) || []).map((point, pointIndex) => {
      const coords = point.split(",");
      return {
        _type: JXG.OBJECT_TYPE_POINT,
        id: uuidv4(),
        label: labels[pointIndex] || false,
        type: "point",
        x: parseFloat(coords[0]),
        y: parseFloat(coords[1])
      };
    });
  };
  if (typeof expression === "string") {
    return getPoint(expression);
  }
  if (Array.isArray(expression)) {
    return expression.reduce((points, exp) => {
      const point = getPoint(exp);
      return [...points, ...point];
    });
  }
  return [];
};
