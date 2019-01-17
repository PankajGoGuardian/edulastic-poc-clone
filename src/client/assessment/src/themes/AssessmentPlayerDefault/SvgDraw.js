import React, { useRef, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

const SvgDraw = ({ lineColor, lineWidth, activeMode, scratchPadMode, history, saveHistory }) => {
  const svg = useRef(null);

  const [points, setPoints] = useState([]);
  const [pathes, setPathes] = useState([]);
  const [dragStart, setDragStart] = useState(false);
  const [active, setActive] = useState(null);
  const [figures, setFigures] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [mouseClicked, setMouseClicked] = useState(false);

  useEffect(
    () => {
      if (history.points && history.pathes && history.figures) {
        setPoints(history.points);
        setPathes(history.pathes);
        setFigures(history.figures);

        if (active && !history.figures[active]) {
          setActive(null);
        }
      }
    },
    [history]
  );

  useEffect(
    () => {
      setActive(null);
    },
    [activeMode]
  );

  const handleMove = (e) => {
    if (mouseClicked) {
      const newPoints = cloneDeep(points);
      const bounded = svg.current.getBoundingClientRect();

      newPoints.push({
        lineWidth,
        color: lineColor,
        x: e.clientX - bounded.left,
        y: e.clientY - bounded.top
      });
      setPoints(newPoints);
    }
  };

  const handleMouseDown = (e) => {
    setMouseClicked(true);
    const newPoints = cloneDeep(points);
    const bounded = svg.current.getBoundingClientRect();

    newPoints.push({
      lineWidth,
      color: lineColor,
      x: e.clientX - bounded.left,
      y: e.clientY - bounded.top
    });
    setPoints(newPoints);
  };

  const handleSavePath = () => {
    setMouseClicked(false);
    setPathes([...pathes, cloneDeep(points)]);
    setPoints([]);
    saveHistory({ pathes: [...pathes, cloneDeep(points)], points: [], figures });
  };

  const handlePoint = (modifier = '') => (e) => {
    const newPoints = cloneDeep(points);
    const bounded = svg.current.getBoundingClientRect();
    if (newPoints.length === 0) {
      newPoints.push({
        lineWidth,
        modifier,
        color: lineColor,
        x: e.clientX - bounded.left,
        y: e.clientY - bounded.top
      });
    }
    newPoints.push({
      lineWidth,
      modifier,
      color: lineColor,
      x: e.clientX - bounded.left,
      y: e.clientY - bounded.top
    });

    setPoints(newPoints);
    saveHistory({ pathes, points: newPoints, figures });
  };

  const handleLineSecondPoint = (e) => {
    if (mouseClicked) {
      const newPoints = cloneDeep(points);
      const bounded = svg.current.getBoundingClientRect();

      newPoints[1] = {
        lineWidth,
        color: lineColor,
        x: e.clientX - bounded.left,
        y: e.clientY - bounded.top
      };
      setPoints(newPoints);
    }
  };

  const handleDeletePath = index => () => {
    const newPathes = cloneDeep(pathes);
    newPathes.splice(index, 1);
    setPathes(newPathes);
    saveHistory({ pathes: newPathes, points: [], figures });
  };

  const handleDeleteFigure = index => () => {
    const newFigures = cloneDeep(figures);
    newFigures.splice(index, 1);
    setActive(null);
    setFigures(newFigures);
    saveHistory({ pathes, points: [], figures: newFigures });
  };

  const handleClearPoints = () => {
    setPoints([]);
    saveHistory({ pathes, points: [], figures });
  };

  const drawSquare = (e) => {
    if (active === null) {
      const newFigures = cloneDeep(figures);
      const bounded = svg.current.getBoundingClientRect();
      newFigures.push({
        strokeWidth: lineWidth,
        stroke: lineColor,
        width: 50,
        height: 50,
        x: e.clientX - bounded.left,
        y: e.clientY - bounded.top
      });
      setFigures(newFigures);
      saveHistory({ pathes, points: [], figures: newFigures });
    } else if (e.target === svg.current) {
      setActive(null);
    }
  };

  const handleCurveMove = (e) => {
    const newPoints = cloneDeep(points);
    if (newPoints.length > 1) {
      const bounded = svg.current.getBoundingClientRect();

      newPoints[newPoints.length - 1] = {
        lineWidth,
        color: lineColor,
        x: e.clientX - bounded.left,
        y: e.clientY - bounded.top
      };

      setPoints(newPoints);
    }
  };

  const handleResizeRect = (e) => {
    if (mouseClicked && activeIndex !== null) {
      const newFigures = cloneDeep(figures);
      if (activeIndex === 1 || activeIndex === 2) {
        if (e.clientX < cursor.x) {
          newFigures[active].width -= cursor.x - e.clientX;
        } else {
          newFigures[active].width += e.clientX - cursor.x;
        }
      } else if (e.clientX < cursor.x) {
        newFigures[active].x -= cursor.x - e.clientX;
        newFigures[active].width += cursor.x - e.clientX;
      } else {
        newFigures[active].x += e.clientX - cursor.x;
        newFigures[active].width -= e.clientX - cursor.x;
      }
      if (activeIndex === 3 || activeIndex === 2) {
        if (e.clientY < cursor.y) {
          newFigures[active].height -= cursor.y - e.clientY;
        } else {
          newFigures[active].height += e.clientY - cursor.y;
        }
      } else if (e.clientY < cursor.y) {
        newFigures[active].y -= cursor.y - e.clientY;
        newFigures[active].height += cursor.y - e.clientY;
      } else {
        newFigures[active].y += e.clientY - cursor.y;
        newFigures[active].height -= e.clientY - cursor.y;
      }

      setCursor({ x: e.clientX, y: e.clientY });
      if (newFigures[active].width > 20 && newFigures[active].height > 20) {
        setFigures(newFigures);
      }
    }
    if (dragStart) {
      const newFigures = cloneDeep(figures);

      if (e.clientX < cursor.x) {
        newFigures[active].x -= cursor.x - e.clientX;
      } else {
        newFigures[active].x += e.clientX - cursor.x;
      }

      if (e.clientY < cursor.y) {
        newFigures[active].y -= cursor.y - e.clientY;
      } else {
        newFigures[active].y += e.clientY - cursor.y;
      }
      setCursor({ x: e.clientX, y: e.clientY });

      setFigures(newFigures);
    }
  };

  const handleActive = index => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!mouseClicked) {
      setActive(index);
    } else {
      setMouseClicked(false);
    }
  };

  const getPointsForDrawingPath = path =>
    `M ${path[0].x},${path[0].y} ${path
      .map((point, i) => (i !== 0 ? `L ${point.x},${point.y}` : ''))
      .join(' ')}`;

  const mouseUpAndDownControl = (flag, index) => (e) => {
    setMouseClicked(flag);
    if (flag) {
      setCursor({ x: e.clientX, y: e.clientY });
      setActiveIndex(index);
    } else {
      setActiveIndex(null);
      setDragStart(false);
      saveHistory({ pathes, points: [], figures });
    }
  };

  const renderActiveFigure = () => {
    if (!figures[active].cx && !figures[active].d) {
      const rects = [
        { x: figures[active].x - 10, y: figures[active].y - 10 },
        { x: figures[active].x + figures[active].width - 10, y: figures[active].y - 10 },
        {
          x: figures[active].x + figures[active].width - 10,
          y: figures[active].y + figures[active].height - 10
        },
        { x: figures[active].x - 10, y: figures[active].y + figures[active].height - 10 }
      ];
      return rects.map((point, i) => (
        <rect
          key={i}
          onMouseDown={mouseUpAndDownControl(true, i)}
          onMouseUp={mouseUpAndDownControl(false)}
          fill="blue"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...point}
          height={20}
          width={20}
        />
      ));
    }
  };

  const handleDragStart = i => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(i);
    setCursor({ x: e.clientX, y: e.clientY });
    setDragStart(true);
  };

  const handleDragEnd = i => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(i);
    setCursor({ x: e.clientX, y: e.clientY });
    setDragStart(false);
    saveHistory({ pathes, points: [], figures });
  };

  const getSvgHandlers = () => {
    if (scratchPadMode) {
      switch (activeMode) {
        case 'freeDraw':
          return {
            onMouseUp: handleSavePath,
            onMouseDown: handleMouseDown,
            onMouseMove: handleMove
          };
        case 'drawBreakingLine':
          return {
            onDoubleClick: handleSavePath,
            onClick: handlePoint('L'),
            onMouseMove: handleCurveMove
          };

        case 'drawSimpleLine':
          return {
            onMouseUp: handleSavePath,
            onMouseDown: handleMouseDown,
            onMouseMove: handleLineSecondPoint
          };

        case 'drawSquare':
          return {
            onMouseUp: drawSquare,
            onMouseMove: handleResizeRect
          };

        default:
      }
    }
  };

  return (
    <svg
      ref={svg}
      {...getSvgHandlers()}
      width="100%"
      height={document.documentElement.clientHeight + 28}
      style={{
        background: 'transparent',
        position: 'absolute',
        top: 62,
        left: 0,
        display: scratchPadMode ? 'block' : 'none',
        zIndex: mouseClicked || dragStart ? 1000 : 0
      }}
    >
      {figures.length > 0 &&
        figures.map((path, i) => (
          <rect
            key={i}
            onMouseDown={activeMode === 'drawSquare' ? handleDragStart(i) : undefined}
            onMouseUp={activeMode === 'drawSquare' ? handleDragEnd(i) : undefined}
            onClick={
              activeMode === 'deleteMode'
                ? handleDeleteFigure(i)
                : activeMode === 'drawSquare'
                  ? handleActive(i)
                  : undefined
            }
            fill="red"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...path}
          />
        ))}

      {pathes.length > 0 &&
        pathes.map((path, i) => (
          <path
            key={i}
            onClick={activeMode === 'deleteMode' ? handleDeletePath(i) : undefined}
            stroke={path[0].color}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={path[0].lineWidth}
            d={getPointsForDrawingPath(path)}
          />
        ))}

      {points.length > 0 && (
        <path
          stroke={points[0].color}
          onClick={activeMode === 'deleteMode' ? handleClearPoints : undefined}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={points[0].lineWidth}
          d={getPointsForDrawingPath(points)}
        />
      )}

      {active !== null && <Fragment>{renderActiveFigure()}</Fragment>}
    </svg>
  );
};

SvgDraw.propTypes = {
  lineColor: PropTypes.string.isRequired,
  lineWidth: PropTypes.number.isRequired,
  activeMode: PropTypes.string.isRequired,
  scratchPadMode: PropTypes.bool.isRequired,
  history: PropTypes.any.isRequired,
  saveHistory: PropTypes.any.isRequired
};

export default SvgDraw;
