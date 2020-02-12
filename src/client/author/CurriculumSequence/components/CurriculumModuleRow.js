/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button, Menu, Dropdown, Icon, Modal, Tag, Col, message } from "antd";
import {
  mobileWidth,
  white,
  desktopWidth,
  tabletWidth,
  greenThird,
  extraDesktopWidth,
  mainBgColor,
  textColor,
  themeColor
} from "@edulastic/colors";
import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";
import { IconVerified, IconVisualization, IconCheckSmall, IconMoreVertical, IconLeftArrow } from "@edulastic/icons";
import { toggleCheckedUnitItemAction, setSelectedItemsForAssignAction, removeUnitAction } from "../ducks";
import assessmentRed from "../assets/assessment.svg";
import assessmentGreen from "../assets/concept-check.svg";
import Tags from "../../src/components/common/Tags";
import { FaBars } from "react-icons/fa";

import AssessmentPlayer from "../../../assessment";
import { removeTestFromModuleAction } from "../../PlaylistPage/ducks";
import AssignmentDragItem from "./AssignmentDragItem";
import { Tooltip } from "../../../common/utils/helpers.js";
import presentationIcon from "../../Assignments/assets/presentation.svg";
import additemsIcon from "../../Assignments/assets/add-items.svg";
import piechartIcon from "../../Assignments/assets/pie-chart.svg";
/**
 * @typedef {object} Props
 * @property {import('./CurriculumSequence').Module} module
 * @property {function} onCollapseExpand
 * @property {function} toggleUnitItem
 * @property {boolean} collapsed
 * @property {string[]} checkedUnitItems
 * @property {boolean} isContentExpanded
 * @property {any[]} assigned
 * @property {function} setSelectedItemsForAssign
 * @property {function} removeItemFromUnit
 * @property {function} removeUnit
 * @property {boolean} padding
 * set module item that will be assigned, also
 * when there's more than 0 elements set, modal for assignment will be shown
 * when empty array is set, modal is hidden
 */

const IS_ASSIGNED = "ASSIGNED";
const NOT_ASSIGNED = "ASSIGN";

const SortableHOC = sortableContainer(({ children }) => <div onClick={e => e.stopPropagation()}>{children}</div>);

const SortableContainer = props =>
  props.mode === "embedded" ? <SortableHOC {...props}>{props.children}</SortableHOC> : <div>{props.children}</div>;

const SortableHandle = sortableHandle(() => (
  <DragHandle>
    <FaBars />
  </DragHandle>
));

const SortableElement = sortableElement(props => {
  const {
    moduleData,
    id,
    isContentExpanded,
    hideEditOptions,
    assignTest,
    mode,
    assigned,
    moreMenu,
    menu,
    standardTags,
    status,
    isAssigned,
    viewTest,
    deleteTest,
    moduleIndex,
    dropContent,
    onBeginDrag
  } = props;
  return (
    <AssignmentDragItemContainer>
      <SortableHandle />
      <AssignmentDragItem
        key={`${id}-${moduleData.id}`}
        moduleData={moduleData}
        isContentExpanded={isContentExpanded}
        hideEditOptions={hideEditOptions}
        assignTest={assignTest}
        mode={mode}
        assigned={assigned}
        moreMenu={moreMenu}
        menu={menu}
        standardTags={standardTags}
        status={status}
        contentIndex={id}
        isAssigned={isAssigned}
        viewTest={viewTest}
        deleteTest={deleteTest}
        moduleIndex={moduleIndex}
        handleDrop={dropContent}
        onBeginDrag={onBeginDrag}
        onClick={e => e.stopPropagation()}
      />
    </AssignmentDragItemContainer>
  );
});

/** @extends Component<Props> */
class ModuleRow extends Component {
  state = {
    showModal: false,
    selectedTest: "",
    currentAssignmentId: []
  };

  /**
   * @param {import('./CurriculumSequence').Module} module
   */
  assignModule = module => {
    const { setSelectedItemsForAssign, history, playlistId } = this.props;
    const moduleItemsIds = module.data.map(item => item.contentId);
    setSelectedItemsForAssign(moduleItemsIds);
    history.push(`/author/playlists/assignments/${playlistId}/${module._id}`);
  };

