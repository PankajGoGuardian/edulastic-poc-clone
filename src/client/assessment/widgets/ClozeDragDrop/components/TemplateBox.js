import React from "react";
import PropTypes from "prop-types";

import { MathSpan, measureText, DragDrop } from "@edulastic/common";
import { response as Dimensions } from "@edulastic/constants";
import { Popover } from "antd";
import { ResponseContainer } from "../styled/ResponseContainer";

const { DropContainer, DragItem } = DragDrop;

const TemplateBox = ({ resprops, id }) => {
  if (!id) {
    return "NOID";
  }
  const {
    hasGroupResponses,
    responsecontainerindividuals = [],
    responseBtnStyle,
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

  const itemData = !hasGroupResponses
    ? `${getData("value")}_${dropTargetIndex}_fromResp`
    : `${getDataForGroup("value")}_${userAnswers[dropTargetIndex] &&
        userAnswers[dropTargetIndex].group}_${dropTargetIndex}_fromResp`;

  const containerStyle = {
    display: "inline-flex",
    verticalAlign: "middle",
    borderRadius: 10,
    border: "2px dashed #E6E6E6",
    margin: "2px"
  };

  return (
    <DropContainer style={containerStyle} index={dropTargetIndex} drop={onDrop}>
      <DragItem data={itemData}>
        <ResponseContainer style={style}>
          {showPopover && <Popover content={content}>{content}</Popover>}
          {!showPopover && content}
        </ResponseContainer>
      </DragItem>
    </DropContainer>
  );
};

TemplateBox.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default TemplateBox;
