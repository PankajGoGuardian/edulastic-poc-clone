/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
import {
  borderGrey3,
  borderGrey4,
  darkGrey2,
  desktopWidth,
  extraDesktopWidth,
  greenDark,
  greenDark6,
  greyThemeDark1,
  greyThemeLighter,
  lightGreen5,
  lightGrey5,
  lightGrey6,
  mainBgColor,
  mobileWidth,
  tabletWidth,
  testTypeColor,
  themeColor,
  themeColorLighter,
  titleColor,
  white
} from "@edulastic/colors";
import { EduButton, ProgressBar } from "@edulastic/common";
import { testActivityStatus } from "@edulastic/constants";
import { IconCheckSmall, IconLeftArrow, IconMoreVertical, IconVerified, IconVisualization } from "@edulastic/icons";
import { Avatar, Button, Col, Dropdown, Icon, Menu, Modal, Row as AntRow } from "antd";
import produce from "immer";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { FaBars, FaChevronRight } from "react-icons/fa";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";
import { compose } from "redux";
import styled from "styled-components";
import AssessmentPlayer from "../../../assessment";
import { Tooltip } from "../../../common/utils/helpers";
import { resumeAssignmentAction, startAssignmentAction } from "../../../student/Assignments/ducks";
import { getCurrentGroup } from "../../../student/Login/ducks";
import additemsIcon from "../../Assignments/assets/add-items.svg";
import piechartIcon from "../../Assignments/assets/pie-chart.svg";
import presentationIcon from "../../Assignments/assets/presentation.svg";
import { removeTestFromModuleAction } from "../../PlaylistPage/ducks";
import { StyledLabel, StyledTag } from "../../Reports/common/styled";
import { StatusLabel } from "../../Assignments/components/TableList/styled";
import Tags from "../../src/components/common/Tags";
import { getUserRole } from "../../src/selectors/user";
import {
  putCurriculumSequenceAction,
  removeUnitAction,
  setSelectedItemsForAssignAction,
  toggleCheckedUnitItemAction
} from "../ducks";
import { getProgressColor, getProgressData } from "../util";
import AssignmentDragItem from "./AssignmentDragItem";

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

const SortableHOC = sortableContainer(({ children }) => <div onClick={e => e.stopPropagation()}>{children}</div>);

