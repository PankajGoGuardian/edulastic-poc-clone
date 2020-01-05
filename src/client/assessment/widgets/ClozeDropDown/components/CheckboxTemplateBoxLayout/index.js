import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import { Popover } from "antd";
import { response } from "@edulastic/constants";
import { getStemNumeration } from "../../../../utils/helpers";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { CLEAR } from "../../../../constants/constantsForQuestions";
import { measureText, MathSpan } from "@edulastic/common";

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
    item: { responseIds }
  } = resprops;
  const { index, id: answerId } = find(responseIds, _response => _response.id === id);
  const userSelection = find(userSelections, selection => (selection ? selection.id : "") === id);
  const indexStr = getStemNumeration(stemNumeration, index);
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
    marginTop: 0
  };
  const lessMinWidth = parseInt(btnStyle.width, 10) < response.minWidthShowAnswer;
  const indexStyle = lessMinWidth ? { width: response.indexSizeSmallBox, padding: "8px", minWidth: "unset" } : {};
  const textStyle = lessMinWidth ? { maxWidth: "80%" } : {};

  const content = (
    <span
      className={`
    response-btn 
    ${userAttempted ? "check-answer" : ""} 
    ${status} 
    ${showAnswer ? "show-answer" : ""}`}
      style={_btnStyle}
      onClick={handleClick}
    >
      {(showAnswer || isPrint) && !lessMinWidth && (
        <span className="index" style={indexStyle}>
          {indexStr}
        </span>
      )}
      <span className="text container" style={{ padding: lessMinWidth ? "8px 2px" : null }}>
        <MathSpan
          className="clipText"
          style={{ ...textStyle, fontWeight: "normal" }}
          dangerouslySetInnerHTML={{ __html: userSelection?.value }}
        />
      </span>
      <IconWrapper rightPosition={lessMinWidth ? 1 : 8}>
        {userAttempted && status === "right" && <RightIcon />}
        {userAttempted && status === "wrong" && <WrongIcon />}
      </IconWrapper>
    </span>
  );

  const { scrollWidth } = measureText(userSelection?.value || "", _btnStyle);
  const showPopover = scrollWidth > _btnStyle.width && userAttempted;

  return showPopover ? <Popover content={content}>{content}</Popover> : content;
};

CheckboxTemplateBoxLayout.propTypes = {
  resprops: PropTypes.object,
  id: PropTypes.string.isRequired
};

CheckboxTemplateBoxLayout.defaultProps = {
  resprops: {}
};

export default React.memo(CheckboxTemplateBoxLayout);
