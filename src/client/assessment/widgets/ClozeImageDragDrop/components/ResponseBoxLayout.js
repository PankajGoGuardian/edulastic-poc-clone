import React from "react";
import PropTypes from "prop-types";
import { MathSpan, FlexContainer, DragDrop, DragDropInnerContainer } from "@edulastic/common";
import { StyledResponseDiv } from "../../ClozeDragDrop/styled/ResponseBox";
import { ChoiceItem, DragHandler } from "../../../components/ChoiceItem";
import { DropContainerTitle } from "../../../components/DropContainerTitle";

const { DragItem, DropContainer } = DragDrop;

const ResponseBoxLayout = ({
  smallSize,
  responses,
  fontSize,
  dragHandler,
  onDrop,
  transparentResponses,
  responseContainerPosition,
  getHeading,
  choiceStyle,
  isPrintMode
}) => {
  const horizontallyAligned = responseContainerPosition === "left" || responseContainerPosition === "right";
  const itemStyle = {
    ...choiceStyle,
    fontSize: smallSize ? 10 : fontSize
  };

  const containerStyle = {
    height: horizontallyAligned && "100%",
    padding: smallSize ? "5px 10px" : horizontallyAligned ? 10 : 16
  };
  
  return (
    <DropContainer drop={onDrop} style={{ height: horizontallyAligned && "100%", border: "none" }}>
      <StyledResponseDiv className="responses_box" data-cy="responses-box" style={containerStyle}>
        <FlexContainer flexDirection="column" style={isPrintMode ? { width: "100%" } : {}}>
          <DropContainerTitle>{getHeading("component.cloze.dragDrop.optionContainerHeading")}</DropContainerTitle>
          <DragDropInnerContainer>
            <FlexContainer
              justifyContent="flex-start"
              flexDirection={isPrintMode ? "column" : horizontallyAligned ? "column" : "row"}
              flexWrap="wrap"
            >
              {responses.map((option = "", index) => (
                <DragItem
                  id={`response-item-${index}`}
                  key={`response-item-${index}`}
                  data={{ option, fromRespIndex: index }}
                  size={{ width: choiceStyle.widthpx, height: choiceStyle.heightpx }}
                >
                  <ChoiceItem
                    style={itemStyle}
                    className={transparentResponses ? "draggable_box_transparent" : "draggable_box"}
                  >
                    {dragHandler && <DragHandler />}
                    <MathSpan dangerouslySetInnerHTML={{ __html: option.value }} />
                  </ChoiceItem>
                </DragItem>
              ))}
            </FlexContainer>
          </DragDropInnerContainer>
        </FlexContainer>
      </StyledResponseDiv>
    </DropContainer>
  );
};

ResponseBoxLayout.propTypes = {
  responses: PropTypes.array,
  fontSize: PropTypes.string,
  choiceStyle: PropTypes.object.isRequired,
  onDrop: PropTypes.func.isRequired,
  getHeading: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  dragHandler: PropTypes.bool,
  transparentResponses: PropTypes.bool,
  responseContainerPosition: PropTypes.string,
  isPrintMode: PropTypes.bool
};

ResponseBoxLayout.defaultProps = {
  responses: [],
  fontSize: "13px",
  smallSize: false,
  dragHandler: false,
  transparentResponses: false,
  responseContainerPosition: "bottom",
  isPrintMode: false
};

export default React.memo(ResponseBoxLayout);
