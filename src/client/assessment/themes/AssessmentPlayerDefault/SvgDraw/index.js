/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import produce from "immer";
import { drawTools } from "@edulastic/constants";
import styled from "styled-components";
import { useDisableDragScroll, measureText } from "@edulastic/common";

import MathDraw from "./components/MathDraw";
import CurvedLine from "./components/CurveLine";
import MeasureTools from "./components/MeasureTools";
import TextInput from "./components/TextInput";
import { normalizeTouchEvent } from "../../../utils/helpers";

const SvgDraw = ({
  lineColor,
  lineWidth,
  activeMode,
  scratchPadMode,
  history,
  saveHistory: saveWorkHistory,
  fillColor,
  deleteMode,
  position,
  fromFreeFormNotes,
  fontFamily
}) => {
  const svg = useDisableDragScroll();
  const [points, setPoints] = useState([]);
  const [pathes, setPathes] = useState([]);
  const [dragStart, setDragStart] = useState(false);
  const [active, setActive] = useState(null);
  const [figures, setFigures] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [mouseClicked, setMouseClicked] = useState(false);
  const [inputIsVisible, setInputIsVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [texts, setTexts] = useState([]);
  const [newMathItem, setNewMathItem] = useState({});
  const boundedRef = useRef();
  const curvedLineRef = useRef();

  useEffect(() => {
    if (history && history.points && history.pathes && history.figures && history.texts) {
      setPoints(history.points);
      setPathes(history.pathes);
      setFigures(history.figures);
      setTexts(history.texts);

      if (active && !history.figures[active]) {
        setActive(null);
      }
    } else {
      setPoints([]);
      setPathes([]);
      setFigures([]);
      setTexts([]);
      setActive(null);
    }
  }, [history]);

  useEffect(() => {
    setActive(null);
  }, [activeMode]);

  const saveHistory = values => {
    saveWorkHistory({ ...history, ...values });
  };

  const disableRemove = (index, prop) =>
    fromFreeFormNotes && fromFreeFormNotes[prop] && index < fromFreeFormNotes[prop];

  const getSvgRect = () => svg?.current?.getBoundingClientRect() || {};

  const calcTextPosition = text => {
    const { width, height } = measureText(text.value, { fontSize: `${lineWidth * 3}px` }, "svg", "text");
    const bounded = getSvgRect();
    return produce(text, draft => {
      const xDiff = draft.x + width - bounded.width - 10;
      if (xDiff > 0) {
        draft.x -= xDiff + 5;
      }
      if (draft.x < 0) {
        draft.x = 5;
      }

      const yDiff = draft.y + height - bounded.height;
      if (yDiff > 0) {
        draft.y -= yDiff + 5;
      }
      if (draft.y < 0) {
        draft.y = 0;
      }
      draft.fontFamily = fontFamily;
    });
  };

  const handleMove = e => {
    if (mouseClicked) {
      normalizeTouchEvent(e);
      const bounded = boundedRef.current;
      const newPoints = points.concat({
        lineWidth,
        color: lineColor,
        x: e.clientX - bounded.left,
        y: e.clientY - bounded.top
      });
      setPoints(newPoints);
    }
  };

  const handleMouseDown = e => {
    setMouseClicked(true);
    normalizeTouchEvent(e);
    boundedRef.current = getSvgRect();
    const bounded = boundedRef.current;
    const newPoints = points.concat({
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
    saveHistory({
      pathes: [...pathes, cloneDeep(points)],
      points: [],
      texts,
      figures
    });
  };

  const handlePoint = (modifier = "") => e => {
    normalizeTouchEvent(e);
    const newPoints = cloneDeep(points);
    const bounded = getSvgRect();
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
    saveHistory({ pathes, points: newPoints, texts, figures });
  };

  const handleLineSecondPoint = e => {
    if (mouseClicked) {
      normalizeTouchEvent(e);
      const newPoints = cloneDeep(points);
      const bounded = getSvgRect();

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
    if (disableRemove(index, "pathes")) return;
    const newPathes = cloneDeep(pathes);
    newPathes.splice(index, 1);
    setPathes(newPathes);
    saveHistory({ pathes: newPathes, points: [], texts, figures });
  };

  const handleDeleteFigure = index => () => {
    if (disableRemove(index, "figures")) return;
    const newFigures = cloneDeep(figures);
    newFigures.splice(index, 1);
    setActive(null);
    setFigures(newFigures);
    saveHistory({ pathes, points: [], texts, figures: newFigures });
  };

  const handleClearPoints = () => {
    setPoints([]);
    saveHistory({ pathes, points: [], texts, figures });
  };

  const drawSquare = e => {
    if (active === null) {
      normalizeTouchEvent(e);
      const newFigures = cloneDeep(figures);
      const bounded = getSvgRect();
      newFigures.push({
        strokeWidth: lineWidth,
        stroke: lineColor,
        fill: fillColor,
        width: 50,
        height: 50,
        x: e.clientX - bounded.left,
        y: e.clientY - bounded.top
      });
      setFigures(newFigures);
      saveHistory({ pathes, points: [], texts, figures: newFigures });
    } else if (e.target === svg.current) {
      setActive(null);
    }
  };

  const drawСircle = e => {
    if (active === null) {
      normalizeTouchEvent(e);
      const newFigures = cloneDeep(figures);
      const bounded = getSvgRect();
      newFigures.push({
        strokeWidth: lineWidth,
        stroke: lineColor,
        fill: fillColor,
        rx: 50,
        ry: 50,
        cx: e.clientX - bounded.left,
        cy: e.clientY - bounded.top
      });
      setFigures(newFigures);
      saveHistory({ pathes, points: [], texts, figures: newFigures });
    } else if (e.target === svg.current) {
      setActive(null);
    }
  };

  const drawTriangle = e => {
    if (active === null) {
      normalizeTouchEvent(e);
      const newFigures = cloneDeep(figures);
      const bounded = getSvgRect();
      const point = { x: e.clientX - bounded.left, y: e.clientY - bounded.top };
      newFigures.push({
        strokeWidth: lineWidth,
        stroke: lineColor,
        fill: fillColor,
        points: `${point.x},${point.y} ${point.x + 70},${point.y + 120} ${point.x},${point.y + 120}`
      });
      setFigures(newFigures);
      saveHistory({ pathes, points: [], texts, figures: newFigures });
    } else if (e.target === svg.current) {
      setActive(null);
    }
  };

  const drawText = e => {
    if (currentPosition.index === undefined) {
      normalizeTouchEvent(e);
      const bounded = getSvgRect();
      const point = { x: e.clientX - bounded.left, y: e.clientY - bounded.top };
      setInputIsVisible(true);
      setCurrentPosition({
        color: lineColor,
        lineWidth,
        value: "",
        x: point.x,
        y: point.y,
        fontFamily,
        index: texts.length
      });
    } else {
      setInputIsVisible(false);
      setCurrentPosition({ x: 0, y: 0 });
    }
  };

  const handleCurveMove = e => {
    normalizeTouchEvent(e);
    const newPoints = cloneDeep(points);
    if (newPoints.length > 1) {
      const bounded = getSvgRect();

      newPoints[newPoints.length - 1] = {
        lineWidth,
        color: lineColor,
        x: e.clientX - bounded.left,
        y: e.clientY - bounded.top
      };

      setPoints(newPoints);
    }
  };

  const handleResizeRect = e => {
    const newFigures = cloneDeep(figures);
    if (mouseClicked && newFigures[active]) {
      normalizeTouchEvent(e);
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
    if (dragStart && newFigures[active]) {
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

  const handleResizeCircle = e => {
    normalizeTouchEvent(e);
    const newFigures = cloneDeep(figures);
    if (mouseClicked && newFigures[active]) {
      if (activeIndex === 1 || activeIndex === 2) {
        if (e.clientX < cursor.x) {
          newFigures[active].rx -= cursor.x - e.clientX;
        } else {
          newFigures[active].rx += e.clientX - cursor.x;
        }
      } else if (e.clientX < cursor.x) {
        newFigures[active].rx += cursor.x - e.clientX;
      } else {
        newFigures[active].rx -= e.clientX - cursor.x;
      }
      if (activeIndex === 3 || activeIndex === 2) {
        if (e.clientY < cursor.y) {
          newFigures[active].ry -= cursor.y - e.clientY;
        } else {
          newFigures[active].ry += e.clientY - cursor.y;
        }
      } else if (e.clientY < cursor.y) {
        newFigures[active].cy -= (cursor.y - e.clientY) / 2;
        newFigures[active].ry += (cursor.y - e.clientY) / 2;
      } else {
        newFigures[active].cy += (e.clientY - cursor.y) / 2;
        newFigures[active].ry -= (e.clientY - cursor.y) / 2;
      }

      setCursor({ x: e.clientX, y: e.clientY });
      if (newFigures[active].rx > 20 && newFigures[active].ry > 20) {
        setFigures(newFigures);
      }
    }
    if (dragStart && newFigures[active]) {
      if (e.clientX < cursor.x) {
        newFigures[active].cx -= cursor.x - e.clientX;
      } else {
        newFigures[active].cx += e.clientX - cursor.x;
      }

      if (e.clientY < cursor.y) {
        newFigures[active].cy -= cursor.y - e.clientY;
      } else {
        newFigures[active].cy += e.clientY - cursor.y;
      }
      setCursor({ x: e.clientX, y: e.clientY });

      setFigures(newFigures);
    }
  };

  const handleResizeTriangle = e => {
    normalizeTouchEvent(e);
    if (mouseClicked && activeIndex !== null) {
      const newFigures = cloneDeep(figures);
      const currentPoints = newFigures[active].points.split(" ").map(item => {
        const point = item.split(",");
        return { x: Number(point[0]), y: Number(point[1]) };
      });

      currentPoints[activeIndex].x -= cursor.x - e.clientX;

      currentPoints[activeIndex].y -= cursor.y - e.clientY;

      newFigures[active].points = currentPoints.map(point => `${point.x},${point.y}`).join(" ");

      setCursor({ x: e.clientX, y: e.clientY });
      setFigures(newFigures);
    }
    if (dragStart) {
      const newFigures = cloneDeep(figures);
      const currentPoints = newFigures[active].points.split(" ").map(item => {
        const point = item.split(",");
        return { x: Number(point[0]), y: Number(point[1]) };
      });

      newFigures[active].points = currentPoints
        .map(point => {
          const xPoint = point.x - (cursor.x - e.clientX);
          const yPoint = point.y - (cursor.y - e.clientY);
          return `${xPoint},${yPoint}`;
        })
        .join(" ");

      setCursor({ x: e.clientX, y: e.clientY });

      setFigures(newFigures);
    }
  };

  const handleActive = index => e => {
    if (disableRemove(index, "figures")) return;
    e.preventDefault();
    e.stopPropagation();
    if (!mouseClicked) {
      setActive(index);
    } else {
      setMouseClicked(false);
    }
  };

  const getPointsForDrawingPath = path =>
    `M ${path[0].x},${path[0].y} ${path.map((point, i) => (i !== 0 ? `L ${point.x},${point.y}` : "")).join(" ")}`;

  const mouseUpAndDownControl = (flag, index) => e => {
    e.preventDefault();
    e.stopPropagation();
    setMouseClicked(flag);
    if (flag) {
      setCursor({ x: e.clientX, y: e.clientY });
      setActiveIndex(index);
    } else {
      setActiveIndex(null);
      setDragStart(false);
      saveHistory({ pathes, points: [], figures, texts });
    }
  };

  const handleDragStart = i => e => {
    if (disableRemove(i, "figures")) return;
    normalizeTouchEvent(e);
    e.preventDefault();
    e.stopPropagation();
    setActive(i);
    setCursor({ x: e.clientX, y: e.clientY });
    setDragStart(true);
  };

  const handleDragEnd = i => e => {
    if (disableRemove(i, "figures")) return;
    normalizeTouchEvent(e);
    e.preventDefault();
    e.stopPropagation();
    setActive(i);
    setCursor({ x: e.clientX, y: e.clientY });
    setDragStart(false);

    saveHistory({
      pathes,
      points: [],
      figures,
      texts: produce(texts, draft => {
        if (draft[active]) {
          draft[active] = calcTextPosition(draft[active]);
        }
      })
    });
  };

  const editText = index => () => {
    if (disableRemove(index, "texts")) return;
    if (texts[index]) {
      setInputIsVisible(true);
      setCurrentPosition(texts[index]);
    }
  };

  const handleBlur = newText => {
    if (newText?.value?.trim()) {
      saveHistory({
        pathes,
        points: [],
        figures,
        texts: produce(texts, draft => {
          draft[newText.index] = calcTextPosition(newText);
        })
      });
    }
    setInputIsVisible(false);
  };

  const handleTextMove = e => {
    if (dragStart && texts[active] && !disableRemove(active, "texts")) {
      normalizeTouchEvent(e);
      setCursor({ x: e.clientX, y: e.clientY });
      setTexts(
        produce(texts, draft => {
          const xPoint = draft[active].x - (cursor.x - e.clientX);
          const yPoint = draft[active].y - (cursor.y - e.clientY);

          draft[active].x = xPoint;
          draft[active].y = yPoint;
          draft[active] = draft[active];
        })
      );
    }
  };

  // CurvedLine Handlers here.
  const handleMouseMoveCurvedLine = e => {
    normalizeTouchEvent(e);
    if (curvedLineRef.current && typeof curvedLineRef.current.handleMouseMove === "function") {
      curvedLineRef.current.handleMouseMove(e, svg);
    }
  };

  const handleMouseUpCurvedLine = e => {
    if (curvedLineRef.current && typeof curvedLineRef.current.handleMouseUp === "function") {
      curvedLineRef.current.handleMouseUp(e, svg);
    }
  };

  const handleDoubleClick = () => {
    if (curvedLineRef.current && typeof curvedLineRef.current.handleDoubleClick === "function") {
      curvedLineRef.current.handleDoubleClick();
    }
  };

  const getSvgHandlers = () => {
    if (scratchPadMode && !deleteMode) {
      switch (activeMode) {
        case drawTools.FREE_DRAW:
          return {
            onMouseUp: handleSavePath,
            onTouchEnd: handleSavePath,

            onMouseDown: handleMouseDown,
            onTouchStart: handleMouseDown,

            onMouseMove: handleMove,
            onTouchMove: handleMove
          };
        case drawTools.DRAW_BREAKING_LINE:
          return {
            onDoubleClick: handleSavePath,

            onClick: handlePoint("L"),

            onMouseMove: handleCurveMove,
            onTouchMove: handleCurveMove
          };

        case drawTools.DRAW_SIMPLE_LINE:
          return {
            onMouseUp: handleSavePath,
            onTouchEnd: handleSavePath,

            onMouseDown: handleMouseDown,
            onTouchStart: handleMouseDown,

            onMouseMove: handleLineSecondPoint,
            onTouchMove: handleLineSecondPoint
          };

        case drawTools.DRAW_SQUARE:
          return {
            onMouseUp: drawSquare,
            onTouchEnd: drawSquare,

            onMouseMove: handleResizeRect,
            onTouchMove: handleResizeRect
          };

        case drawTools.DRAW_CIRCLE:
          return {
            onMouseUp: drawСircle,
            onTouchEnd: drawСircle,

            onMouseMove: handleResizeCircle,
            onTouchMove: handleResizeCircle
          };

        case drawTools.DRAW_TRIANGLE:
          return {
            onMouseUp: drawTriangle,
            onTouchEnd: drawTriangle,

            onMouseMove: handleResizeTriangle,
            onTouchMove: handleResizeTriangle
          };

        case drawTools.DRAW_TEXT:
          return {
            onMouseUp: drawText,
            onTouchEnd: drawText,

            onMouseMove: handleTextMove,
            onTouchMove: handleTextMove
          };
        case drawTools.DRAW_CURVE_LINE:
          return {
            onMouseUp: handleMouseUpCurvedLine,
            onTouchEnd: handleMouseUpCurvedLine,

            onDoubleClick: handleDoubleClick,

            onMouseMove: handleMouseMoveCurvedLine,
            onTouchMove: handleMouseMoveCurvedLine
          };
        default:
      }
    } else {
      return {};
    }
  };

  const handleDeleteText = index => () => {
    if (disableRemove(index, "texts")) return;
    const newTexts = cloneDeep(texts);
    newTexts.splice(index, 1);
    setTexts(newTexts);
    saveHistory({ pathes, points: [], figures, texts: newTexts });
  };

  const getMouseDownHandler = (mode, index) =>
    activeMode === mode && !deleteMode ? handleDragStart(index) : undefined;

  const getMouseUpHandler = (mode, index) => (activeMode === mode && !deleteMode ? handleDragEnd(index) : undefined);

  const getOnClickHandler = (mode, index) =>
    deleteMode ? handleDeleteFigure(index) : activeMode === mode ? handleActive(index) : undefined;

  const getDeleteTextHandler = index =>
    deleteMode ? handleDeleteText(index) : activeMode ? handleActive(index) : undefined;

  const renderFigure = (path, i) =>
    path.x ? (
      <Rect
        key={i}
        onMouseDown={getMouseDownHandler(drawTools.DRAW_SQUARE, i)}
        onTouchStart={getMouseDownHandler(drawTools.DRAW_SQUARE, i)}
        onMouseUp={getMouseUpHandler(drawTools.DRAW_SQUARE, i)}
        onTouchEnd={getMouseUpHandler(drawTools.DRAW_SQUARE, i)}
        onClick={getOnClickHandler(drawTools.DRAW_SQUARE, i)}
        {...path}
      />
    ) : path.points ? (
      <Polygon
        key={i}
        onMouseDown={getMouseDownHandler(drawTools.DRAW_TRIANGLE, i)}
        onTouchStart={getMouseDownHandler(drawTools.DRAW_TRIANGLE, i)}
        onMouseUp={getMouseUpHandler(drawTools.DRAW_TRIANGLE, i)}
        onTouchEnd={getMouseUpHandler(drawTools.DRAW_TRIANGLE, i)}
        onClick={getOnClickHandler(drawTools.DRAW_TRIANGLE, i)}
        {...path}
      />
    ) : (
      <Ellipse
        key={i}
        onMouseDown={getMouseDownHandler(drawTools.DRAW_CIRCLE, i)}
        onTouchStart={getMouseDownHandler(drawTools.DRAW_CIRCLE, i)}
        onMouseUp={getMouseUpHandler(drawTools.DRAW_CIRCLE, i)}
        onTouchEnd={getMouseUpHandler(drawTools.DRAW_CIRCLE, i)}
        onClick={getOnClickHandler(drawTools.DRAW_CIRCLE, i)}
        {...path}
      />
    );

  const renderActiveFigure = () => {
    let rects;
    if (!figures[active].cx && !figures[active].points) {
      rects = [
        { x: figures[active].x - 10, y: figures[active].y - 10 },
        {
          x: figures[active].x + figures[active].width - 10,
          y: figures[active].y - 10
        },
        {
          x: figures[active].x + figures[active].width - 10,
          y: figures[active].y + figures[active].height - 10
        },
        {
          x: figures[active].x - 10,
          y: figures[active].y + figures[active].height - 10
        }
      ];
    } else if (figures[active].cx !== undefined) {
      rects = [
        {
          x: figures[active].cx - figures[active].rx - 10,
          y: figures[active].cy - figures[active].ry - 10
        },
        {
          x: figures[active].cx + figures[active].rx - 10,
          y: figures[active].cy - figures[active].ry - 10
        },
        {
          x: figures[active].cx + figures[active].rx - 10,
          y: figures[active].cy + figures[active].ry - 10
        },
        {
          x: figures[active].cx - figures[active].rx - 10,
          y: figures[active].cy + figures[active].ry - 10
        }
      ];
    } else {
      rects = figures[active].points.split(" ").map(item => {
        const point = item.split(",");
        return { x: point[0] - 10, y: point[1] - 10 };
      });
    }
    return (
      <Fragment>
        <polygon
          points={rects.map(point => `${point.x + 10},${point.y + 10}`).join(" ")}
          fill="none"
          stroke="black"
          style={{ strokDashoffset: 0, strokeDasharray: 5 }}
        />
        {renderFigure(figures[active], active)}
        {rects.map((point, i) => (
          <Rect
            key={i}
            onMouseDown={mouseUpAndDownControl(true, i)}
            onTouchStart={mouseUpAndDownControl(true, i)}
            onMouseUp={mouseUpAndDownControl(false)}
            onTouchEnd={mouseUpAndDownControl(false)}
            fill="blue"
            {...point}
            height={20}
            width={20}
          />
        ))}
      </Fragment>
    );
  };

  return (
    <Fragment>
      {inputIsVisible && activeMode === drawTools.DRAW_TEXT && (
        <TextInput
          bounded={getSvgRect()}
          text={currentPosition}
          onBlur={handleBlur}
          setCurrentPosition={setCurrentPosition}
        />
      )}
      <svg
        ref={svg}
        {...getSvgHandlers()}
        style={{
          position,
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          background: "transparent",
          display: scratchPadMode ? "block" : "none",
          pointerEvents: activeMode === "" ? "none" : "all",
          zIndex: mouseClicked || dragStart || activeMode === "" ? 40 : 40
        }}
      >
        {active !== null &&
          figures[active] &&
          !deleteMode &&
          activeMode !== drawTools.DRAW_TEXT &&
          activeMode !== drawTools.DRAW_MATH && <Fragment>{renderActiveFigure()}</Fragment>}

        {figures.length > 0 &&
          figures.map((path, i) => {
            if (i !== active) {
              return renderFigure(path, i);
            }
            if (activeMode === drawTools.DRAW_MATH || activeMode === drawTools.DRAW_TEXT) {
              return renderFigure(path, i);
            }
            return false;
          })}

        {texts.length > 0 &&
          texts.map(
            (text, i) =>
              currentPosition.index !== i && (
                // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                <Text
                  onMouseDown={getMouseDownHandler(drawTools.DRAW_TEXT, i)}
                  onTouchStart={getMouseDownHandler(drawTools.DRAW_TEXT, i)}
                  onMouseUp={getMouseUpHandler(drawTools.DRAW_TEXT, i)}
                  onTouchEnd={getMouseUpHandler(drawTools.DRAW_TEXT, i)}
                  onClick={getDeleteTextHandler(i)}
                  onDoubleClick={activeMode === drawTools.DRAW_TEXT ? editText(i) : undefined}
                  key={i}
                  fontFamily={text.fontFamily}
                  color={text.color}
                  fontSize={text.lineWidth * 3}
                  x={text.x}
                  y={text.y + 25}
                >
                  {text.value}
                </Text>
              )
          )}

        {pathes.length > 0 &&
          pathes.map(
            (path, i) =>
              path.length && (
                <Path
                  key={i}
                  onClick={deleteMode ? handleDeletePath(i) : undefined}
                  stroke={path[0].color}
                  strokeWidth={path[0].lineWidth}
                  d={getPointsForDrawingPath(path)}
                />
              )
          )}

        {points.length > 0 && (
          <Path
            stroke={points[0].color}
            onClick={deleteMode ? handleClearPoints : undefined}
            strokeWidth={points[0].lineWidth}
            d={getPointsForDrawingPath(points)}
          />
        )}
        <CurvedLine
          deleteMode={deleteMode}
          activeMode={activeMode}
          workHistory={history}
          saveHistory={saveHistory}
          ref={curvedLineRef}
          lineWidth={lineWidth}
          lineColor={lineColor}
          disableRemove={disableRemove}
          pointColor="rgb(244, 0, 137)"
        />
      </svg>
      <MathDraw
        newItem={newMathItem}
        setNewItem={setNewMathItem}
        workHistory={history}
        saveHistory={saveHistory}
        activeMode={activeMode}
        scratchPadMode={scratchPadMode}
        deleteMode={deleteMode}
        lineWidth={lineWidth}
        disableRemove={disableRemove}
        lineColor={lineColor}
      />
      {activeMode === drawTools.DRAW_MEASURE_TOOL && <MeasureTools />}
    </Fragment>
  );
};

SvgDraw.propTypes = {
  lineColor: PropTypes.string.isRequired,
  lineWidth: PropTypes.number.isRequired,
  activeMode: PropTypes.string.isRequired,
  scratchPadMode: PropTypes.bool.isRequired,
  fromFreeFormNotes: PropTypes.object,
  deleteMode: PropTypes.bool.isRequired,
  history: PropTypes.any,
  fillColor: PropTypes.string.isRequired,
  saveHistory: PropTypes.any.isRequired,
  top: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  fontFamily: PropTypes.string
};

SvgDraw.defaultProps = {
  history: {},
  fromFreeFormNotes: {},
  fontFamily: ""
};

export default SvgDraw;

const Path = styled.path`
  stroke-linecap: round;
  fill: none;
  stroke-linejoin: round;
`;

const Polygon = styled.polygon`
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Ellipse = styled.ellipse`
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Rect = styled.rect`
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Text = styled.text`
  cursor: pointer;
  stroke: ${({ color }) => color};
  fill: ${({ color }) => color};
  font-size: ${({ fontSize }) => fontSize}px;
  font-family: ${({ fontFamily }) => fontFamily || ""};
  user-select: none;
`;
