import React, { useEffect, useState, useRef, useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Rnd } from "react-rnd";
import { ScratchPadContext } from "@edulastic/common";
import * as helpers from "./helpers";

const {
  activatedAreaBorder,
  resizeHandlerStyles,
  getStyle,
  getFiguresInSelection,
  resizeSelection,
  isPointInSelection,
  moveSelectedFigures,
  resizeSelectedFigures,
  editFigures
} = helpers;

const EditFigures = ({ workHistory, lineWidth, saveHistory, editToolMode, finishedEdit }) => {
  const { getContainer } = useContext(ScratchPadContext);
  const drawContainer = getContainer();
  const boundedRef = useRef(null);
  const mouseClicked = useRef(false);
  const activatedArea = useRef(null);
  const historyRef = useRef(workHistory);
  const rndRef = useRef();

  const [copied, setCopied] = useState({});
  const [initPoint, updateInit] = useState({});
  const [lastPoint, updateLast] = useState({});

  const getSelection = () => {
    const selection = getStyle(initPoint, lastPoint);
    activatedArea.current = selection;
    return selection;
  };

  const handleMouseDown = e => {
    const bounded = boundedRef.current;
    const newPoint = { x: e.clientX - bounded.left, y: e.clientY - bounded.top };
    if (!(activatedArea.current && isPointInSelection(activatedArea.current, newPoint))) {
      mouseClicked.current = true;
      updateInit(newPoint);
    }
  };

  const handleMouseMove = e => {
    if (mouseClicked.current) {
      const bounded = boundedRef.current;
      updateLast({ x: e.clientX - bounded.left, y: e.clientY - bounded.top });
    }
  };

  const handleMouseUp = () => {
    if (mouseClicked.current) {
      mouseClicked.current = false;
      if (historyRef.current && activatedArea.current?.width > 10 && activatedArea.current?.height > 10) {
        saveHistory(getFiguresInSelection(historyRef.current, activatedArea.current));
      } else {
        activatedArea.current = null;
      }
      updateInit({});
      updateLast({});
    }
  };

  const handleMove = (e, d) => {
    if (activatedArea.current) {
      const diff = {
        top: d.y - activatedArea.current.top,
        left: d.x - activatedArea.current.left
      };
      activatedArea.current = {
        ...activatedArea.current,
        top: d.y,
        left: d.x
      };
      saveHistory(moveSelectedFigures(diff, historyRef.current));
    }
  };

  const handleResize = (e, direction, ref, delta, position) => {
    const width = parseInt(ref.style.width, 10);
    const height = parseInt(ref.style.height, 10);
    const { current: prevSelection } = activatedArea;
    if (prevSelection) {
      const diff = {
        height: (height - lineWidth * 2) / (prevSelection.height - lineWidth * 2),
        width: (width - lineWidth * 2) / (prevSelection.width - lineWidth * 2)
      };
      activatedArea.current = {
        ...prevSelection,
        left: position.x,
        top: position.y,
        width,
        height
      };
      saveHistory(resizeSelectedFigures(diff, historyRef.current, prevSelection, activatedArea.current));
    }
  };

  useEffect(() => {
    if (drawContainer) {
      drawContainer.addEventListener("mousedown", handleMouseDown);
      drawContainer.addEventListener("mousemove", handleMouseMove);
      drawContainer.addEventListener("mouseup", handleMouseUp);
      boundedRef.current = drawContainer.getBoundingClientRect();
    }
    return () => {
      if (drawContainer) {
        drawContainer.removeEventListener("mousedown", handleMouseDown);
        drawContainer.removeEventListener("mousemove", handleMouseMove);
        drawContainer.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [drawContainer]);

  useEffect(() => {
    if (!workHistory) {
      activatedArea.current = null;
    }
    historyRef.current = workHistory || {};
    if (workHistory) {
      activatedArea.current = resizeSelection(workHistory, lineWidth);
      if (rndRef.current && activatedArea.current) {
        rndRef.current.updatePosition({ x: activatedArea.current.left, y: activatedArea.current.top });
        rndRef.current.updateSize({ width: activatedArea.current.width, height: activatedArea.current.height });
      }
    }
  }, [workHistory]);

  useEffect(() => {
    if (editToolMode) {
      const { figures, copiedObj } = editFigures(copied, historyRef.current, editToolMode);
      if (copiedObj) {
        setCopied(copiedObj);
      }
      if (figures) {
        saveHistory(figures);
      }
      finishedEdit("");
    }
  }, [editToolMode]);

  const { left: x, top: y, height, width } = activatedArea.current || {};

  return [
    mouseClicked.current && <SelectionArea style={getSelection()} key="selection-area" />,
    activatedArea.current && !mouseClicked.current && (
      <ActivatedAreaRnd
        bounds="parent"
        key="selected-rnd"
        ref={rndRef}
        resizeHandleStyles={resizeHandlerStyles}
        default={{ x, y, width, height }}
        onDragStop={handleMove}
        onResizeStop={handleResize}
      />
    )
  ];
};

EditFigures.propTypes = {
  finishedEdit: PropTypes.func
};

EditFigures.defaultProps = {
  finishedEdit: () => {}
};

export default EditFigures;

const SelectionArea = styled.div`
  border: 2px solid #096dd9;
  background: rgba(24, 144, 255, 0.5);
  position: absolute;
  z-index: 900;
`;

const ActivatedAreaRnd = styled(Rnd)`
  background: transparent;
  border: ${activatedAreaBorder};
  position: absolute;
  z-index: 900;
`;
