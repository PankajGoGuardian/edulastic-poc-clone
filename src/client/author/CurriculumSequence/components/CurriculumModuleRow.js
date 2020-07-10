import { lightGrey5, testTypeColor, themeColor, white } from "@edulastic/colors";
import { FlexContainer, notification } from "@edulastic/common";
import { testActivityStatus, roleuser } from "@edulastic/constants";
import { IconCheckSmall, IconLeftArrow, IconMoreVertical, IconVisualization, IconTrash } from "@edulastic/icons";
import { Avatar, Button, Dropdown, Menu, Col } from "antd";
import produce from "immer";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import { useDrop } from "react-dnd";
import { FaBars, FaChevronRight } from "react-icons/fa";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";
import { compose } from "redux";
import { pick } from "lodash";
import { curriculumSequencesApi } from "@edulastic/api";
import AssessmentPlayer from "../../../assessment";
import { Tooltip } from "../../../common/utils/helpers";
import { resumeAssignmentAction, startAssignmentAction } from "../../../student/Assignments/ducks";
import { getCurrentGroup, proxyRole } from "../../../student/Login/ducks";
import { removeTestFromModuleAction } from "../../PlaylistPage/ducks";
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
import { getProgressData } from "../util";
import ModuleRowView, { InfoProgressBar } from "./ModuleRowView";
import AssignmentDragItem from "./AssignmentDragItem";
import { PlaylistResourceRow, SubResource, AddResourceToPlaylist } from "./PlaylistResourceRow";
import PlaylistTestDetailsModal from "./PlaylistTestDetailsModal";
import AssignmentsClasses from "./AssignmentsClasses";
import { TestStatus } from "../../TestList/components/ViewModal/styled";
// import { SupportResourceDropTarget } from "./PlaylistResourceRow/styled";

import {
  AssignmentRowContainer,
  DragHandle,
  ModalWrapper,
  IconActionButton,
  LastColumn,
  CustomIcon,
  ModuleFocused,
  AssignmentButton,
  ModuleDataWrapper,
  ModuleDataName,
  Assignment,
  ModuleWrapper,
  HideLinkLabel
} from "./styled";

const IS_ASSIGNED = "ASSIGNED";
const NOT_ASSIGNED = "ASSIGN";

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

const ResourceActivity = props => {
  const { moduleData, id, dropContent, showSupportingResource, droppedItemId } = props;

  return (
    <AssignmentRowContainer highlightMode={droppedItemId === moduleData.contentId}>
      <SortableHandle onClick={e => e && e.stopPropagation()} />
      <AssignmentDragItem
        key={`${id}-${moduleData.id}`}
        contentIndex={id}
        showSupportingResource={showSupportingResource}
        handleDrop={dropContent}
        onClick={e => e && e.stopPropagation()}
        {...props}
      />
    </AssignmentRowContainer>
  );
};

function OuterDropContainer({ children }) {
  const [{ isOver, contentType }, dropRef] = useDrop({
    accept: "item",
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      contentType: monitor.getItem()?.contentType
    }),
    canDrop: item => !!item?.contentType
  });

  /**
   * if contentType is undefined or null, that means its reordering
   */
  const showSupportingResource = contentType && contentType != "test" && isOver;
  return (
    <div ref={dropRef}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { showNewActivity: contentType && isOver, showSupportingResource })
      )}
    </div>
  );
}