  assignTest = (moduleId, testId) => {
    const { history, playlistId, location } = this.props;
    history.push({
      pathname: `/author/playlists/assignments/${playlistId}/${moduleId}/${testId}`,
      state: location.state
    });
  };

  viewTest = testId => {
    this.setState({
      showModal: true,
      selectedTest: testId
    });
  };

  deleteTest = (moduleIndex, itemId) => {
    const { removeItemFromUnit } = this.props;
    removeItemFromUnit({ moduleIndex, itemId });
  };

  closeModal = () => {
    this.setState({
      showModal: false
    });
  };

  handleActionClick = (e, destinaion, assignmentId, classId) => {
    e.preventDefault();
    e.stopPropagation();
    const { history } = this.props;
    history.push({
      pathname: `/author/${destinaion}/${assignmentId}/${classId}`
    });
  };

  setAssignmentDropdown = id => {
    const { currentAssignmentId } = this.state;
    if (currentAssignmentId.includes(id)) {
      const prevState = [...currentAssignmentId];
      prevState.splice(currentAssignmentId.find(x => x === id), 1);
      this.setState({ currentAssignmentId: prevState });
    } else {
      const newAssignmentIds = currentAssignmentId.concat(id);
      this.setState({ currentAssignmentId: newAssignmentIds });
    }
  };

