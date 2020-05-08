import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dropdown, Icon, Button, Avatar } from "antd";
import styled from "styled-components";
import { DragSource } from "react-dnd";
import { get } from "lodash";
import { lightBlue, white, themeColor, testTypeColor } from "@edulastic/colors";
import { roleuser } from "@edulastic/constants";
import { IconVisualization, IconTrash, IconCheckSmall, IconLeftArrow } from "@edulastic/icons";
import Tags from "../../src/components/common/Tags";
import {
  AssignmentContent,
  CustomIcon,
  ModuleDataName,
  ModuleAssignedUnit,
  AssignmentIconsHolder,
  AssignmentIcon,
  AssignmentButton
} from "./CurriculumModuleRow";
import { LTIResourceRow } from "./LTIResourceRow";
import { FlexContainer } from "@edulastic/common";
import { TestStatus } from "../../TestList/components/ViewModal/styled";

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

/** @extends Component<Props> */
class AssignmentDragItem extends Component {
  render() {
    const {
      moduleData,
      connectDragSource,
      menu,
      moreMenu,
      mode,
      isContentExpanded,
      hideEditOptions,
      assignTest,
      status,
      moduleIndex,
      viewTest,
      deleteTest,
      standardTags,
      isAssigned,
      assigned,
      isDragging,
      togglePlaylistTestDetails,
      showResource,
      userRole,
      urlHasUseThis
    } = this.props;
    const assignmentTestType = get(moduleData, "assignments.[0].testType", "");
    const _testType = get(moduleData, "testType", "");
    return connectDragSource(
      <div className="item" style={{ width: "100%" }}>
        <Assignment
          key={moduleData.contentId}
          data-cy="moduleAssignment"
          borderRadius="unset"
          boxShadow="unset"
          isDragging={isDragging}
        >
          {moduleData.contentType === "lti_resource" ? (
            <LTIResourceRow
              data={moduleData}
              mode={mode}
              urlHasUseThis
              deleteTest={deleteTest}
              moduleIndex={moduleIndex}
              showResource={showResource}
            />
          ) : (
            <>
              {/* <AssignmentPrefix>{moduleData.standards}</AssignmentPrefix> */}
              <WrapperContainer>
                <AssignmentContent expanded={isContentExpanded}>
                  {/* <Checkbox
                onChange={() => toggleUnitItem(moduleData.id)}
                checked={checkedUnitItems.indexOf(moduleData.id) !== -1}
                className="module-checkbox"
              /> */}
                  {/* <CustomIcon marginLeft={16}>
                <Icon type="right" style={{ color: "#707070" }} />
              </CustomIcon> */}
                  <FlexContainer>
                    <ModuleDataName
                      onClick={() => togglePlaylistTestDetails({ id: moduleData?.contentId })}
                      isDragging={isDragging}
                      isReview
                    >
                      {moduleData.contentTitle}
                    </ModuleDataName>

                    <CustomIcon marginLeft={10} marginRight={5}>
                      {urlHasUseThis && (!isAssigned || assignmentTestType === "practice") ? (
                        <Avatar size={18} style={{ backgroundColor: testTypeColor.practice, fontSize: "13px" }}>
                          {" P "}
                        </Avatar>
                      ) : (
                        <Avatar
                          size={18}
                          style={{
                            backgroundColor: testTypeColor[assignmentTestType] || testTypeColor[_testType],
                            fontSize: "13px"
                          }}
                        >
                          {get(assignmentTestType, "[0]", "").toUpperCase() ||
                            get(_testType, "[0]", "").toUpperCase() ||
                            null}
                        </Avatar>
                      )}
                    </CustomIcon>
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
                <FlexContainer width="100%" height="35px" alignItems="center" justifyContent="flex-start">
                  <Tags tags={standardTags} />
                  <TestStatus status={moduleData.status} view="tile" noMargin={!standardTags}>
                    {moduleData.status}
                  </TestStatus>
                </FlexContainer>
              </WrapperContainer>
              <AssignmentIconsHolder>
                <AssignmentIcon marginRight="10px">
                  <CustomIcon>
                    <IconVisualization
                      color={themeColor}
                      data-cy="view-test"
                      onClick={() => viewTest(moduleData.contentId)}
                    />
                  </CustomIcon>
                </AssignmentIcon>
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
                {(!hideEditOptions || mode === "embedded") && (
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
              </AssignmentIconsHolder>
            </>
          )}
        </Assignment>
      </div>
    );
  }
}
AssignmentDragItem.propTypes = {
  moduleData: PropTypes.object.isRequired,
  menu: PropTypes.any.isRequired,
  standardTags: PropTypes.array,
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
`;

const WrapperContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
