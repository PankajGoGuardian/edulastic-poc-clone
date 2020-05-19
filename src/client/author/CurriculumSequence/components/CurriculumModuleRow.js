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
  mediumDesktopExactWidth,
  extraDesktopWidthMax
} from "@edulastic/colors";
import { EduButton, ProgressBar, FlexContainer, MathFormulaDisplay } from "@edulastic/common";
import { testActivityStatus } from "@edulastic/constants";
import { IconCheckSmall, IconLeftArrow, IconMoreVertical, IconVerified, IconVisualization } from "@edulastic/icons";
import { Avatar, Button, Col, Dropdown, Icon, Menu, Modal, Row as AntRow, message } from "antd";
import produce from "immer";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { useDrop } from "react-dnd";
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
import { StyledLabel, StyledTag, HideLinkLabel, InfoColumnLabel } from "../../Reports/common/styled";
import { StatusLabel } from "../../Assignments/components/TableList/styled";
import Tags from "../../src/components/common/Tags";
import { getUserRole } from "../../src/selectors/user";
import {
  playlistTestRemoveFromModuleAction,
  putCurriculumSequenceAction,
  removeUnitAction,
  setSelectedItemsForAssignAction,
  toggleCheckedUnitItemAction,
  togglePlaylistTestDetailsModalWithId,
  addSubresourceToPlaylistAction
} from "../ducks";
import { getProgressColor, getProgressData } from "../util";
import AssignmentDragItem, { SupportResourceDropTarget } from "./AssignmentDragItem";
import { PlaylistResourceRow, SubResource } from "./PlaylistResourceRow";
import PlaylistTestDetailsModal from "./PlaylistTestDetailsModal";
import { TestStatus } from "../../TestList/components/ViewModal/styled";

const SortableHOC = sortableContainer(({ children }) => <div onClick={e => e.stopPropagation()}>{children}</div>);

function OuterDropContainer({ children }) {
  const [{ isOver, contentType }, dropRef] = useDrop({
    accept: "item",
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      contentType: monitor.getItem()?.contentType
    })
  });
  const showSupportingResource = contentType != "test" && isOver;
  return (
    <div ref={dropRef}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { showNewActivity: isOver, showSupportingResource })
      )}
    </div>
  );
}

