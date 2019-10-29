import React, { useState } from "react";
import { find } from "lodash";
import { Popover } from "antd";
import PropTypes from "prop-types";

import { response } from "@edulastic/constants";
import { getStemNumeration } from "../../../../utils/helpers";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { CLEAR } from "../../../../constants/constantsForQuestions";
import PopoverContent from "../PopoverContent";

const CheckboxTemplateBoxLayout = ({ resprops, id }) => {
  if (!id) {
    return null;
  }
  const {
    evaluation,
    checkAnswer,
    showAnswer,
    uiStyle = {},
    fontSize,
    userSelections,
    stemNumeration,
    responsecontainerindividuals,
    responseIds,
    previewTab,
    changePreviewTab,
    isExpressGrader
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
  const textStyle = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    padding: lessMinWidth ? `${btnStyle.height / 6}px 0px` : null
  };
  const textContainerStyle = {
    minwidth: "100%",
    width: btnStyle.width,
    padding: 0,
    height: btnStyle.height,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontWeight: "normal"
  };

  const handleClick = () => previewTab !== CLEAR && changePreviewTab(CLEAR);
  const handleHover = () => {
    if (lessMinWidth) {
      toggleIndexVisibility(!showIndex);
    }
  };
  const popoverContent = (
    <PopoverContent
      stemNumeration={stemNumeration}
      index={index}
      fontSize={fontSize}
      userSelections={userSelections}
      status={status}
      btnStyle={btnStyle}
      textContainerStyle={textContainerStyle}
      textStyle={textStyle}
      checkAnswer={checkAnswer}
      isExpressGrader={isExpressGrader}
    />
  );

  const content = (
    <span
      title={lessMinWidth ? userSelections?.[index]?.value : null}
      className="template_box dropdown"
      style={{ fontSize, padding: 20, overflow: "hidden", margin: "0px 4px" }}
    >
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
        <span className="index" style={{ display: checkAnswer || lessMinWidth ? "none" : "flex" }}>
          {indexStr}
        </span>
        <div className="text container" style={textContainerStyle}>
          <span className="text" style={textStyle}>
            {userSelections?.[index]?.value}
          </span>
        </div>
        <IconWrapper rightPosition={lessMinWidth ? "1" : "10"}>
          {userSelections.length > 0 && userSelections[index] && status === "right" && <RightIcon />}
          {userSelections.length > 0 && userSelections[index] && status === "wrong" && <WrongIcon />}
        </IconWrapper>
      </span>
    </span>
  );

  return lessMinWidth ? <Popover content={popoverContent}> {content} </Popover> : content;
};

CheckboxTemplateBoxLayout.propTypes = {
  resprops: PropTypes.object,
  id: PropTypes.string.isRequired
};

CheckboxTemplateBoxLayout.defaultProps = {
  resprops: {}
};

export default React.memo(CheckboxTemplateBoxLayout);