  render() {
    const {
      onCollapseExpand,
      collapsed,
      padding,
      assigned,
      status,
      isContentExpanded,
      module,
      moduleIndex,
      mode,
      dropContent,
      onBeginDrag,
      hideEditOptions,
      curriculum,
      moduleStatus,
      handleRemove,
      removeUnit,
      handleTestsSort,
      urlHasUseThis
    } = this.props;
    const { title, _id, data = [], description = "" } = module;
    const completed = moduleStatus;
    const { assignModule, assignTest } = this;

    const totalAssigned = data.length;
    const numberOfAssigned = data.filter(content => content.assignments && content.assignments.length > 0).length;
    const { showModal, selectedTest, currentAssignmentId } = this.state;

    const statusBg = {
      "IN PROGRESS": "#5AABEB",
      "IN GRADING": "#F9942D",
      "NOT OPEN": "#95B0CD",
      DONE: themeColor
    };

    const menu = (
      <Menu data-cy="addContentMenu">
        {curriculum.modules.map(moduleItem => (
          <Menu.Item data-cy="addContentMenuItem">
            <span>{moduleItem.title}</span>
          </Menu.Item>
        ))}
        <Menu.Item data-cy="addContentMenuItemAssignNow">
          <span>Assign Now</span>
        </Menu.Item>
      </Menu>
    );
    return (
      <React.Fragment>
        <ModalWrapper
          footer={null}
          visible={showModal}
          onCancel={this.closeModal}
          width="100%"
          height="100%"
          destroyOnClose
        >
          <AssessmentPlayer testId={selectedTest} preview closeTestPreviewModal={this.closeModal} />
        </ModalWrapper>
        <ModuleWrapper
          data-cy="curriculumModuleRow"
          key={`${data.length}-${module.id}`}
          padding={padding}
          onClick={() => onCollapseExpand(moduleIndex)}
        >
          <Container>
            <Module>
              <ModuleHeader
                collapsed={collapsed}
                padding="17px 25px 16px 27px"
                borderRadius={collapsed ? "5px" : "unset"}
                boxShadow={collapsed ? "0 3px 7px 0 rgba(0, 0, 0, 0.1)" : "unset"}
              >
                <ModuleInfo>
                  <CustomIcon marginRight="25" marginLeft={7}>
                    {!collapsed ? (
                      <Icon type="up" style={{ color: "#707070" }} />
                    ) : (
                      <Icon type="down" style={{ color: "#707070" }} />
                    )}
                  </CustomIcon>
                  <ModuleTitleAssignedWrapper>
                    <Col span={16}>
                      <ModuleHelperText fontSize="14px">{`Module ${moduleIndex + 1}`}</ModuleHelperText>
                      <ModuleTitleWrapper>
                        <ModuleTitle>{title}</ModuleTitle>
                        <ModuleTitlePrefix>
                          {!hideEditOptions && (
                            <Icon
                              type="close-circle"
                              data-cy="removeUnit"
                              style={{ visibility: "hidden" }}
                              onClick={() => removeUnit(module.id)}
                            />
                          )}
                        </ModuleTitlePrefix>
                      </ModuleTitleWrapper>
                      <ModuleHelperText fontSize="12px">{description}</ModuleHelperText>
                    </Col>

                    {completed && !hideEditOptions && (
                      <React.Fragment>
                        <ModuleCompleted>
                          <ModuleCompletedLabel>MODULE COMPLETED</ModuleCompletedLabel>
                          <ModuleCompletedIcon>
                            <CustomIcon>
                              <IconVerified color={greenThird} />
                            </CustomIcon>
                          </ModuleCompletedIcon>
                        </ModuleCompleted>
                      </React.Fragment>
                    )}
                    {!completed && !hideEditOptions && (
                      <ModulesWrapper>
                        {totalAssigned ? (
                          <>
                            <ModulesAssigned>
                              Assigned
                              <NumberOfAssigned data-cy="numberOfAssigned">{numberOfAssigned}</NumberOfAssigned>
                              of
                              <TotalAssigned data-cy="totalAssigned">{totalAssigned}</TotalAssigned>
                            </ModulesAssigned>
                            <AssignModuleButton>
                              <Button ghost data-cy="AssignWholeModule" onClick={() => assignModule(module)}>
                                {numberOfAssigned === totalAssigned ? "MODULE ASSIGNED" : "ASSIGN MODULE"}
                              </Button>
                            </AssignModuleButton>
                          </>
                        ) : (
                          <Tag color={themeColor} onClick={event => event.stopPropagation()}>
                            NO ASSIGNMENTS
                          </Tag>
                        )}
                      </ModulesWrapper>
                    )}
                  </ModuleTitleAssignedWrapper>
                </ModuleInfo>
              </ModuleHeader>
              {!collapsed && (
                // eslint-disable-next-line
                <SortableContainer
                  mode={mode}
                  lockAxis="y"
                  lockOffset={["0%", "0%"]}
                  onSortEnd={handleTestsSort}
                  lockToContainerEdges
                  useDragHandle
                >
                  {data.map((moduleData, index) => {
                    const { standards, assignments = [] } = moduleData;
                    const standardTags = (standards && standards.map(stand => stand.name)) || [];
                    const statusList = assignments.flatMap(item => item.class || []).flatMap(item => item.status || []);
                    const contentCompleted =
                      statusList.filter(_status => _status === "DONE").length === statusList.length &&
                      statusList.length > 0;
                    const isAssigned = assignments.length > 0;

                    const assignmentRows = assignments.flatMap(assignment => {
                      const { testType, _id: assignmentId } = assignment;
                      return assignment.class.map(
                        ({
                          name,
                          status,
                          assignedCount,
                          inProgressNumber,
                          inGradingNumber,
                          autoSubmitPicked,
                          _id: classId,
                          gradedNumber = 0
                        }) => ({
                          name,
                          status,
                          assignedCount,
                          inProgressNumber,
                          inGradingNumber,
                          testType,
                          autoSubmitPicked,
                          assignmentId,
                          classId,
                          gradedNumber,
                          submittedCount: inGradingNumber + autoSubmitPicked + gradedNumber
                        })
                      );
                    });

                    const moreMenu = (
                      <Menu data-cy="moduleItemMoreMenu">
                        <Menu.Item onClick={() => assignTest(_id, moduleData.contentId)}>Assign Test</Menu.Item>
                        {isAssigned && (
                          <Menu.Item>
                            <Link to="/author/assignments">View Assignments</Link>
                          </Menu.Item>
                        )}
                        <Menu.Item onClick={() => this.viewTest(moduleData.contentId)}>Preview Test</Menu.Item>
                        {/* <Menu.Item
                          data-cy="moduleItemMoreMenuItem"
                          onClick={() => handleRemove(moduleIndex, moduleData.contentId)}
                        >
                          Remove
                        </Menu.Item> */}
                      </Menu>
                    );

                    if (mode === "embedded") {
                      return (
                        <SortableElement
                          moduleData={moduleData}
                          index={index}
                          id={index}
                          menu={menu}
                          dropContent={dropContent}
                          moreMenu={moreMenu}
                          isAssigned={isAssigned}
                          standardTags={standardTags}
                          assignTest={this.assignTest}
                          viewTest={this.viewTest}
                          deleteTest={this.deleteTest}
                          onClick={e => e.stopPropagation()}
                          {...this.props}
                        />
                      );
                    }

                    return (
                      <>
                        <Assignment
                          data-cy="moduleAssignment"
                          key={moduleData.contentId}
                          padding="14px 30px 14px 50px"
                          borderRadius="unset"
                          boxShadow="unset"
                          onClick={e => {
                            e?.preventDefault?.();
                            e?.stopPropagation?.();
                          }}
                        >
                          <ModuleFocused />
                          <AssignmentInnerWrapper>
                            <AssignmentContent expanded={isContentExpanded}>
                              {/* <Checkbox
                            onChange={() => toggleUnitItem(moduleData.id)}
                            checked={checkedUnitItems.indexOf(moduleData.id) !== -1}
                            className="module-checkbox"
                          /> */}
                              <CustomIcon marginLeft={16}>
                                <Icon type="right" style={{ color: "#707070" }} />
                              </CustomIcon>
                              {isAssigned ? (
                                <ModuleDataName>{moduleData.contentTitle}</ModuleDataName>
                              ) : (
                                <ModuleDataName
                                  onClick={() => message.warning("Test is not yet assigned to any class(es)")}
                                >
                                  {moduleData.contentTitle}
                                </ModuleDataName>
                              )}
                            </AssignmentContent>
                            <AssignmentIconsWrapper expanded={isContentExpanded}>
                              {!hideEditOptions && (
                                <ModuleAssignedUnit>
                                  {moduleData.assigned && !moduleData.completed && (
                                    <CustomIcon>
                                      <img src={assessmentRed} alt="Module item is assigned" />
                                    </CustomIcon>
                                  )}
                                  {contentCompleted && (
                                    <CustomIcon>
                                      <img src={assessmentGreen} alt="Content is completed" />
                                    </CustomIcon>
                                  )}
                                </ModuleAssignedUnit>
                              )}
                              <Tags
                                tags={moduleData.standardIdentifiers}
                                completed={!hideEditOptions && contentCompleted}
                                show={3}
                                isPlaylist
                              />
                              <AssignmentIconsHolder>
                                <AssignmentIcon>
                                  <CustomIcon>
                                    <IconVisualization
                                      color={themeColor}
                                      onClick={() => this.viewTest(moduleData.contentId)}
                                    />
                                  </CustomIcon>
                                </AssignmentIcon>

                                {((isAssigned && !hideEditOptions) ||
                                  (status === "published" && mode === "embedded")) && (
                                  <AssignmentButton assigned={!isAssigned} margin="0 15px 0 0">
                                    <Button onClick={() => this.setAssignmentDropdown(moduleData.contentId)}>
                                      {currentAssignmentId.includes(moduleData.contentId)
                                        ? "HIDE ASSIGNMENTS"
                                        : "SHOW ASSIGNMENTS"}
                                    </Button>
                                  </AssignmentButton>
                                )}

                                {(!hideEditOptions || (status === "published" && mode === "embedded")) && (
                                  <AssignmentButton assigned={isAssigned}>
                                    <Button
                                      data-cy="assignButton"
                                      onClick={() => assignTest(_id, moduleData.contentId)}
                                    >
                                      {isAssigned ? (
                                        <IconCheckSmall color={white} />
                                      ) : (
                                        <IconLeftArrow width={13.3} height={9.35} />
                                      )}
                                      {isAssigned ? IS_ASSIGNED : NOT_ASSIGNED}
                                    </Button>
                                  </AssignmentButton>
                                )}
                                {mode === "embedded" ||
                                  (urlHasUseThis && (
                                    <AssignmentIcon>
                                      <Dropdown overlay={moreMenu} trigger={["click"]}>
                                        <CustomIcon data-cy="assignmentMoreOptionsIcon" marginLeft={25} marginRight={1}>
                                          <IconMoreVertical color={themeColor} />
                                        </CustomIcon>
                                      </Dropdown>
                                    </AssignmentIcon>
                                  ))}
                              </AssignmentIconsHolder>
                            </AssignmentIconsWrapper>
                          </AssignmentInnerWrapper>
                        </Assignment>
                        <AssignmentsClassesContainer
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          visible={currentAssignmentId.includes(moduleData.contentId)}
                        >
                          {assignmentRows?.map((assignment, index) => (
                            <StyledRow key={index}>
                              <Tooltip placement="bottom" title={assignment?.name}>
                                <ClassName>{assignment?.name}</ClassName>
                              </Tooltip>
                              <AssesmentType>{assignment?.testType}</AssesmentType>
                              <AssignmentStatus bg={statusBg[(assignment?.status)]}>
                                {assignment?.status}
                              </AssignmentStatus>
                              <Div maxWidth={125} align="left">
                                {`Submitted ${assignment?.submittedCount} of ${assignment?.assignedCount}`}
                              </Div>
                              <Div maxWidth={35} align="center">
                                {(assignment?.submittedCount / assignment?.assignedCount) * 100 || 0} %
                              </Div>
                              <Div maxWidth={90} align="left">
                                {assignment?.gradedNumber} Graded
                              </Div>

                              <ActionsWrapper>
                                <Tooltip placement="bottom" title="LCB">
                                  <BtnContainer
                                    onClick={e =>
                                      this.handleActionClick(
                                        e,
                                        "classboard",
                                        assignment?.assignmentId,
                                        assignment?.classId
                                      )
                                    }
                                  >
                                    <img src={presentationIcon} alt="Images" />
                                  </BtnContainer>
                                </Tooltip>

                                <Tooltip placement="bottom" title="Express Grader">
                                  <BtnContainer
                                    onClick={e =>
                                      this.handleActionClick(
                                        e,
                                        "expressgrader",
                                        assignment?.assignmentId,
                                        assignment?.classId
                                      )
                                    }
                                  >
                                    <img src={additemsIcon} alt="Images" />
                                  </BtnContainer>
                                </Tooltip>

                                <Tooltip placement="bottom" title="Reports">
                                  <BtnContainer
                                    onClick={e =>
                                      this.handleActionClick(
                                        e,
                                        "standardsBasedReport",
                                        assignment?.assignmentId,
                                        assignment?.classId
                                      )
                                    }
                                  >
                                    <img src={piechartIcon} alt="Images" />
                                  </BtnContainer>
                                </Tooltip>
                              </ActionsWrapper>
                            </StyledRow>
                          ))}
                        </AssignmentsClassesContainer>
                      </>
                    );
                  })}
                </SortableContainer>
              )}
            </Module>
          </Container>
        </ModuleWrapper>
      </React.Fragment>
    );
  }
}

