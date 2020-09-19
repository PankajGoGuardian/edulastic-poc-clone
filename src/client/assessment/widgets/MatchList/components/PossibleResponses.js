import React, { Fragment } from "react";
import styled from "styled-components";
import { FlexContainer, Subtitle, DragDrop } from "@edulastic/common";
import { StyledCorrectAnswersContainer } from "../styled/StyledCorrectAnswersContainer";
import DragItem from "./DragItem";
import DragItems from "./DragItems";
import { GroupsSeparator } from "../styled/GroupsSeparator";

const PossibleResponses = ({
  t,
  isPrintPreview,
  dragItems,
  onDrop,
  getStyles,
  disableResponse,
  groupPossibleResponses,
  possibleResponseGroups,
  groupedPossibleResponses,
  horizontallyAligned,
  dragItemMaxWidth,
  isAnswerModifiable,
  changePreviewTab,
  shuffleOptions,
  previewTab
}) => {
  const choicesBoxStyle = {
    width: isPrintPreview ? "100%" : horizontallyAligned ? null : 750,
    maxWidth: horizontallyAligned ? dragItemMaxWidth : null
  };

  const onDropHandler = ({ data }) => {
    onDrop(data, { flag: "dragItems" });
  };

  return (
    <StyledCorrectAnswersContainer
      className="__prevent-page-break"
      style={choicesBoxStyle}
      title={t("component.matchList.dragItemsTitle")}
    >
      <StyledDropContainer drop={onDropHandler} noBorder>
        <FlexContainer alignItems="stretch" justifyContent="flext-start" flexWrap="wrap" width="100%">
          {groupPossibleResponses ? (
            possibleResponseGroups.map((i, index) => (
              <Fragment key={index}>
                <FlexContainer
                  style={{ flex: 1 }}
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="flex-start"
                  width="100%"
                >
                  <StyledSubTitle>{i.title}</StyledSubTitle>
                  <FlexContainer
                    width="100%"
                    justifyContent="center"
                    flexWrap="wrap"
                    display={horizontallyAligned ? "inline-flex" : "flex"}
                    flexDirection={horizontallyAligned ? "column" : "row"}
                  >
                    {groupedPossibleResponses[index]?.map(
                      (ite, ind) =>
                        dragItems.find(_item => _item.value === ite.value) && ( // Here we should shuffle in place
                          <DragItem
                            flag="dragItems"
                            key={ind}
                            item={ite}
                            getStyles={getStyles}
                            disableResponse={disableResponse || !isAnswerModifiable}
                          />
                        )
                    )}
                  </FlexContainer>
                </FlexContainer>
                {index !== possibleResponseGroups.length - 1 && (
                  <GroupsSeparator horizontallyAligned={horizontallyAligned} />
                )}
              </Fragment>
            ))
          ) : (
            <Fragment>
              <FlexContainer flexDirection="column" alignItems="center" justifyContent="flex-start" maxWidth="100%">
                <FlexContainer
                  maxWidth="100%"
                  flexWrap="wrap"
                  justifyContent="center"
                  display={horizontallyAligned ? "inline-flex" : "flex"}
                  flexDirection={horizontallyAligned ? "column" : "row"}
                  alignItems={horizontallyAligned ? "baseline" : "center"}
                >
                  <DragItems
                    dragItems={dragItems}
                    getStyles={getStyles}
                    disableResponse={disableResponse || !isAnswerModifiable}
                    changePreviewTab={changePreviewTab}
                    shuffleOptions={shuffleOptions}
                    previewTab={previewTab}
                  />
                </FlexContainer>
              </FlexContainer>
            </Fragment>
          )}
        </FlexContainer>
      </StyledDropContainer>
    </StyledCorrectAnswersContainer>
  );
};

export default PossibleResponses;

const StyledSubTitle = styled(Subtitle)`
  color: ${({ theme }) => theme.widgets.matchList.previewSubtitleColor};
`;

const StyledDropContainer = styled(DragDrop.DropContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding-left: 20px;
  border-radius: 4px;
  min-height: 50px;
`;
