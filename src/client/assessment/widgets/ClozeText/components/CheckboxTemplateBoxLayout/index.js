import React, { Fragment, useContext } from "react";
import { find } from "lodash";
import { Tooltip } from "antd";
import PropTypes from "prop-types";

import { getStemNumeration } from "../../../../utils/helpers";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { CLEAR } from "../../../../constants/constantsForQuestions";
import { response } from "@edulastic/constants";

const CheckboxTemplateBoxLayout = ({ resprops, id }) => {
  if (!id) {
    return null;
  }
  const {
    evaluation,
    showAnswer,
    style,
    uiStyle = {},
    responseBtnStyle,
    fontSize,
    userSelections,
    stemNumeration,
    responsecontainerindividuals,
    responseIds,
    previewTab,
    changePreviewTab,
    isReviewTab
  } = resprops;
  const { id: choiceId, index } = find(responseIds, res => res.id === id);
  const status = evaluation[choiceId] ? "right" : "wrong";
  const indexStr = getStemNumeration(stemNumeration, index);

  const btnStyle = {
    height: 0,
    widthpx: uiStyle.widthpx ? uiStyle.widthpx : 140,
    heightpx: 0,
    position: "relative"
  };

  if (btnStyle && btnStyle.width === 0 && !showAnswer) {
    btnStyle.width = responseBtnStyle.widthpx;
  } else {
    btnStyle.width = btnStyle.widthpx;
  }
  if (btnStyle && btnStyle.height === 0) {
    btnStyle.height = responseBtnStyle.heightpx;
  } else {
    btnStyle.height = btnStyle.heightpx;
  }
  let isBoxSizeSmall = false;
  const responseStyle = find(responsecontainerindividuals, resp => resp.id === id);
  if (uiStyle.globalSettings) {
    let width = (responseStyle && responseStyle.previewWidth) || style.widthpx;
    if (isReviewTab) {
      width = (responseStyle && responseStyle.previewWidth) || style.widthpx;
    } else {
      const answerWidth = userSelections?.[index] ? userSelections[index].value.split("").length * 9 : width;
      const splitWidth = Math.max(answerWidth || width, 100);
      width = Math.min(splitWidth, 400);
    }
    btnStyle.width = width;
    if (parseInt(width, 10) < response.minWidthShowAnswer) {
      btnStyle.minWidth = parseInt(width, 10) + 15;
      isBoxSizeSmall = true;
    }
    btnStyle.height = style.height || "auto";
  } else {
    const width = (responseStyle && responseStyle.widthpx) || style.widthpx;
    btnStyle.width = width;
    if (parseInt(width, 10) < response.minWidthShowAnswer) {
      btnStyle.minWidth = parseInt(width, 10) + 15;
      isBoxSizeSmall = true;
    }
    btnStyle.height = (responseStyle && responseStyle.heightpx) || style.height || "auto";
  }

  const indexStyle = { alignSelf: "stretch", height: "auto" };
  const textStyle = {
    width: btnStyle.width,
    height: btnStyle.height,
    display: "block",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden"
  };

  if (isBoxSizeSmall) {
    indexStyle.minWidth = "50%";
    indexStyle.width = "20px";
    indexStyle.maxWidth = response.indexSizeSmallBox;
    textStyle.padding = "8px 0px";
  }

  const handleClick = () => previewTab !== CLEAR && changePreviewTab(CLEAR);

  return (
    <span className="template_box dropdown" style={{ fontSize, padding: 20, overflow: "hidden", margin: "0px 4px" }}>
      {showAnswer && (
        <Tooltip title={userSelections?.[index]?.value}>
          <span
            className={`
                    response-btn 
                    ${userSelections.length > 0 && userSelections[index] ? "check-answer" : ""} 
                    ${status}
                    ${showAnswer ? "show-answer" : ""}`}
            style={{ ...btnStyle, height: "auto", margin: 0, marginBottom: 4 }}
            onClick={handleClick}
          >
            <span className="index" style={indexStyle}>
              {indexStr}
            </span>
            <span className="text" style={textStyle}>
              {userSelections[index] && userSelections[index].value}&nbsp;
            </span>
            <IconWrapper rightPosition={isBoxSizeSmall ? "1" : "10"}>
              {userSelections.length > 0 && userSelections[index] && status === "right" && <RightIcon />}
              {userSelections.length > 0 && userSelections[index] && status === "wrong" && <WrongIcon />}
            </IconWrapper>
          </span>
        </Tooltip>
      )}
      {!showAnswer && (
        <span
          className={`response-btn 
                ${userSelections.length > 0 && userSelections[index] ? "check-answer" : ""} 
                ${status}`}
          style={{ ...btnStyle, height: "auto", minWidth: btnStyle.widthpx, margin: 0 }}
          title={userSelections[index] && userSelections[index].value}
          onClick={handleClick}
        >
          {showAnswer && (
            <Fragment>
              <span className="index" style={indexStyle}>
                {indexStr}
              </span>
            </Fragment>
          )}
          <span style={textStyle} className="text">
            {userSelections[index] && userSelections[index].value}&nbsp;
          </span>
          <IconWrapper rightPosition={isBoxSizeSmall ? "1" : "10"}>
            {userSelections.length > 0 && userSelections[index] && status === "right" && <RightIcon />}
            {userSelections.length > 0 && userSelections[index] && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </span>
      )}
    </span>
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
