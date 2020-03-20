import React, { useState } from "react";
import PropTypes from "prop-types";
import { MathSpan, measureText, DragDrop } from "@edulastic/common";
import { Popover } from "antd";
import { response as dimensions } from "@edulastic/constants";

import { getStemNumeration } from "../../../../utils/helpers";
import { CheckboxContainer } from "./styled/CheckboxContainer";
import { CheckBoxTemplateBox } from "./styled/CheckBoxTemplateBox";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import PopoverContent from "./components/PopoverContent";
import getImageDimensionsHook from "../../../../hooks/imageDimensions";

const { DropContainer, DragItem } = DragDrop;

const CheckboxTemplateBoxLayout = ({ resprops, id }) => {
  const {
    showAnswer,
    checkAnswer,
    options = [],
    hasGroupResponses = false,
    responsecontainerindividuals = [],
    responseBtnStyle = {},
    userSelections = [],
    cAnswers,
    isReviewTab,
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

  const label = getFormulaLabel();
  const imageDimensions = getImageDimensionsHook(label);

  const { scrollWidth, scrollHeight } = measureText(label, { ...btnStyle, maxWidth: btnStyle.maxWidth });

  /**
   * +60 is ellipsis width on clicking showAnswer
   * +30 is ellipsis width on clicking checkAnswer
   */

  const padding = 30;
  const widthOverflow = scrollWidth + padding + (showAnswer ? 60 : 30) > btnStyle.maxWidth;

  const boxHeight = response?.heightpx || responseBtnStyle.heightpx;

  const heightOverflow = imageDimensions.height > boxHeight || scrollHeight >= boxHeight;

  const showPopover = widthOverflow || heightOverflow;

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

  const entireAnswer = <MathSpan dangerouslySetInnerHTML={{ __html: getFormulaLabel() }} />;

  const popoverContent = (
    <PopoverContent
      checkAnswer={checkAnswer}
      index={dropTargetIndex}
      answer={entireAnswer}
      status={status}
      className={className}
      isExpressGrader={isExpressGrader}
      stemNumeration={stemNumeration}
    />
  );

  const getData = attr => {
    const answers = isReviewTab ? cAnswers : userSelections;
    if (answers[dropTargetIndex]) {
      const foundedItem = options.find(option => option.value === answers[dropTargetIndex]);
      if (foundedItem) {
        return attr === "value" ? foundedItem.value : foundedItem.label;
      }
    }
  };

  const getDataForGroup = attr => {
    const answers = isReviewTab ? cAnswers : userSelections;
    if (answers[dropTargetIndex] && answers[dropTargetIndex].data) {
      const foundedGroup = options.find(option =>
        option.options.find(inOption => inOption.value === answers[dropTargetIndex].data)
      );
      if (foundedGroup) {
        const foundItem = foundedGroup.options.find(inOption => inOption.value === answers[dropTargetIndex].data);
        if (foundItem) {
          return attr === "value" ? foundItem.value : foundItem.label;
        }
      }
    }
  };

  const itemData = !hasGroupResponses
    ? `${getData("value")}_${dropTargetIndex}_fromResp`
    : `${getDataForGroup("value")}_${userSelections[dropTargetIndex] &&
        userSelections[dropTargetIndex].group}_${dropTargetIndex}_fromResp`;

  return (
    <CheckBoxTemplateBox>
      <DropContainer drop={onDropHandler} index={dropTargetIndex}>
        <DragItem disableResponse={disableResponse} data={itemData}>
          {choiceAttempted && showPopover ? (
            <Popover placement="bottomLeft" overlayClassName="customTooltip" content={popoverContent}>
              {content}
            </Popover>
          ) : (
            content
          )}
        </DragItem>
      </DropContainer>
    </CheckBoxTemplateBox>
  );
};

CheckboxTemplateBoxLayout.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default React.memo(CheckboxTemplateBoxLayout);