const SortableElement = sortableElement(props => {
  const { onDrop, id, moduleIndex, isTestType, fromPlaylist } = props;
  return (
    <OuterDropContainer>
      <ResourceActivity {...props} />
      <AddResourceToPlaylist
        onDrop={onDrop}
        index={id}
        moduleIndex={moduleIndex}
        isTestType={isTestType}
        fromPlaylist={fromPlaylist}
      />
    </OuterDropContainer>
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
    const { removeItemFromUnit, removeItemFromDestinationPlaylist, urlHasUseThis, customizeInDraft } = this.props;

    if (urlHasUseThis || customizeInDraft) {
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
    const changedItem = dataToUpdate.modules.find(el => el._id === module._id) || {};
    updateCurriculumSequence({
      id: playlistId,
      curriculumSequence: dataToUpdate,
      toggleModuleNotification: true,
      changedItem
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

    const changedItem = { ...assignment, hidden: !assignment.hidden };
    updateCurriculumSequence({
      id: playlistId,
      curriculumSequence: dataToUpdate,
      toggleTestNotification: true,
      changedItem
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
      notification({ messageKey: "FailedToLoadTheResource" });
    }
  };

  addModuleMenuClick = e => {
    const { domEvent } = e;
    domEvent.stopPropagation();

    const { addModule } = this.props;
    if (addModule) {
      addModule();
    }
  };

  editModuleMenuClick = e => {
    const { domEvent } = e;
    domEvent.stopPropagation();
    const { editModule, module, moduleIndex } = this.props;
    if (editModule) {
      editModule(moduleIndex, module);
    }
  };

  deleteModuleMenuClick = e => {
    const { domEvent } = e;
    domEvent.stopPropagation();

    const { deleteModule, moduleIndex } = this.props;
    if (deleteModule) {
      deleteModule(moduleIndex);
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
      isMobile,
      showRightPanel,
      setEmbeddedVideoPreviewModal,
      onDrop,
      proxyUserRole,
      isManageContentActive,
      userRole,
      fromPlaylist,
      isPlaylistDetailsPage
    } = this.props;
    const { showModal, selectedTest, currentAssignmentId } = this.state;
    const { assignTest } = this;
    const { _id, data = [] } = module;
    const isParentRoleProxy = proxyUserRole === "parent";

    const contentData = urlHasUseThis || isStudent ? data.filter(test => test?.status !== "draft") : data;

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
            <ModuleRowView
              module={module}
              moduleIndex={moduleIndex}
              summaryData={summaryData}
              isStudent={isStudent}
              isDesktop={isDesktop}
              isMobile={isMobile}
              urlHasUseThis={urlHasUseThis}
              hasEditAccess={hasEditAccess}
              moduleStatus={completed}
              collapsed={collapsed}
              removeUnit={removeUnit}
              toggleModule={this.toggleModule}
              assignModule={this.assignModule}
              addModuleMenuClick={this.addModuleMenuClick}
              editModuleMenuClick={this.editModuleMenuClick}
              deleteModuleMenuClick={this.deleteModuleMenuClick}
              isPlaylistDetailsPage={isPlaylistDetailsPage}
              isManageContentActive={isManageContentActive}
            />

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
                {contentData.map((moduleData, index) => {
                  const { assignments = [], contentId, contentType, hidden } = moduleData;
                  const isTestType = contentType === "test";
                  const statusList = assignments.flatMap(item => item.class || []).flatMap(item => item.status || []);
                  const contentCompleted =
                    statusList.filter(_status => _status === "DONE").length === statusList.length &&
                    statusList.length > 0;
                  const isAssigned = assignments.length > 0;
                  const rowInlineStyle = {
                    opacity: hidden ? `.5` : `1`,
                    pointerEvents: hidden ? "none" : "all"
                  };

                  const progressData = getProgressData(playlistMetrics, _id, contentId, assignments);

                  const assignmentRows = assignments.flatMap(assignment => {
                    const { testType, _id: assignmentId, maxAttempts, assignedBy } = assignment;
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
                        assignedBy: assignedBy?.name,
                        maxAttempts
                      })
                    );
                  });

                  // process user test activity to get student assignment actions
                  const uta = isStudent
                    ? this.processStudentAssignmentAction(_id, moduleData, isAssigned, assignmentRows)
                    : {};

                  const moreMenu = (
                    <Menu data-cy="assessmentItemMoreMenu">
                      {!isStudent && (
                        <Menu.Item onClick={() => assignTest(_id, moduleData.contentId)}>Assign Test</Menu.Item>
                      )}
                      {!isStudent && isAssigned && (
                        <Menu.Item>
                          <Link to="/author/assignments">View Assignments</Link>
                        </Menu.Item>
                      )}
                      {!isStudent && (
                        <Menu.Item data-cy="view-test" onClick={() => this.viewTest(moduleData.contentId)}>
                          Preview Test
                        </Menu.Item>
                      )}
                      {/* <Menu.Item
                          data-cy="moduleItemMoreMenuItem"
                          onClick={() => handleRemove(moduleIndex, moduleData.contentId)}
                        >
                          Remove
                        </Menu.Item> */}
                    </Menu>
                  );

                  const showHideAssessmentButton = hasEditAccess &&
                    (urlHasUseThis || (status === "published" && mode === "embedded")) && (
                      <HideLinkLabel
                        textColor={themeColor}
                        fontWeight="Bold"
                        data-cy={moduleData.hidden ? "make-visible" : "make-hidden"}
                        onClick={() => this.hideTest(module._id, moduleData)}
                      >
                        {moduleData.hidden ? "SHOW" : "HIDE"}
                      </HideLinkLabel>
                    );

                  const assessmentInfoProgress = (
                    <InfoProgressBar
                      isDesktop={isDesktop}
                      isStudent={isStudent}
                      columnStyle={rowInlineStyle}
                      urlHasUseThis={urlHasUseThis}
                      data={progressData}
                      renderExtra={isMobile ? showHideAssessmentButton : ""}
                      isAssessment
                    />
                  );

                  const assessmentActions = urlHasUseThis ? (
                    !isStudent ? (
                      <Fragment>
                        {showHideAssessmentButton}
                        <LastColumn
                          align="center"
                          justify="flex-end"
                          paddingRight="0"
                          width={!urlHasUseThis || isStudent ? "auto" : null}
                        >
                          {(urlHasUseThis || (status === "published" && mode === "embedded")) &&
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
                              (urlHasUseThis || (status === "published" && mode === "embedded")) &&
                              userRole !== roleuser.EDULASTIC_CURATOR && (
                                <AssignmentButton assigned={isAssigned}>
                                  <Button data-cy="assignButton" onClick={() => assignTest(_id, moduleData.contentId)}>
                                    {isAssigned ? (
                                      <IconCheckSmall color={white} />
                                    ) : (
                                      <IconLeftArrow color={themeColor} width={13.3} height={9.35} />
                                    )}
                                    {isAssigned ? IS_ASSIGNED : NOT_ASSIGNED}
                                  </Button>
                                </AssignmentButton>
                              )
                            ))}

                          {isDesktop && (mode === "embedded" || urlHasUseThis) && (
                            <Dropdown overlay={moreMenu} trigger={["click"]} style={rowInlineStyle}>
                              <IconActionButton>
                                <IconMoreVertical width={5} height={14} color={themeColor} />
                              </IconActionButton>
                            </Dropdown>
                          )}
                          {(urlHasUseThis || mode === "embedded") && isManageContentActive && (
                            <IconActionButton
                              data-cy="assignmentDeleteOptionsIcon"
                              onClick={e => {
                                e.stopPropagation();
                                this.deleteTest(moduleIndex, moduleData.contentId);
                              }}
                            >
                              <IconTrash color={themeColor} />
                            </IconActionButton>
                          )}
                        </LastColumn>
                      </Fragment>
                    ) : (
                      !moduleData.hidden && (
                        <Fragment>
                          <LastColumn width={!urlHasUseThis || isStudent ? "auto" : null}>
                            {!isParentRoleProxy && (
                              <AssignmentButton assigned={false}>
                                <Button data-cy={uta.text} onClick={uta.action}>
                                  {uta.text}
                                </Button>
                              </AssignmentButton>
                            )}
                            {uta.retake && !isParentRoleProxy && (
                              <AssignmentButton assigned={false}>
                                <Button data-cy={uta.retake.text} onClick={uta.retake.action}>
                                  {uta.retake.text}
                                </Button>
                              </AssignmentButton>
                            )}
                          </LastColumn>
                        </Fragment>
                      )
                    )
                  ) : (
                    <LastColumn width={!urlHasUseThis || isStudent ? "auto" : null}>
                      <AssignmentButton>
                        <Button onClick={() => this.viewTest(moduleData?.contentId)}>
                          <IconVisualization width="14px" height="14px" />
                          Preview
                        </Button>
                      </AssignmentButton>

                      {mode === "embedded" ? (
                        <IconActionButton
                          data-cy="assignmentDeleteOptionsIcon"
                          onClick={e => {
                            e.stopPropagation();
                            this.deleteTest(moduleIndex, moduleData.contentId);
                          }}
                        >
                          <IconTrash color={themeColor} />
                        </IconActionButton>
                      ) : null}
                    </LastColumn>
                  );

                  const assessmentColums = isDesktop ? (
                    <Fragment>
                      {assessmentInfoProgress}
                      {assessmentActions}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {assessmentInfoProgress}
                      <Dropdown
                        overlay={
                          <Fragment>
                            {assessmentActions}
                            {moreMenu}
                          </Fragment>
                        }
                        trigger={["click"]}
                      >
                        <IconActionButton onClick={e => e.stopPropagation()}>
                          <IconMoreVertical width={5} height={14} color={themeColor} />
                        </IconActionButton>
                      </Dropdown>
                    </Fragment>
                  );

                  const testType = isTestType && (
                    <CustomIcon marginLeft={10} marginRight={5}>
                      {urlHasUseThis && (
                        <Avatar
                          size={18}
                          style={{
                            backgroundColor:
                              testTypeColor[(moduleData.assignments?.[0]?.testType)] ||
                              testTypeColor[moduleData.testType],
                            fontSize: "13px"
                          }}
                        >
                          {moduleData.assignments?.[0]?.testType?.[0]?.toUpperCase() ||
                            moduleData?.testType?.[0]?.toUpperCase() ||
                            " P "}
                        </Avatar>
                      )}
                    </CustomIcon>
                  );

                  const testTags = isTestType && (
                    <FlexContainer height="25px" alignItems="center" justifyContent="flex-start">
                      <Tags
                        margin="5px 0px 0px 0px"
                        flexWrap="nowrap"
                        tags={moduleData.standardIdentifiers}
                        completed={urlHasUseThis && contentCompleted}
                        show={2}
                        isPlaylist
                      />
                      {!urlHasUseThis && (
                        <TestStatus status={moduleData.status} view="tile" noMargin={!moduleData.standardIdentifiers}>
                          {moduleData.status}
                        </TestStatus>
                      )}
                    </FlexContainer>
                  );

                  const assignmentsRow = currentAssignmentId.includes(moduleData.contentId) && !isStudent && (
                    <AssignmentsClasses assignmentRows={assignmentRows} handleActionClick={this.handleActionClick} />
                  );

                  if (mode === "embedded" && !(isStudent && moduleData.hidden)) {
                    return (
                      <SortableElement
                        {...this.props}
                        key={`content-${moduleData.contentId}`}
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
                        assessmentColums={assessmentColums}
                        testTags={testTags}
                        testType={testType}
                        assignmentsRow={assignmentsRow}
                        isDesktop={isDesktop}
                        isStudent={isStudent}
                        showRightPanel={showRightPanel}
                        isManageContentActive={isManageContentActive}
                        toggleTest={() => this.hideTest(module._id, moduleData)}
                        fromPlaylist={fromPlaylist}
                        showHideAssessmentButton={showHideAssessmentButton}
                        onDrop={onDrop}
                        moduleIndex={moduleIndex}
                        isTestType={isTestType}
                      />
                    );
                  }

                  return (
                    !(isStudent && moduleData.hidden) && (
                      <AssignmentRowContainer>
                        <ModuleFocused />
                        <DragHandle>
                          <FaChevronRight color={lightGrey5} />
                        </DragHandle>
                        <div className="item" style={{ width: "calc(100% - 35px)" }}>
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
                            {!isTestType && (
                              <PlaylistResourceRow
                                data={moduleData}
                                mode={mode}
                                urlHasUseThis={urlHasUseThis}
                                showResource={this.showResource}
                                showHideAssessmentButton={showHideAssessmentButton}
                                isManageContentActive={isManageContentActive}
                                setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
                              />
                            )}
                            {isTestType && (
                              <Fragment>
                                <Col
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
                                        <span>{moduleData.contentTitle}</span>
                                        {testType}
                                      </Tooltip>
                                      {!isDesktop && testTags}
                                    </ModuleDataName>
                                    {isDesktop && testTags}
                                  </ModuleDataWrapper>
                                </Col>
                                {assessmentColums}
                              </Fragment>
                            )}
                          </Assignment>
                          {moduleData?.resources?.length > 0 && (
                            <SubResource
                              data={moduleData}
                              urlHasUseThis={urlHasUseThis}
                              showResource={this.showResource}
                              isManageContentActive={isManageContentActive}
                              setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
                            />
                          )}
                          {assignmentsRow}
                        </div>
                      </AssignmentRowContainer>
                    )
                  );
                })}
              </SortableContainer>
            )}
          </ModuleWrapper>
          {playlistTestDetailsModalData?.isVisible && moduleIndex === 0 && (
            <PlaylistTestDetailsModal
              onClose={togglePlaylistTestDetails}
              modalInitData={playlistTestDetailsModalData}
              viewAsStudent={this.viewTest}
              playlistId={playlistId}
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
  moduleStatus: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  removeUnit: PropTypes.func.isRequired
};

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
      playlistTestDetailsModalData: curriculumSequence?.playlistTestDetailsModal,
      proxyUserRole: proxyRole({ user })
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