const SortableContainer = props => {
  const { mode, children } = props;
  return mode === "embedded" ? <SortableHOC {...props}>{children}</SortableHOC> : <div>{children}</div>;
};

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

  processStudentAssignmentAction = (moduleId, moduleData, isAssigned, assignmentRows = []) => {
    let uta = moduleData.userTestActivities || {};
    const { classId: groupId, playlistClassList, startAssignment, resumeAssignment, playlistId } = this.props;
    const testId = uta.testId || moduleData.contentId;

    if (isAssigned) {
      // TODO: filter out the assignments in assignmentRows by classIds in case of multiple assignments
      const { testType, assignmentId, classId } = assignmentRows[0] || {};
      uta = {
        testId,
        classId,
        testType,
        assignmentId,
        utaAssignmentId: uta.assignmentId,
        taStatus: uta.status,
        testActivityId: uta._id,
        isPlaylist: {
          moduleId,
          playlistId
        },
        redirect: uta.redirect
      };
      const isRedirected = assignmentRows.find(el => el.redirect);
      if (isRedirected && uta.redirect) {
        uta.isRedirected = true;
        uta.text = "RETAKE";
        uta.action = () => startAssignment(uta);
      } else if (uta.taStatus === testActivityStatus.SUBMITTED && uta.utaAssignmentId) {
        uta.text = "REVIEW";
      } else if (uta.taStatus === testActivityStatus.ABSENT && uta.utaAssignmentId) {
        uta.text = "ABSENT";
      } else if (uta.testActivityId && uta.utaAssignmentId) {
        // In case previous uta was derived from practice flow then check for assignment ID and proceed
        uta.text = "RESUME ASSIGNMENT";
        uta.action = () => resumeAssignment(uta);
      } else {
        uta.text = "START ASSIGNMENT";
        uta.action = () => startAssignment(uta);
      }
    } else {
      uta = {
        testId,
        classId: uta.groupId || groupId || playlistClassList[0],
        testType: "practice",
        taStatus: uta.status,
        testActivityId: uta._id,
        isPlaylist: {
          moduleId,
          playlistId
        }
      };

      if (uta.testActivityId && uta.taStatus !== testActivityStatus.SUBMITTED) {
        uta.text = "RESUME PRACTICE";
        uta.action = () => resumeAssignment(uta);
      } else {
        uta.text = "START PRACTICE";
        uta.action = () => startAssignment(uta);
      }
    }
    return uta;
  };

  toggleModule = (module, moduleIndex) => {
    const { updateCurriculumSequence, playlistId, curriculum, collapsed, onCollapseExpand } = this.props;
    const dataToUpdate = produce(curriculum, draftState => {
      const currentModule = draftState.modules.find(el => el._id === module._id);
      currentModule.hidden = !module.hidden;
      currentModule.data = currentModule.data.map(test => ({
        ...test,
        hidden: !module.hidden
      }));
      if ((collapsed && !currentModule.hidden) || (!collapsed && currentModule.hidden)) {
        onCollapseExpand(moduleIndex);
      }
    });
    updateCurriculumSequence({
      id: playlistId,
      curriculumSequence: dataToUpdate
    });
  };

  hideTest = (moduleId, assignment) => {
    const { updateCurriculumSequence, playlistId, curriculum } = this.props;
    const { currentAssignmentId } = this.state;

    const dataToUpdate = produce(curriculum, draftState => {
      const module = draftState.modules.find(el => el._id === moduleId);
      const content = module.data.find(el => el.contentId === assignment.contentId);
      content.hidden = !content.hidden;
      // if Hide is clicked and assignment rows expanded, then hide assignment rows
      if (content.hidden && currentAssignmentId.includes(content.contentId)) {
        const prevState = [...currentAssignmentId];
        prevState.splice(currentAssignmentId.find(x => x === content.contentId), 1);
        this.setState({ currentAssignmentId: prevState });
      }
      const allTestInHidden = module.data.filter(t => !t.hidden);
      if (!allTestInHidden.length && content.hidden) {
        module.hidden = true;
      } else {
        module.hidden = false;
      }
    });

    updateCurriculumSequence({
      id: playlistId,
      curriculumSequence: dataToUpdate
    });
  };

  render() {
    const {
      onCollapseExpand,
      collapsed,
      padding,
      status,
      module,
      moduleIndex,
      mode,
      dropContent,
      hideEditOptions,
      curriculum,
      moduleStatus: completed,
      removeUnit,
      handleTestsSort,
      urlHasUseThis,
      isStudent,
      summaryData,
      playlistMetrics,
      playlistId
    } = this.props;

    const { title, _id, data = [], description = "" } = module;
    const { assignModule, assignTest } = this;

    const totalAssigned = data.length;
    // const numberOfAssigned = data.filter(
    //   content => content.assignments && content.assignments.length > 0
    // ).length;
    const { showModal, selectedTest, currentAssignmentId } = this.state;

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
    const moduleInlineStyle = {
      opacity: module.hidden ? `.5` : `1`,
      pointerEvents: module.hidden ? "none" : "all"
    };

    return (
      (isStudent && module.hidden) || (
        <React.Fragment>
          <ModalWrapper
            footer={null}
            visible={showModal}
            onCancel={this.closeModal}
            width="100%"
            height="100%"
            destroyOnClose
          >
            <AssessmentPlayer
              playlistId={playlistId}
              testId={selectedTest}
              preview
              closeTestPreviewModal={this.closeModal}
            />
          </ModalWrapper>
          <ModuleWrapper
            data-cy={`row-module-${moduleIndex + 1}`}
            key={`${data.length}-${module.id}`}
            collapsed={collapsed}
            padding={padding}
            onClick={() => onCollapseExpand(moduleIndex)}
          >
            <ModuleHeader>
              <ModuleCount>{moduleIndex + 1}</ModuleCount>
              <AntRow type="flex" gutter={20} style={{ width: "calc(100% - 25px)" }}>
                <Col span={urlHasUseThis ? 7 : 24} style={moduleInlineStyle}>
                  <StyledLabel fontStyle="14/19px Open Sans" fontWeight="normal" textColor={lightGrey5}>
                    Module {moduleIndex + 1}
                  </StyledLabel>
                  <ModuleTitleWrapper>
                    <ModuleTitle data-cy="module-name">{title}</ModuleTitle>
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
                  <Tooltip placement="bottom" title={description}>
                    <EllipsisContainer>{description}</EllipsisContainer>
                  </Tooltip>
                </Col>
                {urlHasUseThis && (
                  <>
                    <Col span={4} style={moduleInlineStyle}>
                      <StyledLabel textColor={lightGrey5}>PROFICIENCY</StyledLabel>
                      {/* TODO: Method to find Progress Percentage */}
                      <ProgressBar
                        strokeColor={getProgressColor(summaryData[moduleIndex]?.value)}
                        strokeWidth={13}
                        percent={summaryData[moduleIndex]?.value}
                        format={percent => (percent ? `${percent}%` : "")}
                      />
                    </Col>
                    {!isStudent ? (
                      <Col span={3} style={moduleInlineStyle}>
                        <StyledLabel justify="center" textColor={lightGrey5}>
                          SUBMITTED
                        </StyledLabel>
                        <StyledLabel
                          textColor={greyThemeDark1}
                          fontStyle="12px/17px Open Sans"
                          padding="4px 0px"
                          justify="center"
                        >
                          {/* TODO: Method to find submissions */}
                          {summaryData[moduleIndex]?.submitted === "-"
                            ? summaryData[moduleIndex]?.submitted
                            : `${summaryData[moduleIndex].submitted}%`}
                        </StyledLabel>
                      </Col>
                    ) : (
                      <Col span={2}>
                        <StyledLabel justify="center" textColor={lightGrey5}>
                          SCORE
                        </StyledLabel>
                        <StyledLabel
                          textColor={greyThemeDark1}
                          fontStyle="12px/17px Open Sans"
                          padding="4px 0px"
                          justify="center"
                        >
                          {/* TODO: Method to find sum of scores */}
                          {summaryData[moduleIndex]?.scores >= 0 && summaryData[moduleIndex]?.maxScore
                            ? `${summaryData[moduleIndex]?.scores}/${summaryData[moduleIndex]?.maxScore}`
                            : "-"}
                        </StyledLabel>
                      </Col>
                    )}
                    {!isStudent ? (
                      <Col span={2} style={moduleInlineStyle}>
                        <StyledLabel justify="center" textColor={lightGrey5}>
                          CLASSES
                        </StyledLabel>
                        <StyledLabel
                          textColor={greyThemeDark1}
                          fontStyle="12px/17px Open Sans"
                          padding="4px 0px"
                          justify="center"
                        >
                          {/* TODO: Method to find classes */}
                          {summaryData[moduleIndex]?.classes}
                        </StyledLabel>
                      </Col>
                    ) : (
                      <Col span={4}>
                        <StyledLabel justify="center" textColor={lightGrey5}>
                          TIME SPENT
                        </StyledLabel>
                        <StyledLabel
                          textColor={greyThemeDark1}
                          fontStyle="12px/17px Open Sans"
                          padding="4px 0px"
                          justify="center"
                        >
                          {/* TODO: Method to find Total Time Spent */}
                          {summaryData[moduleIndex]?.timeSpent}
                        </StyledLabel>
                      </Col>
                    )}
                  </>
                )}
                {!hideEditOptions &&
                  (completed ? (
                    <StyledCol span={7} justify="flex-end" style={moduleInlineStyle}>
                      <StyledLabel data-cy="module-complete" textColor={themeColorLighter} fontWeight="Bold">
                        MODULE COMPLETED
                        <IconVerified color={themeColorLighter} style={{ "margin-left": "20px" }} />
                      </StyledLabel>
                    </StyledCol>
                  ) : (
                    !isStudent &&
                    (totalAssigned ? (
                      <StyledCol span={8} justify="flex-end">
                        <StyledLabel
                          textColor={lightGreen5}
                          fontStyle="9px/13px Open Sans"
                          fontWeight="Bold"
                          padding="10px 20px 10px 0px"
                          data-cy={module.hidden ? "show-module" : "hide-module"}
                          onClick={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            this.toggleModule(module, moduleIndex);
                          }}
                        >
                          {module.hidden ? "SHOW MODULE" : "HIDE MODULE"}
                        </StyledLabel>
                        <StyledTag
                          data-cy="AssignWholeModule"
                          bgColor={lightGreen5}
                          onClick={() => (!module.hidden ? assignModule(module) : {})}
                          style={moduleInlineStyle}
                        >
                          ASSIGN MODULE
                        </StyledTag>
                      </StyledCol>
                    ) : (
                      <StyledCol span={8} justify="flex-end" style={moduleInlineStyle}>
                        <StyledTag onClick={event => event.stopPropagation()}>NO ASSIGNMENTS</StyledTag>
                      </StyledCol>
                    ))
                  ))}
              </AntRow>
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
                  const { assignments = [], contentId } = moduleData;
                  const statusList = assignments.flatMap(item => item.class || []).flatMap(item => item.status || []);
                  const contentCompleted =
                    statusList.filter(_status => _status === "DONE").length === statusList.length &&
                    statusList.length > 0;
                  const isAssigned = assignments.length > 0;
                  const rowInlineStyle = {
                    opacity: moduleData.hidden ? `.5` : `1`,
                    pointerEvents: moduleData.hidden ? "none" : "all"
                  };

                  const progressData = getProgressData(playlistMetrics, _id, contentId, assignments);

                  const assignmentRows = assignments.flatMap(assignment => {
                    const { testType, _id: assignmentId } = assignment;
                    return assignment.class.map(
                      ({
                        name,
                        status: _status,
                        assignedCount,
                        inProgressNumber,
                        inGradingNumber,
                        _id: classId,
                        gradedNumber = 0,
                        redirect = false
                      }) => ({
                        name,
                        status: _status,
                        assignedCount,
                        inProgressNumber,
                        inGradingNumber,
                        testType,
                        assignmentId,
                        classId,
                        gradedNumber,
                        submittedCount: inGradingNumber + gradedNumber,
                        redirect
                      })
                    );
                  });

                  // process user test activity to get student assignment actions
                  const uta = isStudent
                    ? this.processStudentAssignmentAction(_id, moduleData, isAssigned, assignmentRows)
                    : {};

                  const moreMenu = (
                    <Menu data-cy="moduleItemMoreMenu">
                      <Menu.Item onClick={() => assignTest(_id, moduleData.contentId)}>Assign Test</Menu.Item>
                      {isAssigned && (
                        <Menu.Item>
                          <Link to="/author/assignments">View Assignments</Link>
                        </Menu.Item>
                      )}
                      <Menu.Item data-cy="view-test" onClick={() => this.viewTest(moduleData.contentId)}>
                        Preview Test
                      </Menu.Item>
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
                        standardTags={moduleData.standardIdentifiers}
                        assignTest={this.assignTest}
                        viewTest={this.viewTest}
                        deleteTest={this.deleteTest}
                        onClick={e => e.stopPropagation()}
                        {...this.props}
                      />
                    );
                  }

                  return (
                    !(isStudent && moduleData.hidden) && (
                      <>
                        <Assignment
                          data-cy="moduleAssignment"
                          key={moduleData.contentId}
                          borderRadius="unset"
                          boxShadow="unset"
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <ModuleFocused />
                          <FaChevronRight
                            color={lightGreen5}
                            style={{ margin: urlHasUseThis ? "4px 15px" : "4px 15px 0px 43px" }}
                          />
                          <AntRow type="flex" gutter={20} align="top" style={{ width: "calc(100% - 25px)" }}>
                            <Col span={urlHasUseThis ? 7 : 10} style={rowInlineStyle}>
                              <ModuleDataWrapper>
                                <ModuleDataName onClick={() => !isStudent && this.viewTest(moduleData?.contentId)}>
                                  <Tooltip placement="bottomLeft" title={moduleData.contentTitle}>
                                    <EllipticSpan width="calc(100% - 30px)">{moduleData.contentTitle}</EllipticSpan>
                                  </Tooltip>
                                  {urlHasUseThis && (
                                    <CustomIcon marginLeft={10} marginRight={5}>
                                      {!isAssigned || moduleData.assignments[0].testType === "practice" ? (
                                        <Avatar
                                          size={18}
                                          style={{ backgroundColor: testTypeColor.practice, fontSize: "13px" }}
                                        >
                                          {" P "}
                                        </Avatar>
                                      ) : (
                                        <Avatar
                                          size={18}
                                          style={{
                                            backgroundColor: testTypeColor[moduleData.assignments[0].testType],
                                            fontSize: "13px"
                                          }}
                                        >
                                          {moduleData.assignments[0].testType[0].toUpperCase()}
                                        </Avatar>
                                      )}
                                    </CustomIcon>
                                  )}
                                </ModuleDataName>
                                <Tags
                                  margin="5px 0px 0px 0px"
                                  tags={moduleData.standardIdentifiers}
                                  completed={!hideEditOptions && contentCompleted}
                                  show={2}
                                  isPlaylist
                                />
                              </ModuleDataWrapper>
                            </Col>
                            {urlHasUseThis ? (
                              <>
                                <StyledCol span={4} style={rowInlineStyle}>
                                  {/* TODO: Method to display progress for assignments */}
                                  <ProgressBar
                                    strokeColor={getProgressColor(progressData?.progress)}
                                    strokeWidth={13}
                                    percent={progressData?.progress}
                                    format={percent => (percent ? `${percent}%` : "")}
                                  />
                                </StyledCol>
                                {!isStudent ? (
                                  <StyledCol span={3} style={rowInlineStyle} justify="center">
                                    <StyledLabel
                                      textColor={greyThemeDark1}
                                      fontStyle="12px/17px Open Sans"
                                      padding="2px"
                                      justify="center"
                                    >
                                      {/* TODO: Method to find submissions for each assignment */}
                                      {progressData?.submitted ? `${progressData?.submitted}%` : "-"}
                                    </StyledLabel>
                                  </StyledCol>
                                ) : (
                                  <StyledCol span={2} style={rowInlineStyle} justify="center">
                                    <StyledLabel
                                      textColor={greyThemeDark1}
                                      fontStyle="12px/17px Open Sans"
                                      padding="2px"
                                      justify="center"
                                    >
                                      {/* TODO: Method to find sum of scores for each assignment */}
                                      {progressData?.scores >= 0 && progressData?.maxScore
                                        ? `${progressData?.scores}/${progressData?.maxScore}`
                                        : "-"}
                                    </StyledLabel>
                                  </StyledCol>
                                )}
                                {!isStudent ? (
                                  <StyledCol span={2} style={rowInlineStyle} justify="center">
                                    <StyledLabel
                                      textColor={greyThemeDark1}
                                      fontStyle="12px/17px Open Sans"
                                      padding="2px"
                                      justify="center"
                                    >
                                      {/* TODO: Method to find classes for each assignment */}
                                      {progressData?.classes || "-"}
                                    </StyledLabel>
                                  </StyledCol>
                                ) : (
                                  <StyledCol span={4} style={rowInlineStyle} justify="center">
                                    <StyledLabel
                                      textColor={greyThemeDark1}
                                      fontStyle="12px/17px Open Sans"
                                      padding="2px"
                                      justify="center"
                                    >
                                      {/* TODO: Method to find Total Time Spent for each assignment */}
                                      {progressData?.timeSpent}
                                    </StyledLabel>
                                  </StyledCol>
                                )}

                                {!isStudent ? (
                                  <StyledCol span={8} align="flex-start" justify="flex-end">
                                    {(!hideEditOptions || (status === "published" && mode === "embedded")) && (
                                      <StyledLabel
                                        textColor={lightGreen5}
                                        fontStyle="9px/13px Open Sans"
                                        fontWeight="Bold"
                                        padding="4px 20px 10px 0px"
                                        data-cy={moduleData.hidden ? "make-visible" : "make-hidden"}
                                        onClick={() => this.hideTest(module._id, moduleData)}
                                      >
                                        {moduleData.hidden ? "SHOW" : "HIDE"}
                                      </StyledLabel>
                                    )}
                                    {(!hideEditOptions || (status === "published" && mode === "embedded")) &&
                                      (isAssigned ? (
                                        <AssignmentButton assigned={isAssigned} style={rowInlineStyle}>
                                          <Button
                                            data-cy={
                                              currentAssignmentId.includes(moduleData.contentId)
                                                ? "hide-assignment"
                                                : "show-assignment"
                                            }
                                            onClick={() => this.setAssignmentDropdown(moduleData.contentId)}
                                          >
                                            <IconCheckSmall color={white} />
                                            &nbsp;&nbsp;
                                            {currentAssignmentId.includes(moduleData.contentId)
                                              ? "HIDE ASSIGNMENTS"
                                              : "SHOW ASSIGNMENTS"}
                                          </Button>
                                        </AssignmentButton>
                                      ) : (
                                        <AssignmentButton assigned={isAssigned} style={rowInlineStyle}>
                                          <Button
                                            data-cy="assignButton"
                                            onClick={() => assignTest(_id, moduleData.contentId)}
                                          >
                                            <IconLeftArrow width={13.3} height={9.35} />
                                            ASSIGN
                                          </Button>
                                        </AssignmentButton>
                                      ))}
                                    {mode === "embedded" ||
                                      (urlHasUseThis && (
                                        <Dropdown overlay={moreMenu} trigger={["click"]} style={rowInlineStyle}>
                                          <CustomIcon
                                            data-cy="assignmentMoreOptionsIcon"
                                            marginLeft={20}
                                            marginRight={15}
                                            align="auto"
                                            style={rowInlineStyle}
                                          >
                                            <IconMoreVertical width={5} height={14} color={lightGreen5} />
                                          </CustomIcon>
                                        </Dropdown>
                                      ))}
                                  </StyledCol>
                                ) : (
                                  !moduleData.hidden && (
                                    <StyledCol span={7} justify="flex-end">
                                      {uta.testType !== "practice" &&
                                      uta.taStatus === testActivityStatus.SUBMITTED &&
                                      !uta.isRedirected ? (
                                        <StyledLink
                                          to={`/home/class/${uta.classId}/test/${uta.testId}/testActivityReport/${
                                            uta.testActivityId
                                          }`}
                                        >
                                          {uta.text}
                                        </StyledLink>
                                      ) : (
                                        <AssignmentButton assigned={false}>
                                          <Button data-cy={uta.text} onClick={uta.action}>
                                            {uta.text}
                                          </Button>
                                        </AssignmentButton>
                                      )}
                                    </StyledCol>
                                  )
                                )}
                              </>
                            ) : (
                              <StyledCol span={14} style={{ display: "flex", justifyContent: "flex-end" }}>
                                <EduButton
                                  isGhost
                                  height="22px"
                                  style={{ padding: "0px 15px" }}
                                  onClick={() => this.viewTest(moduleData?.contentId)}
                                >
                                  <IconVisualization width="14px" height="14px" />
                                  Preview
                                </EduButton>
                              </StyledCol>
                            )}
                          </AntRow>
                        </Assignment>

                        <AssignmentsClassesContainer
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          visible={currentAssignmentId.includes(moduleData.contentId) && !isStudent}
                        >
                          {assignmentRows?.map((assignment, assignmentIndex) => (
                            <StyledRow key={assignmentIndex}>
                              <StyledLabel fontStyle="14px/19px Open Sans" textColor={titleColor}>
                                <Tooltip placement="bottomLeft" title={assignment?.name}>
                                  <EllipticSpan md="100px" lg="260px" xl="300px" padding="0px 0px 0px 30px">
                                    {assignment?.name}
                                  </EllipticSpan>
                                </Tooltip>
                              </StyledLabel>

                              {/* TODO: Remove if not required, else uncomment and update the assignment name sizes accordingly */}
                              {/* <CustomIcon marginRight={0} align="unset">
                                <Avatar
                                  size={18}
                                  style={{
                                    backgroundColor: testTypeColor[assignment?.testType || "practice"],
                                    fontSize: "13px"
                                  }}
                                >
                                  {assignment?.testType[0].toUpperCase() || "P"}
                                </Avatar>
                              </CustomIcon> */}

                              {assignment?.status && (
                                <StyledStatusLabel status={assignment?.status}>{assignment?.status}</StyledStatusLabel>
                              )}

                              <StyledLabel fontStyle="14px/19px Open Sans" textColor={titleColor} width="150px">
                                {`Submitted ${assignment?.submittedCount || 0} of ${assignment?.assignedCount || 0}`}
                              </StyledLabel>

                              {/* TODO: Display percentage completion for each assignment row */}
                              {assignment?.percentage && (
                                <StyledLabel fontStyle="14px/19px Open Sans" textColor={titleColor} width="70px">
                                  {assignment.percentage}
                                </StyledLabel>
                              )}

                              <StyledLabel fontStyle="14px/19px Open Sans" textColor={titleColor}>
                                {assignment?.gradedNumber} Graded
                              </StyledLabel>

                              <ActionsWrapper data-cy="PresentationIcon">
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
                    )
                  );
                })}
              </SortableContainer>
            )}
          </ModuleWrapper>
        </React.Fragment>
      )
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
  margin-right: 0px;
