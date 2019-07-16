import React, { useRef, useEffect, useState, useLayoutEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { get, isNaN } from "lodash";

import { Stimulus, InstructorStimulus, withWindowSizes, ScratchPadContext } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { IconUndo, IconRedo, IconEraseText } from "@edulastic/icons";
import { canvasDimensions } from "@edulastic/constants";

import { PREVIEW } from "../../constants/constantsForQuestions";

import { PreviewContainer } from "./styled/PreviewContainer";
import { Container } from "./styled/Container";
import { StyledSelect } from "./styled/StyledSelect";
import { Button } from "./styled/Button";
import { Text } from "./styled/Text";
import { CanvasContainer } from "./styled/CanvasContainer";
import { AdaptiveButtonList } from "./styled/AdaptiveButtonList";
import { getFontSize } from "../../utils/helpers";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";

const { Option } = Select;

const HighlightImagePreview = ({
  view,
  item = {},
  windowWidth,
  smallSize,
  saveAnswer,
  userAnswer,
  t,
  showQuestionNumber,
  qIndex,
  disableResponse
}) => {
  const canvas = useRef(null);
  const canvasContainerRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyTab, setHistoryTab] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);

  const { image, line_color = [] } = item;

  const [currentColor, setCurrentColor] = useState(line_color[0]);

  const [width, setWidth] = useState(image ? `${image.width}px` : "auto");
  const [height, setHeight] = useState(image ? `${image.height}px` : 470);
  const [canvasHeight, setCanvasHeight] = useState(image ? image.height : canvasDimensions.maxHeight);
  const altText = image ? image.altText : "";
  const file = image ? image.source : "";

  const { enableQuestionLevelScratchPad = true } = useContext(ScratchPadContext);

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

  const onCanvasMouseDown = e => {
    const bounded = canvas.current.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - bounded.left, e.clientY - bounded.top);
    setCtx(ctx);
    setMouseDown(true);
  };

  const onCanvasMouseUp = e => {
    if (mouseDown) {
      const bounded = canvas.current.getBoundingClientRect();
      ctx.lineTo(e.clientX - bounded.left, e.clientY - bounded.top);
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

      ctx.lineTo(e.clientX - bounded.left, e.clientY - bounded.top);
      ctx.strokeStyle = currentColor;
      ctx.stroke();
      setCtx(ctx);
    }
  };

  const onClearClick = () => {
    ctx.clearRect(0, 0, width, height);
    setCtx(ctx);
    const newHistory = [...history.slice(0, historyTab + 1), canvas.current.toDataURL()];
    setHistory(newHistory);
    setHistoryTab(newHistory.length - 1);
  };

  const onUndoClick = () => {
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      setHistoryTab(historyTab - 1);
      setCtx(ctx);
    };
    img.src = history[historyTab - 1];
    saveAnswer(history[historyTab - 1]);
  };

  const onRedoClick = () => {
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      setHistoryTab(historyTab + 1);
      setCtx(ctx);
    };
    img.src = history[historyTab + 1];
    saveAnswer(history[historyTab + 1]);
  };

  const fontSize = getFontSize(get(item, "ui_style.fontsize"));

  const renderImage = () =>
    file ? (
      <div style={{ width: "100%", height: "100%" }}>
        <img src={file} alt={altText} style={{ width, height }} />
      </div>
    ) : (
      <div style={{ width, height }} />
    );

  let canvasContainerWidth = canvasDimensions.maxWidth;

  const _w = parseInt(width, 10);

  if (!isNaN(_w)) {
    canvasContainerWidth = _w >= canvasContainerWidth ? _w : canvasContainerWidth;
  }

  return (
    <PreviewContainer padding={smallSize} boxShadow={smallSize ? "none" : ""}>
      <div
        ref={canvasContainerRef}
        style={{
          minHeight: `${canvasDimensions.maxHeight}px`,
          width: `${canvasContainerWidth}px`
        }}
      >
        <CanvasContainer>
          <InstructorStimulus width="100%">{item.instructor_stimulus}</InstructorStimulus>
          <QuestionTitleWrapper>
            {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
            {view === PREVIEW && !smallSize && <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />}
          </QuestionTitleWrapper>
          {item.image && item.image.source && renderImage()}
          {enableQuestionLevelScratchPad && (
            <canvas
              onMouseDown={!disableResponse ? onCanvasMouseDown : () => {}}
              onMouseUp={!disableResponse ? onCanvasMouseUp : () => {}}
              onMouseMove={!disableResponse ? onCanvasMouseMove : () => {}}
              ref={canvas}
            />
          )}
        </CanvasContainer>
      </div>
    </PreviewContainer>
  );
};

HighlightImagePreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  windowWidth: PropTypes.any.isRequired,
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  userAnswer: PropTypes.any.isRequired,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number,
  disableResponse: PropTypes.bool
};

HighlightImagePreview.defaultProps = {
  showQuestionNumber: false,
  qIndex: null,
  smallSize: false,
  disableResponse: false
};

export default withWindowSizes(withNamespaces("assessment")(HighlightImagePreview));
