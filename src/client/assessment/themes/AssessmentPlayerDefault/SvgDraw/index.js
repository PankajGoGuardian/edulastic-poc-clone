/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect, Fragment, useContext, useLayoutEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import produce from "immer";
import { drawTools } from "@edulastic/constants";
import { useDisableDragScroll, measureText, ScratchPadContext } from "@edulastic/common";

import MathDraw from "./components/MathDraw";
import CurvedLine from "./components/CurveLine";
import MeasureTools from "./components/MeasureTools";
import EditFigures from "./components/EditFigures";
import TextInput from "./components/Texts/TextInput";
import Points from "./components/Points";
import Lines from "./components/Lines";
import Texts from "./components/Texts/Texts";
import Figures from "./components/Figures/Figures";
import { normalizeTouchEvent } from "../../../utils/helpers";
import { updateScratchpadAction } from "../../../../common/ducks/scratchpad";
import { getNewFigures, resizeFigure, moveFigure } from "./utils";

const SvgDraw = ({
  lineColor,
  lineWidth,
  activeMode,
  editToolMode,
  finishedEdit,
  scratchPadMode,
  history,
  saveHistory: saveWorkHistory,
  fillColor,
  deleteMode,
  position,
  fromFreeFormNotes,
  fontFamily,
  zoom,
  updateScratchpadData,
  updateScratchpadtoStore,
  viewBoxProps,
  LCBPreviewModal,
  previousDimensions,
  showScratchpadByDefault
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

  const { getContainer } = useContext(ScratchPadContext);

  const containerRef = getContainer();

  useEffect(() => {
    if (history) {
      history.points && setPoints(history.points);
      history.pathes && setPathes(history.pathes);
      history.figures && setFigures(history.figures);
      history.texts && setTexts(history.texts);

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

  useEffect(() => {
    if (deleteMode) {
      setActive(null);
    }
  }, [deleteMode]);

  const containerHeight = containerRef?.scrollHeight;

  useLayoutEffect(() => {
    setTimeout(() => {
      if (svg.current && containerRef) {
        // get dimensions of container only after content is loaded
        const { scrollHeight, scrollWidth } = containerRef;
        let updatedHeight = `${scrollHeight}px`;
        let updatedWidth = `${scrollWidth}px`;
        if (showScratchpadByDefault || LCBPreviewModal) {
          const { height, width } = previousDimensions;
          updatedWidth = `${width}px`;
          updatedHeight = `${height}px`;
        }
        svg.current.style.height = updatedHeight;
        svg.current.style.width = updatedWidth;

        if (updateScratchpadtoStore) {
          updateScratchpadData({ height: scrollHeight, width: scrollWidth });
        }
      }
      if (svg.current) {
        boundedRef.current = svg.current.getBoundingClientRect();
      }
    });
  }, [containerRef, containerHeight, svg.current]);

  const saveHistory = values => {
    saveWorkHistory({ ...history, ...values });
  };

  const disableRemove = (index, prop) =>
    fromFreeFormNotes && fromFreeFormNotes[prop] && index < fromFreeFormNotes[prop];

  const getDrawingContainer = () => svg?.current;

  // Figure(circle, rectangle, triangle) Handlers new/move/resize/delete
  const drawFigure = e => {
    const figuresProps = { strokeWidth: lineWidth, stroke: lineColor, fill: fillColor };
    if (active === null) {
      const newFigures = getNewFigures(e, figures, boundedRef.current, figuresProps, activeMode);
      saveHistory({ figures: newFigures });
    } else if (e.target === svg.current) {
      setActive(null);
    }
  };

  const resizeMoveFigure = e => {
    const newFigures = cloneDeep(figures);
    if (mouseClicked && newFigures[active] && activeIndex !== null) {
      newFigures[active] = resizeFigure(e, cursor, newFigures[active], activeIndex, activeMode);
    }
    if (dragStart && newFigures[active]) {
      newFigures[active] = moveFigure(e, cursor, newFigures[active], activeMode);
    }
    setFigures(newFigures);
    setCursor({ x: e.clientX, y: e.clientY });
  };

  // Free Line, Simple Line, Breaking Line handlers new/save
  const isBreakLine = activeMode === drawTools.DRAW_BREAKING_LINE;
  const addPoint = (e, prevPoints, pathProps) =>
    getNewFigures(e, prevPoints, boundedRef.current, pathProps, activeMode);
  const lineProps = { lineWidth, color: lineColor };

  const drawPointForLine = (modifier = "") => e => {
    if (!isBreakLine) {
      setMouseClicked(true);
    }
    // Break line should have modifier "L" for each break points
    if (isBreakLine) {
      lineProps.modifier = modifier;
    }
    let newPoints = addPoint(e, points, lineProps);
    if (isBreakLine && points.length === 0) {
      newPoints = addPoint(e, newPoints, lineProps);
    }
    setPoints(newPoints);
    if (isBreakLine) {
      saveHistory({ points: newPoints });
    }
  };

  const drawPointsForLine = e => {
    if (mouseClicked || (isBreakLine && points.length > 1)) {
      setPoints(addPoint(e, points, lineProps));
    }
  };

  const savePath = () => {
    setMouseClicked(false);
    saveHistory({
      pathes: [...pathes, cloneDeep(points)],
      points: []
    });
  };

  // Text Handlers
  const calcTextPosition = text => {
    const { width, height } = measureText(text.value, { fontSize: `${lineWidth * 3}px` }, "svg", "text");
    const bounded = boundedRef.current;
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

  const drawText = e => {
    if (currentPosition.index === undefined) {
      normalizeTouchEvent(e);
      const bounded = boundedRef.current;
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

  const saveText = newText => {
    if (newText?.value?.trim()) {
      saveHistory({
        texts: produce(texts, draft => {
          draft[newText.index] = calcTextPosition(newText);
        })
      });
    }
    setInputIsVisible(false);
  };

  const editText = index => () => {
    if (disableRemove(index, "texts") || activeMode !== drawTools.DRAW_TEXT) return;
    if (texts[index]) {
      setInputIsVisible(true);
      setCurrentPosition(texts[index]);
    }
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

  // other handlers
  const handleActive = index => e => {
    if (disableRemove(index, "figures")) return;
    normalizeTouchEvent(e);
    if (!mouseClicked) {
      setActive(index);
    } else {
      setMouseClicked(false);
    }
  };

  const mouseUpAndDownControl = (flag, index) => e => {
    normalizeTouchEvent(e);
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
    setActive(i);
    setCursor({ x: e.clientX, y: e.clientY });
    setDragStart(true);
  };

  const handleDragEnd = i => e => {
    if (disableRemove(i, "figures")) return;
    normalizeTouchEvent(e);
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
        case drawTools.DRAW_SIMPLE_LINE:
        case drawTools.FREE_DRAW:
        case drawTools.DRAW_BREAKING_LINE:
          return {
            onMouseDown: isBreakLine ? undefined : drawPointForLine(),
            onTouchStart: isBreakLine ? undefined : drawPointForLine(),
            onClick: !isBreakLine ? undefined : drawPointForLine("L"),
            onDoubleClick: !isBreakLine ? undefined : savePath,
            onMouseUp: isBreakLine ? undefined : savePath,
            onTouchEnd: isBreakLine ? undefined : savePath,
            onMouseMove: drawPointsForLine,
            onTouchMove: drawPointsForLine
          };
        case drawTools.DRAW_CIRCLE:
        case drawTools.DRAW_SQUARE:
        case drawTools.DRAW_TRIANGLE:
          return {
            onMouseUp: drawFigure,
            onTouchEnd: drawFigure,
            onMouseMove: resizeMoveFigure,
            onTouchMove: resizeMoveFigure
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

  const deleteFigure = (index, prop) => () => {
    if (disableRemove(index, prop)) return;
    const newFigures = cloneDeep(history[prop]);
    newFigures.splice(index, 1);
    saveHistory({ [prop]: newFigures });
  };

  const getMouseDownHandler = (mode, index) =>
    activeMode === mode && !deleteMode ? handleDragStart(index) : undefined;

  const getMouseUpHandler = (mode, index) => (activeMode === mode && !deleteMode ? handleDragEnd(index) : undefined);

  const getOnClickHandler = prop => (mode, index) =>
    deleteMode ? deleteFigure(index, prop) : activeMode === mode ? handleActive(index) : undefined;

  const svgStyle = {
    position,
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    background: "transparent",
    display: showScratchpadByDefault || scratchPadMode ? "block" : "none",
    pointerEvents: activeMode === "" ? "none" : "all",
    zIndex: mouseClicked || dragStart || activeMode === "" ? 40 : 40,
    transformOrigin: "left top",
    transform: `scale(${zoom},${zoom})`
  };

  return (
    <Fragment>
      <svg ref={svg} {...viewBoxProps} {...getSvgHandlers()} style={svgStyle}>
        <Figures
          figures={figures}
          active={active}
          deleteMode={deleteMode}
          activeMode={activeMode}
          onMouseDown={getMouseDownHandler}
          onMouseUp={getMouseUpHandler}
          onClick={getOnClickHandler("figures")}
          mouseUpAndDownControl={mouseUpAndDownControl}
        />
        <Texts
          texts={texts}
          currentPosition={currentPosition}
          onMouseDown={getMouseDownHandler}
          onMouseUp={getMouseUpHandler}
          onDelete={getOnClickHandler("texts")}
          onEditText={editText}
        />
        <Lines pathes={pathes} disableRemove={disableRemove} deleteMode={deleteMode} saveHistory={saveHistory} />
        <Points points={points} disableRemove={disableRemove} deleteMode={deleteMode} saveHistory={saveHistory} />
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
      {activeMode === drawTools.SELECT_TOOL && (
        <EditFigures
          getContainer={getDrawingContainer}
          workHistory={history}
          saveHistory={saveHistory}
          lineWidth={lineWidth}
          finishedEdit={finishedEdit}
          editToolMode={editToolMode}
        />
      )}
      {inputIsVisible && activeMode === drawTools.DRAW_TEXT && (
        <TextInput
          bounded={boundedRef.current}
          text={currentPosition}
          onBlur={saveText}
          setCurrentPosition={setCurrentPosition}
        />
      )}
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

const mapDispatchToProps = {
  updateScratchpadData: updateScratchpadAction
};

export default connect(
  null,
  mapDispatchToProps
)(SvgDraw);