ModuleRow.propTypes = {
  setSelectedItemsForAssign: PropTypes.func.isRequired,
  module: PropTypes.object.isRequired,
  onCollapseExpand: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  padding: PropTypes.bool.isRequired,
  isContentExpanded: PropTypes.bool.isRequired,
  assigned: PropTypes.array.isRequired,
  moduleStatus: PropTypes.bool,
  mode: PropTypes.string,
  status: PropTypes.string,
  removeUnit: PropTypes.func.isRequired
};

const AssesmentType = styled.div`
  background: #d1f9eb;
  color: #4aac8b;
  line-height: 25px;
  font-size: 12px;
  text-align: center;
  width: 90px;
  height: 25px;
  border-radius: 6px;
  text-transform: uppercase;
`;

const AssignmentStatus = styled.div`
  background: ${({ bg }) => bg};
  color: ${white};
  line-height: 24px;
  font-size: 11px;
  text-align: center;
  width: 100px;
  height: 24px;
  border-radius: 6px;
`;

const BtnContainer = styled.div`
  background: transparent;
  img {
    width: 18px;
    height: 18px;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  width: 120px;
  align-items: center;
  justify-content: space-evenly;
  margin-right: 0;
`;

const ClassName = styled.div`
  max-width: 200px;
  width: 100%;
`;

