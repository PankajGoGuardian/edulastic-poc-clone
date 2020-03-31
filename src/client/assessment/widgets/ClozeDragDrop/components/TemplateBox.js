import React from "react";
import PropTypes from "prop-types";

import { MathSpan, measureText, DragDrop } from "@edulastic/common";
import { response as Dimensions } from "@edulastic/constants";
import { Popover } from "antd";
import { ResponseContainer } from "../styled/ResponseContainer";
import getImageDimensionsHook from "../../../hooks/imageDimensions";

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
      // group all the options together in case groupResponses is checked
      const source = hasGroupResponses ? options.flatMap(_ => _.options) : options;
      // when groupResponses is checked, it has an object having data
      // else it is a plain string
      const key = hasGroupResponses ? answers[dropTargetIndex].data : answers[dropTargetIndex];
      const foundedItem = source.find(option => option.value === key);
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
  const imageDimensions = getImageDimensionsHook(label);

  const draggableContainerStyle = {
    display: "flex",
    justifyContent: "flext-start",
    alignItems: "center",
    height: "100%",
    "max-width": Dimensions.maxWidth
  };

  const boxHeight = response ? height : responseBtnStyle.heightpx;
  const { scrollWidth: contentWidth, scrollHeight: contentHeight } = measureText(label, style);
  const getContent = (inPopover = false) => (
    <div style={{ maxWidth: Dimensions.popoverMaxWidth, overflow: "auto" }}>
      <MathSpan dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  );
  const widthOverflow = contentWidth > style.maxWidth;
  const heightOverflow = imageDimensions.height > boxHeight || contentHeight > boxHeight;
  const showPopover = label && (widthOverflow || heightOverflow);

  const itemData = !hasGroupResponses
    ? `${getData("value")}_${dropTargetIndex}_fromResp`
    : `${getDataForGroup("value")}_${userAnswers[dropTargetIndex] &&
        userAnswers[dropTargetIndex].group}_${dropTargetIndex}_fromResp`;

  const containerStyle = {
    display: "inline-flex",
    verticalAlign: "middle",
    borderRadius: 2,
    border: "1px dashed #b9b9b9",
    background: "#f8f8f8",
    margin: "2px"
  };

  return (
    <DropContainer style={containerStyle} index={dropTargetIndex} drop={onDrop}>
      <DragItem data={itemData}>
        <ResponseContainer style={style}>
          {showPopover && (
            <Popover placement="bottomLeft" content={getContent(true)}>
              {getContent(true)}
            </Popover>
          )}
          {!showPopover && getContent()}
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
