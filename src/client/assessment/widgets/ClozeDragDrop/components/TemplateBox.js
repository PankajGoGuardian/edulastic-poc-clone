import React from "react";
import PropTypes from "prop-types";
import striptags from "striptags";

import { MathSpan } from "@edulastic/common";
import Droppable from "./Droppable";
import Draggable from "./Draggable";
import { ResponseContainer } from "../styled/ResponseContainer";

const TemplateBox = ({ resprops, id }) => {
  if (!id) {
    return "NOID";
  }
  const { hasGroupResponses, btnStyle, smallSize, options, userAnswers, onDrop, responseIDs } = resprops;
  const { index: dropTargetIndex } = responseIDs.find(response => response.id === id) || {};

  const getLabel = () => {
    if (userAnswers[dropTargetIndex]) {
      const foundedItem = options.find(option => option.value === userAnswers[dropTargetIndex]);
      if (foundedItem) {
        return foundedItem.label;
      }
    }
  };

  const getLabelForGroup = () => {
    if (userAnswers[dropTargetIndex] && userAnswers[dropTargetIndex].data) {
      const foundedGroup = options.find(option =>
        option.options.find(inOption => inOption.value === userAnswers[dropTargetIndex].data)
      );
      if (foundedGroup) {
        const foundItem = foundedGroup.options.find(inOption => inOption.value === userAnswers[dropTargetIndex].data);
        if (foundItem) {
          return foundItem.label;
        }
      }
    }
  };

  return (
    <Droppable drop={() => ({ dropTargetIndex })}>
      {!hasGroupResponses && (
        <ResponseContainer id={`response-container-${dropTargetIndex}`} style={btnStyle} smallSize={smallSize}>
          <Draggable
            title={striptags(getLabel(dropTargetIndex)) || ""}
            className="content"
            onDrop={onDrop}
            data={`${getLabel(dropTargetIndex)}_${dropTargetIndex}_fromResp`}
          >
            <MathSpan dangerouslySetInnerHTML={{ __html: getLabel(dropTargetIndex) || "" }} />
          </Draggable>
          &nbsp;
        </ResponseContainer>
      )}
      {hasGroupResponses && (
        <ResponseContainer style={btnStyle} smallSize={smallSize}>
          <Draggable
            title={striptags(getLabelForGroup(dropTargetIndex)) || ""}
            className="content"
            onDrop={onDrop}
            data={`${getLabelForGroup(dropTargetIndex)}_${userAnswers[dropTargetIndex] &&
              userAnswers[dropTargetIndex].group}_${dropTargetIndex}_fromResp`}
          >
            <MathSpan dangerouslySetInnerHTML={{ __html: getLabelForGroup(dropTargetIndex) || "" }} />
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