const Div = styled.div`
  max-width: ${({ maxWidth }) => maxWidth}px;
  width: 100%;
  text-align: ${({ align }) => align};
`;

const StyledRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 48px;
  border-bottom: 1px solid #e9e9e9;
  color: #30404f;
  font-size: 12px;

  &:hover {
    background: #f8f8f8;
  }
`;

const AssignmentsClassesContainer = styled.div`
  background: ${white};
  width: 100%;
  display: ${({ visible }) => (visible ? "block" : "none")};
`;

const AssignmentDragItemContainer = styled.div`
  display: flex;
  width: 100;
  justify-content: stretch;
`;

const DragHandle = styled.div`
  color: ${themeColor};
  background: ${white};
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const ModalWrapper = styled(Modal)`
  top: 0px;
  padding: 0;
  overflow: hidden;
  .ant-modal-content {
    background: ${mainBgColor};
    .ant-modal-close-icon {
      color: ${white};
    }
    .ant-modal-body {
      padding: 0px;
      min-height: 100px;
      text-align: center;
      main {
        padding: 20px 40px;
        height: calc(100vh - 62px);
        & > section {
          padding: 0px;
          min-height: calc(100vh - 100px);
        }
      }
    }
  }
`;

export const CustomIcon = styled.span`
  cursor: pointer;
  margin-right: ${props => (props.marginRight ? props.marginRight : 25)}px;
  margin-left: ${({ marginLeft }) => marginLeft || 0}px;
  font-size: 16px;
  align-self: flex-start;

  @media only screen and (max-width: ${mobileWidth}) {
    margin-right: 5px;
    margin-left: 0px;
    padding: 5px;
  }
`;

