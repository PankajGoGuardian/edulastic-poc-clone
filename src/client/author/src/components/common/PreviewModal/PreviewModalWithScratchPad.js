import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "redux-undo";
import { get } from "lodash";
import { AnswerContext, ScratchPadContext, hexToRGB } from "@edulastic/common";
import SvgDraw from "../../../../../assessment/themes/AssessmentPlayerDefault/SvgDraw";
import Tools from "../../../../../assessment/themes/AssessmentPlayerDefault/Tools";
import { allThemeVars } from "../../../../../theme";
import { StyledFlex, StyledInput, StyledRejectionSubmitBtn, StyledFlexContainer } from "./styled";

import { savePreviewRejectAction } from "./previewAttachment.ducks";
import { message } from "antd";

const PreviewModalWithScratchPad = ({
  submitReviewFeedback,
  saveUserWork,
  rejectFeedbackData,
  scratchPad,
  item,
  undoScratchPad,
  redoScratchPad,
  columnsContentArea: ColumnsContentArea,
  sectionQue,
  resourceCount,
  onlySratchpad,
  scrollContainerRef
}) => {
  const [currentColor, setCurrentColor] = useState("#ff0000");
  const [fillColor, setFillColor] = useState("#ff0000");
  const [lineWidth, setLineWidth] = useState(6);
  const [activeMode, setActiveMode] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [history, setHistory] = useState(0);
  const [note, setNote] = useState("");
  const [svgHeight, setSvgHeight] = useState();

  const containerRef = useRef();

  useEffect(() => {
    if (scrollContainerRef) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => {
      scrollContainerRef?.current.removeEventListener("scroll", handleScroll);
    };
  });

  const handleScroll = e => setSvgHeight(e.target.scrollHeight);

  const handleScratchToolChange = value => () => {
    if (value === "deleteMode") {
      setDeleteMode(!deleteMode);
    } else if (activeMode === value) {
      setActiveMode("");
    } else {
      if (value === "drawBreakingLine") {
        message.info("Please double click to stop drawing");
      }
      setActiveMode(value);
      setDeleteMode(false);
    }
  };

  const handleColorChange = obj => setCurrentColor(hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100));

  // will dispatch user work to store on here for scratchpad, passage highlight, or cross answer
  // sourceId will be one of 'scratchpad', 'resourceId', and 'crossAction'
  const saveHistory = sourceId => data => {
    setHistory(history + 1);
    saveUserWork({
      [item._id]: { ...rejectFeedbackData, [sourceId]: data }
    });
  };

  const handleUndo = () => {
    if (history > 0) {
      setHistory(history + 1);
      undoScratchPad();
    }
  };

  const handleRedo = () => {
    setHistory(history + 1);
    redoScratchPad();
  };

  const onFillColorChange = obj => setFillColor(hexToRGB(obj.color, (obj.alpha ? obj.alpha : 1) / 100));

  const handleNote = e => setNote(e.target.value);

  const handleSubmit = () => submitReviewFeedback(note, scratchPad);

  const _renderAddRejectNoteSection = () => (
    <StyledFlex style={{ marginTop: "18px" }}>
      <StyledInput placeholder="Type an additional comments here..." value={note} onChange={handleNote} rows={1} />
      <StyledRejectionSubmitBtn onClick={handleSubmit}>Submit</StyledRejectionSubmitBtn>
    </StyledFlex>
  );

  return (
    <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
      <StyledFlexContainer
        style={{
          alignItems: "flex-start",
          width: "100%",
          background: allThemeVars.containerWhite,
          borderRadius: "10px"
        }}
      >
        {!onlySratchpad && (
          <Tools
            onFillColorChange={onFillColorChange}
            fillColor={fillColor}
            deleteMode={deleteMode}
            currentColor={currentColor}
            onToolChange={handleScratchToolChange}
            activeMode={activeMode}
            undo={handleUndo}
            redo={handleRedo}
            onColorChange={handleColorChange}
            lineWidth={lineWidth}
            className="review-scratchpad"
            scratchpadResponsiveHeight={scrollContainerRef.current.clientHeight}
            style={{minHeight: "auto"}}
          />
        )}
        <div style={{ width: "100%", position: "relative", overflow: "auto" }} ref={containerRef}>
          <ScratchPadContext.Provider value={{ getContainer: () => containerRef.current }}>
            <ColumnsContentArea
              sectionQue={sectionQue}
              resourceCount={resourceCount}
              className="scratchpad-wrapper"
              style={{ position: "relative", minWidth: "1200px" }}
            >
              <SvgDraw
                activeMode={activeMode}
                scratchPadMode
                lineColor={currentColor}
                deleteMode={deleteMode}
                lineWidth={lineWidth}
                fillColor={fillColor}
                saveHistory={saveHistory("scratchpad")}
                height={svgHeight ? `${svgHeight}px` : "100%"}
                top="0"
                left="0"
                position="absolute"
                history={scratchPad}
              />
            </ColumnsContentArea>
          </ScratchPadContext.Provider>
        </div>
      </StyledFlexContainer>
      {!onlySratchpad && _renderAddRejectNoteSection()}
    </AnswerContext.Provider>
  );
};

const enhance = compose(
  connect(
    (state, ownProps) => ({
      scratchPad: get(state, `testItemPreviewAttachment.present[${ownProps.item._id}].scratchpad`, null),
      rejectFeedbackData: get(state, `testItemPreviewAttachment.present[${ownProps.item._id}]`, null)
    }),
    {
      saveUserWork: savePreviewRejectAction,
      undoScratchPad: ActionCreators.undo,
      redoScratchPad: ActionCreators.redo
    }
  )
);

PreviewModalWithScratchPad.propTypes = {
  submitReviewFeedback: PropTypes.func.isRequired,
  saveUserWork: PropTypes.func.isRequired,
  rejectFeedbackData: PropTypes.object,
  scratchPad: PropTypes.object,
  item: PropTypes.object.isRequired,
  undoScratchPad: PropTypes.func.isRequired,
  redoScratchPad: PropTypes.func.isRequired,
  columnsContentArea: PropTypes.node,
  sectionQue: PropTypes.array,
  resourceCount: PropTypes.number
};

export default enhance(PreviewModalWithScratchPad);
