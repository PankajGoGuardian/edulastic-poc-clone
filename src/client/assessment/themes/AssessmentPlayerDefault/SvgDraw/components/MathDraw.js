import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import produce from "immer";
import { drawTools } from "@edulastic/constants";
import { MathModal, MathFormulaDisplay } from "@edulastic/common";

import { normalizeTouchEvent } from "../../../../utils/helpers";

const MathDrawWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: ${({ activeMode }) => (activeMode === drawTools.DRAW_MATH ? 45 : 10)};
  display: ${({ scratchPadMode }) => (scratchPadMode ? "block" : "none")};
  pointer-events: ${({ activeMode }) => (activeMode === "" ? "none" : "all")};
`;

const MathFormula = styled(MathFormulaDisplay).attrs(({ top, left }) => ({
  style: { top, left }
}))`
  position: absolute;
  color: ${({ color }) => color};
  font-size: ${({ fontSize }) => fontSize}px;
  width: max-content;
  cursor: pointer;
  z-index: 50;
`;

const MathDraw = ({ workHistory, saveHistory, activeMode, deleteMode, lineColor, lineWidth, scratchPadMode }) => {
  const [latexs, setLatexs] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [newItem, setNewItem] = useState({});
  const [dragStart, setDragStart] = useState(false);

  const wrapperRef = useRef();

  const onSave = latex => {
    if (latex) {
      saveHistory({
        maths: produce(latexs, draft => {
          if (newItem.index === undefined) {
            draft.push({ ...newItem, value: latex, index: latexs.length });
          } else if (newItem.index !== undefined) {
            draft.splice(newItem.index, 1, { ...newItem, value: latex });
          }
          setNewItem({});
        })
      });
    }
  };

  const onClose = () => setNewItem({});

  useEffect(() => {
    if (workHistory && workHistory.maths) {
      setLatexs(workHistory.maths);
    }
  }, [workHistory]);

  const handleOnMouseDown = i => e => {
    if (activeMode === drawTools.DRAW_MATH && !deleteMode) {
      normalizeTouchEvent(e);
      setCursor({ x: e.clientX, y: e.clientY });
      setActiveItem(i);
      setDragStart(true);
    }
  };

  const addNewItem = e => {
    normalizeTouchEvent(e);
    if (!newItem.index && wrapperRef.current && wrapperRef.current.className === e.target.className && !deleteMode) {
      const bounded = wrapperRef.current.getBoundingClientRect();
      const point = { x: e.clientX - bounded.left, y: e.clientY - bounded.top };
      setNewItem({ color: lineColor, lineWidth, value: "", x: point.x, y: point.y });
    }
  };

  const handleOnMouseUp = i => () => {
    if (activeMode === drawTools.DRAW_MATH && !deleteMode) {
      saveHistory({ maths: latexs });
    } else if (activeMode === drawTools.DRAW_MATH && deleteMode) {
      saveHistory({
        maths: produce(latexs, draft => {
          draft.splice(i, 1);
          draft = draft.map((_latex, index) => ({ ..._latex, index }));
        })
      });
    }
    setDragStart(false);
  };

  const handleOnMouseMove = e => {
    if (activeMode === drawTools.DRAW_MATH && !deleteMode) {
      normalizeTouchEvent(e);
      setLatexs(
        produce(latexs, draft => {
          const xPoint = draft[activeItem].x - (cursor.x - e.clientX);
          const yPoint = draft[activeItem].y - (cursor.y - e.clientY);
          draft[activeItem].x = xPoint;
          draft[activeItem].y = yPoint;
        })
      );
      setCursor({ x: e.clientX, y: e.clientY });
    }
  };

  const handleDoubleClick = i => () => {
    setNewItem(latexs[i]);
  };

  return (
    <>
      <MathModal
        value={newItem.value}
        isEditable
        show={newItem.color}
        width="max-content"
        showDropdown
        onSave={onSave}
        onClose={onClose}
      />
      <MathDrawWrapper
        ref={wrapperRef}
        onClick={addNewItem}
        onMouseMove={dragStart ? handleOnMouseMove : undefined}
        activeMode={activeMode}
        scratchPadMode={scratchPadMode}
      >
        {latexs &&
          latexs.map((latex, i) => (
            <MathFormula
              onMouseDown={handleOnMouseDown(i)}
              onTouchStart={handleOnMouseDown(i)}
              onMouseUp={handleOnMouseUp(i)}
              onTouchEnd={handleOnMouseUp(i)}
              onDoubleClick={handleDoubleClick(i)}
              top={latex.y}
              left={latex.x}
              key={latex.index}
              color={latex.color}
              fontSize={latex.lineWidth * 3}
              dangerouslySetInnerHTML={{ __html: `<span class="input__math" data-latex="${latex.value}"></span>` }}
            />
          ))}
      </MathDrawWrapper>
    </>
  );
};

MathDraw.propTypes = {
  workHistory: PropTypes.object,
  scratchPadMode: PropTypes.bool.isRequired,
  lineWidth: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
  activeMode: PropTypes.string.isRequired,
  deleteMode: PropTypes.bool.isRequired,
  saveHistory: PropTypes.func.isRequired
};

MathDraw.defaultProps = {
  workHistory: {}
};

export default MathDraw;
