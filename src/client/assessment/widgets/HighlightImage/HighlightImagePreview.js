/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState, useLayoutEffect, useContext } from "react";
import PropTypes from "prop-types";
import { isNaN } from "lodash";

import {
  Stimulus,
  withWindowSizes,
  ScratchPadContext,
  QuestionNumberLabel,
  isMobileDevice,
  AnswerContext
} from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { canvasDimensions } from "@edulastic/constants";

import { PREVIEW } from "../../constants/constantsForQuestions";

import { PreviewContainer } from "./styled/PreviewContainer";
import { CanvasContainer } from "./styled/CanvasContainer";
import { QuestionTitleWrapper } from "./styled/QustionNumber";
import DEFAULT_IMAGE from "../../assets/grid.png";

import Scratch from "./Scratch";

const isMobile = isMobileDevice();

const HighlightImagePreview = ({
  view,
  item = {},
  smallSize,
  saveAnswer,
  userAnswer,
  showQuestionNumber,
  disableResponse,
  theme,
  viewComponent,
  clearClicked
}) => {
  const canvas = useRef(null);
  const canvasContainerRef = useRef(null);
  const containerRef = useRef();

  const [ctx, setCtx] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyTab, setHistoryTab] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const { image, line_color = [] } = item;

  const [currentColor] = useState(line_color[0]);

  const [width] = useState(image ? `${image.width}px` : "auto");
  const [height] = useState(image ? `${image.height}px` : 470);
  const [canvasHeight] = useState(image ? image.height : canvasDimensions.maxHeight);
  const altText = image ? image.altText : "";
  const file = image ? image.source : "";

  const { enableQuestionLevelScratchPad = true } = useContext(ScratchPadContext);
  const { isAnswerModifiable } = useContext(AnswerContext);

  useEffect(() => {
    if (isMobile) {
      if (mouseDown) {
        document.ontouchmove = e => {
          e.preventDefault();
        };
      } else {
        document.ontouchmove = null;
      }
    }
  }, [mouseDown]);

  const renderImg = context => {
    const img = new Image();
    img.alt = altText;
    img.src = userAnswer;
    img.onload = () => {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      context.drawImage(img, 0, 0, img.width, img.height);
      setCtx(context);
    };
  };

  const drawImage = context => {
    if (!Array.isArray(userAnswer)) {
      renderImg(context);
    } else {
      context.clearRect(0, 0, width, height);
      if (canvas.current) {
        setHistory([canvas.current.toDataURL()]);
      }
      setHistoryTab(0);
      if (canvas.current) {
        saveAnswer(canvas.current.toDataURL());
      }

      setCtx(context);
    }
  };

  useEffect(() => {
    if (canvas.current) {
      canvas.current.width = canvasDimensions.maxWidth;
      canvas.current.height = canvasHeight;
      const context = canvas.current.getContext("2d");
      context.lineWidth = item.line_width || 5;
      context.lineJoin = "round";
      context.lineCap = "round";
      drawImage(context);
    }
  }, [file]);

  useLayoutEffect(() => {
    if (canvasContainerRef.current && canvas.current) {
      canvas.current.height = canvasContainerRef.current.clientHeight;
      canvas.current.width = canvasContainerRef.current.clientWidth;
      const context = canvas.current.getContext("2d");
      renderImg(context);
      context.lineWidth = item.line_width || 5;
    }
  }, [canvasContainerRef.current && canvasContainerRef.current.clientHeight]);

  const getCoords = (e, end = false) => {
    if (isMobile) {
      if (end) {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      }
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const onCanvasMouseDown = e => {
    const bounded = canvas.current.getBoundingClientRect();
    const coords = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(coords.x - bounded.left, coords.y - bounded.top);
    setCtx(ctx);
    setMouseDown(true);
  };

  const onCanvasMouseUp = e => {
    if (mouseDown) {
      const bounded = canvas.current.getBoundingClientRect();
      const coords = getCoords(e, true);
      ctx.lineTo(coords.x - bounded.left, coords.y - bounded.top);
      ctx.strokeStyle = currentColor;
      ctx.stroke();
      ctx.closePath();
      const newHistory = [...history.slice(0, historyTab + 1), canvas.current.toDataURL()];
      setHistory(newHistory);
      setHistoryTab(newHistory.length - 1);
      setCtx(ctx);
      setMouseDown(false);
      saveAnswer(canvas.current.toDataURL());
    }
  };

  const onCanvasMouseMove = e => {
    if (mouseDown) {
      const bounded = canvas.current.getBoundingClientRect();
      const coords = getCoords(e);
      ctx.lineTo(coords.x - bounded.left, coords.y - bounded.top);
      ctx.strokeStyle = currentColor;
      ctx.stroke();
      setCtx(ctx);
    }
  };

  const renderImage = () => (
    <div style={{ width: "100%", height: "100%", zoom: theme.widgets.highlightImage.imageZoom }}>
      <img src={file || DEFAULT_IMAGE} alt={altText} style={{ width, height }} />
    </div>
  );

  let canvasContainerWidth = canvasDimensions.maxWidth;

  const _w = parseInt(width, 10);

  if (!isNaN(_w)) {
    canvasContainerWidth = _w >= canvasContainerWidth ? _w : canvasContainerWidth;
  }

  const disableDrawing = disableResponse || !isAnswerModifiable;

  useEffect(() => {
    if (clearClicked && ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }, [clearClicked]);

  return (
    <PreviewContainer padding={smallSize} boxShadow={smallSize ? "none" : ""} ref={containerRef}>
      <ScratchPadContext.Provider value={{ getContainer: () => containerRef.current }}>
        <CanvasContainer
          ref={canvasContainerRef}
          minHeight={canvasDimensions.maxHeight}
          width={disableDrawing ? "auto" : `${canvasContainerWidth}px`}
        >
          <QuestionTitleWrapper>
            {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
            {view === PREVIEW && !smallSize && <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />}
          </QuestionTitleWrapper>
          {renderImage()}
          {enableQuestionLevelScratchPad && (
            <canvas
              onMouseDown={!disableDrawing ? onCanvasMouseDown : () => {}}
              onTouchStart={!disableDrawing ? onCanvasMouseDown : () => {}}
              onMouseUp={!disableDrawing ? onCanvasMouseUp : () => {}}
              onTouchEnd={!disableDrawing ? onCanvasMouseUp : () => {}}
              onMouseMove={!disableDrawing ? onCanvasMouseMove : () => {}}
              onTouchMove={!disableDrawing ? onCanvasMouseMove : () => {}}
              ref={canvas}
            />
          )}
        </CanvasContainer>
        {(viewComponent === "editQuestion" || viewComponent === "authorPreviewPopup") && (
          <Scratch clearClicked={clearClicked} />
        )}
      </ScratchPadContext.Provider>
    </PreviewContainer>
  );
};

HighlightImagePreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  viewComponent: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any.isRequired,
  showQuestionNumber: PropTypes.bool,
  clearClicked: PropTypes.bool,
  disableResponse: PropTypes.bool
};

HighlightImagePreview.defaultProps = {
  showQuestionNumber: false,
  clearClicked: false,
  smallSize: false,
  disableResponse: false
};

export default withWindowSizes(withNamespaces("assessment")(HighlightImagePreview));
