import React, { Fragment } from "react";
import { get } from "lodash";
import { DragDrop, FlexContainer, Subtitle } from "@edulastic/common";
import styled from "styled-components";
import ChoiceContainer from "./ChoiceContainer";
import DragItem from "./DragItem";
import { Separator } from "../styled/Separator";

import { getStemNumeration } from "../../../utils/helpers";

const ChoiceBoxes = ({
  t,
  item,
  onDrop,
  direction,
  isVertical,
  stemNumeration,
  dragItemProps,
  dragItemMaxWidth,
  disableResponse,
  isAnswerModifiable,
  possibleResponses,
  verifiedDragItems,
  possibleResponseGroups,
  groupPossibleResponses,
  verifiedGroupDragItems
}) => {
  const onDropHandler = ({ data }) => {
    onDrop(data, { flag: "dragItems" });
  };

  return (
    <ChoiceContainer
      direction={direction}
      choiceWidth={dragItemMaxWidth}
      title={t("component.classification.dragItemsTitle")}
    >
      <DropContainer drop={onDropHandler} isVertical={isVertical}>
        <FlexContainer
          style={{ width: "100%" }}
          flexDirection="column"
          alignItems="stretch"
          justifyContent="center"
          maxWidth="100%"
        >
          {groupPossibleResponses ? (
            verifiedGroupDragItems.map((i, index) => (
              <Fragment key={index}>
                <FlexContainer
                  style={{ flex: 1 }}
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="flex-start"
                  maxWidth="100%"
                >
                  <Subtitle>{get(item, `possibleResponseGroups[${index}].title`, "")}</Subtitle>
                  <FlexContainer className="choice-items-wrapper">
                    {i.map((ite, ind) => (
                      <DragItem
                        {...dragItemProps}
                        renderIndex={getStemNumeration(stemNumeration, ind)}
                        item={ite.value}
                        key={ite.id}
                      />
                    ))}
                  </FlexContainer>
                </FlexContainer>
                {index !== possibleResponseGroups.length - 1 && <Separator />}
              </Fragment>
            ))
          ) : (
            <Fragment>
              <FlexContainer
                style={{ flex: 1 }}
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start"
                maxWidth="100%"
              >
                <FlexContainer className="choice-items-wrapper">
                  {verifiedDragItems.map(ite => (
                    <DragItem
                      {...dragItemProps}
                      key={ite.id}
                      item={ite.value}
                      renderIndex={possibleResponses.indexOf(ite)}
                      disableResponse={disableResponse || !isAnswerModifiable}
                    />
                  ))}
                </FlexContainer>
              </FlexContainer>
            </Fragment>
          )}
        </FlexContainer>
      </DropContainer>
    </ChoiceContainer>
  );
};

export default ChoiceBoxes;

const DropContainer = styled(DragDrop.DropContainer)`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: ${({ isVertical }) => (isVertical ? "140px" : "50px")};
  border-radius: 4px;
`;