function NewActivityTargetContainer({ children, ...props }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: "item",
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      contentType: monitor.getItem()?.contentType
    }),
    drop: item => {
      const { moduleIndex, afterIndex, onDrop } = props;
      if (onDrop) {
        onDrop(moduleIndex, item, afterIndex);
      }
    }
  });

  return (
    <NewActivityTarget {...props} ref={dropRef} active={isOver}>
      {children}
    </NewActivityTarget>
  );
}

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
  const { moduleData, id, dropContent, showSupportingResource } = props;

  return (
    <AssignmentDragItemContainer>
      <SortableHandle />
      <AssignmentDragItem
        key={`${id}-${moduleData.id}`}
        contentIndex={id}
        showSupportingResource={showSupportingResource}
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
    currentAssignmentId: []
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
    const { history, playlistId } = this.props;
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
    const { removeItemFromUnit, removeItemFromDestinationPlaylist, urlHasUseThis, isManageContentActive } = this.props;

    if (urlHasUseThis || isManageContentActive) {
      removeItemFromDestinationPlaylist({ moduleIndex, itemId });
    } else {
      removeItemFromUnit({ moduleIndex, itemId });
    }
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
      hasEditAccess,
      isDesktop,
      showRightPanel,
      setEmbeddedVideoPreviewModal,
      onDrop
    } = this.props;
    const { title, _id, data = [], description = "", moduleId, moduleGroupName } = module;
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
      "white-space": "nowrap",
      opacity: module.hidden ? `.5` : `1`,
      pointerEvents: module.hidden ? "none" : "all",
      overflow: "hidden"
    };

    // eslint-disable-next-line no-use-before-define
    const ResolvedInfoColumsWrapper = isDesktop ? InfoColumnsDesktop : InfoColumnsMobile;

    const lastColumOfModuleRow =
      !hideEditOptions &&
      (completed ? (
        <LastColumn justify="flex-end" style={moduleInlineStyle}>
          <StyledLabel data-cy="module-complete" textColor={themeColorLighter} fontWeight="Bold">
            MODULE COMPLETED
            <IconVerified color={themeColorLighter} style={{ "margin-left": "20px" }} />
          </StyledLabel>
        </LastColumn>
      ) : isStudent ? (
        <LastColumn />
      ) : totalAssigned ? (
        <>
          {hasEditAccess && (
            <HideLinkLabel
              textColor={themeColor}
              fontWeight="Bold"
              data-cy={module.hidden ? "show-module" : "hide-module"}
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                this.toggleModule(module, moduleIndex);
              }}
            >
              {module.hidden ? "SHOW MODULE" : "HIDE MODULE"}
            </HideLinkLabel>
          )}
          <LastColumn justify="flex-end">
            <StyledTag
              data-cy="AssignWholeModule"
              bgColor={themeColor}
              onClick={() => (!module.hidden ? assignModule(module) : {})}
              style={moduleInlineStyle}
            >
              ASSIGN MODULE
            </StyledTag>
          </LastColumn>
        </>
      ) : (
        <LastColumn justify="flex-end" style={moduleInlineStyle}>
          <StyledTag onClick={event => event.stopPropagation()}>NO ASSIGNMENTS</StyledTag>
        </LastColumn>
      ));

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
              <ModuleHeaderData>
                <FirstColumn
                  urlHasUseThis={urlHasUseThis}
                  style={{
                    ...moduleInlineStyle,
                    marginRight: urlHasUseThis && "auto",
                    width: isDesktop ? "" : "100%"
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
                    <EllipsisContainer dangerouslySetInnerHTML={{ __html: description }} />
                  </Tooltip>
                </FirstColumn>
                {urlHasUseThis && (
                  <>
                    <ResolvedInfoColumsWrapper>
                      <ProficiencyColumn style={moduleInlineStyle}>
                        <InfoColumnLabel textColor={lightGrey5}>PROFICIENCY</InfoColumnLabel>
                        {/* TODO: Method to find Progress Percentage */}
                        <StyledProgressBar
                          strokeColor={getProgressColor(summaryData[moduleIndex]?.value)}
                          strokeWidth={13}
                          percent={summaryData[moduleIndex]?.value}
                          format={percent => (percent ? `${percent}%` : "")}
                        />
                      </ProficiencyColumn>
                      {!isStudent ? (
                        <SubmittedColumn style={{ ...moduleInlineStyle }}>
                          <InfoColumnLabel justify="center" textColor={lightGrey5}>
                            SUBMITTED
                          </InfoColumnLabel>
                          <InfoColumnLabel textColor={greyThemeDark1} padding="4px 0px" justify="center">
                            {/* TODO: Method to find submissions */}
                            {summaryData[moduleIndex]?.submitted === "-"
                              ? summaryData[moduleIndex]?.submitted
                              : `${summaryData[moduleIndex].submitted}%`}
                          </InfoColumnLabel>
                        </SubmittedColumn>
                      ) : (
                        <ScoreColumn>
                          <InfoColumnLabel justify="center" textColor={lightGrey5}>
                            SCORE
                          </InfoColumnLabel>
                          <InfoColumnLabel textColor={greyThemeDark1} padding="4px 0px" justify="center">
                            {/* TODO: Method to find sum of scores */}
                            {summaryData[moduleIndex]?.scores >= 0 && summaryData[moduleIndex]?.maxScore
                              ? `${summaryData[moduleIndex]?.scores}/${summaryData[moduleIndex]?.maxScore}`
                              : "-"}
                          </InfoColumnLabel>
                        </ScoreColumn>
                      )}
                      {!isStudent ? (
                        <ClassesColumn style={{ ...moduleInlineStyle }}>
                          <InfoColumnLabel justify="center" textColor={lightGrey5}>
                            CLASSES
                          </InfoColumnLabel>
                          <InfoColumnLabel textColor={greyThemeDark1} padding="4px 0px" justify="center">
                            {/* TODO: Method to find classes */}
                            {summaryData[moduleIndex]?.classes}
                          </InfoColumnLabel>
                        </ClassesColumn>
                      ) : (
                        <TimeColumn>
                          <InfoColumnLabel justify="center" textColor={lightGrey5}>
                            TIME SPENT
                          </InfoColumnLabel>
                          <InfoColumnLabel textColor={greyThemeDark1} padding="4px 0px" justify="center">
                            {/* TODO: Method to find Total Time Spent */}
                            {summaryData[moduleIndex]?.timeSpent}
                          </InfoColumnLabel>
                        </TimeColumn>
                      )}
                      {!isDesktop && (
                        <Dropdown overlay={lastColumOfModuleRow} trigger={["click"]}>
                          <MobileModuleActionButton
                            onClick={e => {
                              // To prevent collapse/expand row
                              e.stopPropagation();
                            }}
                          >
                            <IconMoreVertical width={5} height={14} color={themeColor} />
                          </MobileModuleActionButton>
                        </Dropdown>
                      )}
                    </ResolvedInfoColumsWrapper>
                    {isDesktop && lastColumOfModuleRow}
                  </>
                )}
              </ModuleHeaderData>
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

                  const assessmentsLastColumn = urlHasUseThis ? (
                    !isStudent ? (
                      <>
                        {hasEditAccess && (!hideEditOptions || (status === "published" && mode === "embedded")) && (
                          <HideLinkLabel
                            textColor={themeColor}
                            fontWeight="Bold"
                            data-cy={moduleData.hidden ? "make-visible" : "make-hidden"}
                            onClick={() => this.hideTest(module._id, moduleData)}
                          >
                            {moduleData.hidden ? "SHOW" : "HIDE"}
                          </HideLinkLabel>
                        )}
                        <LastColumn align="flex-start" justify="flex-end" paddingRight="0">
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
                              <AssignmentButton data-cy="assignButton" assigned={isAssigned} style={rowInlineStyle}>
                                <Button onClick={() => assignTest(_id, moduleData.contentId)} style={{ width: 124 }}>
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
                      </>
                    ) : (
                      !moduleData.hidden && (
                        <>
                          <LastColumn>
                            <AssignmentButton assigned={false}>
                              <Button data-cy={uta.text} onClick={uta.action}>
                                {uta.text}
                              </Button>
                            </AssignmentButton>
                          </LastColumn>
                          {uta.retake && (
                            <LastColumn>
                              <AssignmentButton assigned={false}>
                                <Button data-cy={uta.retake.text} onClick={uta.retake.action}>
                                  {uta.retake.text}
                                </Button>
                              </AssignmentButton>
                            </LastColumn>
                          )}
                        </>
                      )
                    )
                  ) : (
                    <LastColumn>
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
                  );

                  const assessmentInfoProgress = (
                    <ResolvedInfoColumsWrapper>
                      <ProficiencyColumn style={rowInlineStyle}>
                        {/* TODO: Method to display progress for assignments */}
                        <StyledProgressBar
                          strokeColor={getProgressColor(progressData?.progress)}
                          strokeWidth={13}
                          percent={progressData?.progress}
                          format={percent => (percent ? `${percent}%` : "")}
                        />
                      </ProficiencyColumn>
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
                      {!isDesktop && (
                        <Dropdown overlay={assessmentsLastColumn} trigger={["click"]}>
                          <MobileModuleActionButton>
                            <IconMoreVertical color={themeColor} />
                          </MobileModuleActionButton>
                        </Dropdown>
                      )}
                    </ResolvedInfoColumsWrapper>
                  );

                  const testType = (
                    <CustomIcon marginLeft={10} marginRight={5}>
                      {urlHasUseThis && (!isAssigned || moduleData.assignments[0].testType === "practice") ? (
                        <Avatar size={18} style={{ backgroundColor: testTypeColor.practice, fontSize: "13px" }}>
                          {" P "}
                        </Avatar>
                      ) : (
                        <Avatar
                          size={18}
                          style={{
                            backgroundColor:
                              testTypeColor[(moduleData.assignments?.[0]?.testType)] ||
                              testTypeColor[moduleData.testType],
                            fontSize: "13px"
                          }}
                        >
                          {moduleData.assignments?.[0]?.testType[0].toUpperCase() ||
                            moduleData.testType[0].toUpperCase() ||
                            null}
                        </Avatar>
                      )}
                    </CustomIcon>
                  );

                  const testTypeAndTags = (
                    <FlexContainer
                      height="25px"
                      marginLeft={!showRightPanel ? "16px" : ""}
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Tags
                        margin="5px 0px 0px 0px"
                        flexWrap="nowrap"
                        tags={moduleData.standardIdentifiers}
                        completed={!hideEditOptions && contentCompleted}
                        show={2}
                        isPlaylist
                      />
                      {!urlHasUseThis && (
                        <TestStatus status={moduleData.status} view="tile" noMargin={!moduleData.standardIdentifiers}>
                          {moduleData.status}
                        </TestStatus>
                      )}
                      {testType}
                    </FlexContainer>
                  );

                  if (mode === "embedded") {
                    return (
                      <OuterDropContainer>
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
                          urlHasUseThis={urlHasUseThis}
                          setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
                          infoColumn={assessmentInfoProgress}
                          testTypeAndTags={testTypeAndTags}
                          isDesktop={isDesktop}
                          showRightPanel={showRightPanel}
                          toggleTest={() => this.hideTest(module._id, moduleData)}
                          {...this.props}
                        />
                        <NewActivityTargetContainer moduleIndex={moduleIndex} afterIndex={index} onDrop={onDrop}>
                          New activity
                        </NewActivityTargetContainer>
                      </OuterDropContainer>
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
                          <DragHandle>
                            <FaChevronRight color={lightGrey5} />
                          </DragHandle>
                          {contentType !== "test" ? (
                            <PlaylistResourceRow
                              data={moduleData}
                              urlHasUseThis={urlHasUseThis}
                              showResource={this.showResource}
                              setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
                            />
                          ) : (
                            <AntRow type="flex" gutter={10} align="middle" style={{ width: "calc(100% - 35px)" }}>
                              <FirstColumn
                                data-cy="assigment-row-first"
                                urlHasUseThis={urlHasUseThis}
                                style={{
                                  ...rowInlineStyle,
                                  marginRight: urlHasUseThis && "auto",
                                  width: isDesktop ? "" : "100%"
                                }}
                              >
                                <ModuleDataWrapper display={showRightPanel || !isDesktop ? "block" : "flex"}>
                                  <ModuleDataName
                                    onClick={() =>
                                      !isStudent && togglePlaylistTestDetails({ id: moduleData?.contentId })
                                    }
                                  >
                                    <Tooltip placement="bottomLeft" title={moduleData.contentTitle}>
                                      <EllipticSpan width={urlHasUseThis ? "calc(100% - 30px)" : "auto"}>
                                        {moduleData.contentTitle}
                                      </EllipticSpan>
                                    </Tooltip>
                                    {!isDesktop && testTypeAndTags}
                                  </ModuleDataName>
                                  {isDesktop && testTypeAndTags}
                                  {moduleData?.resources?.length > 0 && (
                                    <SubResource
                                      data={moduleData}
                                      urlHasUseThis={urlHasUseThis}
                                      showResource={this.showResource}
                                      setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
                                    />
                                  )}
                                </ModuleDataWrapper>
                              </FirstColumn>

                              {urlHasUseThis && assessmentInfoProgress}
                              {isDesktop && assessmentsLastColumn}
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
  width: 100%;
  justify-content: stretch;
`;

const DragHandle = styled.div`
  color: ${themeColor};
  background: ${white};
  width: 35px;
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
        }
      }
    }
  }
`;

const StyledCol = styled(Col)`
  display: flex;
  align-items: ${props => props.align || "center"};
  justify-content: ${props => props.justify || "flex-start"};
  padding-right: ${({ paddingRight }) => (paddingRight ? `${paddingRight} !important` : "")};
  width: ${({ width }) => width};
  margin-left: ${({ marginLeft }) => marginLeft};
`;

const FirstColumn = styled(Col)`
  /* width: ${props => (props.urlHasUseThis ? "calc(100% - 550px)" : props.reviewWidth)};
  @media (max-width: ${mediumDesktopExactWidth}) {
    width: ${props => (props.urlHasUseThis ? "calc(100% - 500px)" : props.reviewWidth)};
  } */
`;

const InfoColumnsMobile = styled(StyledCol)`
  width: 100%;
  position: relative;
  padding-right: 35px;
`;

const InfoColumnsDesktop = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const StyledProgressBar = styled(ProgressBar)`
  & .ant-progress-text {
    @media (max-width: ${extraDesktopWidthMax}) {
      font-size: 10px;
    }
  }
`;

const MobileModuleActionButton = styled.div`
  width: 30px;
  height: 100%;
  right: 0px;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
`;

export const LastColumn = styled(StyledCol)`
  justify-content: flex-start;
  width: 165px;
  margin-left: 15px;
  flex-shrink: 0;
`;

const ProficiencyColumn = styled(Col)`
  width: 130px;

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 100px;
  }
`;

const SubmittedColumn = styled(Col)`
  width: 100px;

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 80px;
  }
