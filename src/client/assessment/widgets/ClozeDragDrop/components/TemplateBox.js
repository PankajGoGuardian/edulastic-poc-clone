import React from "react";
import PropTypes from "prop-types";

import { MathSpan, measureText } from "@edulastic/common";
import { response as Dimensions } from "@edulastic/constants";
import { Popover } from "antd";
import Droppable from "./Droppable";
import Draggable from "./Draggable";
import { ResponseContainer } from "../styled/ResponseContainer";

const TemplateBox = ({ resprops, id }) => {
  if (!id) {
    return "NOID";
  }
  const {
    hasGroupResponses,
    responsecontainerindividuals = [],
    responseBtnStyle,
    smallSize,
    options,
    userAnswers,
    onDrop,
    responseIDs,
    isReviewTab,
    cAnswers,
    maxWidth
  } = resprops;
  const { index: dropTargetIndex } = responseIDs.find(response => response.id === id) || {};
  const response = responsecontainerindividuals.find(resp => resp.id === id) || {};
  const height = (response && response.heightpx) || responseBtnStyle.heightpx || Dimensions.minHeight;
  const width = (response && response.widthpx) || responseBtnStyle.widthpx || Dimensions.minWidth;
  const style = {
    ...responseBtnStyle,
    height: response ? height : "auto",
    minWidth: response ? width : "auto",
    maxWidth: maxWidth || "auto"
  };
  const getData = attr => {
    const answers = isReviewTab ? cAnswers : userAnswers;
    if (answers[dropTargetIndex]) {
      const foundedItem = options.find(option => option.value === answers[dropTargetIndex]);
      if (foundedItem) {
        return attr === "value" ? foundedItem.value : foundedItem.label;
      }
    }
  };

  const getDataForGroup = attr => {
    const answers = isReviewTab ? cAnswers : userAnswers;
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

  const label = getData("label" || "");

  const { scrollWidth: contentWidth } = measureText(label, style);
  const content = <MathSpan dangerouslySetInnerHTML={{ __html: label }} />;
  const showPopover = contentWidth > style.maxWidth && label;

  return (
    <Droppable drop={() => ({ dropTargetIndex })}>
      {!hasGroupResponses && (
        <ResponseContainer id={`response-container-${dropTargetIndex}`} style={style} smallSize={smallSize}>
          <Draggable
            className="content"
            onDrop={onDrop}
            data={`${getData("value")}_${dropTargetIndex}_fromResp`}
            smallSize={smallSize}
            style={{ display: "flex", justifyContent: "flext-start", alignItems: "center", height: "100%" }}
          >
            {showPopover && <Popover content={content}>{content}</Popover>}
            {!showPopover && content}
          </Draggable>
          &nbsp;
        </ResponseContainer>
      )}
      {hasGroupResponses && (
        <ResponseContainer style={style} smallSize={smallSize}>
          <Draggable
            className="content"
            onDrop={onDrop}
            data={`${getDataForGroup("value")}_${userAnswers[dropTargetIndex] &&
              userAnswers[dropTargetIndex].group}_${dropTargetIndex}_fromResp`}
            smallSize={smallSize}
          >
            {showPopover && <Popover content={content}>{content}</Popover>}
            {!showPopover && content}
          </Draggable>
          &nbsp;
        </ResponseContainer>
      )}
    </Droppable>
  );
};

TemplateBox.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default TemplateBox;