export const AssignmentIconsHolder = styled.div`
  display: flex;
  justify-items: flex-end;
  margin-left: auto;
  @media only screen and (max-width: ${desktopWidth}) {
    margin-left: 0;
    justify-items: flex-start;
    /* margin-right: 100%;  */
  }
`;

/* NOTE: margin-right: 100%; - hack but works */
const ModuleFocused = styled.div`
  border-left: 3px solid #4aac8b;
  width: 3px;
  position: absolute;
  height: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  top: 0;
  opacity: 0;
`;

export const ModuleAssignedUnit = styled.div`
  margin-right: auto;
  @media only screen and (max-width: ${tabletWidth}) {
    margin-right: 0;
    position: absolute;
    top: 0px;
  }
  @media only screen and (max-width: ${tabletWidth}) and (min-width: ${mobileWidth}) {
    right: -25px;
  }
`;

const ModuleTitleWrapper = styled.div`
  display: flex;
  @media only screen and (max-width: ${tabletWidth}) {
    width: 80%;
  }
`;

const ModuleCompletedLabel = styled.div`
  color: ${greenThird};
  font-size: 11px;
  @media only screen and (max-width: ${tabletWidth}) {
    display: none;
  }
`;

const ModuleCompletedIcon = styled.div`
  padding-left: 30px;
  padding-right: 30px;
  @media only screen and (max-width: ${tabletWidth}) {
    padding-left: 0px;
    padding-right: 0px;
    position: absolute;
    top: 5px;
    right: -10px;
  }
`;

const ModuleCompleted = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  width: auto;
  align-items: center;
  @media only screen and (max-width: ${tabletWidth}) {
    align-self: flex-end;
    margin-left: 0;
  }
`;

const NumberOfAssigned = styled.strong`
  padding-left: 4px;
  padding-right: 4px;
  font-weight: bolder;
`;

const TotalAssigned = styled.strong`
  padding-left: 4px;
  font-weight: bolder;