`;

const TimeColumn = styled(SubmittedColumn)`
  width: 85px;
  @media (max-width: ${extraDesktopWidthMax}) {
    width: 70px;
  }
`;

const ClassesColumn = styled(Col)`
  width: 90px;

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 65px;
  }
`;

const ScoreColumn = styled(ClassesColumn)`
  width: 90px;

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 65px;
  }
`;

const ModuleHeader = styled.div`
  display: flex;
  width: 100%;
  background: ${white};
  align-items: center;
  padding: 20px 0px;

  @media (max-width: ${desktopWidth}) {
    align-items: flex-start;
  }
`;

const ModuleHeaderData = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 35px);
  /* justify={urlHasUseThis && "end"} style={{  }} */
`;

const ModuleID = styled.div`
  margin-right: ${props => props.marginRight || "10px"};
  max-width: 60px;
  color: ${white};
  background: ${greenDark6};
  font-size: 16px;
  border-radius: 2px;
  font-weight: 600;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 25px;
    height: 25px;
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

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 14px;
  }
`;

export const EllipsisContainer = styled(MathFormulaDisplay)`
  white-space: nowrap;
  color: ${lightGrey6};
  font-size: ${props => props.fontSize || "12px"};
  line-height: ${props => props.lineHeight || "17px"};
  font-weight: ${props => props.fontWeight || "normal"};
  letter-spacing: 0.2px;
  max-width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${extraDesktopWidthMax}) {
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
  @media only screen and (max-width: ${desktopWidth}) {
    margin-left: 0;
    justify-items: flex-start;
  }
`;

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
  min-width: 118px;
  .ant-btn {
    color: ${({ assigned }) => (assigned ? white : themeColor)};
    border: 1px solid ${themeColor};
    background-color: ${({ assigned }) => (assigned ? themeColor : white)};
    min-width: 128px;
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
  display: ${({ display }) => `inline-${display}`};
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
  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 11px;
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
  @media (max-width: ${extraDesktopWidthMax}) {
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
  width: 15px;
`;

const Assignment = styled.div`
  padding: 10px 0px;
  display: flex;
  align-items: stretch;
  position: relative;
  background: white !important;
  &:active ${ModuleFocused}, &:focus ${ModuleFocused}, &:hover ${ModuleFocused} {
    opacity: 1;
  }

  @media only screen and (max-width: ${desktopWidth}) {
    flex-direction: column;
    padding-left: 8px;
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

const NewActivityTarget = styled(SupportResourceDropTarget)`
  width: 300px;
  text-align: center;
  display: ${({ showNewActivity }) => (showNewActivity ? "block" : "none")};
  height: 50px;
  line-height: 50px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 70px;
`;

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
      togglePlaylistTestDetails: togglePlaylistTestDetailsModalWithId,
      addSubresource: addSubresourceToPlaylistAction
    }
  )
);

export default enhance(ModuleRow);
