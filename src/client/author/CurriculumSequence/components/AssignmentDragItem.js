import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dropdown, Icon, Button } from "antd";
import styled from "styled-components";
import { DragSource } from "react-dnd";
import { lightBlue, white, themeColor } from "@edulastic/colors";
import { IconVisualization, IconTrash, IconCheckSmall, IconLeftArrow } from "@edulastic/icons";
import Tags from "../../src/components/common/Tags";
import { matchAssigned } from "../util";
import {
  AssignmentContent,
  CustomIcon,
  ModuleDataName,
  ModuleAssignedUnit,
  AssignmentIconsHolder,
  AssignmentIcon,
  AssignmentButton
} from "./CurriculumModuleRow";

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
      isDragging
    } = this.props;

    return connectDragSource(
      <div className="item" style={{ width: "100%" }}>
        <Assignment
          key={moduleData.contentId}
          data-cy="moduleAssignment"
          padding="14px 30px 14px 20px"
          borderRadius="unset"
          boxShadow="unset"
        >
          {/* <AssignmentPrefix>{moduleData.standards}</AssignmentPrefix> */}
          <AssignmentContent expanded={isContentExpanded}>
            {/* <Checkbox
              onChange={() => toggleUnitItem(moduleData.id)}
              checked={checkedUnitItems.indexOf(moduleData.id) !== -1}
              className="module-checkbox"
            /> */}
            <CustomIcon marginLeft={16}>
              <Icon type="right" style={{ color: "#707070" }} />
            </CustomIcon>
            <ModuleDataName>{moduleData.contentTitle}</ModuleDataName>
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
          <Tags tags={standardTags} />
          <AssignmentIconsHolder>
            <AssignmentIcon>
              <CustomIcon>
                <IconVisualization color={themeColor} onClick={() => viewTest(moduleData.contentId)} />
              </CustomIcon>
            </AssignmentIcon>
            {(!hideEditOptions || (status === "published" && mode === "embedded")) && (
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

const AssignContent = styled.div`
  border-radius: 4px;
  margin-left: 20px;
  justify-self: flex-end;
  min-width: 19px;
  cursor: pointer;
`;

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
  padding-left: 20px;
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
  padding-top: 10px;
  padding-bottom: 10px;
`;
