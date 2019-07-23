import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { message, Menu, Dropdown, Button, Modal, Icon, Switch, Input } from "antd";
import moment from "moment";
import { get } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import {
  IconSummaryBoard,
  IconDeskTopMonitor,
  IconBookMarkButton,
  IconNotes,
  IconMoreVertical
} from "@edulastic/icons";

import {
  Container,
  StyledTitle,
  StyledLink,
  StyledParaFirst,
  LinkLabel,
  StyledParaSecond,
  StyledPopconfirm,
  StyledDiv,
  StyledTabContainer,
  StyledTabs,
  StyledAnchor,
  StyledButton,
  MenuWrapper,
  OpenCloseButton,
  HeaderMenuIcon,
  RightSideButtonWrapper,
  DropMenu,
  MenuItems,
  CaretUp
} from "./styled";
import { StudentReportCardMenuModal } from "./components/studentReportCardMenuModal";
import { StudentReportCardModal } from "./components/studentReportCardModal";
import ReleaseScoreSettingsModal from "../../../Assignments/components/ReleaseScoreSettingsModal/ReleaseScoreSettingsModal";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

import {
  releaseScoreAction,
  markAsDoneAction,
  openAssignmentAction,
  closeAssignmentAction,
  togglePauseAssignmentAction
} from "../../../src/actions/classBoard";
import { showScoreSelector, getClassResponseSelector, getMarkAsDoneEnableSelector } from "../../../ClassBoard/ducks";
import { getUserRole } from "../../../../student/Login/ducks";
import { togglePresentationModeAction } from "../../../src/actions/testActivity";
import { getToggleReleaseGradeStateSelector } from "../../../src/selectors/assignments";
import { toggleReleaseScoreSettingsAction } from "../../../src/actions/assignments";
import { themeColor } from "@edulastic/colors";
import ConfirmationModal from "../../../../common/components/ConfirmationModal";

class ClassHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isPauseModalVisible: false,
      modalInputVal: "",
      condition: true, // Whether meet the condition, if not show popconfirm.
      showDropdown: false,
      studentReportCardMenuModalVisibility: false,
      studentReportCardModalVisibility: false,
      studentReportCardModalColumnsFlags: {}
    };
    this.inputRef = React.createRef();
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

  toggleDropdown = () => {
    this.setState(state => ({ showDropdown: !state.showDropdown }));
  };

  handleReleaseScore = releaseScore => {
    const { classId, assignmentId, setReleaseScore, toggleReleaseGradePopUp } = this.props;
    setReleaseScore(assignmentId, classId, releaseScore);
    toggleReleaseGradePopUp(false);
  };

  handleMarkAsDone = () => {
    const { setMarkAsDone, assignmentId, classId } = this.props;
    setMarkAsDone(assignmentId, classId);
  };

  handleOpenAssignment = () => {
    const { openAssignment, assignmentId, classId, additionalData, userRole } = this.props;
    if (additionalData.testType === "common assessment" && userRole === "teacher") {
      return message.error(`You can open the assessment once the Open time ${moment(additionalData.endDate)} has passed.
    `);
    }
    openAssignment(assignmentId, classId);
  };

  handleCloseAssignment = () => {
    const { closeAssignment, assignmentId, classId } = this.props;
    closeAssignment(assignmentId, classId);
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

  toggleCurrentMode = () => {
    const { togglePresentationMode, isPresentationMode } = this.props;
    if (!isPresentationMode) {
      message.info("Presentation mode is ON. You can present assessment data without revealing student identity.");
    }
    togglePresentationMode(!isPresentationMode);
  };

  handlePauseAssignment(value) {
    const {
      togglePauseAssignment,
      assignmentId,
      classId,
      additionalData: { testName }
    } = this.props;
    togglePauseAssignment({ value, assignmentId, classId, name: testName });
    this.togglePauseModal(false);
  }

  togglePauseModal = value => {
    this.setState({ isPauseModalVisible: value, modalInputVal: "" });
  };

  handleValidateInput = e => {
    this.setState({ modalInputVal: e.target.value });
  };

  render() {
    const {
      t,
      active,
      assignmentId,
      classId,
      testActivityId,
      additionalData = {},
      selectedStudentsKeys,
      classResponse = {},
      assignmentStatus,
      enableMarkAsDone,
      togglePresentationMode,
      isPresentationMode,
      isShowReleaseSettingsPopup,
      toggleReleaseGradePopUp,
      userRole
    } = this.props;

    const { showDropdown, visible, isPauseModalVisible, modalInputVal = "" } = this.state;
    const { endDate, startDate, releaseScore, isPaused = false } = additionalData;
    const dueDate = Number.isNaN(endDate) ? new Date(endDate) : new Date(parseInt(endDate, 10));
    const { canOpenClass = [], canCloseClass = [], openPolicy, closePolicy } = additionalData;
    const canOpen =
      canOpenClass.includes(classId) && !(openPolicy === "Open Manually by Admin" && userRole === "teacher");
    const canClose =
      canCloseClass.includes(classId) && !(closePolicy === "Close Manually by Admin" && userRole === "teacher");
    const assignmentStatusForDisplay =
      assignmentStatus === "NOT OPEN" && startDate && startDate < moment() ? "IN PROGRESS" : assignmentStatus;
    const menu = (
      <DropMenu>
        <CaretUp className="fa fa-caret-up" />
        <FeaturesSwitch inputFeatures="assessmentSuperPowersMarkAsDone" actionOnInaccessible="hidden" groupId={classId}>
          <MenuItems
            key="key1"
            onClick={this.handleMarkAsDone}
            disabled={!enableMarkAsDone || assignmentStatus.toLowerCase() === "done"}
          >
            Mark as Done
          </MenuItems>
        </FeaturesSwitch>
        <MenuItems key="key2" onClick={() => toggleReleaseGradePopUp(true)}>
          Release Score
        </MenuItems>
        {/* TODO temp hiding for UAT */}
        {/* <MenuItems key="key3" onClick={this.onStudentReportCardsClick}>
          Generate Bubble Sheet
        </MenuItems> */}
      </DropMenu>
    );

    return (
      <Container>
        <StyledTitle>
          <StyledParaFirst data-cy="CurrentClassName">{additionalData.className || "loading..."}</StyledParaFirst>
          <StyledParaSecond>
            {assignmentStatusForDisplay}
            {isPaused && assignmentStatusForDisplay !== "DONE" ? "(PAUSED)" : ""} (Due on{" "}
            {additionalData.endDate && moment(dueDate).format("D MMMM YYYY")})
          </StyledParaSecond>
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
              <StyledLink to={`/author/expressgrader/${assignmentId}/${classId}`} data-cy="Expressgrader">
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

            <FeaturesSwitch inputFeatures="standardBasedReport" actionOnInaccessible="hidden" groupId={classId}>
              <StyledLink to={`/author/standardsBasedReport/${assignmentId}/${classId}`} data-cy="StandardsBasedReport">
                <StyledAnchor isActive={active === "standard_report"}>
                  <IconNotes color={active === "standard_report" ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)"} left={0} />
                  <LinkLabel color={active === "classboard" ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)"}>
                    {t("common.standardBasedReports")}
                  </LinkLabel>
                </StyledAnchor>
              </StyledLink>
            </FeaturesSwitch>
          </StyledTabs>
        </StyledTabContainer>
        <RightSideButtonWrapper>
          {canOpen ? (
            <OpenCloseButton onClick={this.handleOpenAssignment}>OPEN</OpenCloseButton>
          ) : canClose ? (
            <>
              {assignmentStatusForDisplay !== "DONE" && (
                <OpenCloseButton
                  onClick={() => (isPaused ? this.handlePauseAssignment(!isPaused) : this.togglePauseModal(true))}
                >
                  {" "}
                  {isPaused ? "OPEN" : "PAUSE"}
                </OpenCloseButton>
              )}
              <OpenCloseButton onClick={this.handleCloseAssignment}>CLOSE</OpenCloseButton>
            </>
          ) : (
            ""
          )}
          <Dropdown overlay={menu} placement={"bottomRight"}>
            <HeaderMenuIcon>
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
  testActivityId: PropTypes.string,
  additionalData: PropTypes.object.isRequired,
  setReleaseScore: PropTypes.func.isRequired,
  releaseScore: PropTypes.string
};

ClassHeader.defaultProps = {
  testActivityId: "",
  releaseScore: "DONT_RELEASE"
};

const enhance = compose(
  withNamespaces("classBoard"),
  connect(
    state => ({
      releaseScore: showScoreSelector(state),
      classResponse: getClassResponseSelector(state),
      userRole: getUserRole(state),
      enableMarkAsDone: getMarkAsDoneEnableSelector(state),
      assignmentStatus: get(state, ["author_classboard_testActivity", "data", "status"], ""),
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false),
      isShowReleaseSettingsPopup: getToggleReleaseGradeStateSelector(state)
    }),
    {
      setReleaseScore: releaseScoreAction,
      togglePauseAssignment: togglePauseAssignmentAction,
      setMarkAsDone: markAsDoneAction,
      openAssignment: openAssignmentAction,
      closeAssignment: closeAssignmentAction,
      toggleReleaseGradePopUp: toggleReleaseScoreSettingsAction
    }
  )
);

export default enhance(ClassHeader);
