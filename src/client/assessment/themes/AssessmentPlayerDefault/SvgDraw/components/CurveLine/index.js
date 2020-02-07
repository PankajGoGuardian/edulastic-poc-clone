/* eslint-disable react/no-unused-prop-types */
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { get, set, isEqual } from "lodash";
import { drawTools } from "@edulastic/constants";

import Curve from "./Curve";
import Point from "./Point";
import Controller from "./Controller";

class CurvedLine extends React.Component {
  constructor(props) {
    super(props);
    const curved = get(props.workHistory, "curved", []);
    this.state = {
      curved,
      draggingPoint: null,
      newLine: false,
      actived: null
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { activeMode, deleteMode, workHistory } = props;
    const { draggingPoint, actived, prevCurved } = state;
    const newState = {
      deleteMode,
      draggingPoint: deleteMode ? null : draggingPoint,
      actived: activeMode !== drawTools.DRAW_CURVE_LINE ? null : actived
    };
    const curved = get(workHistory, "curved", []);

    if (!isEqual(curved, prevCurved)) {
      newState.curved = curved;
      newState.prevCurved = curved;
    }

    return newState;
  }

  saveCurvedlines = () => {
    const { saveHistory } = this.props;
    const { curved } = this.state;
    saveHistory({ curved });
  };

  getNewPoint = (x, y, bounded, isTemp = false) => {
    const { curved, actived } = this.state;

    const lineIndex = actived || 0;
    const points = get(curved, `[${lineIndex}].points`, []);
    const lineWidth = get(curved, `[${lineIndex}].lineWidth`, 6);

    const pointX = x - bounded.left;
    const pointY = y - bounded.top;

    let cpx2 = pointX + 100;
    const cpx2Diff = cpx2 - bounded.width;
    if (cpx2Diff > lineWidth / 2) {
      cpx2 -= cpx2Diff + lineWidth;
    }

    const newPoint = {
      index: points.length + 1,
      px: pointX,
      py: pointY,
      cpx1: Math.abs(pointX - 100),
      cpy1: Math.abs(pointY - 100),
      cpy2: Math.abs(pointY - 100),
      cpx2
    };

    if (!points.length && !isTemp) {
      delete newPoint.cpx1;
      delete newPoint.cpy1;
    }
    return newPoint;
  };

  addNewPoint = (clientX, clientY, lineIndex, bounded) => {
    const { lineWidth, lineColor, pointColor } = this.props;
    // const { disableRemove } = this.props;
    // if (disableRemove(lineIndex, "curved")) return;
    const { curved } = this.state;
    this.setState(
      {
        curved: produce(curved, draft => {
          const points = get(draft, `[${lineIndex}].points`, []);
          const newPoint = this.getNewPoint(clientX, clientY, bounded);
          points.push(newPoint);
          set(draft, `[${lineIndex}].points`, points);
          set(draft, `[${lineIndex}].lineWidth`, lineWidth);
          set(draft, `[${lineIndex}].lineColor`, lineColor);
          set(draft, `[${lineIndex}].pointColor`, pointColor);
        }),
        actived: lineIndex,
        newLine: false
      },
      this.saveCurvedlines
    );
  };

  deletePoint = (lineIndex, pointIndex) => () => {
    const { disableRemove } = this.props;
    if (disableRemove(lineIndex, "curved")) return;

    const { curved, deleteMode } = this.state;
    if (deleteMode) {
      this.setState(
        {
          curved: produce(curved, draft => {
            draft[lineIndex].points.splice(pointIndex, 1);
          })
        },
        this.saveCurvedlines
      );
    }
    this.setState({ actived: lineIndex, newLine: false });
  };

  movePoint = (svgX, svgY) => {
    const { draggingPoint, curved, actived } = this.state;
    const { prop, pointIndex } = draggingPoint;
    const newData = produce(curved, draft => {
      const points = get(draft, `[${actived}].points`, []);
      if (points[pointIndex]) {
        if (prop === "point") {
          points[pointIndex].px = svgX;
          points[pointIndex].py = svgY;
        }
        if (prop === "cpx1") {
          if (pointIndex === 0) {
            points[pointIndex].cpx2 = svgX;
            points[pointIndex].cpy2 = svgY;
          } else {
            points[pointIndex].cpx1 = svgX;
            points[pointIndex].cpy1 = svgY;
          }
        }
        if (prop === "cpx2") {
          points[pointIndex].cpx2 = svgX;
          points[pointIndex].cpy2 = svgY;
        }
        draft[actived].points = points;
      }
    });
    this.setState({ curved: newData });
  };

  handleDoubleClick = () => this.setState({ newLine: true, actived: null });

  handleActiveLine = i => () => {
    const { disableRemove } = this.props;
    if (disableRemove(i, "curved")) return;
    this.setState({ actived: i, newLine: false });
  };

  handleMouseDown = (pointIndex, prop) => () => this.setState({ draggingPoint: { pointIndex, prop } });

  handleMouseUp = ({ clientX, clientY, target }, svgRef) => {
    const { curved, draggingPoint, newLine, actived } = this.state;
    const { disableRemove } = this.props;

    if (draggingPoint) {
      return this.setState({ draggingPoint: null }, this.saveCurvedlines);
    }

    if (target.nodeName !== "svg") {
      return;
    }

    let lineIndex = actived || 0;
    if (!curved.length) {
      lineIndex = 0;
    } else if (newLine) {
      lineIndex = curved.length;
    }

    if (disableRemove(lineIndex, "curved")) {
      lineIndex = curved.length;
    }

    const bounded = svgRef.current.getBoundingClientRect();
    this.addNewPoint(clientX, clientY, lineIndex, bounded);
  };

  handleMouseMove = ({ clientX, clientY }, svgRef) => {
    const { draggingPoint, actived } = this.state;
    if (!svgRef) {
      return;
    }

    if (!draggingPoint || actived === null) {
      return;
    }
    const svgRect = svgRef.current.getBoundingClientRect();
    const svgX = clientX - svgRect.left;
    const svgY = clientY - svgRect.top;
    this.movePoint(svgX, svgY);
  };

  renderHandlers = ({ pointColor, lineWidth, points = [], pointIndex, point: currentPoint, lineIndex }) => {
    const { actived } = this.state;

    const isFirstPoint = pointIndex === 0;
    const isLast = pointIndex >= points.length - 1;

    const point = { x: currentPoint.px, y: currentPoint.py };

    const controller1 = isFirstPoint
      ? { x: currentPoint.cpx2, y: currentPoint.cpy2 }
      : { x: currentPoint.cpx1, y: currentPoint.cpy1 };

    const controller2 = isFirstPoint && isLast ? {} : { x: currentPoint.cpx2, y: currentPoint.cpy2 };

    const showHandler = actived === lineIndex;

    return (
      <Fragment key={`point-${lineIndex}-${pointIndex}`}>
        {showHandler && (
          <>
            <Controller
              cPoint={point}
              controlPoint={controller1}
              lineWidth={lineWidth}
              onMouseDown={this.handleMouseDown(pointIndex, "cpx1")}
            />
            {!isLast && !isFirstPoint && (
              <Controller
                cPoint={point}
                controlPoint={controller2}
                lineWidth={lineWidth}
                onMouseDown={this.handleMouseDown(pointIndex, "cpx2")}
              />
            )}
          </>
        )}
        <Point
          coordinates={point}
          lineWidth={lineWidth}
          color={pointColor}
          onMouseDown={this.handleMouseDown(pointIndex, "point")}
          onClick={this.deletePoint(lineIndex, pointIndex)}
        />
      </Fragment>
    );
  };

  renderLine = (line, lineIndex) => {
    const { lineColor, lineWidth, points, pointColor } = line;
    const handlers = [];
    const pathStr = points.reduce((str, point, pointIndex) => {
      handlers.push(this.renderHandlers({ pointColor, lineWidth, points, pointIndex, point, lineIndex }));

      if (pointIndex === 0) {
        return `${str} ${point.px},${point.py}`;
      }

      const prevPoint = points[pointIndex - 1];
      return `${str} C ${prevPoint.cpx2},${prevPoint.cpy2} ${point.cpx1},${point.cpy1} ${point.px},${point.py}`;
    }, "M");

    return {
      curvedPath: (
        <Curve
          pathStr={pathStr}
          lineWidth={lineWidth}
          lineColor={lineColor}
          key={`path-${lineIndex}`}
          onClick={this.handleActiveLine(lineIndex)}
        />
      ),
      handlers
    };
  };

  render() {
    const { curved } = this.state;
    const allHandlers = [];
    const allPaths =
      curved?.map((line, index) => {
        const { curvedPath, handlers } = this.renderLine(line, index);
        allHandlers.push(handlers);
        return curvedPath;
      }) || null;

    return (
      <Fragment>
        {allPaths}
        {allHandlers}
      </Fragment>
    );
  }
}

CurvedLine.propTypes = {
  workHistory: PropTypes.object,
  lineWidth: PropTypes.number.isRequired,
  disableRemove: PropTypes.func.isRequired,
  saveHistory: PropTypes.func.isRequired,
  pointColor: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired
};

CurvedLine.defaultProps = {
  workHistory: {}
};

export default CurvedLine;
