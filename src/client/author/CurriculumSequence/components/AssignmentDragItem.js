import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { desktopWidth, lightBlue, white, themeColor } from "@edulastic/colors";
import { DragSource } from "react-dnd";
import { FlexContainer } from "@edulastic/common";
import { AssignmentContent, CustomIcon, ModuleDataName, ModuleAssignedUnit } from "./CurriculumModuleRow";
import { PlaylistResourceRow, SubResource } from "./PlaylistResourceRow";

const itemSource = {
  beginDrag(props) {
    const { moduleData, onBeginDrag, moduleIndex, contentIndex } = props;
    onBeginDrag({ fromModuleIndex: moduleIndex, fromContentId: moduleData.contentId, contentIndex });
    return { moduleData };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

/** @extends Component<Props> */
class AssignmentDragItem extends Component {
  render() {
    const {
      moduleData,
      connectDragSource,
      mode,
      isContentExpanded,
      hideEditOptions,
      moduleIndex,
      deleteTest,
      isDragging,
      togglePlaylistTestDetails,
      showResource,
      urlHasUseThis,
      assessmentColums,
      testTypeAndTags,
      isDesktop,
      isManageContentActive,
      setEmbeddedVideoPreviewModal,
      id
    } = this.props;
    const isTestType = moduleData.contentType === "test";

    return connectDragSource(
      <div className="item" style={{ width: "calc(100% - 35px)" }}>
        <Assignment
          key={moduleData.contentId}
          data-cy="moduleAssignment"
          borderRadius="unset"
          boxShadow="unset"
          isDragging={isDragging}
        >
          {!isTestType && (
            <PlaylistResourceRow
              data={moduleData}
              mode={mode}
              urlHasUseThis
              deleteTest={deleteTest}
              moduleIndex={moduleIndex}
              showResource={showResource}
              itemIndex={id}
              isManageContentActive={isManageContentActive}
              setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
            />
          )}
          {isTestType && (
            <Fragment>
              <WrapperContainer urlHasUseThis={urlHasUseThis} style={{ width: isDesktop ? "" : "100%" }}>
                <AssignmentContent expanded={isContentExpanded}>
                  <FlexContainer>
                    <ModuleDataName
                      onClick={() => togglePlaylistTestDetails({ id: moduleData?.contentId })}
                      isDragging={isDragging}
                      isReview
                    >
                      <span>{moduleData.contentTitle}</span>
                    </ModuleDataName>
                  </FlexContainer>
                </AssignmentContent>
                {!hideEditOptions && (
                  <ModuleAssignedUnit>
                    {moduleData.assigned && !moduleData.completed && (
                      <CustomIcon>
                        <img src={assessmentRed} alt="Module item is assigned" />
                      </CustomIcon>
                    )}
                    {moduleData.completed && (
                      <CustomIcon>
                        <img src={assessmentGreen} alt="Module item is completed" />
                      </CustomIcon>
                    )}
                  </ModuleAssignedUnit>
                )}
                {testTypeAndTags}
              </WrapperContainer>
              {assessmentColums}
            </Fragment>
          )}
        </Assignment>
        <SubResource
          data={moduleData}
          mode={mode}
          urlHasUseThis
          deleteTest={deleteTest}
          moduleIndex={moduleIndex}
          itemIndex={id}
          isTestType={isTestType}
          showResource={showResource}
          isManageContentActive={isManageContentActive}
          setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
        />
      </div>
    );
  }
}
AssignmentDragItem.propTypes = {
  moduleData: PropTypes.object.isRequired,
  connectDragSource: PropTypes.any.isRequired
};

export default DragSource("item", itemSource, collect)(AssignmentDragItem);

const Visualize = styled.span`
  border-radius: 4px;
  margin-left: 20px;
  justify-self: flex-end;
  min-width: 19px;
  cursor: pointer;
`;

Visualize.displayName = "Visualize";

const UnitIcon = styled.span`
  border-radius: 4px;
  margin-left: auto;
  min-width: 19px;
  display: flex;
  justify-content: center;
  transition: 0.3s transform;
  transform: ${({ rotated }) => (rotated ? "rotate(-90deg)" : "rotate(0deg)")};
  cursor: pointer;
`;
UnitIcon.displayName = "UnitIcon";

const Row = styled.div`
  background: ${white};
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 10px;
  padding-right: 10px;
  box-shadow: none;
`;

const Module = styled.div`
  font-size: 13px;
  font-weight: 600;
  border-top: 1px solid ${lightBlue};
`;
Module.displayName = "SelectContentRowModule";

const Assignment = styled(Row)`
  display: flex;
  align-items: center;
  border: 0;
  cursor: grab;
  border-radius: 0;
  padding: 10px 0px;
  background: ${({ isDragging }) => (isDragging ? themeColor : white)};

  @media (max-width: ${desktopWidth}) {
    flex-direction: column;
    position: relative;
    justify-content: flex-end;
  }
`;

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
