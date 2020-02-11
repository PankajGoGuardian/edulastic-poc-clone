import React, { useContext } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { DropTarget } from "react-dnd";
import { compose } from "redux";

import { MathSpan, FlexContainer, AnswerContext } from "@edulastic/common";

import DragItem from "./DragItem";
import { StyledResponseDiv, StyledResponseOption } from "../../ClozeDragDrop/styled/ResponseBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAlt } from "@fortawesome/free-solid-svg-icons";

const specTarget = {
  drop: (props, monitor) => {
    if (monitor.didDrop()) {
      return;
    }

    return props.drop(props);
  }
};

const collectTarget = (connector, monitor) => ({
  connectDropTarget: connector.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop()
});

const ResponseBoxLayout = ({
  smallSize,
  responses,
  fontSize,
  dragHandler,
  onDrop,
  disableResponse,
  transparentResponses,
  connectDropTarget,
  isOver,
  responseContainerPosition,
  getHeading,
  choiceStyle,
  theme
}) => {
  const { isAnswerModifiable } = useContext(AnswerContext);

  const horizontallyAligned = responseContainerPosition === "left" || responseContainerPosition === "right";
  return connectDropTarget(
    <div>
      <StyledResponseDiv
        className="responses_box"
        data-cy="responses-box"
        style={{
          padding: smallSize ? "5px 10px" : horizontallyAligned ? 10 : 16,
          height: horizontallyAligned && "100%",
          border: `1px solid ${theme.widgets.clozeDragDrop.correctAnswerBoxBorderColor}`,
          ...(isOver ? { boxShadow: "0 0 6px #75b4dd", border: "2px dashed #75b4dd" } : {})
        }}
      >
        <FlexContainer flexDirection="column">
          <div
            style={{
              margin: "0 auto 1rem 8px",
              color: theme.textColor,
              fontWeight: theme.bold,
              fontSize: theme.smallFontSize,
              lineHeight: theme.headerLineHeight
            }}
          >
            {getHeading("component.cloze.dragDrop.optionContainerHeading")}
          </div>
          <div
            style={{
              display: horizontallyAligned && "flex",
              flexDirection: horizontallyAligned && "column"
            }}
          >
            {responses.map((option = "", index) => (
              <StyledResponseOption
                key={index}
                className={transparentResponses ? "draggable_box_transparent" : "draggable_box"}
                style={{
                  ...choiceStyle,
                  fontSize: smallSize ? 10 : fontSize,
                  transform: "translate3d(0px, 0px, 0px)"
                }}
              >
                {!dragHandler && (
                  <DragItem
                    style={{ width: "100%" }}
                    index={index}
                    onDrop={onDrop}
                    item={option}
                    disableResponse={disableResponse || !isAnswerModifiable}
                    data={`${option}_null_${index}`}
                  >
                    <MathSpan dangerouslySetInnerHTML={{ __html: option }} />
                  </DragItem>
                )}
                {dragHandler && (
                  <DragItem
                    index={index}
                    onDrop={onDrop}
                    item={option}
                    data={`${option}_null_${index}`}
                    disableResponse={!isAnswerModifiable}
                  >
                    <FontAwesomeIcon icon={faArrowsAlt} style={{ fontSize: 12 }} />
                    <MathSpan dangerouslySetInnerHTML={{ __html: option }} />
                  </DragItem>
                )}
              </StyledResponseOption>
            ))}
          </div>
        </FlexContainer>
      </StyledResponseDiv>
    </div>
  );
};

ResponseBoxLayout.propTypes = {
  responses: PropTypes.array,
  fontSize: PropTypes.string,
  choiceStyle: PropTypes.object.isRequired,
  onDrop: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  dragHandler: PropTypes.bool,
  transparentResponses: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  responseContainerPosition: PropTypes.string
};

ResponseBoxLayout.defaultProps = {
  responses: [],
  fontSize: "13px",
  smallSize: false,
  dragHandler: false,
  transparentResponses: false,
  responseContainerPosition: "bottom"
};

const enhance = compose(
  withTheme,
  React.memo,
  DropTarget("metal", specTarget, collectTarget)
);

export default enhance(ResponseBoxLayout);
