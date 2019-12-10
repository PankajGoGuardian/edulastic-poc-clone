import React, { useState } from "react";
import PropTypes from "prop-types";
import { MathSpan, measureText } from "@edulastic/common";
import { Popover } from "antd";
import { response as dimensions } from "@edulastic/constants";
import Draggable from "../Draggable";
import Droppable from "../Droppable";
import { getStemNumeration } from "../../../../utils/helpers";
import { CheckboxContainer } from "./styled/CheckboxContainer";
import { CheckBoxTemplateBox } from "./styled/CheckBoxTemplateBox";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import PopoverContent from "./components/PopoverContent";

const CheckboxTemplateBoxLayout = ({ resprops, id }) => {
  const {
    showAnswer,
    checkAnswer,
    options = [],
    hasGroupResponses = false,
    responsecontainerindividuals = [],
    responseBtnStyle = {},
    userSelections = [],
    stemNumeration = "numerical",
    evaluation = [],
    onDropHandler = () => {},
    responseIDs,
    maxWidth,
    globalSettings,
    disableResponse,
    isExpressGrader
  } = resprops;
  const { index: dropTargetIndex } = (responseIDs && responseIDs.find(response => response.id === id)) || {};
  const status =
    userSelections.length > 0 && evaluation.length > 0 ? (evaluation[dropTargetIndex] ? "right" : "wrong") : null;

  const choiceAttempted = userSelections.length > 0 ? !!userSelections[dropTargetIndex] : null;

  const indexStr = getStemNumeration(stemNumeration, dropTargetIndex);

  const btnStyle = { ...responseBtnStyle };
  const response = responsecontainerindividuals.find(resp => resp.id === id) || {};
  const heightpx = (response && response.heightpx) || btnStyle.heightpx;
  const widthpx = (response && response.widthpx) || btnStyle.widthpx;
  btnStyle.minWidth = !globalSettings ? (widthpx ? `${widthpx}px` : "auto") : "auto";
  btnStyle.height = !globalSettings ? (heightpx ? `${heightpx}px` : "auto") : "auto";

  if (maxWidth) {
    btnStyle.maxWidth = maxWidth;
  }

  const getFormulaLabel = () => {
    let formulaLabel = "";
    if (!hasGroupResponses && userSelections[dropTargetIndex]) {
      const foundedItem = options.find(option => option.value === userSelections[dropTargetIndex]);
      if (foundedItem) {
        formulaLabel = foundedItem.label;
      }
    } else if (userSelections[dropTargetIndex] && userSelections[dropTargetIndex].data) {
      const foundedGroup = options.find(option =>
        option.options.find(inOption => inOption.value === userSelections[dropTargetIndex].data)
      );
      if (foundedGroup) {
        const foundItem = foundedGroup.options.find(
          inOption => inOption.value === userSelections[dropTargetIndex].data
        );
        if (foundItem) {
          formulaLabel = foundItem.label;
        }
      }
    }
    return formulaLabel;
  };

  const lessMinWidth = parseInt(btnStyle.maxWidth, 10) < dimensions.minWidthShowAnswer;
  const [showIndex, toggleIndexVisibility] = useState(!lessMinWidth);

  const { scrollWidth } = measureText(getFormulaLabel(), { ...btnStyle, maxWidth: btnStyle.maxWidth });
  /**
   * +60 is ellipsis width on clicking showAnswer
   * +30 is ellipsis width on clicking checkAnswer
   */
  const showPopover = scrollWidth + (showAnswer ? 60 : 30) > btnStyle.maxWidth;

  const indexStyle = {};
  if (lessMinWidth) {
    btnStyle.minWidth = "unset";
    indexStyle.width = "10px";
    indexStyle.minWidth = "unset";
  }

  const getLabel = () => (
    <CheckboxContainer width={btnStyle.maxWidth} showAnswer={showAnswer}>
      <MathSpan className="clipText" dangerouslySetInnerHTML={{ __html: getFormulaLabel() }} />
    </CheckboxContainer>
  );

  const handleHover = () => {
    if (showAnswer && lessMinWidth) {
      toggleIndexVisibility(!showIndex);
    }
  };

  const className = `response-btn ${choiceAttempted ? "check-answer" : ""} ${status} ${
    showAnswer ? "show-answer" : ""
  }`;

  const answer = getLabel(dropTargetIndex);

  const content = (
    <div className={className} style={btnStyle} onMouseEnter={handleHover} onMouseLeave={handleHover}>
      {showAnswer && !lessMinWidth && (
        <span style={indexStyle} className="index">
          {indexStr}
        </span>
      )}

      <span
        style={{
          justifyContent: showPopover ? null : "center",
          padding: lessMinWidth ? "8px 0px" : null,
          paddingRight: showAnswer && !lessMinWidth && 30
        }}
        className="text"
      >
        {answer}
      </span>

      {(!showAnswer || (showAnswer && !lessMinWidth)) && choiceAttempted && (
        <IconWrapper rightPosition={0} correct={status === "right"}>
          {choiceAttempted && status === "right" && <RightIcon />}
          {choiceAttempted && status === "wrong" && <WrongIcon />}
        </IconWrapper>
      )}
    </div>
  );

  const entireAnswer = <MathSpan className="clipText" dangerouslySetInnerHTML={{ __html: getFormulaLabel() }} />;

  const popoverContent = (
    <PopoverContent
      checkAnswer={checkAnswer}
      index={dropTargetIndex}
      answer={entireAnswer}
      status={status}
      className={className}
      isExpressGrader={isExpressGrader}
    />
  );

  return (
    <CheckBoxTemplateBox>
      <Droppable style={{ border: "none" }} drop={() => ({ dropTargetIndex })}>
        <Draggable
          onDrop={onDropHandler}
          disableResponse={disableResponse}
          data={`${getLabel(dropTargetIndex)}_${userSelections[dropTargetIndex] &&
            userSelections[dropTargetIndex].group}_${dropTargetIndex}_fromResp`}
        >
          {choiceAttempted && showPopover ? (
            <Popover overlayClassName="customTooltip" content={popoverContent}>
              {content}
            </Popover>
          ) : (
            content
          )}
        </Draggable>
      </Droppable>
    </CheckBoxTemplateBox>
  );
};

CheckboxTemplateBoxLayout.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default React.memo(CheckboxTemplateBoxLayout);
