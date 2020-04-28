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
  lightGrey5,
  lightGrey6,
  mainBgColor,
  mobileWidth,
  tabletWidth,
  testTypeColor,
  themeColor,
  themeColorLighter,
  titleColor,
  white,
  mediumDesktopExactWidth
} from "@edulastic/colors";
import { EduButton, ProgressBar } from "@edulastic/common";
import { testActivityStatus } from "@edulastic/constants";
import { IconCheckSmall, IconLeftArrow, IconMoreVertical, IconVerified, IconVisualization } from "@edulastic/icons";
import { Avatar, Button, Col, Dropdown, Icon, Menu, Modal, Row as AntRow, message } from "antd";
import produce from "immer";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { FaBars, FaChevronRight } from "react-icons/fa";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";
import { compose } from "redux";
import styled from "styled-components";
import { pick } from "lodash";
import { curriculumSequencesApi } from "@edulastic/api";
import AssessmentPlayer from "../../../assessment";
import { Tooltip } from "../../../common/utils/helpers";
import { resumeAssignmentAction, startAssignmentAction } from "../../../student/Assignments/ducks";
import { getCurrentGroup } from "../../../student/Login/ducks";
import additemsIcon from "../../Assignments/assets/add-items.svg";
import piechartIcon from "../../Assignments/assets/pie-chart.svg";
import presentationIcon from "../../Assignments/assets/presentation.svg";
import { removeTestFromModuleAction } from "../../PlaylistPage/ducks";
import { StyledLabel, StyledTag, HideLinkLabel } from "../../Reports/common/styled";
import { StatusLabel } from "../../Assignments/components/TableList/styled";
import Tags from "../../src/components/common/Tags";
import { getUserRole } from "../../src/selectors/user";
import {
  playlistTestRemoveFromModuleAction,
  putCurriculumSequenceAction,
  removeUnitAction,
  setSelectedItemsForAssignAction,
  toggleCheckedUnitItemAction,
  togglePlaylistTestDetailsModalWithId
} from "../ducks";
import { getProgressColor, getProgressData } from "../util";
import AssignmentDragItem from "./AssignmentDragItem";
import { LTIResourceRow } from "./LTIResourceRow";
import PlaylistTestDetailsModal from "./PlaylistTestDetailsModal";

const SortableHOC = sortableContainer(({ children }) => (
  <div style={{ marginLeft: "30px" }} onClick={e => e.stopPropagation()}>
    {children}
  </div>
));

const SortableContainer = props => {
  const { mode, children } = props;
  return mode === "embedded" ? (
    <SortableHOC {...props}>{children}</SortableHOC>
  ) : (
    <div style={{ marginLeft: "30px" }}>{children}</div>
  );
};

const SortableHandle = sortableHandle(() => (
  <DragHandle>
    <FaBars />
  </DragHandle>
));

const SortableElement = sortableElement(props => {
  const { moduleData, id, dropContent } = props;

  return (
    <AssignmentDragItemContainer>
      <SortableHandle />
      <AssignmentDragItem
        key={`${id}-${moduleData.id}`}
        contentIndex={id}
        handleDrop={dropContent}
        onClick={e => e.stopPropagation()}
        {...props}
      />
    </AssignmentDragItemContainer>
  );
});

export const submitLTIForm = signedRequest => {
  if (signedRequest) {
    const ltiForm = document.createElement("form");
    ltiForm.style.display = "none";
    ltiForm.setAttribute("target", "_blank");
    ltiForm.setAttribute("action", "https://edulasticv2-lti.snapwiz.net/launch-lti");
    ltiForm.setAttribute("method", "POST");
    ltiForm.setAttribute("id", "lti-review-form");
    const formBody = Object.keys(signedRequest)
      .map(key => `<input name="${key}" value="${signedRequest[key]}" type="text" />`)
      .join("");
    ltiForm.innerHTML = formBody;
    document.body.appendChild(ltiForm);
    ltiForm.submit();
    document.body.removeChild(ltiForm);
  }
};

