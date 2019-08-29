import React, { Fragment } from "react";
import { find } from "lodash";
import PropTypes from "prop-types";

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
    responseBtnStyle,
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

  const response = find(responsecontainerindividuals, resp => resp.index === index);
  if (uiStyle.globalSettings) {
    btnStyle.width = (response && response.previewWidth) || uiStyle.widthpx;
    btnStyle.height = uiStyle.heightpx;
  } else {
    btnStyle.width = (response && response.widthpx) || uiStyle.widthpx || "auto";
    btnStyle.height = (response && response.heightpx) || uiStyle.heightpx || "auto";
  }

  if (responsecontainerindividuals && responsecontainerindividuals[index]) {
    const { widthpx: widthpx1, heightpx: heightpx1 } = responsecontainerindividuals[index];
    btnStyle.width = widthpx1;
    btnStyle.height = heightpx1;
    btnStyle.widthpx = widthpx1;
    btnStyle.heightpx = heightpx1;
  }
  console.log(btnStyle);
  const handleClick = () => previewTab !== CLEAR && changePreviewTab(CLEAR);

  return (
    <span className="template_box dropdown" style={{ fontSize, padding: 20, overflow: "hidden", margin: "0px 4px" }}>
      {showAnswer && (
        <span
          className={`
                    response-btn 
                    ${userSelections.length > 0 && userSelections[index] ? "check-answer" : ""} 
                    ${status}
                    ${showAnswer ? "show-answer" : ""}`}
          style={{ ...btnStyle, height: "auto", minWidth: btnStyle.widthpx, margin: 0 }}
          title={userSelections[index] && userSelections[index].value}
          onClick={handleClick}
        >
          <span className="index" style={{ alignSelf: "stretch", height: "auto" }}>
            {indexStr}
          </span>
          <span
            className="text"
            style={{
              width: btnStyle.width,
              height: btnStyle.height,
              display: "block",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
            }}
          >
            {userSelections[index] && userSelections[index].value}&nbsp;
          </span>
          <IconWrapper>
            {userSelections.length > 0 && userSelections[index] && status === "right" && <RightIcon />}
            {userSelections.length > 0 && userSelections[index] && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </span>
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
              <span className="index" style={{ alignSelf: "stretch", height: "auto" }}>
                {indexStr}
              </span>
            </Fragment>
          )}
          <span
            style={{
              width: btnStyle.width,
              height: btnStyle.height,
              display: "block",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
            }}
            className="text"
          >
            {userSelections[index] && userSelections[index].value}&nbsp;
          </span>
          <IconWrapper>
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
