import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import { Popover } from "antd";
import { response } from "@edulastic/constants";
import { measureText, MathSpan } from "@edulastic/common";
import { darkBlue } from "@edulastic/colors";

import { getStemNumeration } from "../../../../utils/helpers";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
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
    isPrint,
    userSelections,
    evaluation,
    changePreviewTab,
    previewTab,
    disableResponse,
    item: { responseIds },
    isPrintPreview
  } = resprops;
  const { index, id: answerId } = find(responseIds, _response => _response.id === id);
  const userSelection = find(userSelections, selection => (selection ? selection.id : "") === id);
  const indexStr = getStemNumeration((isPrint || isPrintPreview ? "lowercase" : stemNumeration), index);
  const status = userSelections && evaluation ? (evaluation[answerId] ? "right" : "wrong") : "wrong";
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
    height: btnStyle.heightpx,
    minWidth: "unset",
    margin: "0px 4px 5px",
    display: "inline-block",
    verticalAlign: "middle"
  };

  const indexStyle = {
    display: "inline-block",
    "text-align": "center",
    height: "100%"
  };

  if (isPrint || isPrintPreview) {
    indexStyle.color = darkBlue;
  }
  const lessMinWidth = parseInt(btnStyle.width, 10) < response.minWidthShowAnswer;

  if (lessMinWidth) {
    indexStyle.width = response.indexSizeSmallBox;
    indexStyle.padding = "8px";
    indexStyle.minWidth = "unset";
  }

  const textStyle = lessMinWidth ? { maxWidth: "80%" } : {};

  const getContent = inPopover => (
    <span
      className={`
    response-btn 
    ${userAttempted ? "check-answer" : ""} 
    ${status} 
    ${showAnswer ? "show-answer" : ""}`}
      style={inPopover ? { maxWidth: response.maxWidth } : _btnStyle}
      onClick={handleClick}
    >
      {(showAnswer || isPrint || isPrintPreview) && !lessMinWidth && (
        <span className="index" style={indexStyle}>
          {indexStr}
        </span>
      )}
      {userAttempted && (
        <span
          className="text container"
          style={{
            display: "inline-flex",
            width: showAnswer ? "calc(100% - 40px)" : "100%",
            padding: lessMinWidth ? "8px 2px" : null,
            whiteSpace: inPopover && "normal"
          }}
        >
          <MathSpan
            className={!inPopover && "clipText"}
            style={{ ...textStyle, fontWeight: "normal" }}
            dangerouslySetInnerHTML={{ __html: userSelection?.value }}
          />
        </span>
      )}
      <IconWrapper rightPosition={lessMinWidth ? 1 : 8}>
        {userAttempted && status === "right" && <RightIcon />}
        {userAttempted && status === "wrong" && <WrongIcon />}
      </IconWrapper>
    </span>
  );

  const { scrollWidth } = measureText(userSelection?.value || "", _btnStyle);
  let contentWidth = scrollWidth + 40; // 40 is padding and margin and ellipsis width
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
