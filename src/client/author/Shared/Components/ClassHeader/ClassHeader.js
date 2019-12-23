import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link, withRouter } from "react-router-dom";
import { message, Dropdown } from "antd";
import moment from "moment";
import { get } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { IconDeskTopMonitor, IconBookMarkButton, IconNotes, IconSettings } from "@edulastic/icons";
import { assignmentPolicyOptions, test as testContants } from "@edulastic/constants";
import { MenuIcon } from "@edulastic/common";
import { toggleSideBarAction } from "../../../src/actions/toggleMenu";

import {
  Container,
  StyledTitle,
  StyledLink,
  StyledParaFirst,
  DownArrow,
  LinkLabel,
  StyledParaSecond,
  StyledPopconfirm,
  StyledDiv,
  StyledTabContainer,
  StyledTabs,
  StyledAnchor,
  OpenCloseButton,
  HeaderMenuIcon,
  RightSideButtonWrapper,
  DropMenu,
  ClassDropMenu,
  MenuItems,
  CaretUp,
  StudentStatusDetails,
  OpenCloseWrapper
} from "./styled";

import ReleaseScoreSettingsModal from "../../../Assignments/components/ReleaseScoreSettingsModal/ReleaseScoreSettingsModal";
import { DeleteAssignmentModal } from "../../../Assignments/components/DeleteAssignmentModal/deleteAssignmentModal";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

import {
  releaseScoreAction,
  markAsDoneAction,
  openAssignmentAction,
  closeAssignmentAction,
  togglePauseAssignmentAction,
  receiveTestActivitydAction,
  toggleViewPasswordAction
} from "../../../src/actions/classBoard";
import {
  showScoreSelector,
  getMarkAsDoneEnableSelector,
  notStartedStudentsSelector,
  inProgressStudentsSelector,
  isItemVisibiltySelector,
  classListSelector,
  getCanCloseAssignmentSelector,
  getCanOpenAssignmentSelector,
  getViewPasswordSelector,
  getPasswordPolicySelector,
  showPasswordButonSelector
} from "../../../ClassBoard/ducks";
import { getUserRole } from "../../../../student/Login/ducks";
import { getToggleReleaseGradeStateSelector } from "../../../src/selectors/assignments";
import { toggleReleaseScoreSettingsAction } from "../../../src/actions/assignments";
import ConfirmationModal from "../../../../common/components/ConfirmationModal";
import { gradebookUnSelectAllAction } from "../../../src/reducers/gradeBook";
import { toggleDeleteAssignmentModalAction } from "../../../sharedDucks/assignments";
import ViewPasswordModal from "./ViewPasswordModal";

const { POLICY_OPEN_MANUALLY_BY_TEACHER } = assignmentPolicyOptions;
const desktopWidth = 992;

