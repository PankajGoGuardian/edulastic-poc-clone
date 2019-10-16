import React, { useState } from "react";
import { find } from "lodash";
import { Tooltip } from "antd";
import PropTypes from "prop-types";

import { response } from "@edulastic/constants";
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
    evaluation,
    showAnswer,
    uiStyle = {},
    fontSize,
    userSelections,
    stemNumeration,
    responsecontainerindividuals,
    responseIds,
    previewTab,
    changePreviewTab
  } = resprops;
  const { id: choiceId, index } = find(responseIds, res => res.id === id);
  const status = evaluation[choiceId] ? "right" : "wrong";
  const indexStr = getStemNumeration(stemNumeration, index);
  const btnStyle = {
    width: uiStyle?.widthpx || 140,
    height: uiStyle?.heightpx || 35,
    position: "relative"
  };

  const responseStyle = find(responsecontainerindividuals, resp => resp.id === id);
  if (uiStyle.globalSettings) {
    let width = responseStyle?.previewWidth || btnStyle.width;
    const answerWidth = userSelections?.[index] ? userSelections[index].value.split("").length * 9 : width;
    const splitWidth = Math.max(answerWidth || width, 100);
    width = Math.min(splitWidth, 400);
    btnStyle.width = width;
  } else {
    btnStyle.width = responseStyle?.widthpx || btnStyle.width;
  }
  btnStyle.height = responseStyle?.heightpx || btnStyle.height;
  const lessMinWidth = parseInt(btnStyle.width, 10) < response.minWidthShowAnswer;
  const [showIndex, toggleIndexVisibility] = useState(!lessMinWidth);
  const indexStyle = {
    alignSelf: "stretch",
    height: "auto",
    display: showAnswer && showIndex ? "block" : "none",
    width: lessMinWidth ? Math.max(parseInt(btnStyle.width, 10) / 2, 20) : null,
    maxWidth: "50%",
    minWidth: lessMinWidth ? "unset" : null
  };
  const textStyle = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    padding: lessMinWidth ? `${btnStyle.height / 6}px 0px` : null
  };
  const textContainerStyle = {
    minwidth: "100%",
    width: btnStyle.width,
    padding: lessMinWidth ? "0 1px" : null,
    height: btnStyle.height,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center"
  };

  const handleClick = () => previewTab !== CLEAR && changePreviewTab(CLEAR);
  const handleHover = () => {
    if (showAnswer && lessMinWidth) {
      toggleIndexVisibility(!showIndex);
    }
  };
  return (
    <Tooltip title={userSelections?.[index]?.value}>
      <span className="template_box dropdown" style={{ fontSize, padding: 20, overflow: "hidden", margin: "0px 4px" }}>
        <span
          className={`
                    response-btn 
                    ${userSelections.length > 0 && userSelections[index] ? "check-answer" : ""} 
                    ${status}
                    ${showAnswer ? "show-answer" : ""}`}
          style={{ ...btnStyle, minWidth: "unset", margin: "0 2px 4px 0px" }}
          onClick={handleClick}
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
        >
          <span className="index" style={indexStyle}>
            {indexStr}
          </span>
          <div className="text container" style={textContainerStyle}>
            <span className="text" style={textStyle}>
              {userSelections?.[index]?.value}
            </span>
          </div>
          <IconWrapper
            display={!showAnswer || (showAnswer && showIndex) ? "flex" : "none"}
            rightPosition={lessMinWidth ? "1" : "10"}
          >
            {userSelections.length > 0 && userSelections[index] && status === "right" && <RightIcon />}
            {userSelections.length > 0 && userSelections[index] && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </span>
      </span>
    </Tooltip>
  );
};

CheckboxTemplateBoxLayout.propTypes = {
  resprops: PropTypes.object,
  id: PropTypes.string.isRequired
};

CheckboxTemplateBoxLayout.defaultProps = {
  resprops: {}
};

export default React.memo(CheckboxTemplateBoxLayout);
