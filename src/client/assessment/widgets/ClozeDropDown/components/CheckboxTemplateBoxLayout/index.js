import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import { Popover } from "antd";
import { response } from "@edulastic/constants";
import { measureText } from "@edulastic/common";

import AnswerBox from "./AnswerBox";

import { getStemNumeration } from "../../../../utils/helpers";
import { CLEAR } from "../../../../constants/constantsForQuestions";

const CheckboxTemplateBoxLayout = ({ resprops, id }) => {
  if (!id) {
    return null;
  }

  const {
    responsecontainerindividuals,
    responseBtnStyle,
    stemNumeration,
    showAnswer,
    isPrint = false,
    userSelections,
    evaluation,
    changePreviewTab,
    previewTab,
    disableResponse,
    item: { responseIds },
    isPrintPreview = false
  } = resprops;
  const { index, id: answerId } = find(responseIds, _response => _response.id === id);
  const userSelection = find(userSelections, selection => (selection ? selection.id : "") === id);
  const indexStr = getStemNumeration(isPrint || isPrintPreview ? "lowercase" : stemNumeration, index);
  const userAttempted =
    userSelections.length > 0 && evaluation[answerId] !== undefined ? !!userSelections[index] : null;

  const btnStyle =
    (responsecontainerindividuals && responsecontainerindividuals.find(resp => resp.id === answerId)) ||
    responseBtnStyle;

  const handleClick = () => {
    if (previewTab !== CLEAR && !disableResponse) {
      changePreviewTab(CLEAR);
    }
  };

  const _btnStyle = {
    ...btnStyle,
    width: btnStyle.widthpx,
    height: btnStyle.heightpx
  };

  const lessMinWidth = parseInt(btnStyle.width, 10) < response.minWidthShowAnswer;

  const getContent = inPopover => (
    <AnswerBox
      onClick={handleClick}
      checked={userAttempted}
      userAnswer={userSelection?.value}
      correct={evaluation && evaluation[answerId]}
      style={inPopover ? { maxWidth: response.maxWidth } : _btnStyle}
      inPopover={inPopover}
      lessMinWidth={lessMinWidth}
      showIndex={(showAnswer || isPrint || isPrintPreview) && !lessMinWidth}
      indexStr={indexStr}
      isPrintPreview={isPrintPreview || isPrint}
    />
  );

  const { scrollWidth } = measureText(userSelection?.value || "", _btnStyle);
  let contentWidth = scrollWidth + 65; // +65 is padding and margin and ellipsis width
  if (showAnswer) {
    contentWidth += lessMinWidth ? response.indexSizeSmallBox : 35; // index box size
  }

  const showPopover = contentWidth >= _btnStyle.width && userAttempted;
  const answerContent = getContent();
  const popoverContent = getContent(true);

  return showPopover ? <Popover content={popoverContent}>{answerContent}</Popover> : answerContent;
};

CheckboxTemplateBoxLayout.propTypes = {
  resprops: PropTypes.object,
  id: PropTypes.string.isRequired
};

CheckboxTemplateBoxLayout.defaultProps = {
  resprops: {}
};

export default React.memo(CheckboxTemplateBoxLayout);