const classViewRoutesByActiveTabName = {
  classboard: "classboard",
  expressgrader: "expressgrader",
  standard_report: "standardsBasedReport"
};
class ClassHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isPauseModalVisible: false,
      isCloseModalVisible: false,
      modalInputVal: "",
      condition: true, // Whether meet the condition, if not show popconfirm.
      studentReportCardMenuModalVisibility: false,
      studentReportCardModalVisibility: false,
      studentReportCardModalColumnsFlags: {}
    };
    this.inputRef = React.createRef();
  }

  switchClass(classId) {
    const { loadTestActivity, match, studentUnselectAll, resetView, active } = this.props;
    const { assignmentId } = match.params;
    if (match.params.classId === classId) return;
    if (active === "classboard") {
      resetView("Both");
    }
    loadTestActivity(assignmentId, classId);
    studentUnselectAll();
  }

  changeCondition = value => {
    this.setState({ condition: value });
  };

  confirm = () => {
    this.setState({ visible: false });
    message.success("Next step.");
  };

  cancel = () => {
    this.setState({ visible: false });
    message.error("Click on cancel.");
  };

  handleVisibleChange = visible => {
    if (!visible) {
      this.setState({ visible });
      return;
    }
    const { condition } = this.state;
    // Determining condition before show the popconfirm.
    if (condition) {
      this.confirm(); // next step
    } else {
      this.setState({ visible }); // show the popconfirm
    }
  };

  handleReleaseScore = releaseScore => {
    const { match, setReleaseScore, toggleReleaseGradePopUp } = this.props;
    const { classId, assignmentId } = match.params;
    setReleaseScore(assignmentId, classId, releaseScore);
    toggleReleaseGradePopUp(false);
  };

  handleMarkAsDone = () => {
    const { setMarkAsDone, match } = this.props;
    const { classId, assignmentId } = match.params;
    setMarkAsDone(assignmentId, classId);
  };

  handleOpenAssignment = () => {
    const { openAssignment, match, additionalData, userRole } = this.props;
    const { classId, assignmentId } = match.params;
    if (
      additionalData.openPolicy !== POLICY_OPEN_MANUALLY_BY_TEACHER &&
      additionalData.testType === "common assessment" &&
      userRole === "teacher"
    ) {
      return message.warn(`You can open the assessment once the Open time ${moment(additionalData.endDate)} has passed.
    `);
    }
    openAssignment(assignmentId, classId);
  };

  handleCloseAssignment = () => {
    const { closeAssignment, match } = this.props;
    const { classId, assignmentId } = match.params;
    closeAssignment(assignmentId, classId);
    this.toggleCloseModal(false);
  };

  onStudentReportCardsClick = () => {
    this.setState(state => {
      return { ...state, studentReportCardMenuModalVisibility: true };
    });
  };

  onStudentReportCardMenuModalOk = obj => {
    this.setState(state => {
      return {
        ...this.state,
        studentReportCardMenuModalVisibility: false,
        studentReportCardModalVisibility: true,
        studentReportCardModalColumnsFlags: { ...obj }
      };
    });
  };

  onStudentReportCardMenuModalCancel = () => {
    this.setState(state => {
      return { ...this.state, studentReportCardMenuModalVisibility: false };
    });
  };

  onStudentReportCardModalOk = () => {};

  onStudentReportCardModalCancel = () => {
    this.setState(state => {
      return { ...this.state, studentReportCardModalVisibility: false };
    });
  };

  handlePauseAssignment(value) {
    const {
      togglePauseAssignment,
      match,
      additionalData: { testName }
    } = this.props;
    const { classId, assignmentId } = match.params;
    togglePauseAssignment({ value, assignmentId, classId, name: testName });
    this.togglePauseModal(false);
  }

  togglePauseModal = value => {
    this.setState({ isPauseModalVisible: value, modalInputVal: "" });
  };

  toggleCloseModal = value => {
    this.setState({ isCloseModalVisible: value, modalInputVal: "" });
  };

  handleValidateInput = e => {
    this.setState({ modalInputVal: e.target.value });
  };

  handleTogglePasswordModal = () => {
    const { passwordPolicy, toggleViewPassword, assignmentStatus } = this.props;
    if (
      assignmentStatus === "NOT OPEN" &&
      passwordPolicy === testContants.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
    ) {
      return message.error("assignment should be open to see password");
    }
    toggleViewPassword();
  };

  render() {
    const {
      t,
      active,
      additionalData = {},
      assignmentStatus,
      enableMarkAsDone,
      canClose,
      canOpen,
      isShowReleaseSettingsPopup,
      toggleReleaseGradePopUp,
      toggleDeleteAssignmentModalAction,
      notStartedStudents,
      inProgressStudents,
      toggleSideBar,
      isItemsVisible,
      classesList,
      match,
      showPasswordButton,
      isViewPassword
    } = this.props;

    const { visible, isPauseModalVisible, isCloseModalVisible, modalInputVal = "" } = this.state;
    const { endDate, startDate, releaseScore, isPaused = false, open, closed, canCloseClass } = additionalData;
    const dueDate = Number.isNaN(endDate) ? new Date(endDate) : new Date(parseInt(endDate, 10));
    const { assignmentId, classId } = match.params;
    const canPause =
      (startDate || open) && !closed && (endDate > Date.now() || !endDate) && canCloseClass.includes(classId);
    const assignmentStatusForDisplay =
      assignmentStatus === "NOT OPEN" && startDate && startDate < moment()
        ? "IN PROGRESS"
        : closed
        ? "DONE"
        : assignmentStatus;

    const renderOpenClose = (
      <OpenCloseWrapper>
        {canOpen ? (
          <OpenCloseButton data-cy="openButton" onClick={this.handleOpenAssignment}>
            OPEN
          </OpenCloseButton>
        ) : (
          assignmentStatusForDisplay !== "DONE" &&
          canPause && (
            <OpenCloseButton
              data-cy="openPauseButton"
              onClick={() => (isPaused ? this.handlePauseAssignment(!isPaused) : this.togglePauseModal(true))}
            >
              {isPaused ? "OPEN" : "PAUSE"}
            </OpenCloseButton>
          )
        )}
        {canClose ? (
          <OpenCloseButton data-cy="closeButton" onClick={() => this.toggleCloseModal(true)}>
            CLOSE
          </OpenCloseButton>
        ) : (
          ""
        )}
      </OpenCloseWrapper>
    );

    const actionsMenu = (
      <DropMenu>
        <CaretUp className="fa fa-caret-up" />
        <FeaturesSwitch inputFeatures="assessmentSuperPowersMarkAsDone" actionOnInaccessible="hidden" groupId={classId}>
          <MenuItems
            data-cy="markAsDone"
            key="key1"
            onClick={this.handleMarkAsDone}
            disabled={!enableMarkAsDone || assignmentStatus.toLowerCase() === "done"}
          >
            Mark as Done
          </MenuItems>
        </FeaturesSwitch>
        <MenuItems data-cy="releaseScore" key="key2" onClick={() => toggleReleaseGradePopUp(true)}>
          Release Score
        </MenuItems>
        {window.innerWidth <= desktopWidth && <MenuItems key="key3">{renderOpenClose}</MenuItems>}
        <MenuItems data-cy="unAssign" key="key4" onClick={() => toggleDeleteAssignmentModalAction(true)}>
          Unassign
        </MenuItems>
        {/* TODO temp hiding for UAT */}
        {/* <MenuItems key="key3" onClick={this.onStudentReportCardsClick}>
          Generate Bubble Sheet
        </MenuItems> */}
        {showPasswordButton && (
          <MenuItems key="key5" onClick={this.handleTogglePasswordModal}>
            View Password
          </MenuItems>
        )}
      </DropMenu>
    );

    const classListMenu = (
      <ClassDropMenu selectedKeys={classId}>
        {classesList.map(item => (
          <MenuItems key={item._id} onClick={() => this.switchClass(item._id)}>
            <Link to={`/author/${classViewRoutesByActiveTabName[active]}/${assignmentId}/${item._id}`}>
              {item.name}
            </Link>
          </MenuItems>
        ))}
      </ClassDropMenu>
    );

    return (
      <Container>
        <StyledTitle>
          <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
          <div>
            {classesList.length > 1 ? (
              <Dropdown overlay={classListMenu} placement={"bottomLeft"}>
                <div style={{ position: "relative" }}>
                  <StyledParaFirst data-cy="CurrentClassName" title={additionalData.className || "loading..."}>
                    {additionalData.className || "loading..."}
                  </StyledParaFirst>
                  <DownArrow type="down" />
                </div>
              </Dropdown>
            ) : (
              <div style={{ position: "relative" }}>
                <StyledParaFirst data-cy="CurrentClassName" title={additionalData.className || "loading..."}>
                  {additionalData.className || "loading..."}
                </StyledParaFirst>
              </div>
            )}
            <StyledParaSecond>
              {assignmentStatusForDisplay}
              {isPaused && assignmentStatusForDisplay !== "DONE" ? " (PAUSED)" : ""}
              <div>{!!additionalData.endDate && `(Due on ${moment(dueDate).format("MMM DD, YYYY")})`}</div>
            </StyledParaSecond>
          </div>
        </StyledTitle>
        <StyledTabContainer>
          <StyledTabs>
            <StyledLink to={`/author/classboard/${assignmentId}/${classId}`} data-cy="LiveClassBoard">
              <StyledAnchor isActive={active === "classboard"}>
                <IconDeskTopMonitor
                  color={active === "classboard" ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)"}
                  left={0}
                />
                <LinkLabel color={active === "classboard" ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)"}>
                  {t("common.liveClassBoard")}
                </LinkLabel>
              </StyledAnchor>
            </StyledLink>
            <FeaturesSwitch inputFeatures="expressGrader" actionOnInaccessible="hidden" groupId={classId}>
              <StyledLink
                to={`/author/expressgrader/${assignmentId}/${classId}`}
                disabled={!isItemsVisible}
                data-cy="Expressgrader"
              >
                <StyledAnchor isActive={active === "expressgrader"}>
                  <IconBookMarkButton
                    color={active === "expressgrader" ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)"}
                    left={0}
                  />
                  <LinkLabel color={active === "classboard" ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)"}>
                    {t("common.expressGrader")}
                  </LinkLabel>
                </StyledAnchor>
              </StyledLink>
            </FeaturesSwitch>

            <FeaturesSwitch
              inputFeatures="standardBasedReport"
              actionOnInaccessible="hidden"
              disabled={!isItemsVisible}
              groupId={classId}
            >
              <StyledLink to={`/author/standardsBasedReport/${assignmentId}/${classId}`} data-cy="StandardsBasedReport">
                <StyledAnchor isActive={active === "standard_report"}>
                  <IconNotes color={active === "standard_report" ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)"} left={0} />
                  <LinkLabel color={active === "classboard" ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)"}>
                    {t("common.standardBasedReports")}
                  </LinkLabel>
                </StyledAnchor>
              </StyledLink>
            </FeaturesSwitch>
            <StyledLink to={`/author/lcb/settings/${assignmentId}/${classId}`} data-cy="LCBAssignmentSettings">
              <StyledAnchor isActive={active === "settings"}>
                <IconSettings color={active === "settings" ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)"} left={0} />
                <LinkLabel color={active === "classboard" ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)"}>
                  {t("common.settings")}
                </LinkLabel>
              </StyledAnchor>
            </StyledLink>
          </StyledTabs>
        </StyledTabContainer>
        <RightSideButtonWrapper>
          {window.innerWidth > desktopWidth && renderOpenClose}
          <Dropdown overlay={actionsMenu} placement={"bottomRight"}>
            <HeaderMenuIcon data-cy="headerDropDown">
              <i class="fa fa-ellipsis-v" />
            </HeaderMenuIcon>
          </Dropdown>
        </RightSideButtonWrapper>
        <StyledDiv>
          <StyledPopconfirm
            visible={visible}
            onVisibleChange={this.handleVisibleChange}
            onConfirm={this.confirm}
            onCancel={this.cancel}
            okText="Yes"
            cancelText="No"
          />
          <ReleaseScoreSettingsModal
            showReleaseGradeSettings={isShowReleaseSettingsPopup}
            onCloseReleaseScoreSettings={() => toggleReleaseGradePopUp(false)}
            updateReleaseScoreSettings={this.handleReleaseScore}
            releaseScore={releaseScore}
          />
          <DeleteAssignmentModal
            testName={additionalData?.testName}
            assignmentId={assignmentId}
            classId={classId}
            lcb
          />
          {/* Needed this check as password modal has a timer hook which should not load until all password details are loaded */}
          {isViewPassword && <ViewPasswordModal />}
          <ConfirmationModal
            title="Pause"
            show={isPauseModalVisible}
            onOk={() => this.handlePauseAssignment(!isPaused)}
            onCancel={() => this.togglePauseModal(false)}
            inputVal={modalInputVal}
            onInputChange={this.handleValidateInput}
            expectedVal="PAUSE"
            canUndone={true}
            bodyText={`Are you sure you want to pause? Once paused, no student would be able to answer the test unless you
                resume it.`}
            okText="Yes, Pause"
            cancelText="No, Cancel"
          />
          <ConfirmationModal
            title="Close"
            show={isCloseModalVisible}
            onOk={this.handleCloseAssignment}
            onCancel={() => this.toggleCloseModal(false)}
            inputVal={modalInputVal}
            onInputChange={this.handleValidateInput}
            expectedVal="CLOSE"
            bodyStyle={{ padding: "60px 20px" }}
            bodyText={
              <div>
                <StudentStatusDetails>
                  {notStartedStudents.length ? <p>{notStartedStudents.length} student(s) have not yet started</p> : ""}
                  {inProgressStudents.length ? (
                    <p>{inProgressStudents.length} student(s) have not yet submitted</p>
                  ) : (
                    ""
                  )}
                </StudentStatusDetails>
                <p>Are you sure you want to close ?</p>
                <p>Once closed, no student would be able to answer the assessment</p>
              </div>
            }
            okText="Yes, Close"
            canUndone
          />
        </StyledDiv>
      </Container>
    );
  }
}