/** @extends Component<Props> */
class ModuleRow extends Component {
  state = {
    showModal: false,
    selectedTest: "",
    currentAssignmentId: [],
    showResourceModal: false
  };

  /**
   * @param {import('./CurriculumSequence').Module} module
   */
  assignModule = module => {
    const { setSelectedItemsForAssign, history, playlistId } = this.props;

    const moduleItemsIds = [];
    module.data.forEach(item => {
      if (item.contentType === "test") {
        moduleItemsIds.push(item.contentId);
      }
    });
    setSelectedItemsForAssign(moduleItemsIds);
    history.push({
      pathname: `/author/playlists/assignments/${playlistId}/${module._id}`,
      state: { from: "myPlaylist", fromText: "My Playlist", toUrl: `/author/playlists/playlist/${playlistId}/use-this` }
    });
  };

  assignTest = (moduleId, testId) => {
    const { history, playlistId, location } = this.props;
    history.push({
      pathname: `/author/playlists/assignments/${playlistId}/${moduleId}/${testId}`,
      state: { from: "myPlaylist", fromText: "My Playlist", toUrl: `/author/playlists/playlist/${playlistId}/use-this` }
    });
  };

  viewTest = testId => {
    this.setState({
      showModal: true,
      selectedTest: testId
    });
  };