`;

export const AssignmentButton = styled.div`
  min-width: 121px;
  .ant-btn {
    color: ${({ assigned }) => (assigned ? white : themeColor)};
    border-color: ${({ assigned }) => (assigned ? themeColor : white)};
    background-color: ${({ assigned }) => (assigned ? themeColor : white)};
    min-width: 121px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(201, 208, 219, 0.5);
    margin: ${({ margin }) => margin};

    svg {
      fill: ${({ assigned }) => (assigned ? white : themeColor)};
    }
    &:hover {
      background-color: ${({ assigned }) => (assigned ? white : themeColor)};
      color: ${({ assigned }) => (assigned ? themeColor : white)};
      border-color: ${({ assigned }) => (assigned ? white : themeColor)};
      svg {
        fill: ${({ assigned }) => (assigned ? themeColor : white)};
      }
    }
    i {
      position: absolute;
      position: absolute;
      left: 6px;
      display: flex;
      align-items: center;
    }
    span {
      margin-left: auto;
      margin-right: auto;
      font-size: 12px;
      font-weight: 600;
    }
  }
`;

const AssignModuleButton = styled.div`
  align-self: center;
  .ant-btn {
    min-height: 30px;
    font-size: 10px;
    margin-right: 20px;
    color: #00ad50;
    border-color: ${white};
    box-shadow: 0 2px 4px rgba(201, 208, 219, 0.5);
    @media only screen and (max-width: ${mobileWidth}) {
      margin-right: 0px;
      padding: 0px 7px;
    }
  }
  @media only screen and (max-width: ${desktopWidth}) {
    align-self: flex-start;
  }
`;

export const AssignmentContent = styled.div`
  flex-direction: row;
  display: flex;
  min-width: ${props => (!props.expanded ? "30%" : "45%")};
  @media only screen and (max-width: ${mobileWidth}) {
    width: 80%;
  }
`;

const LinkWrapper = styled.div`
  border: 1px solid ${themeColor};
  color: ${themeColor};
  background: ${white};
  text-align: center;
  border-radius: 4px;
  margin-right: 18px;
  padding: 4px 10px;
  min-height: 30px;
  font-size: 12px;
  display: table-cell;
  vertical-align: middle;
  box-sizing: border-box;

  &:hover {
    background: ${themeColor};
    a {
      color: ${white};
    }
  }
`;

const ModuleTitle = styled.div`
  display: flex;
  justify-self: flex-start;
  align-items: center;
  color: #30404f;
  font-size: 18px;
  font-weight: 600;
  @media only screen and (max-width: ${tabletWidth}) {
    align-items: flex-start;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
  }
  @media only screen and (max-width: ${mobileWidth}) {
    padding: 0px 0px 5px;
  }
`;

const ModuleTitleAssignedWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  @media only screen and (max-width: ${tabletWidth}) {
    flex-wrap: wrap;
    margin-top: -5px;
    position: relative;
  }
`;

const ModuleTitlePrefix = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-left: 10px;
`;

export const ModuleDataName = styled.div`
  font-weight: 600;
  color: ${({ isDragging }) => (isDragging ? white : textColor)};
  font-size: 14px;
  font-family: Open Sans, SemiBold;
  min-width: 210px;
  max-width: 210px;

  @media only screen and (max-width: ${desktopWidth}) {
    min-width: auto;
    order: 2;
  }
  @media only screen and (max-width: ${mobileWidth}) {
    font-size: 12px;
    padding: 0px 0px 5px;
  }
`;

const ModuleInfo = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  @media only screen and (max-width: ${mobileWidth}) {
    align-items: flex-start;
  }
`;

const AssignmentIconsWrapper = styled.div`
  width: 100%;
  padding: 0px;
  display: inline-flex;
  min-width: 65%;
  display: flex;
  justify-content: flex-start;
  @media screen and (max-width: ${extraDesktopWidth}) {
    min-width: 45%;
  }
  @media screen and (max-width: ${desktopWidth}) {
    min-width: 35%;
  }
  @media only screen and (max-width: ${tabletWidth}) {
    min-width: 50%;
    padding-top: 10px;
    margin-left: auto;
    margin-right: 0px;
  }
  @media screen and (max-width: ${mobileWidth}) {
    min-width: 100%;
  }
`;

export const AssignmentIcon = styled.span`
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  width: 30px;
`;