`;

const StyledRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 48px;
  border-bottom: 1px solid ${borderGrey3};
  color: ${titleColor};
  font-size: 12px;

  &:hover {
    background: ${greyThemeLighter};
  }
`;

const StyledStatusLabel = styled(StatusLabel)`
  display: flex;
  justify-content: center;
  font-size: 10px;
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
  margin-left: 35px;

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
        }
      }
    }
  }
`;

const StyledCol = styled(Col)`
  display: flex;
  align-items: ${props => props.align || "center"};
  justify-content: ${props => props.justify || "flex-start"};
`;

const ModuleHeader = styled.div`
  display: flex;
  width: 100%;
  background: ${white};
  align-items: center;
  padding: 20px 0px;
`;

const ModuleCount = styled.div`
  cursor: pointer;
  margin-right: 20px;
  height: 25px;
  width: 25px;
  min-width: 25px;
  font: 18px Open Sans;
  font-weight: 600;
  text-align: center;
  color: white;
  background: ${greenDark6};
  box-shadow: 0px 0px 2px ${greenDark6};
`;

const ModuleTitle = styled.div`
  align-items: left;
  color: ${darkGrey2};
  font-size: 18px;
  font-weight: 600;
`;

export const EllipsisContainer = styled.div`
  white-space: nowrap;
  color: ${lightGrey6};
  font-size: ${props => props.fontSize || "12px"};
  line-height: ${props => props.lineHeight || "17px"};
  font-weight: ${props => props.fontWeight || "normal"};
  letter-spacing: 0.2px;
  max-width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CustomIcon = styled.span`
  cursor: pointer;
  margin-right: ${props => props.marginRight || 25}px;
  margin-left: ${props => props.marginLeft || 0}px;
  font-size: 16px;
  align-self: ${props => props.align || "flex-start"};
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
  border-left: 3px solid ${greenDark};
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