  deleteTest = (moduleIndex, itemId) => {
    const {
      removeItemFromUnit,
      removeItemFromDestinationPlaylist,
      urlHasUseThis,
      mode,
      isManageContentActive
    } = this.props;

    if (urlHasUseThis || isManageContentActive) {
      removeItemFromDestinationPlaylist({ moduleIndex, itemId });
    } else {
      removeItemFromUnit({ moduleIndex, itemId });
    }
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      showResourceModal: false
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
    const { classId: groupId, playlistClassList, startAssignment, resumeAssignment, playlistId, history } = this.props;
    const testId = uta.testId || moduleData.contentId;

    if (isAssigned) {
      // TODO: filter out the assignments in assignmentRows by classIds in case of multiple assignments
      const { testType, assignmentId, classId, maxAttempts } = assignmentRows[0] || {};
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
        redirect: uta.redirect,
        attempts: uta.totalAttempts
      };
      const isRedirected = assignmentRows.find(el => el.redirect);
      if (isRedirected && uta.redirect) {
        uta.isRedirected = true;
        uta.text = "RETAKE";
        uta.action = () => startAssignment(uta);
      } else if (uta.taStatus === testActivityStatus.SUBMITTED && uta.utaAssignmentId) {
        uta.text = "REVIEW";
        uta.action = () =>
          history.push({
            pathname: `/home/class/${uta.classId}/test/${uta.testId}/testActivityReport/${uta.testActivityId}`,
            fromPlayList: true
          });
        if (uta.attempts < maxAttempts) {
          uta.retake = {
            text: "RETAKE",
            action: () => startAssignment(uta)
          };
        }
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

  showResource = async (contentId, resource) => {
    resource = resource && pick(resource, ["toolProvider", "url", "customParams", "consumerKey", "sharedSecret"]);
    const { playlistId, module } = this.props;
    try {
      const signedRequest = await curriculumSequencesApi.getSignedRequest({
        playlistId,
        moduleId: module._id,
        contentId,
        resource
      });
      submitLTIForm(signedRequest);
    } catch (e) {
      message.error("Failed to load the resource");
    }
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
      playlistId,
      playlistTestDetailsModalData,
      togglePlaylistTestDetails,
      customize,
      hasEditAccess
    } = this.props;
    const { title, _id, data = [], description = "", moduleId, moduleGroupName } = module;
    const { assignModule, assignTest } = this;

    const totalAssigned = data.length;
    // const numberOfAssigned = data.filter(
    //   content => content.assignments && content.assignments.length > 0
    // ).length;
    const { showModal, selectedTest, currentAssignmentId, showResourceModal } = this.state;

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
      "white-space": "nowrap",
      opacity: module.hidden ? `.5` : `1`,
      pointerEvents: module.hidden ? "none" : "all"
    };

    return (
      (isStudent && module.hidden) || (
        <React.Fragment>
          {showModal && (
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
          )}

          <ModuleWrapper
            data-cy={`row-module-${moduleIndex + 1}`}
            key={`${data.length}-${module.id}`}
            collapsed={collapsed}
            padding={padding}
            onClick={() => onCollapseExpand(moduleIndex)}
          >
            <ModuleHeader>
              <ModuleID>
                <span>{moduleId || moduleIndex + 1}</span>
              </ModuleID>
              <AntRow type="flex" gutter={10} justify={urlHasUseThis && "end"} style={{ width: "calc(100% - 25px)" }}>
                <FirstColumn
                  urlHasUseThis={urlHasUseThis}
                  reviewWidth="100%"
                  style={{
                    ...moduleInlineStyle,
                    marginRight: urlHasUseThis && "auto"
                  }}
                >
                  <StyledLabel fontWeight="normal" textColor={lightGrey5}>
                    {moduleGroupName}
                  </StyledLabel>
                  <ModuleTitleWrapper>
                    <Tooltip title={title}>
                      <ModuleTitle data-cy="module-name">{title}</ModuleTitle>
                    </Tooltip>
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
                </FirstColumn>
                {urlHasUseThis && (
                  <>
                    <Col style={{ ...moduleInlineStyle, width: "130px" }}>
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
                      <SubmittedColumn style={{ ...moduleInlineStyle }}>
                        <StyledLabel justify="center" textColor={lightGrey5}>
                          SUBMITTED
                        </StyledLabel>
                        <StyledLabel textColor={greyThemeDark1} padding="4px 0px" justify="center">
                          {/* TODO: Method to find submissions */}
                          {summaryData[moduleIndex]?.submitted === "-"
                            ? summaryData[moduleIndex]?.submitted
                            : `${summaryData[moduleIndex].submitted}%`}
                        </StyledLabel>
                      </SubmittedColumn>
                    ) : (
                      <ScoreColumn>
                        <StyledLabel justify="center" textColor={lightGrey5}>
                          SCORE
                        </StyledLabel>
                        <StyledLabel textColor={greyThemeDark1} padding="4px 0px" justify="center">
                          {/* TODO: Method to find sum of scores */}
                          {summaryData[moduleIndex]?.scores >= 0 && summaryData[moduleIndex]?.maxScore
                            ? `${summaryData[moduleIndex]?.scores}/${summaryData[moduleIndex]?.maxScore}`
                            : "-"}
                        </StyledLabel>
                      </ScoreColumn>
                    )}
                    {!isStudent ? (
                      <ClassesColumn style={{ ...moduleInlineStyle }}>
                        <StyledLabel justify="center" textColor={lightGrey5}>
                          CLASSES
                        </StyledLabel>
                        <StyledLabel textColor={greyThemeDark1} padding="4px 0px" justify="center">
                          {/* TODO: Method to find classes */}
                          {summaryData[moduleIndex]?.classes}
                        </StyledLabel>
                      </ClassesColumn>
                    ) : (
                      <TimeColumn>
                        <StyledLabel justify="center" textColor={lightGrey5}>
                          TIME SPENT
                        </StyledLabel>
                        <StyledLabel textColor={greyThemeDark1} padding="4px 0px" justify="center">
                          {/* TODO: Method to find Total Time Spent */}
                          {summaryData[moduleIndex]?.timeSpent}
                        </StyledLabel>
                      </TimeColumn>
                    )}
                  </>
                )}
                {!hideEditOptions &&
                  (completed ? (
                    <LastColumn width={isStudent ? "160px" : null} justify="flex-end" style={moduleInlineStyle}>
                      <StyledLabel data-cy="module-complete" textColor={themeColorLighter} fontWeight="Bold">
                        MODULE COMPLETED
                        <IconVerified color={themeColorLighter} style={{ "margin-left": "20px" }} />
                      </StyledLabel>
                    </LastColumn>
                  ) : isStudent ? (
                    <LastColumn width="160px" />
                  ) : totalAssigned ? (
                    <LastColumn justify="flex-end">
                      {hasEditAccess && (
                        <StyledLabel
                          textColor={themeColor}
                          fontWeight="Bold"
                          padding="10px 20px 10px 0px"
                          data-cy={module.hidden ? "show-module" : "hide-module"}
                          onClick={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            this.toggleModule(module, moduleIndex);
                          }}
                        >
                          {module.hidden ? "SHOW" : "HIDE"}
                        </StyledLabel>
                      )}
                      <StyledTag
                        data-cy="AssignWholeModule"
                        bgColor={themeColor}
                        onClick={() => (!module.hidden ? assignModule(module) : {})}
                        style={moduleInlineStyle}
                        width="154px"
                        height="32px"
                        bgColor={themeColor}
                      >
                        ASSIGN MODULE
                      </StyledTag>
                    </LastColumn>
                  ) : (
                    <LastColumn justify="flex-end" style={moduleInlineStyle}>
                      <StyledTag onClick={event => event.stopPropagation()}>NO ASSIGNMENTS</StyledTag>
                    </LastColumn>
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
                  const { assignments = [], contentId, contentType } = moduleData;
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
                    const { testType, _id: assignmentId, maxAttempts } = assignment;
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
                        redirect,
                        maxAttempts
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
                        showResource={this.showResource}
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
                            color={lightGrey5}
                            style={{ margin: urlHasUseThis ? "4px 15px" : "4px 15px 0px 43px" }}
                          />
                          {contentType === "lti_resource" ? (
                            <LTIResourceRow
                              data={moduleData}
                              urlHasUseThis={urlHasUseThis}
                              showResource={this.showResource}
                            />
                          ) : (
                            <AntRow type="flex" gutter={10} align="top" style={{ width: "calc(100% - 25px)" }}>
                              <FirstColumn
                                urlHasUseThis={urlHasUseThis}
                                reviewWidth="calc(100% - 160px)"
                                style={{
                                  ...rowInlineStyle,
                                  marginRight: urlHasUseThis && "auto"
                                }}
                              >
                                <ModuleDataWrapper>
                                  <ModuleDataName
                                    onClick={() =>
                                      !isStudent && togglePlaylistTestDetails({ id: moduleData?.contentId })
                                    }
                                  >
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
                              </FirstColumn>
                              {urlHasUseThis ? (
                                <>
                                  <StyledCol width="130px" style={rowInlineStyle}>
                                    {/* TODO: Method to display progress for assignments */}
                                    <ProgressBar
                                      strokeColor={getProgressColor(progressData?.progress)}
                                      strokeWidth={13}
                                      percent={progressData?.progress}
                                      format={percent => (percent ? `${percent}%` : "")}
                                    />
                                  </StyledCol>
                                  {!isStudent ? (
                                    <SubmittedColumn style={rowInlineStyle}>
                                      <StyledLabel textColor={greyThemeDark1} padding="2px" justify="center">
                                        {/* TODO: Method to find submissions for each assignment */}
                                        {progressData?.submitted ? `${progressData?.submitted}%` : "-"}
                                      </StyledLabel>
                                    </SubmittedColumn>
                                  ) : (
                                    <ScoreColumn style={rowInlineStyle}>
                                      <StyledLabel textColor={greyThemeDark1} padding="2px" justify="center">
                                        {/* TODO: Method to find sum of scores for each assignment */}
                                        {progressData?.scores >= 0 && progressData?.maxScore
                                          ? `${progressData?.scores}/${progressData?.maxScore}`
                                          : "-"}
                                      </StyledLabel>
                                    </ScoreColumn>
                                  )}
                                  {!isStudent ? (
                                    <ClassesColumn style={rowInlineStyle}>
                                      <StyledLabel textColor={greyThemeDark1} padding="2px" justify="center">
                                        {/* TODO: Method to find classes for each assignment */}
                                        {progressData?.classes || "-"}
                                      </StyledLabel>
                                    </ClassesColumn>
                                  ) : (
                                    <TimeColumn style={rowInlineStyle}>
                                      <StyledLabel textColor={greyThemeDark1} padding="2px" justify="center">
                                        {/* TODO: Method to find Total Time Spent for each assignment */}
                                        {progressData?.timeSpent}
                                      </StyledLabel>
                                    </TimeColumn>
                                  )}

                                  {!isStudent ? (
                                    <LastColumn align="flex-start" justify="flex-end" paddingRight="0">
                                      {hasEditAccess &&
                                        (!hideEditOptions || (status === "published" && mode === "embedded")) && (
                                          <HideLinkLabel
                                            textColor={themeColor}
                                            fontWeight="Bold"
                                            data-cy={moduleData.hidden ? "make-visible" : "make-hidden"}
                                            onClick={() => this.hideTest(module._id, moduleData)}
                                          >
                                            {moduleData.hidden ? "SHOW" : "HIDE"}
                                          </HideLinkLabel>
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
                                              style={{ padding: "0 6px" }}
                                            >
                                              <IconCheckSmall color={white} />
                                              &nbsp;&nbsp;
                                              {currentAssignmentId.includes(moduleData.contentId)
                                                ? "HIDE ASSIGNMENTS"
                                                : "SHOW ASSIGNMENTS"}
                                            </Button>
                                          </AssignmentButton>
                                        ) : (
                                          <AssignmentButton
                                            data-cy="assignButton"
                                            assigned={isAssigned}
                                            style={rowInlineStyle}
                                          >
                                            <Button
                                              onClick={() => assignTest(_id, moduleData.contentId)}
                                              style={{ width: 124 }}
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
                                              marginLeft={15}
                                              marginRight={15}
                                              align="auto"
                                              style={rowInlineStyle}
                                            >
                                              <IconMoreVertical width={5} height={14} color={themeColor} />
                                            </CustomIcon>
                                          </Dropdown>
                                        ))}
                                    </LastColumn>
                                  ) : (
                                    !moduleData.hidden && (
                                      <>
                                        <LastColumn width="160px">
                                          <AssignmentButton assigned={false}>
                                            <Button data-cy={uta.text} onClick={uta.action}>
                                              {uta.text}
                                            </Button>
                                          </AssignmentButton>
                                        </LastColumn>
                                        {uta.retake && (
                                          <LastColumn width="160px">
                                            <AssignmentButton assigned={false}>
                                              <Button data-cy={uta.retake.text} onClick={uta.retake.action}>
                                                {uta.retake.text}
                                              </Button>
                                            </AssignmentButton>
                                          </LastColumn>
                                        )}
                                      </>
                                    )
                                  )}
                                </>
                              ) : (
                                <LastColumn width="160px">
                                  <EduButton
                                    isGhost
                                    height="22px"
                                    width="124px"
                                    style={{ padding: "0px 15px" }}
                                    onClick={() => this.viewTest(moduleData?.contentId)}
                                  >
                                    <IconVisualization width="14px" height="14px" />
                                    Preview
                                  </EduButton>
                                </LastColumn>
                              )}
                            </AntRow>
                          )}
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
                              <StyledLabel textColor={titleColor}>
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

                              <StyledLabel textColor={titleColor} width="150px">
                                {`Submitted ${assignment?.submittedCount || 0} of ${assignment?.assignedCount || 0}`}
                              </StyledLabel>

                              {/* TODO: Display percentage completion for each assignment row */}
                              {assignment?.percentage && (
                                <StyledLabel textColor={titleColor} width="70px">
                                  {assignment.percentage}
                                </StyledLabel>
                              )}

                              <StyledLabel textColor={titleColor}>{assignment?.gradedNumber} Graded</StyledLabel>

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
          {playlistTestDetailsModalData?.isVisible && (
            <PlaylistTestDetailsModal
              onClose={togglePlaylistTestDetails}
              modalInitData={playlistTestDetailsModalData}
              viewAsStudent={this.viewTest}
            />
          )}
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
  padding-right: ${({ paddingRight }) => paddingRight} !important;
  width: ${({ width }) => width};
  margin-left: ${({ marginLeft }) => marginLeft};
`;

const FirstColumn = styled(Col)`
  width: ${props => (props.urlHasUseThis ? "calc(100% - 640px)" : props.reviewWidth)};
  @media (max-width: ${mediumDesktopExactWidth}) {
    width: ${props => (props.urlHasUseThis ? "calc(100% - 500px)" : props.reviewWidth)};
  }
`;

const LastColumn = styled(StyledCol)`
  width: ${props => props.width || "250px"};
  justify-content: flex-end;

  @media (max-width: ${mediumDesktopExactWidth}) {
    width: ${props => props.width || "220px"};
  }
`;

const SubmittedColumn = styled(Col)`
  width: 100px;

  @media (max-width: ${mediumDesktopExactWidth}) {
    width: 80px;
  }
`;

const TimeColumn = styled(SubmittedColumn)`
  @media (max-width: ${mediumDesktopExactWidth}) {
    width: 85px;
  }
`;

const ClassesColumn = styled(Col)`
  width: 90px;

  @media (max-width: ${mediumDesktopExactWidth}) {
    width: 65px;
  }
`;

const ScoreColumn = styled(ClassesColumn)``;

const ModuleHeader = styled.div`
  display: flex;
  width: 100%;
  background: ${white};
  align-items: center;
  padding: 20px 0px;
`;

const ModuleID = styled.div`
  margin-right: ${props => props.marginRight || "10px"};
  width: 100%;
  max-width: 64px;
  span {
    display: block;
    width: fit-content;
    margin: auto;
    min-width: 38px;
    max-width: 64px;
    min-height: 30px;
    color: ${white};
    background: ${greenDark6};
    text-align: center;
    font-size: 16px;
    padding: 4px 6px;
    border-radius: 2px;
    font-weight: 600;
    user-select: none;
  }
`;

const ModuleTitle = styled.div`
  align-items: left;
  color: ${darkGrey2};
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: 14px;
  }
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

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: 12px;
  }
`;

export const CustomIcon = styled.span`
  cursor: pointer;
  margin-right: ${props => props.marginRight || 0}px;
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

export const AssignmentButton = styled.div`
  min-width: 121px;
  .ant-btn {
    color: ${({ assigned }) => (assigned ? white : themeColor)};
    border: 1px solid ${themeColor};
    background-color: ${({ assigned }) => (assigned ? themeColor : white)};
    min-width: 121px;
    max-height: 22px;
    display: flex;
    align-items: center;
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
  width: ${({ isReview }) => (isReview ? "auto" : "100%")};
  letter-spacing: 0;
  color: ${darkGrey2};
  font: 14px/19px Open Sans;
  cursor: ${({ isReview }) => isReview && "pointer"};
  span {
    font-weight: 600;
  }
`;

export const EllipticSpan = styled.span`
  width: ${props => props.width || "100%"};
  padding: ${props => props.padding};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  @media only screen and (max-width: ${tabletWidth}) {
    min-width: ${props => props.md || props.width};
    max-width: ${props => props.md || props.width};
  }
  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: 11px;
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
  margin-left: 12px;
  margin-right: ${props => props.marginRight || "0px"};
  width: 20px;
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
      userRole: getUserRole({ user }),
      isStudent: getUserRole({ user }) === "student",
      classId: getCurrentGroup({ user }),
      playlistTestDetailsModalData: curriculumSequence?.playlistTestDetailsModal
    }),
    {
      toggleUnitItem: toggleCheckedUnitItemAction,
      setSelectedItemsForAssign: setSelectedItemsForAssignAction,
      removeItemFromUnit: removeTestFromModuleAction,
      removeItemFromDestinationPlaylist: playlistTestRemoveFromModuleAction,
      removeUnit: removeUnitAction,
      startAssignment: startAssignmentAction,
      resumeAssignment: resumeAssignmentAction,
      updateCurriculumSequence: putCurriculumSequenceAction,
      togglePlaylistTestDetails: togglePlaylistTestDetailsModalWithId
    }
  )
);

export default enhance(ModuleRow);
