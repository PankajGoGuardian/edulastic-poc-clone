import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "redux-undo";
import { get } from "lodash";
import { AnswerContext, FlexContainer } from "@edulastic/common";
import { allThemeVars } from "../../../../../theme";
import { StyledFlex, StyledInput, StyledRejectionSubmitBtn, StyledFlexContainer } from "./styled";

import { savePreviewRejectAction } from "./previewAttachment.ducks";

const PreviewModalWithScratchPad = ({
  submitReviewFeedback,
  saveUserWork,
  rejectFeedbackData,
  scratchPad,
  item,
  columnsContentArea: ColumnsContentArea,
  sectionQue,
  resourceCount,
  onlySratchpad,
  scrollContainerRef
}) => {
  const [history, setHistory] = useState(0);
  const [note, setNote] = useState("");
  const [, setSvgHeight] = useState();
  const containerRef = useRef();
  const handleScroll = e => setSvgHeight(e.target.scrollHeight);

  useEffect(() => {
    if (scrollContainerRef) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => {
      scrollContainerRef?.current.removeEventListener("scroll", handleScroll);
    };
  });

  // will dispatch user work to store on here for scratchpad, passage highlight, or cross answer
  // sourceId will be one of 'scratchpad', 'resourceId', and 'crossAction'
  const saveHistory = sourceId => data => {
    setHistory(history + 1);
    saveUserWork({
      [item._id]: { ...rejectFeedbackData, [sourceId]: data }
    });
  };
  console.log(scratchPad, saveHistory("scratchpad"));

  const handleNote = e => setNote(e.target.value);

  const handleSubmit = () => submitReviewFeedback(note, scratchPad);

  const _renderAddRejectNoteSection = () => (
    <StyledFlex style={{ margin: "18px auto", width: "100%" }}>
      <StyledInput placeholder="Type an additional comments here..." value={note} onChange={handleNote} rows={1} />
      <StyledRejectionSubmitBtn onClick={handleSubmit}>Submit</StyledRejectionSubmitBtn>
    </StyledFlex>
  );

  return (
    <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
      <FlexContainer width="100%" flexDirection="column">
        <StyledFlexContainer
          style={{
            alignItems: "flex-start",
            width: "100%",
            background: allThemeVars.containerWhite,
            borderRadius: "10px"
          }}
        >
          <div style={{ width: "100%", position: "relative", overflow: "auto" }} ref={containerRef}>
            <ColumnsContentArea
              sectionQue={sectionQue}
              resourceCount={resourceCount}
              className="scratchpad-wrapper"
              style={{ position: "relative", minWidth: "1200px" }}
            >
              {/* TODOScratchpad */}
            </ColumnsContentArea>
          </div>
        </StyledFlexContainer>
        {!onlySratchpad && _renderAddRejectNoteSection()}
      </FlexContainer>
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
  item: PropTypes.object.isRequired
};

export default enhance(PreviewModalWithScratchPad);