const StyledLink = styled(Link)`
  min-width: 121px;
  border-radius: 4px;
  height: 24px;
  color: ${lightGreen5};
  border: 1px solid ${lightGreen5};
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 9px/13px Open Sans;
  letter-spacing: 0.17px;
  font-weight: 600;
  &:hover {
    background-color: ${lightGreen5};
    color: white;
    fill: white;
  }
`;

export const AssignmentButton = styled.div`
  min-width: 121px;
  .ant-btn {
    color: ${({ assigned }) => (assigned ? white : lightGreen5)};
    border: 1px solid ${lightGreen5};
    background-color: ${({ assigned }) => (assigned ? lightGreen5 : white)};
    min-width: 121px;
    max-height: 22px;
    display: flex;
    align-items: center;
    margin: ${({ margin }) => margin};

    svg {
      fill: ${({ assigned }) => (assigned ? white : lightGreen5)};
    }
    &:hover {
      background-color: ${({ assigned }) => (assigned ? white : lightGreen5)};
      color: ${({ assigned }) => (assigned ? lightGreen5 : white)};
      border-color: ${({ assigned }) => (assigned ? white : lightGreen5)};
      svg {
        fill: ${({ assigned }) => (assigned ? lightGreen5 : white)};
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
      font: 9px/13px Open Sans;
      letter-spacing: 0.17px;
      font-weight: 600;
    }
  }
`;

