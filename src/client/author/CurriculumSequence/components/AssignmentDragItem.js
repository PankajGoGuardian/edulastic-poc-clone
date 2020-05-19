import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Dropdown, Button } from "antd";
import styled from "styled-components";
import { desktopWidth, lightBlue, white, themeColor } from "@edulastic/colors";
import { DragSource, useDrop } from "react-dnd";
import { roleuser } from "@edulastic/constants";
import { IconTrash, IconCheckSmall, IconLeftArrow, IconMoreVertical } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";
import {
  AssignmentContent,
  CustomIcon,
  ModuleDataName,
  ModuleAssignedUnit,
  AssignmentIcon,
  AssignmentButton,
  LastColumn
} from "./CurriculumModuleRow";
import { HideLinkLabel } from "../../Reports/common/styled";
import { PlaylistResourceRow, SubResource } from "./PlaylistResourceRow";

/**
 * @typedef Props
 * @property {Object} moduleData
 * @property {boolean} checked
 * @property {Component} menu
 */

const IS_ASSIGNED = "ASSIGNED";
const NOT_ASSIGNED = "ASSIGN";

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

function SubResourceDropContainer({ children, ...props }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: "item",
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      contentType: monitor.getItem()?.contentType
    }),
    drop: item => {
      const { moduleIndex, itemIndex, addSubresource } = props;
      addSubresource({ moduleIndex, itemIndex, item });
    }
  });

  return (
    <SupportResourceDropTarget {...props} ref={dropRef} active={isOver}>
      {children}
    </SupportResourceDropTarget>
  );
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
      assignTest,
      status,
      moduleIndex,
      deleteTest,
      isAssigned,
      isDragging,
      togglePlaylistTestDetails,
      showResource,
      userRole,
      urlHasUseThis,
      infoColumn,
      testTypeAndTags,
      isDesktop,
      isStudent,
      showRightPanel,
      toggleTest,
      isManageContentActive,
      setEmbeddedVideoPreviewModal,
      showSupportingResource,
      addSubresource,
      id
    } = this.props;
    const assessmentActions = !isStudent && (
      <>
        <HideLinkLabel onClick={toggleTest} textColor={themeColor} fontWeight="Bold">
          {moduleData.hidden ? "SHOW" : "HIDE"}
        </HideLinkLabel>
        <LastColumn>
          {(!hideEditOptions || (status === "published" && mode === "embedded")) &&
            userRole !== roleuser.EDULASTIC_CURATOR && (
              <AssignmentButton assigned={isAssigned}>
                <Button data-cy="assignButton" onClick={() => assignTest(moduleIndex, moduleData.contentId)}>
                  {isAssigned ? (
                    <IconCheckSmall color={white} />
                  ) : (
                    <IconLeftArrow color={themeColor} width={13.3} height={9.35} />
                  )}
                  {isAssigned ? IS_ASSIGNED : NOT_ASSIGNED}
                </Button>
              </AssignmentButton>
            )}
          {/* {(!hideEditOptions || mode === "embedded") && (
          <AssignmentIcon>
            <Dropdown overlay={moreMenu} trigger={["click"]}>
              <CustomIcon data-cy="assignmentMoreOptionsIcon" marginLeft={25} marginRight={1}>
                <IconMoreVertical color={themeColor} />
              </CustomIcon>
            </Dropdown>
          </AssignmentIcon>
        )} */}
          {(!hideEditOptions || mode === "embedded") && isManageContentActive && (
            <AssignmentIcon>
              <CustomIcon
                data-cy="assignmentDeleteOptionsIcon"
                onClick={e => {
                  e.stopPropagation();
                  deleteTest(moduleIndex, moduleData.contentId);
                }}
              >
                <IconTrash color={themeColor} />
              </CustomIcon>
            </AssignmentIcon>
          )}
        </LastColumn>
      </>
    );

    return connectDragSource(
      <div className="item" style={{ width: "calc(100% - 35px)" }}>
        <Assignment
          key={moduleData.contentId}
          data-cy="moduleAssignment"
          borderRadius="unset"
          boxShadow="unset"
          isDragging={isDragging}
        >
          {moduleData.contentType !== "test" ? (
            <PlaylistResourceRow
              data={moduleData}
              mode={mode}
              urlHasUseThis
              deleteTest={deleteTest}
              moduleIndex={moduleIndex}
              showResource={showResource}
              itemIndex={id}
              setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
            />
          ) : (
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
                {(showRightPanel || !isDesktop) && testTypeAndTags}
                <FlexContainer width="100%" height="35px" alignItems="center" justifyContent="flex-start">
                  {moduleData.contentType === "test" && showSupportingResource && (
                    <SubResourceDropContainer moduleIndex={moduleIndex} addSubresource={addSubresource} itemIndex={id}>
                      Supporting Resource
                    </SubResourceDropContainer>
                  )}
                </FlexContainer>
                {moduleData?.resources?.length > 0 && (
                  <SubResource
                    data={moduleData}
                    mode={mode}
                    urlHasUseThis
                    deleteTest={deleteTest}
                    moduleIndex={moduleIndex}
                    itemIndex={id}
                    showResource={showResource}
                    setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
                  />
                )}
              </WrapperContainer>
              {!showRightPanel && isDesktop && testTypeAndTags}
              {infoColumn}
              {isDesktop && assessmentActions}
              {!isDesktop && (
                <Dropdown overlay={assessmentActions} trigger={["click"]}>
                  <MobileActionButton>
                    <IconMoreVertical color={themeColor} />
                  </MobileActionButton>
                </Dropdown>
              )}
            </Fragment>
          )}
        </Assignment>
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

export const SupportResourceDropTarget = styled.span`
  display: inline-block;
  height: 22px;
  margin-left: 12px;
  box-sizing: border-box;
  border-radius: 5px;
  padding-left: 15px;
  padding-right: 15px;
  line-height: 22px;

  background-image: linear-gradient(90deg, ${themeColor} 40%, transparent 60%),
    linear-gradient(90deg, ${themeColor} 40%, transparent 60%),
    linear-gradient(0deg, ${themeColor} 40%, transparent 60%), linear-gradient(0deg, ${themeColor} 40%, transparent 60%);
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-size: 15px 2px, 15px 2px, 2px 15px, 2px 15px;
  background-position: left top, right bottom, left bottom, right top;
  ${props => (props?.active ? ` animation: border-dance 1s infinite linear;` : "")}

  @keyframes border-dance {
    0% {
      background-position: left top, right bottom, left bottom, right top;
    }
    100% {
      background-position: left 15px top, right 15px bottom, left bottom 15px, right top 15px;
    }
  }
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

const MobileActionButton = styled.div`
  width: 30px;
  height: 30px;
  right: 0px;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
`;
