import React from "react";
import PropTypes from "prop-types";

import { MathSpan } from "@edulastic/common";
import Droppable from "./Droppable";
import Draggable from "./Draggable";
import { ResponseContainer } from "../styled/ResponseContainer";
import { response as Dimensions } from "@edulastic/constants";

import Tooltip from "antd/lib/tooltip";

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
    globalSettings
  } = resprops;
  const { index: dropTargetIndex } = responseIDs.find(response => response.id === id) || {};
  const response = responsecontainerindividuals.find(resp => resp.id === id) || {};
  const minHeight = (response && response.heightpx) || responseBtnStyle.heightpx || Dimensions.minHeight;
  const minWidth = (response && response.widthpx) || responseBtnStyle.widthpx || Dimensions.minWidth;
  const style = {
    ...responseBtnStyle,
    minWidth,
    minHeight,
    maxWidth: globalSettings ? "400px" : "auto"
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

  return (
    <Droppable drop={() => ({ dropTargetIndex })}>
      {!hasGroupResponses && (
        <ResponseContainer id={`response-container-${dropTargetIndex}`} style={style} smallSize={smallSize}>
          <Draggable
            className="content"
            onDrop={onDrop}
            data={`${getData("value")}_${dropTargetIndex}_fromResp`}
            smallSize={smallSize}
          >
            <Tooltip
              overlayClassName="customTooltip"
              title={<MathSpan dangerouslySetInnerHTML={{ __html: getData("label") || "" }} />}
            >
              <MathSpan dangerouslySetInnerHTML={{ __html: getData("label") || "" }} />
            </Tooltip>
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
            <Tooltip
              overlayClassName="customTooltip"
              title={<MathSpan dangerouslySetInnerHTML={{ __html: getDataForGroup("label") || "" }} />}
            >
              <MathSpan dangerouslySetInnerHTML={{ __html: getDataForGroup("label") || "" }} />
            </Tooltip>
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
