import React, { useState } from "react";
import PropTypes from "prop-types";
import { measureText, DragDrop } from "@edulastic/common";
import { Popover } from "antd";
import { response as dimensions } from "@edulastic/constants";

import { compose } from "redux";
import { withTheme } from "styled-components";
import { getStemNumeration } from "../../../../utils/helpers";
import { CheckBoxTemplateBox } from "./styled/CheckBoxTemplateBox";
import getImageDimensionsHook from "../../../../hooks/imageDimensions";

import CheckMark from "./styled/CheckMark";
import { AnswerBox } from "./styled/AnswerBox";
import { IndexBox } from "./styled/IndexBox";
import { AnswerContent } from "./styled/AnswerContent";

const { DropContainer, DragItem } = DragDrop;

const CheckboxTemplateBoxLayout = ({ resprops, id, theme }) => {
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
    evaluation = {},
    onDropHandler = () => {},
    responseIDs,
    globalSettings,
    disableResponse,
    isPrintPreview
  } = resprops;

  const { index: dropTargetIndex } = (responseIDs && responseIDs.find(response => response.id === id)) || {};
  const choiceAttempted = userSelections.length > 0 && !!userSelections[dropTargetIndex];
  const status = choiceAttempted ? (evaluation[dropTargetIndex] ? "right" : "wrong") : null;
  const indexStr = getStemNumeration(stemNumeration, dropTargetIndex);
  const btnStyle = { ...responseBtnStyle };
  const response = responsecontainerindividuals.find(resp => resp.id === id) || {};
  const heightpx = (response && response.heightpx) || btnStyle.heightpx;
  const widthpx = (response && response.widthpx) || btnStyle.widthpx;

  btnStyle.minWidth = !globalSettings ? (widthpx ? `${widthpx}px` : "auto") : "auto";
  btnStyle.maxHeight = !globalSettings ? (heightpx ? `${heightpx}px` : "auto") : "auto";
  btnStyle.minHeight = !globalSettings ? (heightpx ? `${heightpx}px` : "auto") : "auto";

  // Removing maxWidth

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

  const handleHover = () => {
    if (showAnswer && lessMinWidth) {
      toggleIndexVisibility(!showIndex);
    }
  };

  const correct = status === "right";

  const getContent = (maxHeight = "") => (
    <AnswerBox
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      style={{ ...btnStyle, maxHeight }}
      checked={choiceAttempted}
      correct={correct}
      isPrintPreview={isPrintPreview}
    >
      {!checkAnswer && (
        <IndexBox checked={choiceAttempted} correct={correct}>
          {indexStr}
        </IndexBox>
      )}
      <AnswerContent
        style={{ width: "auto" }}
        showIndex={!checkAnswer}
        dangerouslySetInnerHTML={{ __html: label || "" }}
        isPrintPreview={isPrintPreview}
      />
      {choiceAttempted && <CheckMark correct={correct} />}
    </AnswerBox>
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

  const {
    answerBox: { borderWidth, borderStyle, borderColor, borderRadius }
  } = theme;

  return (
    <CheckBoxTemplateBox>
      <DropContainer
        drop={onDropHandler}
        index={dropTargetIndex}
        style={{ border: `${borderWidth} ${borderStyle} ${borderColor}`, borderRadius }}
      >
        <DragItem disableResponse={disableResponse} data={itemData} style={{ overflow: "hidden" }}>
          {choiceAttempted && showPopover ? (
            <Popover placement="bottomLeft" overlayClassName="customTooltip" content={getContent()}>
              {getContent(btnStyle.maxHeight)}
            </Popover>
          ) : (
            getContent()
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

const enhance = compose(
  React.memo,
  withTheme
);

export default enhance(CheckboxTemplateBoxLayout);