export const AssignmentContent = styled.div`
  flex-direction: row;
  display: flex;
  min-width: ${props => (!props.expanded ? "30%" : "65%")};
  @media only screen and (max-width: ${mobileWidth}) {
    width: 80%;
  }
`;

const ModuleTitlePrefix = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-left: 10px;
`;

const ModuleDataWrapper = styled.div`
  width: 100%;
  display: inline-block;
`;

export const ModuleDataName = styled.div`
  display: inline-flex;
  width: 100%;
  letter-spacing: 0;
  color: ${darkGrey2};
  font: 14px/19px Open Sans;
  span {
    font-weight: 600;
  }
`;

const EllipticSpan = styled.span`
  width: ${props => props.width || "100%"};
  padding: ${props => props.padding};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  @media only screen and (max-width: ${tabletWidth}) {
    min-width: ${props => props.md || props.width};
    max-width: ${props => props.md || props.width};
  }
  @media only screen and (max-width: ${extraDesktopWidth}) {
    min-width: ${props => props.lg || props.width};
    max-width: ${props => props.lg || props.width};
  }
  @media only screen and (min-width: ${extraDesktopWidth}) {
    min-width: ${props => props.xl || props.width};
    max-width: ${props => props.xl || props.width};
  }
`;

export const AssignmentIcon = styled.span`
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  width: 30px;
`;

const Assignment = styled.div`
  padding: 10px 0px;
  display: flex;
  align-items: flex-start;
  position: relative;
  background: white !important;
  &:active ${ModuleFocused}, &:focus ${ModuleFocused}, &:hover ${ModuleFocused} {
    opacity: 1;
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

const ModuleWrapper = styled.div`
  cursor: pointer;
  & {
    padding-top: 0px;
    padding-bottom: ${props => (props.collapsed ? "0px" : "20px")};
    padding-left: 0px;
    padding-right: ${props => (props.padding ? "20px" : "0px")};
    border-bottom: 1px solid ${borderGrey4};
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

const enhance = compose(
  withRouter,
  connect(
    ({ curriculumSequence, user }) => ({
      checkedUnitItems: curriculumSequence.checkedUnitItems,
      isContentExpanded: curriculumSequence.isContentExpanded,
      assigned: curriculumSequence.assigned,
      isStudent: getUserRole({ user }) === "student",
      classId: getCurrentGroup({ user })
    }),
    {
      toggleUnitItem: toggleCheckedUnitItemAction,
      setSelectedItemsForAssign: setSelectedItemsForAssignAction,
      removeItemFromUnit: removeTestFromModuleAction,
      removeUnit: removeUnitAction,
      startAssignment: startAssignmentAction,
      resumeAssignment: resumeAssignmentAction,
      updateCurriculumSequence: putCurriculumSequenceAction
    }
  )
);

export default enhance(ModuleRow);
