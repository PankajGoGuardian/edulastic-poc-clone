import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";

import { MathSpan, FlexContainer } from "@edulastic/common";

import Draggable from "./Draggable";
import Droppable from "./Droppable";
import { StyledResponseDiv, StyledResponseOption } from "../styled/ResponseBox";

const ResponseBoxLayout = ({
  smallSize,
  hasGroupResponses,
  responses,
  fontSize,
  dragHandler,
  onDrop,
  theme,
  containerPosition,
  getHeading
}) => {
  const handleMove = e => {
    if (e.clientY < 100) {
      window.scrollTo(window.pageXOffset, window.pageYOffset - 10);
    } else if (e.clientY > window.innerHeight - 100) {
      window.scrollTo(window.pageXOffset, window.pageYOffset + 10);
    }
  };

  useEffect(() => {
    document.body.addEventListener("dragover", handleMove);
    return () => {
      document.body.removeEventListener("dragover", handleMove);
    };
  }, []);

  const horizontallyAligned = containerPosition === "left" || containerPosition === "right";

  return (
    <Droppable
      style={{ display: "block", border: `1px solid ${theme?.widgets?.clozeDragDrop?.correctAnswerBoxBorderColor}` }}
      drop={e => e}
    >
      <StyledResponseDiv
        className="responses_box"
        style={{
          padding: smallSize ? "5px 10px" : 16,
          borderRadius: smallSize ? 0 : 10,
          display: "flex",
          flexDirection: horizontallyAligned ? "column" : "row",
          alignItems: horizontallyAligned || hasGroupResponses ? "flex-start" : "center",
          justifyContent: smallSize ? "space-around" : "flex-start"
        }}
      >
        <FlexContainer flexDirection="column">
          <div
            style={{
              margin: "0 auto 1rem 8px",
              color: theme?.textColor,
              fontWeight: theme?.bold,
              fontSize: theme?.smallFontSize,
              lineHeight: theme?.headerLineHeight
            }}
          >
            {getHeading("component.cloze.dragDrop.optionContainerHeading")}
          </div>
          <FlexContainer flexDirection={horizontallyAligned ? "column" : "row"}>
            {hasGroupResponses && (
              <GroupWrapper horizontallyAligned={horizontallyAligned}>
                {responses.map((groupResponse, index) => {
                  if (groupResponse !== null && typeof groupResponse === "object") {
                    return (
                      <div key={index} className="group">
                        <h3>{groupResponse.title}</h3>
                        {groupResponse.options &&
                          groupResponse.options.map((option, itemIndex) => {
                            const { value, label = "" } = option;
                            return (
                              <div
                                key={itemIndex}
                                className="draggable_box"
                                style={{
                                  display: "flex",
                                  width: horizontallyAligned ? "100%" : null,
                                  justifyContent: "center",
                                  fontSize: smallSize
                                    ? theme.widgets.clozeDragDrop.groupDraggableBoxSmallFontSize
                                    : fontSize
                                }}
                              >
                                {!dragHandler && (
                                  <Draggable onDrop={onDrop} data={`${value}_${index}`}>
                                    <MathSpan dangerouslySetInnerHTML={{ __html: label }} />
                                  </Draggable>
                                )}
                                {dragHandler && (
                                  <React.Fragment>
                                    <Draggable onDrop={onDrop} data={`${value}_${index}`}>
                                      <i
                                        className="fa fa-arrows-alt"
                                        style={{
                                          fontSize: theme.widgets.clozeDragDrop.draggableIconFontSize
                                        }}
                                      />
                                      <MathSpan dangerouslySetInnerHTML={{ __html: label }} />
                                    </Draggable>
                                  </React.Fragment>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    );
                  }
                  return <React.Fragment key={index} />;
                })}
              </GroupWrapper>
            )}

            {!hasGroupResponses &&
              responses.map((option, index) => {
                const { label, value } = option;
                return (
                  <StyledResponseOption
                    id={`response-item-${index}`}
                    key={value}
                    className="draggable_box"
                    style={{
                      fontSize: smallSize ? theme.widgets.clozeDragDrop.draggableBoxSmallFontSize : fontSize,
                      fontWeight: smallSize
                        ? theme.widgets.clozeDragDrop.draggableBoxSmallFontWeight
                        : theme.widgets.clozeDragDrop.draggableBoxFontWeight,
                      display: "flex",
                      width: horizontallyAligned ? "100%" : null,
                      justifyContent: "center"
                    }}
                  >
                    {!dragHandler && (
                      <Draggable onDrop={onDrop} data={value}>
                        <MathSpan dangerouslySetInnerHTML={{ __html: label }} />
                      </Draggable>
                    )}
                    {dragHandler && (
                      <React.Fragment>
                        <Draggable onDrop={onDrop} data={value}>
                          <i
                            className="fa fa-arrows-alt"
                            style={{
                              fontSize: theme.widgets.clozeDragDrop.draggableIconFontSize
                            }}
                          />
                          <MathSpan dangerouslySetInnerHTML={{ __html: label }} />
                        </Draggable>
                      </React.Fragment>
                    )}
                  </StyledResponseOption>
                );
              })}
          </FlexContainer>
        </FlexContainer>
      </StyledResponseDiv>
    </Droppable>
  );
};

ResponseBoxLayout.propTypes = {
  responses: PropTypes.array,
  fontSize: PropTypes.string,
  hasGroupResponses: PropTypes.bool,
  smallSize: PropTypes.bool,
  dragHandler: PropTypes.bool,
  onDrop: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  containerPosition: PropTypes.string
};

ResponseBoxLayout.defaultProps = {
  responses: [],
  fontSize: "13px",
  smallSize: false,
  hasGroupResponses: false,
  dragHandler: false,
  containerPosition: "bottom"
};

const GroupWrapper = styled.div`
  display: flex;
  width: 100%;
  ${({ horizontallyAligned }) => {
    if (horizontallyAligned) {
      return `
      flex-direction: column;
      .group {
        border-right: none;
        border-bottom: 1px solid black;
      }
      .group:last-child {
        border-bottom: none;
      }
      `;
    }
    return `flex-direction: row`;
  }}
`;

export default withTheme(React.memo(ResponseBoxLayout));
