import React, { useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { get } from "lodash";
import { AnswerContext, FlexContainer } from "@edulastic/common";
import { StyledFlex, StyledInput, StyledRejectionSubmitBtn } from "./styled";
import { savePreviewRejectAction } from "./previewAttachment.ducks";

const PreviewModalWithRejectNote = ({
  item,
  submitReviewFeedback,
  scratchPad,
  saveUserWork,
  rejectFeedbackData,
  columnsContentArea: ColumnsContentArea,
  sectionQue,
  resourceCount,
  onlySratchpad
}) => {
  const [note, setNote] = useState("");

  const handleNote = e => setNote(e.target.value);

  const handleSubmit = () => submitReviewFeedback(note, scratchPad);

  const saveScratchpad = data => {
    saveUserWork({
      [item._id]: { ...rejectFeedbackData, scratchpad: data }
    });
  };

  const _renderAddRejectNoteSection = () => (
    <StyledFlex style={{ margin: "18px auto", width: "100%" }}>
      <StyledInput placeholder="Type an additional comments here..." value={note} onChange={handleNote} rows={1} />
      <StyledRejectionSubmitBtn onClick={handleSubmit}>Submit</StyledRejectionSubmitBtn>
    </StyledFlex>
  );

  return (
    <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
      <FlexContainer width="100%" flexDirection="column">
        <ColumnsContentArea
          sectionQue={sectionQue}
          resourceCount={resourceCount}
          scratchpadData={scratchPad}
          saveScratchpad={saveScratchpad}
        />
        {!onlySratchpad && _renderAddRejectNoteSection()}
      </FlexContainer>
    </AnswerContext.Provider>
  );
};

const enhance = compose(
  connect(
    (state, ownProps) => ({
      scratchPad: get(state, `testItemPreviewAttachment.present[${ownProps.item._id}].scratchpad`, ""),
      rejectFeedbackData: get(state, `testItemPreviewAttachment.present[${ownProps.item._id}]`, null)
    }),
    {
      saveUserWork: savePreviewRejectAction
    }
  )
);

PreviewModalWithRejectNote.propTypes = {
  saveUserWork: PropTypes.func.isRequired,
  submitReviewFeedback: PropTypes.func.isRequired
};

export default enhance(PreviewModalWithRejectNote);
