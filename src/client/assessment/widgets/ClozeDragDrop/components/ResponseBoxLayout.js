import React from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";

import { MathSpan, FlexContainer, DragDrop } from "@edulastic/common";
import { StyledResponseDiv } from "../styled/ResponseBox";
import { ChoiceItem, DragHandler } from "../../../components/ChoiceItem";
import { DropContainerTitle } from "../../../components/DropContainerTitle";
import { WithPopover as ResponseWithPopover } from "./WithPopover";

const { DragItem, DropContainer } = DragDrop;

const ResponseBoxLayout = ({
  smallSize,
  hasGroupResponses,
  responses,
  fontSize,
  dragHandler,
  onDrop,
  theme,
  containerPosition,
  dragItemStyle,
  getHeading
}) => {
  const horizontallyAligned = containerPosition === "left" || containerPosition === "right";

  const itemStyle = {
    ...dragItemStyle,
    fontSize: smallSize ? theme.widgets.clozeDragDrop.draggableBoxSmallFontSize : fontSize,
    fontWeight: smallSize
      ? theme.widgets.clozeDragDrop.draggableBoxSmallFontWeight
      : theme.widgets.clozeDragDrop.draggableBoxFontWeight,
    display: "flex",
    justifyContent: "center",
    width: horizontallyAligned ? "100%" : null
  };

  const containerStyle = {
    padding: smallSize ? "5px 10px" : 16,
    borderRadius: smallSize ? 0 : 10,
    display: "flex",
    flexDirection: horizontallyAligned ? "column" : "row",
    alignItems: horizontallyAligned || hasGroupResponses ? "center" : "flex-start",
    justifyContent: smallSize ? "space-around" : "flex-start"
  };

  return (
    <DropContainer drop={onDrop}>
      <StyledResponseDiv className="responses_box" style={containerStyle}>
        <FlexContainer flexDirection="column" width={hasGroupResponses ? "100%" : "auto"}>
          <DropContainerTitle>{getHeading("component.cloze.dragDrop.optionContainerHeading")}</DropContainerTitle>
          <FlexContainer
            flexDirection={horizontallyAligned ? "column" : "row"}
            flexWrap={horizontallyAligned ? "nowrap" : "wrap"}
            justifyContent={horizontallyAligned ? "center" : "flex-start"}
            alignItems="stretch"
          >
            {hasGroupResponses && (
              <GroupWrapper horizontallyAligned={horizontallyAligned}>
                {responses.map((groupResponse, index) => {
                  if (groupResponse !== null && typeof groupResponse === "object") {
                    return (
                      <div key={index} className="group">
                        <h3>{groupResponse.title}</h3>
                        {groupResponse.options &&
                          groupResponse.options.map(option => {
                            const { value, label = "" } = option;
                            return (
                              <DragItem id={`response-item-${index}`} key={value} data={`${value}_${index}`}>
                                <ResponseWithPopover
                                  showDragHandler={dragHandler}
                                  containerStyle={itemStyle}
                                  userAnswer={label}
                                />
                              </DragItem>
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
                const { label = "", value } = option;
                return (
                  <DragItem id={`response-item-${index}`} key={value} data={value}>
                    <ResponseWithPopover showDragHandler={dragHandler} containerStyle={itemStyle} userAnswer={label} />
                  </DragItem>
                );
              })}
          </FlexContainer>
        </FlexContainer>
      </StyledResponseDiv>
    </DropContainer>
  );
};

ResponseBoxLayout.propTypes = {
  responses: PropTypes.array,
  fontSize: PropTypes.string,
  hasGroupResponses: PropTypes.bool,
  smallSize: PropTypes.bool,
  dragHandler: PropTypes.bool,
  getHeading: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  dragItemStyle: PropTypes.object.isRequired,
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
