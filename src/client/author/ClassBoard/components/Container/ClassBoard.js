import React, { Component } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get, keyBy, isEmpty, round } from "lodash";
import { message, Dropdown, Select } from "antd";
import { withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import {
  IconMarkAsAbsent,
  IconStudentReportCard,
  IconMoreHorizontal,
  IconRedirect,
  IconPrint,
  IconAddStudents,
  IconRemove,
  IconInfo,
  IconMarkAsSubmitted,
  IconDownload
} from "@edulastic/icons";
// actions
import {
  receiveTestActivitydAction,
  receiveClassResponseAction,
  releaseScoreAction,
  markAsDoneAction,
  markAbsentAction,
  removeStudentAction,
  setCurrentTestActivityIdAction,
  getAllTestActivitiesForStudentAction,
  receiveStudentResponseAction,
  markSubmittedAction
} from "../../../src/actions/classBoard";
import QuestionContainer from "../../../QuestionView";
import StudentContainer from "../../../StudentView";
// ducks
import {
  getTestActivitySelector,
  getGradeBookSelector,
  getAdditionalDataSelector,
  getClassResponseSelector,
  getTestQuestionActivitiesSelector,
  stateStudentResponseSelector,
  showScoreSelector,
  getMarkAsDoneEnableSelector,
  getQLabelsSelector,
  removedStudentsSelector,
  getCurrentTestActivityIdSelector,
  getAllTestActivitiesForStudentSelector,
  getStudentResponseSelector
} from "../../ducks";

import {
  gradebookSelectStudentAction,
  gradebookUnSelectStudentAction,
  gradebookUnSelectAllAction,
  gradebookSetSelectedAction
} from "../../../src/reducers/gradeBook";
// components
import Score from "../Score/Score";
import DisneyCardContainer from "../DisneyCardContainer/DisneyCardContainer";
import Graph from "../ProgressGraph/ProgressGraph";
import BarGraph from "../BarGraph/BarGraph";
import { GenSelect } from "../../../Shared/Components/ClassSelect/ClassSelect";
import StudentSelect from "../../../Shared/Components/StudentSelect/StudentSelect";
import ClassHeader from "../../../Shared/Components/ClassHeader/ClassHeader";
import PresentationToggleSwitch from "../../../Shared/Components/PresentationToggleSwitch";
import HooksContainer from "../HooksContainer/HooksContainer";
import RedirectPopup from "../RedirectPopUp";
import { StudentReportCardMenuModal } from "../../../Shared/Components/ClassHeader/components/studentReportCardMenuModal";
import { StudentReportCardModal } from "../../../Shared/Components/ClassHeader/components/studentReportCardModal";

import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

// styled wrappers
import {
  Anchor,
  // BarDiv,
  // SpaceDiv,
  // ButtonSpace,
  AnchorLink,
  // StyledAnc,
  StyledCard,
  // StyledButton,
  StyledCheckbox,
  PaginationInfo,
  CheckContainer,
  // ButtonGroup,
  GraphContainer,
  StyledFlexContainer,
  StudentButtonDiv,
  StudentButton,
  QuestionButton,
  BothButton,
  RedirectButton,
  ClassBoardFeats,
  StudentGrapContainer,
  ButtonIconWrap,
  MenuItems,
  CaretUp,
  DropMenu,
  CardDetailsContainer,
  ScoreHeader,
  ScoreChangeWrapper,
  ScoreWrapper,
  GraphWrapper,
  InfoWrapper
} from "./styled";
import ConfirmationModal from "../../../../common/components/ConfirmationModal";
import AddStudentsPopup from "../AddStudentsPopup";
import { getUserRole, getUserOrgId } from "../../../src/selectors/user";
import moment from "moment";
import { black } from "@edulastic/colors";

class ClassBoard extends Component {
  constructor(props) {
    super(props);
    this.changeStateTrue = this.changeStateTrue.bind(this);
    this.changeStateFalse = this.changeStateFalse.bind(this);
    this.onSelectAllChange = this.onSelectAllChange.bind(this);

    this.state = {
      flag: true,
      selectedTab: "Both",
      selectAll: false,
      selectedQuestion: 0,
      selectedQid: null,
      itemId: null,
      nCountTrue: 0,
      redirectPopup: false,
      selectedStudentId: "",
      visible: false,
      condition: true, // Whether meet the condition, if not show popconfirm.
      disabledList: [],
      absentList: [],
      studentReportCardMenuModalVisibility: false,
      studentReportCardModalVisibility: false,
      studentReportCardModalColumnsFlags: {},
      showMarkAbsentPopup: false,
      showRemoveStudentsPopup: false,
      showAddStudentsPopup: false,
      showMarkSubmittedPopup: false,
      modalInputVal: "",
      selectedNotStartedStudents: []
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

  componentDidMount() {
    const { loadTestActivity, match, studentUnselectAll } = this.props;
    const { assignmentId, classId } = match.params;
    loadTestActivity(assignmentId, classId);
    studentUnselectAll();
  }

  componentDidUpdate(_, prevState) {
    const { loadClassResponses, additionalData = {}, match, testActivity, getAllTestActivitiesForStudent } = this.props;
    const { testId } = additionalData;
    const { assignmentId, classId } = match.params;
    const { testId: prevTestId } = prevState;
    if (testId !== prevTestId) {
      loadClassResponses({ testId });
      const firstStudentId = get(testActivity.filter(x => !!x.testActivityId), [0, "studentId"], false);
      getAllTestActivitiesForStudent({ studentId: firstStudentId, assignmentId, groupId: classId });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { additionalData: { testId } = {} } = props;
    if (testId !== state.testId) {
      return { testId };
    }
    return null;
  }

  changeStateTrue() {
    this.setState({
      flag: true
    });
  }

  changeStateFalse() {
    this.setState({
      flag: false
    });
  }

  onSelectAllChange = e => {
    const { checked } = e.target;
    const { testActivity } = this.props;
    const { studentSelect, studentUnselectAll, allStudents, removedStudents } = this.props;
    testActivity.map(student => {
      student.check = checked;
      return null;
    });
    this.setState({
      selectAll: checked,
      nCountTrue: checked ? testActivity.length : 0
    });
    if (checked) {
      const selectedAllstudents = allStudents.map(x => x._id).filter(item => !removedStudents.includes(item));
      studentSelect(selectedAllstudents);
    } else {
      studentUnselectAll();
    }
  };

  onSelectCardOne = studentId => {
    let { nCountTrue } = this.state;
    const { studentSelect } = this.props;
    this.setState({ nCountTrue: (nCountTrue += 1) });
    studentSelect(studentId);
  };

  onUnselectCardOne = studentId => {
    let { nCountTrue } = this.state;
    const { studentUnselect } = this.props;
    this.setState({ nCountTrue: (nCountTrue -= 1) });
    studentUnselect(studentId);
  };

  handleCreate = () => {
    const { history, match } = this.props;
    history.push(`${match.url}/create`);
  };

  getTestActivityId = (data, student) => {
    return (
      (!student
        ? data.find(item => !!item.testActivityId)
        : data.find(item => !!item.testActivityId && item.studentId == student)) || {}
    ).testActivityId;
  };

  onTabChange = (e, name, selectedStudentId) => {
    this.setState({
      selectedTab: name,
      selectedStudentId
    });
  };

  getQuestions = () => {
    const { classResponse: { testItems = [] } = {} } = this.props;
    let totalQuestions = [];
    testItems.forEach(({ data: { questions = [] } = {} }) =>
      questions.forEach(q => {
        totalQuestions = [...totalQuestions, q];
      })
    );
    return totalQuestions;
  };

  handleRedirect = () => {
    const { selectedStudents, testActivity, enrollmentStatus, additionalData = {}, assignmentStatus } = this.props;
    if (additionalData.isPaused && assignmentStatus !== "DONE" && additionalData.endDate > Date.now()) {
      return message.info("The class has been paused for this assessment.Please resume to continue with redirect.");
    }

    const notStartedStudents = testActivity.filter(
      x =>
        selectedStudents[x.studentId] &&
        (x.status === "notStarted" || x.status === "inProgress" || x.status === "redirected")
    );

    if (notStartedStudents.length > 0) {
      message.warn("You can redirect only Submitted and Absent student(s).");
      return;
    }
    const selectedStudentIds = Object.keys(selectedStudents);
    if (selectedStudentIds.some(item => enrollmentStatus[item] === "0"))
      return message.warn("You can not redirect to not enrolled student(s).");
    this.setState({ redirectPopup: true });
  };

  changeCardCheck = (isCheck, studentId) => {
    let nCountTrue = 0;
    const { testActivity } = this.props;
    testActivity.map(student => {
      if (student.studentId === studentId) student.check = isCheck;
      if (student.check) nCountTrue++;
      return null;
    });
    this.setState({
      selectAll: nCountTrue === testActivity.length,
      nCountTrue
    });
  };

  onClickBarGraph = data => {
    const questions = this.getQuestions();
    const index = questions.findIndex(x => x.id === data.qid);
    this.setState({ selectedQuestion: index, selectedQid: data.qid, itemId: data.itemId, selectedTab: "questionView" });
  };

  isMobile = () => window.innerWidth < 480;

  handleReleaseScore = () => {
    const { match, setReleaseScore, showScore, additionalData } = this.props;
    const { assignmentId, classId } = match.params;
    const { testId } = additionalData;
    const isReleaseScore = !showScore;
    setReleaseScore(assignmentId, classId, isReleaseScore, testId);
  };

  handleMarkAsDone = () => {
    const { setMarkAsDone, match } = this.props;
    const { assignmentId, classId } = match.params;
    setMarkAsDone(assignmentId, classId);
  };

  onStudentReportCardsClick = () => {
    this.setState(state => ({ ...state, studentReportCardMenuModalVisibility: true }));
  };

  onStudentReportCardMenuModalOk = obj => {
    this.setState(state => ({
      ...state,
      studentReportCardMenuModalVisibility: false,
      studentReportCardModalVisibility: true,
      studentReportCardModalColumnsFlags: { ...obj }
    }));
  };

  onStudentReportCardMenuModalCancel = () => {
    this.setState(state => ({ ...state, studentReportCardMenuModalVisibility: false }));
  };

  onStudentReportCardModalOk = () => {};

  onStudentReportCardModalCancel = () => {
    this.setState(state => ({ ...state, studentReportCardModalVisibility: false }));
  };

  handleShowMarkAsSubmittedModal = () => {
    const { selectedStudents, testActivity, assignmentStatus, additionalData = {} } = this.props;
    if (assignmentStatus.toLowerCase() === "not open" && additionalData.startDate > Date.now()) {
      return message.warn("Assignment is not opened yet");
    }

    const selectedStudentKeys = Object.keys(selectedStudents);
    if (!selectedStudentKeys.length) {
      return message.warn("At least one student should be selected to be Marked as Submitted");
    }
    const mapTestActivityByStudId = keyBy(testActivity, "studentId");
    const selectedSubmittedStudents = selectedStudentKeys.filter(
      item => mapTestActivityByStudId[item].status === "submitted" || mapTestActivityByStudId[item].status === "graded"
    );
    if (selectedSubmittedStudents.length) {
      return message.warn(
        `${
          selectedSubmittedStudents.length
        } student(s) that you selected have already submitted the assignment, you will not be allowed to submit again.`
      );
    }
    this.setState({ showMarkSubmittedPopup: true, modalInputVal: "" });
  };

  handleShowMarkAsAbsentModal = () => {
    const { selectedStudents, testActivity, assignmentStatus, additionalData = {} } = this.props;
    if (assignmentStatus.toLowerCase() === "not open" && additionalData.startDate > Date.now()) {
      return message.warn("Assignment is not opened yet");
    }

    const selectedStudentKeys = Object.keys(selectedStudents);
    if (!selectedStudentKeys.length) {
      return message.warn("At least one student should be selected to be Marked as Absent.");
    }
    const mapTestActivityByStudId = keyBy(testActivity, "studentId");
    const selectedNotStartedStudents = selectedStudentKeys.filter(
      item =>
        mapTestActivityByStudId[item].status === "notStarted" || mapTestActivityByStudId[item].status === "redirected"
    );
    if (selectedNotStartedStudents.length !== selectedStudentKeys.length) {
      const submittedStudents = selectedStudentKeys.length - selectedNotStartedStudents.length;
      return message.warn(
        `${submittedStudents} student(s) that you selected have already started the assessment, you will not be allowed to mark as absent.`
      );
    }
    this.setState({ showMarkAbsentPopup: true, selectedNotStartedStudents, modalInputVal: "" });
  };

  handleShowRemoveStudentsModal = () => {
    const { selectedStudents, testActivity } = this.props;
    const selectedStudentKeys = Object.keys(selectedStudents);
    if (!selectedStudentKeys.length) {
      return message.warn("At least one student should be selected to be removed.");
    }
    const selectedStudentsEntity = testActivity.filter(item => selectedStudentKeys.includes(item.studentId));
    const isAnyBodyGraded = selectedStudentsEntity.some(item => item.status === "submitted" && item.graded);
    if (isAnyBodyGraded) {
      return message.warn("You will not be able to remove selected student(s) as the status is graded");
    }
    this.setState({ showRemoveStudentsPopup: true, modalInputVal: "" });
  };

  handleRemoveStudents = () => {
    const { selectedStudents, studentUnselectAll, removeStudent, match } = this.props;
    const { assignmentId, classId } = match.params;
    const selectedStudentKeys = Object.keys(selectedStudents);
    removeStudent(assignmentId, classId, selectedStudentKeys);
    studentUnselectAll();
    this.setState({ showRemoveStudentsPopup: false });
  };

  handleMarkAbsent = () => {
    const { selectedNotStartedStudents } = this.state;
    const { markAbsent, match, studentUnselectAll } = this.props;
    const { assignmentId, classId } = match.params;
    if (!selectedNotStartedStudents.length) return message.warn("No students selected");
    markAbsent(assignmentId, classId, selectedNotStartedStudents);
    studentUnselectAll();
    this.setState({ showMarkAbsentPopup: false });
  };

  handleMarkSubmitted = () => {
    const { markSubmitted, match, studentUnselectAll, selectedStudents } = this.props;
    const { assignmentId, classId } = match.params;
    const selectedStudentKeys = Object.keys(selectedStudents);
    if (!selectedStudentKeys.length) return message.warn("No students selected");
    markSubmitted(assignmentId, classId, selectedStudentKeys);
    studentUnselectAll();
    this.setState({ showMarkSubmittedPopup: false });
  };

  handleShowAddStudentsPopup = () => {
    const { assignmentStatus, additionalData, testActivity } = this.props;
    if (assignmentStatus === "DONE") {
      return message.warn(
        "Mismatch occurred with logged in class section, please navigate to assignments to select class section and try again."
      );
    }
    // total count represents total students count in the class
    if (additionalData.totalCount <= testActivity.length) {
      return message.warn("This assessment is already assigned to all students in the class.");
    }

    this.setState({ showAddStudentsPopup: true });
  };

  handleHideAddStudentsPopup = () => {
    this.setState({ showAddStudentsPopup: false });
  };

  handleCancelMarkSubmitted = () => {
    this.setState({ showMarkSubmittedPopup: false });
  };

  handleCancelMarkAbsent = () => {
    this.setState({ showMarkAbsentPopup: false });
  };

  handleCancelRemove = () => {
    this.setState({ showRemoveStudentsPopup: false });
  };

  handleValidateInput = e => {
    this.setState({ modalInputVal: e.target.value });
  };

  updateDisabledList = (studId, status) => {
    const { disabledList, absentList } = this.state;
    if (status === "Not Started" || status === "In Progress" || status === "Redirected") {
      if (!disabledList.includes(studId)) {
        this.setState({ disabledList: [...disabledList, studId] });
      }
    } else {
      const index = disabledList.indexOf(studId);
      if (index >= 0) {
        this.setState({ disabledList: [...disabledList.slice(0, index), ...disabledList.slice(index + 1)] });
      }
    }
    if (status === "Absent") {
      if (!absentList.includes(studId)) {
        this.setState({ absentList: [...absentList, studId] });
      }
    } else {
      const index = absentList.indexOf(studId);
      if (index >= 0) {
        this.setState({ absentList: [...absentList.slice(0, index), ...absentList.slice(index + 1)] });
      }
    }
  };

  render() {
    const {
      gradebook,
      testActivity,
      creating,
      match,
      classResponse = {},
      additionalData = {
        classes: []
      },
      selectedStudents,
      setSelected,
      allStudents,
      history,
      testQuestionActivities,
      qActivityByStudent,
      enableMarkAsDone,
      showScore,
      isPresentationMode,
      labels,
      userRole,
      districtId,
      assignmentStatus,
      currentTestActivityId,
      allTestActivitiesForStudent,
      setCurrentTestActivityId,
      studentResponse,
      loadStudentResponses,
      getAllTestActivitiesForStudent,
      enrollmentStatus
    } = this.props;
    const {
      selectedTab,
      flag,
      selectedQuestion,
      redirectPopup,
      selectedStudentId,
      studentReportCardMenuModalVisibility,
      studentReportCardModalVisibility,
      studentReportCardModalColumnsFlags,
      itemId,
      selectedQid,
      disabledList,
      absentList,
      selectAll,
      nCountTrue,
      modalInputVal,
      showMarkAbsentPopup,
      showRemoveStudentsPopup,
      showAddStudentsPopup,
      showMarkSubmittedPopup
    } = this.state;
    const { assignmentId, classId } = match.params;
    const classname = additionalData ? additionalData.classes : [];
    const isMobile = this.isMobile();
    let studentTestActivity = (studentResponse && studentResponse.testActivity) || {};
    studentTestActivity.timeSpent = Math.floor(
      ((studentResponse &&
        studentResponse.questionActivities &&
        studentResponse.questionActivities.reduce((acc, qa) => (acc += qa.timeSpent), 0)) ||
        0) / 1000
    );
    let { score = 0, maxScore = 0, scoreChange = 0, status } = studentTestActivity;
    if (studentResponse && !isEmpty(studentResponse.questionActivities) && status === 0) {
      studentResponse.questionActivities.forEach(uqa => {
        score += uqa.score;
        maxScore += uqa.maxScore;
      });
    }
    const selectedStudentsKeys = Object.keys(selectedStudents);
    const firstStudentId = get(testActivity.filter(x => !!x.testActivityId), [0, "studentId"], false);
    const testActivityId = this.getTestActivityId(testActivity, selectedStudentId || firstStudentId);
    const firstQuestionEntities = get(testActivity, [0, "questionActivities"], []);
    const unselectedStudents = testActivity.filter(x => !selectedStudents[x.studentId]);
    const disableMarkAbsent =
      (assignmentStatus.toLowerCase() == "not open" &&
        ((additionalData.startDate && additionalData.startDate > Date.now()) || !additionalData.open)) ||
      assignmentStatus.toLowerCase() === "graded";
    const existingStudents = testActivity.map(item => item.studentId);
    const disableMarkSubmitted = ["graded", "done", "in grading"].includes(assignmentStatus.toLowerCase());
    return (
      <div>
        {showMarkSubmittedPopup && (
          <ConfirmationModal
            title="Mark As Submitted"
            show={showMarkSubmittedPopup}
            onOk={this.handleMarkSubmitted}
            onCancel={this.handleCancelMarkSubmitted}
            inputVal={modalInputVal}
            onInputChange={this.handleValidateInput}
            expectedVal="SUBMIT"
            bodyText={`The assignment for selected student(s) will be marked as "Submitted". Once you proceed, these students will not be able to take the assignment online. If the students have answered any questions, their responses will be saved.`}
            okText="Yes,Submit"
            canUndone
          />
        )}
        {showMarkAbsentPopup && (
          <ConfirmationModal
            title="Absent"
            show={showMarkAbsentPopup}
            onOk={this.handleMarkAbsent}
            onCancel={this.handleCancelMarkAbsent}
            inputVal={modalInputVal}
            onInputChange={this.handleValidateInput}
            expectedVal="ABSENT"
            bodyText={
              "You are about to Mark the selected student(s) as Absent. Student's response if present will be deleted. Do you still want to proceed?"
            }
            okText="Yes,Absent"
          />
        )}
        {showRemoveStudentsPopup && (
          <ConfirmationModal
            title="Remove"
            show={showRemoveStudentsPopup}
            onOk={this.handleRemoveStudents}
            onCancel={this.handleCancelRemove}
            inputVal={modalInputVal}
            onInputChange={this.handleValidateInput}
            expectedVal="REMOVE"
            bodyText={
              "You are about to remove the selected student(s) from this assessment. Student's responses will be deleted. Do you still want to proceed?"
            }
            okText="Yes,Remove"
          />
        )}
        <HooksContainer classId={classId} assignmentId={assignmentId} />
        <ClassHeader
          classId={classId}
          active="classboard"
          creating={creating}
          onCreate={this.handleCreate}
          assignmentId={assignmentId}
          additionalData={additionalData}
          testActivityId={testActivityId}
          selectedStudentsKeys={selectedStudentsKeys}
        />
        <CardDetailsContainer>
          <StyledFlexContainer justifyContent="space-between">
            <PaginationInfo xs={24} md={8}>
              &lt; &nbsp; <AnchorLink to="/author/assignments">RECENTS ASSIGNMENTS</AnchorLink> &nbsp;/&nbsp;
              <AnchorLink
                to={
                  userRole === "teacher"
                    ? "/author/assignments"
                    : `/author/assignments/${districtId}/${additionalData.testId}`
                }
              >
                {additionalData.testName}
              </AnchorLink>{" "}
              &nbsp;/&nbsp;
              <Anchor>{additionalData.className}</Anchor>
            </PaginationInfo>

            <StudentButtonDiv xs={24} md={16} data-cy="studentnQuestionTab">
              <PresentationToggleSwitch groupId={classId} />
              <BothButton
                style={{ marginLeft: "20px" }}
                active={selectedTab === "Both"}
                onClick={e => this.onTabChange(e, "Both")}
              >
                CARD VIEW
              </BothButton>
              <StudentButton
                disabled={!firstStudentId}
                active={selectedTab === "Student"}
                onClick={e => this.onTabChange(e, "Student", firstStudentId)}
              >
                STUDENTS
              </StudentButton>
              <QuestionButton
                active={selectedTab === "questionView"}
                disabled={!firstStudentId}
                onClick={() => {
                  const firstQuestion = get(this.props, ["testActivity", 0, "questionActivities", 0]);
                  if (!firstQuestion) {
                    console.warn("no question activities");
                    return;
                  }
                  this.setState({
                    selectedQuestion: 0,
                    selectedQid: firstQuestion._id,
                    itemId: firstQuestion.testItemId,
                    selectedTab: "questionView"
                  });
                }}
              >
                QUESTIONS
              </QuestionButton>
            </StudentButtonDiv>
          </StyledFlexContainer>
          {selectedTab === "Both" && (
            <React.Fragment>
              <GraphContainer>
                <StyledCard bordered={false}>
                  <Graph
                    gradebook={gradebook}
                    title={additionalData.testName}
                    testActivity={testActivity}
                    testQuestionActivities={testQuestionActivities}
                    onClickHandler={this.onClickBarGraph}
                  />
                </StyledCard>
              </GraphContainer>
              {
                <StyledFlexContainer justifyContent="space-between" marginBottom="0px">
                  <CheckContainer>
                    <StyledCheckbox
                      checked={unselectedStudents.length === 0}
                      indeterminate={unselectedStudents.length > 0 && unselectedStudents.length < testActivity.length}
                      onChange={this.onSelectAllChange}
                    >
                      {unselectedStudents.length > 0 ? "SELECT ALL" : "UNSELECT ALL"}
                    </StyledCheckbox>
                  </CheckContainer>
                  <ClassBoardFeats>
                    <RedirectButton
                      first={true}
                      data-cy="printButton"
                      onClick={() => history.push(`/author/printpreview/${additionalData.testId}`)}
                    >
                      <ButtonIconWrap>
                        <IconPrint />
                      </ButtonIconWrap>
                      PRINT
                    </RedirectButton>
                    <RedirectButton data-cy="rediectButton" onClick={this.handleRedirect}>
                      <ButtonIconWrap>
                        <IconRedirect />
                      </ButtonIconWrap>
                      REDIRECT
                    </RedirectButton>
                    <FeaturesSwitch
                      inputFeatures="assessmentSuperPowersMarkAsDone"
                      actionOnInaccessible="hidden"
                      groupId={classId}
                    >
                      <Dropdown
                        overlay={
                          <DropMenu>
                            <CaretUp className="fa fa-caret-up" />
                            <MenuItems disabled={disableMarkSubmitted} onClick={this.handleShowMarkAsSubmittedModal}>
                              <IconMarkAsSubmitted width={12} />
                              <span>Mark as Submitted</span>
                            </MenuItems>
                            <MenuItems disabled={disableMarkAbsent} onClick={this.handleShowMarkAsAbsentModal}>
                              <IconMarkAsAbsent />
                              <span>Mark as Absent</span>
                            </MenuItems>
                            <MenuItems onClick={this.handleShowAddStudentsPopup}>
                              <IconAddStudents />
                              <span>Add Students</span>
                            </MenuItems>
                            <MenuItems onClick={this.handleShowRemoveStudentsModal}>
                              <IconRemove />
                              <span>Remove Students</span>
                            </MenuItems>
                            <MenuItems>
                              <IconDownload />
                              <span>Download Grades</span>
                            </MenuItems>
                            <MenuItems>
                              <IconDownload />
                              <span>Download Response</span>
                            </MenuItems>
                            <MenuItems onClick={this.onStudentReportCardsClick}>
                              <IconStudentReportCard />
                              <span>Student Report Cards</span>
                            </MenuItems>
                          </DropMenu>
                        }
                        placement="bottomRight"
                      >
                        <RedirectButton last={true}>
                          <ButtonIconWrap>
                            <IconMoreHorizontal />
                          </ButtonIconWrap>
                          MORE
                        </RedirectButton>
                      </Dropdown>
                    </FeaturesSwitch>
                  </ClassBoardFeats>
                </StyledFlexContainer>
              }

              <>
                {/* Modals */}
                {studentReportCardMenuModalVisibility ? (
                  <StudentReportCardMenuModal
                    title="Student Report Card"
                    visible={studentReportCardMenuModalVisibility}
                    onOk={this.onStudentReportCardMenuModalOk}
                    onCancel={this.onStudentReportCardMenuModalCancel}
                  />
                ) : null}
                {studentReportCardModalVisibility ? (
                  <StudentReportCardModal
                    visible={studentReportCardModalVisibility}
                    onOk={this.onStudentReportCardModalOk}
                    onCancel={this.onStudentReportCardModalCancel}
                    groupId={classId}
                    selectedStudentsKeys={selectedStudentsKeys}
                    columnsFlags={studentReportCardModalColumnsFlags}
                    assignmentId={assignmentId}
                  />
                ) : null}
              </>

              {flag ? (
                <DisneyCardContainer
                  selectedStudents={selectedStudents}
                  testActivity={testActivity}
                  updateDisabledList={this.updateDisabledList}
                  assignmentId={assignmentId}
                  classId={classId}
                  studentSelect={this.onSelectCardOne}
                  endDate={additionalData.endDate || additionalData.closedDate}
                  studentUnselect={this.onUnselectCardOne}
                  viewResponses={(e, selected) => {
                    getAllTestActivitiesForStudent({ studentId: selected, assignmentId, groupId: classId });
                    this.onTabChange(e, "Student", selected);
                  }}
                  isPresentationMode={isPresentationMode}
                  enrollmentStatus={enrollmentStatus}
                />
              ) : (
                <Score gradebook={gradebook} assignmentId={assignmentId} classId={classId} />
              )}

              <RedirectPopup
                open={redirectPopup}
                allStudents={allStudents}
                disabledList={disabledList}
                absentList={absentList}
                selectedStudents={selectedStudents}
                additionalData={additionalData}
                enrollmentStatus={enrollmentStatus}
                closePopup={() => {
                  this.setState({ redirectPopup: false });
                }}
                setSelected={setSelected}
                assignmentId={assignmentId}
                groupId={classId}
              />
              {showAddStudentsPopup && (
                <AddStudentsPopup
                  open={showAddStudentsPopup}
                  groupId={classId}
                  closePolicy={additionalData.closePolicy}
                  assignmentId={assignmentId}
                  closePopup={this.handleHideAddStudentsPopup}
                  disabledList={existingStudents}
                />
              )}
            </React.Fragment>
          )}

          {selectedTab === "Student" && testActivity && (
            <React.Fragment>
              <StudentGrapContainer>
                <StyledCard bordered={false} paddingTop={15}>
                  <StudentSelect
                    style={{ width: "200px" }}
                    students={testActivity}
                    selectedStudent={selectedStudentId}
                    studentResponse={qActivityByStudent}
                    handleChange={value => {
                      getAllTestActivitiesForStudent({ studentId: value, assignmentId, groupId: classId });
                      this.setState({ selectedStudentId: value });
                    }}
                    isPresentationMode={isPresentationMode}
                  />
                  <GraphWrapper style={{ width: "100%", display: "flex" }}>
                    <BarGraph
                      gradebook={gradebook}
                      testActivity={testActivity}
                      studentId={selectedStudentId}
                      studentview
                      studentResponse={studentResponse}
                    />
                    <InfoWrapper>
                      {allTestActivitiesForStudent.length > 1 && (
                        <Select
                          style={{ width: "200px" }}
                          value={
                            allTestActivitiesForStudent.includes(currentTestActivityId || testActivityId)
                              ? currentTestActivityId || testActivityId
                              : ""
                          }
                          onChange={testActivityId => {
                            loadStudentResponses({ testActivityId, groupId: classId });
                            setCurrentTestActivityId(testActivityId);
                          }}
                        >
                          {[...allTestActivitiesForStudent].reverse().map((testActivityId, index) => (
                            <Select.Option key={index} value={testActivityId}>
                              {`Attempt ${allTestActivitiesForStudent.length - index}`}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div
                          style={{ display: "flex", flexDirection: "column", padding: "10px", alignItems: "center" }}
                        >
                          <ScoreHeader>TOTAL SCORE</ScoreHeader>
                          <ScoreWrapper>{round(score, 2) || 0}</ScoreWrapper>
                          <div style={{ border: "solid 1px black", width: "50px" }} />
                          <ScoreWrapper>{round(maxScore, 2) || 0}</ScoreWrapper>
                        </div>
                        {allTestActivitiesForStudent.length > 1 && (
                          <div
                            style={{ display: "flex", flexDirection: "column", padding: "10px", alignItems: "center" }}
                          >
                            <ScoreHeader>SCORE</ScoreHeader>
                            <ScoreChangeWrapper scoreChange={studentTestActivity.scoreChange}>
                              {`${studentTestActivity.scoreChange > 0 ? "+" : ""}${round(
                                studentTestActivity.scoreChange,
                                2
                              ) || 0}`}
                            </ScoreChangeWrapper>
                            <ScoreHeader style={{ fontSize: "10px", display: "flex" }}>
                              <span>{`Improvement `}</span>
                              <span
                                style={{ marginLeft: "2px" }}
                                title="Score increase from previous student attempt. Select an attempt from the dropdown above to view prior student responses"
                              >
                                <IconInfo />
                              </span>
                            </ScoreHeader>
                          </div>
                        )}
                      </div>
                      <ScoreHeader style={{ fontSize: "12px" }}>
                        {" "}
                        {`TIME (min) `}{" "}
                        <span style={{ color: black, textTransform: "capitalize" }}>
                          {`${Math.floor(studentTestActivity.timeSpent / 60)}:${studentTestActivity.timeSpent % 60}` ||
                            ""}
                        </span>
                      </ScoreHeader>
                      <ScoreHeader style={{ fontSize: "12px" }}>
                        {" "}
                        {`STATUS  `}{" "}
                        <span style={{ color: black, textTransform: "capitalize" }}>
                          {studentTestActivity.status === 2
                            ? "Absent"
                            : studentTestActivity.status === 1
                            ? studentTestActivity.graded === "GRADED"
                              ? "Graded"
                              : "Submitted"
                            : "In Progress" || ""}
                        </span>
                      </ScoreHeader>
                      <ScoreHeader style={{ fontSize: "12px" }}>
                        {`SUBMITTED ON  `}
                        <span style={{ color: black }}>
                          {moment(studentTestActivity.endDate).format("d MMMM, YYYY")}
                        </span>
                      </ScoreHeader>
                    </InfoWrapper>
                  </GraphWrapper>
                </StyledCard>
              </StudentGrapContainer>
              <StudentContainer
                classResponse={classResponse}
                studentItems={testActivity}
                selectedStudent={selectedStudentId}
                isPresentationMode={isPresentationMode}
              />
            </React.Fragment>
          )}

          {selectedTab === "questionView" && (selectedQuestion || selectedQuestion === 0) && (
            <React.Fragment>
              <QuestionContainer
                classResponse={classResponse}
                testActivity={testActivity}
                qIndex={selectedQuestion}
                itemId={itemId}
                question={{ id: selectedQid }}
                isPresentationMode={isPresentationMode}
              >
                <GenSelect
                  classid="DI"
                  classname={
                    selectedTab === "Student"
                      ? classname
                      : firstQuestionEntities
                          .map((x, index) => ({ value: index, disabled: x.disabled || x.scoringDisabled, id: x._id }))
                          .filter(x => !x.disabled)
                          .map(({ value, id }) => ({ value, name: labels[id].barLabel }))
                  }
                  selected={selectedQuestion}
                  justifyContent="flex-end"
                  handleChange={value => {
                    const { _id: qid, testItemId } = testActivity[0].questionActivities[value];
                    this.setState({ selectedQuestion: value, selectedQid: qid, testItemId });
                  }}
                />
              </QuestionContainer>
            </React.Fragment>
          )}
        </CardDetailsContainer>
      </div>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  withNamespaces("classBoard"),
  connect(
    state => ({
      gradebook: getGradeBookSelector(state),
      testActivity: getTestActivitySelector(state),
      classResponse: getClassResponseSelector(state),
      additionalData: getAdditionalDataSelector(state),
      userRole: getUserRole(state),
      districtId: getUserOrgId(state),
      testQuestionActivities: getTestQuestionActivitiesSelector(state),
      selectedStudents: get(state, ["author_classboard_gradebook", "selectedStudents"], {}),
      allStudents: get(state, ["author_classboard_testActivity", "data", "students"], []),
      testItemsData: get(state, ["author_classboard_testActivity", "data", "testItemsData"], []),
      studentResponse: getStudentResponseSelector(state),
      qActivityByStudent: stateStudentResponseSelector(state),
      showScore: showScoreSelector(state),
      currentTestActivityId: getCurrentTestActivityIdSelector(state),
      allTestActivitiesForStudent: getAllTestActivitiesForStudentSelector(state),
      enableMarkAsDone: getMarkAsDoneEnableSelector(state),
      assignmentStatus: get(state, ["author_classboard_testActivity", "data", "status"], ""),
      enrollmentStatus: get(state, "author_classboard_testActivity.data.enrollmentStatus", {}),
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false),
      labels: getQLabelsSelector(state),
      removedStudents: removedStudentsSelector(state)
    }),
    {
      loadTestActivity: receiveTestActivitydAction,
      loadClassResponses: receiveClassResponseAction,
      loadStudentResponses: receiveStudentResponseAction,
      studentSelect: gradebookSelectStudentAction,
      studentUnselect: gradebookUnSelectStudentAction,
      getAllTestActivitiesForStudent: getAllTestActivitiesForStudentAction,
      setCurrentTestActivityId: setCurrentTestActivityIdAction,
      studentUnselectAll: gradebookUnSelectAllAction,
      setSelected: gradebookSetSelectedAction,
      setReleaseScore: releaseScoreAction,
      setMarkAsDone: markAsDoneAction,
      markAbsent: markAbsentAction,
      removeStudent: removeStudentAction,
      markSubmitted: markSubmittedAction
    }
  )
);

export default enhance(ClassBoard);

/* eslint-disable react/require-default-props */
ClassBoard.propTypes = {
  gradebook: PropTypes.object,
  classResponse: PropTypes.object,
  additionalData: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  loadTestActivity: PropTypes.func,
  creating: PropTypes.object,
  testActivity: PropTypes.array,
  // t: PropTypes.func,
  loadClassResponses: PropTypes.func,
  studentSelect: PropTypes.func.isRequired,
  studentUnselectAll: PropTypes.func.isRequired,
  allStudents: PropTypes.array,
  selectedStudents: PropTypes.object,
  studentUnselect: PropTypes.func,
  setSelected: PropTypes.func,
  setReleaseScore: PropTypes.func,
  showScore: PropTypes.func,
  enableMarkAsDone: PropTypes.bool,
  setMarkAsDone: PropTypes.func,
  isPresentationMode: PropTypes.bool,
  testQuestionActivities: PropTypes.array,
  qActivityByStudent: PropTypes.any,
  labels: PropTypes.array
};
