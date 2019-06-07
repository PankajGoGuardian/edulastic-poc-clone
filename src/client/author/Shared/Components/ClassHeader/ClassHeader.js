import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { message, Menu, Dropdown, Button, Modal } from "antd";
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
  MenuWrapper
} from "./styled";
import { StudentReportCardMenuModal } from "./components/studentReportCardMenuModal";
import { StudentReportCardModal } from "./components/studentReportCardModal";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

import { releaseScoreAction, markAsDoneAction } from "../../../src/actions/classBoard";
import { showScoreSelector, getClassResponseSelector, getMarkAsDoneEnableSelector } from "../../../ClassBoard/ducks";

class ClassHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      condition: true, // Whether meet the condition, if not show popconfirm.
      showDropdown: false,
      studentReportCardMenuModalVisibility: false,
      studentReportCardModalVisibility: false,
      studentReportCardModalColumnsFlags: {}
    };
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

  handleReleaseScore = () => {
    const { classId, assignmentId, setReleaseScore, showScore } = this.props;
    const isReleaseScore = !showScore;
    setReleaseScore(assignmentId, classId, isReleaseScore);
    this.toggleDropdown();
  };

  handleMarkAsDone = () => {
    const { setMarkAsDone, assignmentId, classId } = this.props;
    setMarkAsDone(assignmentId, classId);
  };

  onStudentReportCardsClick = () => {
    this.setState(state => {
      return { ...this.state, studentReportCardMenuModalVisibility: true };
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

  render() {
    const {
      t,
      active,
      assignmentId,
      classId,
      testActivityId,
      additionalData = {},
      showScore,
      selectedStudentsKeys,
      classResponse = {},
      status,
      enableMarkAsDone
    } = this.props;
    const { showDropdown, visible } = this.state;
    const { endDate } = additionalData;
    const dueDate = Number.isNaN(endDate) ? new Date(endDate) : new Date(parseInt(endDate, 10));
    const gradeSubject = {
      grade: classResponse.metadata ? classResponse.metadata.grades : [],
      subject: classResponse.metadata ? classResponse.metadata.subjects : []
    };
    const menu = (
      <Menu>
        <FeaturesSwitch
          inputFeatures="assessmentSuperPowersMarkAsDone"
          actionOnInaccessible="hidden"
          gradeSubject={gradeSubject}
        >
          <Menu.Item
            key="key1"
            onClick={this.handleMarkAsDone}
            disabled={!enableMarkAsDone || status.toLowerCase() === "done"}
          >
            Mark as Done
          </Menu.Item>
        </FeaturesSwitch>
        <Menu.Item
          key="key2"
          onClick={this.handleReleaseScore}
          style={{ textDecoration: showScore ? "line-through" : "none" }}
        >
          Release Score
        </Menu.Item>
        <Menu.Item key="key3" onClick={this.onStudentReportCardsClick}>
          Student Report Cards
        </Menu.Item>
      </Menu>
    );

    return (
      <Container>
        <StyledTitle>
          <StyledParaFirst data-cy="CurrentClassName">{additionalData.className || "loading..."}</StyledParaFirst>
          <StyledParaSecond>
            {status} (Due on {additionalData.endDate && moment(dueDate).format("D MMMM YYYY")})
          </StyledParaSecond>
        </StyledTitle>
        <StyledTabContainer>
          <StyledTabs>
            <StyledLink to={`/author/classboard/${assignmentId}/${classId}`} data-cy="LiveClassBoard">
              <StyledAnchor isActive={active === "classboard"}>
                <IconDeskTopMonitor color={active === "classboard" ? "#FFFFFF" : "#bed8fa"} left={0} />
                <LinkLabel>{t("common.liveClassBoard")}</LinkLabel>
              </StyledAnchor>
            </StyledLink>
            <FeaturesSwitch inputFeatures="expressGrader" actionOnInaccessible="hidden" gradeSubject={gradeSubject}>
              <StyledLink
                to={`/author/expressgrader/${assignmentId}/${classId}/${testActivityId}`}
                data-cy="Expressgrader"
              >
                <StyledAnchor isActive={active === "expressgrader"}>
                  <IconBookMarkButton color={active === "expressgrader" ? "#FFFFFF" : "#bed8fa"} left={0} />
                  <LinkLabel>{t("common.expressGrader")}</LinkLabel>
                </StyledAnchor>
              </StyledLink>
            </FeaturesSwitch>

            <FeaturesSwitch
              inputFeatures="standardBasedReport"
              actionOnInaccessible="hidden"
              gradeSubject={gradeSubject}
            >
              <StyledLink to={`/author/standardsBasedReport/${assignmentId}/${classId}`} data-cy="StandardsBasedReport">
                <StyledAnchor isActive={active === "standard_report"}>
                  <IconNotes color={active === "standard_report" ? "#FFFFFF" : "#bed8fa"} left={0} />
                  <LinkLabel>{t("common.standardBasedReports")}</LinkLabel>
                </StyledAnchor>
              </StyledLink>
            </FeaturesSwitch>
          </StyledTabs>
        </StyledTabContainer>
        <StyledDiv>
          <StyledPopconfirm
            visible={visible}
            onVisibleChange={this.handleVisibleChange}
            onConfirm={this.confirm}
            onCancel={this.cancel}
            okText="Yes"
            cancelText="No"
          />
          <Dropdown overlay={menu}>
            <Button type="primary" shape="circle" icon="more" />
          </Dropdown>
        </StyledDiv>
        <>
          {/* Modals */}
          {this.state.studentReportCardMenuModalVisibility ? (
            <StudentReportCardMenuModal
              title="Student Report Card"
              visible={this.state.studentReportCardMenuModalVisibility}
              onOk={this.onStudentReportCardMenuModalOk}
              onCancel={this.onStudentReportCardMenuModalCancel}
            />
          ) : null}
          {this.state.studentReportCardModalVisibility ? (
            <StudentReportCardModal
              visible={this.state.studentReportCardModalVisibility}
              onOk={this.onStudentReportCardModalOk}
              onCancel={this.onStudentReportCardModalCancel}
              groupId={classId}
              selectedStudentsKeys={selectedStudentsKeys}
              columnsFlags={this.state.studentReportCardModalColumnsFlags}
              assignmentId={assignmentId}
            />
          ) : null}
        </>
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
  showScore: PropTypes.bool
};

ClassHeader.defaultProps = {
  testActivityId: "",
  showScore: false
};

const enhance = compose(
  withNamespaces("classBoard"),
  connect(
    state => ({
      showScore: showScoreSelector(state),
      classResponse: getClassResponseSelector(state),
      status: get(state, ["author_classboard_testActivity", "data", "status"], ""),
      enableMarkAsDone: getMarkAsDoneEnableSelector(state)
    }),
    {
      setReleaseScore: releaseScoreAction,
      setMarkAsDone: markAsDoneAction
    }
  )
);
export default enhance(ClassHeader);