ClassHeader.propTypes = {
  t: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
  assignmentId: PropTypes.string.isRequired,
  classId: PropTypes.string.isRequired,
  additionalData: PropTypes.object.isRequired,
  setReleaseScore: PropTypes.func.isRequired,
  releaseScore: PropTypes.string
};

ClassHeader.defaultProps = {
  releaseScore: "DONT_RELEASE"
};

const enhance = compose(
  withNamespaces("classBoard"),
  withRouter,
  connect(
    state => ({
      releaseScore: showScoreSelector(state),
      enableMarkAsDone: getMarkAsDoneEnableSelector(state),
      canClose: getCanCloseAssignmentSelector(state),
      canOpen: getCanOpenAssignmentSelector(state),
      assignmentStatus: get(state, ["author_classboard_testActivity", "data", "status"], ""),
      isShowReleaseSettingsPopup: getToggleReleaseGradeStateSelector(state),
      notStartedStudents: notStartedStudentsSelector(state),
      inProgressStudents: inProgressStudentsSelector(state),
      isItemsVisible: isItemVisibiltySelector(state),
      classesList: classListSelector(state),
      passwordPolicy: getPasswordPolicySelector(state),
      showPasswordButton: showPasswordButonSelector(state),
      isViewPassword: getViewPasswordSelector(state)
    }),
    {
      loadTestActivity: receiveTestActivitydAction,
      setReleaseScore: releaseScoreAction,
      togglePauseAssignment: togglePauseAssignmentAction,
      setMarkAsDone: markAsDoneAction,
      openAssignment: openAssignmentAction,
      closeAssignment: closeAssignmentAction,
      toggleReleaseGradePopUp: toggleReleaseScoreSettingsAction,
      toggleSideBar: toggleSideBarAction,
      studentUnselectAll: gradebookUnSelectAllAction,
      toggleDeleteAssignmentModalAction,
      toggleViewPassword: toggleViewPasswordAction
    }
  )
);

export default enhance(ClassHeader);