const Row = styled.div`
  border-radius: 0 10px 10px 0;
  background: ${white};
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 20px;
  padding-right: 10px;
  box-shadow: none;
  align-items: center;
  @media (max-width: ${mobileWidth}) {
    padding-left: 10px;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  height: 100%;

  @media (max-width: ${mobileWidth}) {
    padding-left: 0px;
    margin-right: ${props => !props.value && "20px !important"};
    margin-left: ${props => props.value && "20px !important"};
  }
`;

const ModulesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
  margin-bottom: auto;
  margin-top: auto;
  @media only screen and (max-width: ${tabletWidth}) {
    justify-content: flex-start;
    margin-left: auto;
    margin-bottom: 0;
    margin-top: 0;
  }
  @media only screen and (max-width: ${mobileWidth}) {
    /* flex-direction: column; */
  }
`;

const Module = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #949494;
  @media only screen and (max-width: ${mobileWidth}) {
    font-size: 11px;
  }
`;

const ModuleHeader = styled(Row)`
  box-shadow: none;
  display: flex;
  flex-direction: column;
  border-bottom-right-radius: ${({ collapsed }) => (!collapsed ? "0px" : "10px")};
  overflow: hidden;
  position: relative;
`;

const Assignment = styled(Row)`
  border-radius: 0;
  border-bottom: 1px #f2f2f2 solid;
  position: relative;
  background: #f9fbfc !important;
  &:active ${ModuleFocused}, &:focus ${ModuleFocused}, &:hover ${ModuleFocused} {
    opacity: 1;
  }
  &:first-child {
    border-top: 1px #f2f2f2 solid;
  }
  &:last-child {
    border-bottom: 0px;
  }
  @media only screen and (max-width: ${desktopWidth}) {
    flex-direction: column;
  }
`;
Assignment.displayName = "Assignment";

const AssignmentInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  .module-checkbox {
    align-self: center;
  }
  & div,
  & span {
    align-items: center;
  }
  @media only screen and (max-width: ${tabletWidth}) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-items: center;
    margin-left: auto;
    align-items: flex-start;
  }
`;
AssignmentInnerWrapper.displayName = "AssignmentInnerWrapper";

const ModulesAssigned = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  padding-right: 20px;
  padding-left: 20px;
  font-weight: 400;
  color: #434b5d;
  margin-left: auto;
  justify-self: flex-end;
  line-height: 2.4;
  min-width: 123px;
  max-height: 30px;
  margin-top: auto;
  margin-bottom: auto;
  font-family: Open Sans, SemiBold;
  @media only screen and (max-width: ${tabletWidth}) {
    margin-right: auto;
    justify-self: flex-start;
    padding: 0;
    margin: 0;
    margin-bottom: 10px;
  }
  @media only screen and (max-width: ${mobileWidth}) {
    min-width: 95px;
    margin-bottom: 0px;
  }
`;

const ModuleWrapper = styled.div`
  cursor: pointer;
  & {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0px;
    padding-right: ${({ padding }) => (padding ? "20px" : "0px")};
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .module-checkbox {
    span {
      margin-right: 23px;
    }
  }
  .module-btn-assigned {
    background-color: ${themeColor};
    margin-left: auto;
    justify-self: flex-end;
  }
  .module-btn-expand-collapse {
    border: none;
    box-shadow: none;
  }
`;

const ModuleHelperText = styled.p`
  font-size: ${({ fontSize }) => fontSize || "12px"};
  color: ${textColor};
  font-weight: normal;
`;

const enhance = compose(
  withRouter,
  connect(
    ({ curriculumSequence }) => ({
      checkedUnitItems: curriculumSequence.checkedUnitItems,
      isContentExpanded: curriculumSequence.isContentExpanded,
      assigned: curriculumSequence.assigned
    }),
    {
      toggleUnitItem: toggleCheckedUnitItemAction,
      setSelectedItemsForAssign: setSelectedItemsForAssignAction,
      removeItemFromUnit: removeTestFromModuleAction,
      removeUnit: removeUnitAction
    }
  )
);

export default enhance(ModuleRow);
