import { black } from "@edulastic/colors";
import { MainContentWrapper } from "@edulastic/common";
import {
  IconAddStudents,
  IconDownload,
  IconInfo,
  IconMarkAsAbsent,
  IconMarkAsSubmitted,
  IconMoreHorizontal,
  IconPrint,
  IconRedirect,
  IconRemove,
  IconStudentReportCard
} from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import { Dropdown, message, Select } from "antd";
import { get, isEmpty, keyBy, round } from "lodash";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import ConfirmationModal from "../../../../common/components/ConfirmationModal";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import QuestionContainer from "../../../QuestionView";
import ClassBreadBrumb from "../../../Shared/Components/ClassBreadCrumb";
import ClassHeader from "../../../Shared/Components/ClassHeader/ClassHeader";
import { StudentReportCardMenuModal } from "../../../Shared/Components/ClassHeader/components/studentReportCardMenuModal";
import { StudentReportCardModal } from "../../../Shared/Components/ClassHeader/components/studentReportCardModal";
import { GenSelect } from "../../../Shared/Components/ClassSelect/ClassSelect";
import PresentationToggleSwitch from "../../../Shared/Components/PresentationToggleSwitch";
import StudentSelect from "../../../Shared/Components/StudentSelect/StudentSelect";
// actions
import {
  downloadGradesResponseAction,
  getAllTestActivitiesForStudentAction,
  markAbsentAction,
  markAsDoneAction,
  markSubmittedAction,
  receiveStudentResponseAction,
  receiveTestActivitydAction,
  releaseScoreAction,
  removeStudentAction,
  setCurrentTestActivityIdAction
} from "../../../src/actions/classBoard";
import WithDisableMessage from "../../../src/components/common/ToggleDisable";
import {
  gradebookSelectStudentAction,
  gradebookSetSelectedAction,
  gradebookUnSelectAllAction,
  gradebookUnSelectStudentAction
} from "../../../src/reducers/gradeBook";
import StudentContainer from "../../../StudentView";
// ducks
import {
  getAdditionalDataSelector,
  getAllTestActivitiesForStudentSelector,
  getAssignmentStatusSelector,
  getClassResponseSelector,
  getCurrentTestActivityIdSelector,
  getDisableMarkAsSubmittedSelector,
  getGradeBookSelector,
  getHasRandomQuestionselector,
  getSortedTestActivitySelector,
  getStudentResponseSelector,
  getTestQuestionActivitiesSelector,
  isItemVisibiltySelector,
  removedStudentsSelector,
  showScoreSelector,
  stateStudentResponseSelector,
  testActivtyLoadingSelector
} from "../../ducks";
import AddStudentsPopup from "../AddStudentsPopup";
import BarGraph from "../BarGraph/BarGraph";
import DisneyCardContainer from "../DisneyCardContainer/DisneyCardContainer";
import HooksContainer from "../HooksContainer/HooksContainer";
import Graph from "../ProgressGraph/ProgressGraph";
import RedirectPopup from "../RedirectPopUp";
// components
import Score from "../Score/Score";
// styled wrappers
import {
  BothButton,
  ButtonIconWrap,
  CheckContainer,
  ClassBoardFeats,
  DropMenu,
  GraphContainer,
  GraphWrapper,
  InfoWrapper,
  MenuItems,
  QuestionButton,
  RedirectButton,
  ScoreChangeWrapper,
  ScoreHeader,
  ScoreWrapper,
  StudentButton,
  StudentButtonDiv,
  StudentGrapContainer,
  StyledCard,
  StyledCheckbox,
  StyledFlexContainer
} from "./styled";

class ClassBoard extends Component {
  constructor(props) {
    super(props);
    this.changeStateTrue = this.changeStateTrue.bind(this);
    this.changeStateFalse = this.changeStateFalse.bind(this);
    this.onSelectAllChange = this.onSelectAllChange.bind(this);

    let _selectedTab = "Both";
    let questionId = null;
    if (props.location.pathname.includes("question-activity")) {
      _selectedTab = "questionView";
      const tempArr = props.location.pathname.split("/");
      questionId = tempArr[tempArr.length - 1];
    } else if (props.location.pathname.includes("test-activity")) {
      _selectedTab = "Student";
    }

    this.state = {
      flag: true,
      selectedTab: _selectedTab,
      selectAll: false,
      selectedQuestion: 0,
      selectedQid: questionId,
      itemId: null,
      nCountTrue: 0,
      redirectPopup: false,
      selectedStudentId: "",
      visible: false,
      condition: true, // Whether meet the condition, if not show popconfirm.
      studentReportCardMenuModalVisibility: false,
      studentReportCardModalVisibility: false,
      studentReportCardModalColumnsFlags: {},
      showMarkAbsentPopup: false,
      showRemoveStudentsPopup: false,
      showAddStudentsPopup: false,
      showMarkSubmittedPopup: false,
      modalInputVal: "",
      selectedNotStartedStudents: [],
      showScoreImporvement: false
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

  componentDidUpdate(prevProps, prevState) {
    const { additionalData = {}, match, testActivity, getAllTestActivitiesForStudent } = this.props;
    const { assignmentId, classId } = match.params;
    const filterCriteria = activity => activity?.questionActivities?.[0]?._id;
    if (additionalData.testId !== prevState.testId || !prevProps.testActivity.length) {
      const firstStudentId = get(testActivity.filter(x => !!filterCriteria(x)), [0, "studentId"], false);
      if (firstStudentId)
        getAllTestActivitiesForStudent({
          studentId: firstStudentId,
          assignmentId,
          groupId: classId
        });
    }
  }

  static getDerivedStateFromProps(props, state) {
    let newState = {};
    const { additionalData: { testId } = {}, testActivity, allTestActivitiesForStudent } = props;

    if (testId !== state.testId) {
      newState = { ...newState, testId };
    }

    if (
      state.selectedQid &&
      !state.itemId &&
      testActivity.length &&
      props.location.pathname.includes("question-activity")
    ) {
      // first load for question-activity page
      const questions = testActivity[0].questionActivities;
      const questionIndex = questions.findIndex(item => item._id === state.selectedQid);

      const question = questions[questionIndex];
      if (question) {
        newState = { ...newState, itemId: question.testItemId, selectedQuestion: questionIndex };
      }
    }

    if (allTestActivitiesForStudent.length) {
      const tempArr = props.location.pathname.split("/");
      const currentTestActivityId = tempArr[tempArr.length - 1];
      const isFirstAttempt = currentTestActivityId === allTestActivitiesForStudent[0]._id;
      if (isFirstAttempt) {
        newState = { ...newState, showScoreImporvement: false };
      } else {
        newState = { ...newState, showScoreImporvement: true };
      }
    }

    if (testActivity.length && !state.selectedStudentId && props.location.pathname.includes("test-activity")) {
      // first load for test-activity page
      const tempArr = props.location.pathname.split("/");
      const testActivityId = tempArr[tempArr.length - 1];

      const student = testActivity.find(item => item.testActivityId === testActivityId);
      if (student) {
        newState = { ...newState, selectedStudentId: student.studentId, selectedTab: "Student" };
      }
    }

    if (Object.keys(newState).length) {
      return newState;
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

  getTestActivityId = (data, student) =>
    (
      (!student
        ? data.find(item => !!item.testActivityId)
        : data.find(item => !!item.testActivityId && item.studentId == student)) || {}
    ).testActivityId;

  resetView = view => {
    this.setState({ selectedTab: view });
  };

  onTabChange = (e, name, selectedStudentId, testActivityId) => {
    const { setCurrentTestActivityId, match, history } = this.props;
    const { assignmentId, classId } = match.params;
    this.setState({
      selectedTab: name,
      selectedStudentId
    });

    if (name === "Both") {
      history.push(`/author/classboard/${assignmentId}/${classId}`);
    } else if (name === "Student") {
      history.push(`/author/classboard/${assignmentId}/${classId}/test-activity/${testActivityId}`);
      setCurrentTestActivityId(testActivityId);
    }
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
    const { isItemsVisible, match, history } = this.props;
    if (!isItemsVisible) {
      return;
    }
    const { assignmentId, classId } = match.params;
    const questions = this.getQuestions();
    const index = questions.findIndex(x => x.id === data.qid);

    this.setState({
      selectedQuestion: index,
      selectedQid: data.qid,
      itemId: data.itemId,
      selectedTab: "questionView"
    });
    history.push(`/author/classboard/${assignmentId}/${classId}/question-activity/${data.qid}`);
  };

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
    const { selectedStudents, testActivity, assignmentStatus } = this.props;
    if (assignmentStatus.toLowerCase() === "not open") {
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
    const { additionalData, testActivity } = this.props;
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

  handleDownloadGrades = isResponseRequired => {
    const { downloadGradesResponse, match, selectedStudents } = this.props;
    const { assignmentId, classId } = match.params;
    const selectedStudentKeys = Object.keys(selectedStudents);
    if (!selectedStudentKeys.length) {
      return message.warn("At least one student should be selected to download grades.");
    }
    downloadGradesResponse(assignmentId, classId, selectedStudentKeys, isResponseRequired);
  };

  onClickPrint = event => {
    event.preventDefault();

    const { testActivity, selectedStudents, match } = this.props;
    const { assignmentId, classId } = match.params;
    const selectedStudentsKeys = Object.keys(selectedStudents);

    const studentsMap = keyBy(testActivity, "studentId");

    const isPrintable =
      selectedStudentsKeys.length &&
      !selectedStudentsKeys.some(
        item => studentsMap[item].status === "notStarted" || studentsMap[item].status === "inProgress"
      );

    if (isPrintable && selectedStudentsKeys.length) {
      const selectedStudentsStr = selectedStudentsKeys.join(",");
      window.open(`/author/printpreview/${assignmentId}/${classId}?selectedStudents=${selectedStudentsStr}`);
    } else if (!selectedStudentsKeys.length) {
      message.error("At least one student should be selected to print responses.");
    } else {
      message.error("You can print only after the assignment has been submitted by the student(s).");
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
      testQuestionActivities,
      qActivityByStudent,
      isPresentationMode,
      assignmentStatus,
      currentTestActivityId,
      allTestActivitiesForStudent,
      setCurrentTestActivityId,
      studentResponse,
      loadStudentResponses,
      getAllTestActivitiesForStudent,
      enrollmentStatus,
      isItemsVisible,
      studentViewFilter,
      disableMarkSubmitted,
      hasRandomQuestions,
      isLoading,
      t,
      history
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
      modalInputVal,
      showMarkAbsentPopup,
      showRemoveStudentsPopup,
      showAddStudentsPopup,
      showMarkSubmittedPopup
    } = this.state;
    const { assignmentId, classId } = match.params;
    const studentTestActivity = (studentResponse && studentResponse.testActivity) || {};
    studentTestActivity.timeSpent = Math.floor(
      ((studentResponse &&
        studentResponse.questionActivities &&
        studentResponse.questionActivities.reduce((acc, qa) => (acc += qa.timeSpent), 0)) ||
        0) / 1000
    );
    let { score = 0, maxScore = 0, status } = studentTestActivity;
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
    const disabledList = testActivity
      .filter(student => {
        const endDate = additionalData.closedDate || additionalData.endDate;
        if (student.status === "notStarted" && (endDate < Date.now() || additionalData.closed)) {
          return false;
        }
        if (student.status === "notStarted") {
          return true;
        }
        return ["inProgress", "redirected"].includes(student.status);
      })
      .map(x => x.studentId);

    const absentList = testActivity
      .filter(student => {
        const endDate = additionalData.closedDate || additionalData.endDate;
        if (
          student.status === "absent" ||
          (student.status === "notStarted" && (endDate < Date.now() || additionalData.closed))
        ) {
          return true;
        }
      })
      .map(x => x.studentId);
    const enableDownload = testActivity.some(item => item.status === "submitted") && isItemsVisible;

    const { showScoreImporvement } = this.state;
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
            okText="Yes, Submit"
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
            okText="Yes, Remove"
          />
        )}
        <HooksContainer additionalData={additionalData} classId={classId} assignmentId={assignmentId} />
        <ClassHeader
          classId={classId}
          active="classboard"
          creating={creating}
          onCreate={this.handleCreate}
          assignmentId={assignmentId}
          additionalData={additionalData}
          testActivityId={testActivityId}
          selectedStudentsKeys={selectedStudentsKeys}
          resetView={this.resetView}
        />
        <MainContentWrapper>
          <StyledFlexContainer justifyContent="space-between">
            <ClassBreadBrumb />
            <StudentButtonDiv xs={24} md={16} data-cy="studentnQuestionTab">
              <PresentationToggleSwitch groupId={classId} />
              <BothButton
                disabled={isLoading}
                style={{ marginLeft: "20px" }}
                active={selectedTab === "Both"}
                onClick={e => this.onTabChange(e, "Both")}
              >
                CARD VIEW
              </BothButton>
              <WithDisableMessage disabled={!isItemsVisible} errMessage={t("common.testHidden")}>
                <StudentButton
                  disabled={!firstStudentId || !isItemsVisible || isLoading}
                  active={selectedTab === "Student"}
                  onClick={e =>
                    this.onTabChange(
                      e,
                      "Student",
                      firstStudentId,
                      testActivity?.find(x => x.studentId === firstStudentId)?.testActivityId
                    )
                  }
                >
                  STUDENTS
                </StudentButton>
              </WithDisableMessage>
              <WithDisableMessage
                disabled={hasRandomQuestions || !isItemsVisible}
                errMessage={
                  hasRandomQuestions ? "This assignment has random items for every student." : t("common.testHidden")
                }
              >
                <QuestionButton
                  active={selectedTab === "questionView"}
                  disabled={!firstStudentId || !isItemsVisible || hasRandomQuestions || isLoading}
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
                    history.push(
                      `/author/classboard/${assignmentId}/${classId}/question-activity/${firstQuestion._id}`
                    );
                  }}
                >
                  QUESTIONS
                </QuestionButton>
              </WithDisableMessage>
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
                    isLoading={isLoading}
                    isBoth
                  />
                </StyledCard>
              </GraphContainer>
              <StyledFlexContainer justifyContent="space-between" marginBottom="0px">
                <CheckContainer>
                  <StyledCheckbox
                    data-cy="selectAllCheckbox"
                    checked={unselectedStudents.length === 0}
                    indeterminate={unselectedStudents.length > 0 && unselectedStudents.length < testActivity.length}
                    onChange={this.onSelectAllChange}
                  >
                    {unselectedStudents.length > 0 ? "SELECT ALL" : "UNSELECT ALL"}
                  </StyledCheckbox>
                </CheckContainer>
                <ClassBoardFeats>
                  <RedirectButton
                    disabled={!isItemsVisible}
                    first
                    data-cy="printButton"
                    target="_blank"
                    onClick={this.onClickPrint}
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
                  <Dropdown
                    overlay={
                      <DropMenu>
                        <FeaturesSwitch
                          inputFeatures="LCBmarkAsSubmitted"
                          key="LCBmarkAsSubmitted"
                          actionOnInaccessible="hidden"
                          groupId={classId}
                        >
                          <MenuItems
                            data-cy="markSubmitted"
                            disabled={disableMarkSubmitted}
                            onClick={this.handleShowMarkAsSubmittedModal}
                          >
                            <IconMarkAsSubmitted width={12} />
                            <span>Mark as Submitted</span>
                          </MenuItems>
                        </FeaturesSwitch>
                        <FeaturesSwitch
                          inputFeatures="LCBmarkAsAbsent"
                          key="LCBmarkAsAbsent"
                          actionOnInaccessible="hidden"
                          groupId={classId}
                        >
                          <MenuItems
                            data-cy="markAbsent"
                            disabled={disableMarkAbsent}
                            onClick={this.handleShowMarkAsAbsentModal}
                          >
                            <IconMarkAsAbsent />
                            <span>Mark as Absent</span>
                          </MenuItems>
                        </FeaturesSwitch>

                        <MenuItems data-cy="addStudents" onClick={this.handleShowAddStudentsPopup}>
                          <IconAddStudents />
                          <span>Add Students</span>
                        </MenuItems>
                        <MenuItems data-cy="removeStudents" onClick={this.handleShowRemoveStudentsModal}>
                          <IconRemove />
                          <span>Remove Students</span>
                        </MenuItems>
                        <MenuItems
                          data-cy="downloadGrades"
                          disabled={!enableDownload}
                          onClick={() => this.handleDownloadGrades(false)}
                        >
                          <IconDownload />
                          <span>Download Grades</span>
                        </MenuItems>
                        <MenuItems
                          data-cy="downloadResponse"
                          disabled={!enableDownload}
                          onClick={() => this.handleDownloadGrades(true)}
                        >
                          <IconDownload />
                          <span>Download Response</span>
                        </MenuItems>
                        <FeaturesSwitch
                          inputFeatures="LCBstudentReportCard"
                          key="LCBstudentReportCard"
                          actionOnInaccessible="hidden"
                          groupId={classId}
                        >
                          <MenuItems data-cy="studentReportCard" onClick={this.onStudentReportCardsClick}>
                            <IconStudentReportCard />
                            <span>Student Report Cards</span>
                          </MenuItems>
                        </FeaturesSwitch>
                      </DropMenu>
                    }
                    placement="bottomRight"
                  >
                    <RedirectButton data-cy="moreAction" last>
                      <ButtonIconWrap>
                        <IconMoreHorizontal />
                      </ButtonIconWrap>
                      MORE
                    </RedirectButton>
                  </Dropdown>
                </ClassBoardFeats>
              </StyledFlexContainer>

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
                  assignmentId={assignmentId}
                  classId={classId}
                  studentSelect={this.onSelectCardOne}
                  endDate={additionalData.endDate || additionalData.closedDate}
                  closed={additionalData.closed}
                  studentUnselect={this.onUnselectCardOne}
                  viewResponses={(e, selected, testActivityId) => {
                    setCurrentTestActivityId(testActivityId);
                    if (!isItemsVisible) {
                      return;
                    }
                    getAllTestActivitiesForStudent({
                      studentId: selected,
                      assignmentId,
                      groupId: classId
                    });
                    this.onTabChange(e, "Student", selected, testActivityId);
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
                testActivity={testActivity}
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

          {selectedTab === "Student" && selectedStudentId && !isEmpty(testActivity) && !isEmpty(classResponse) && (
            <React.Fragment>
              <StudentGrapContainer>
                <StyledCard bordered={false} paddingTop={15}>
                  <StudentSelect
                    data-cy="studentSelect"
                    style={{ width: "200px" }}
                    students={testActivity}
                    selectedStudent={selectedStudentId}
                    studentResponse={qActivityByStudent}
                    handleChange={(value, testActivityId) => {
                      setCurrentTestActivityId(testActivityId);
                      getAllTestActivitiesForStudent({
                        studentId: value,
                        assignmentId,
                        groupId: classId
                      });
                      this.setState({ selectedStudentId: value });
                      history.push(`/author/classboard/${assignmentId}/${classId}/test-activity/${testActivityId}`);
                    }}
                    isPresentationMode={isPresentationMode}
                  />
                  <GraphWrapper style={{ width: "100%", display: "flex" }}>
                    <BarGraph
                      gradebook={gradebook}
                      testActivity={testActivity}
                      studentId={selectedStudentId}
                      studentview
                      studentViewFilter={studentViewFilter}
                      studentResponse={studentResponse}
                      isLoading={isLoading}
                    />
                    <InfoWrapper>
                      {allTestActivitiesForStudent.length > 1 && (
                        <Select
                          data-cy="attemptSelect"
                          style={{ width: "200px" }}
                          value={
                            allTestActivitiesForStudent.some(
                              ({ _id }) => _id === (currentTestActivityId || testActivityId)
                            )
                              ? currentTestActivityId || testActivityId
                              : ""
                          }
                          onChange={testActivityId => {
                            loadStudentResponses({
                              testActivityId,
                              groupId: classId,
                              studentId: selectedStudentId
                            });
                            setCurrentTestActivityId(testActivityId);
                            history.push(
                              `/author/classboard/${assignmentId}/${classId}/test-activity/${testActivityId}`
                            );
                          }}
                        >
                          {[...allTestActivitiesForStudent].reverse().map((testActivityId, index) => (
                            <Select.Option
                              key={index}
                              value={testActivityId._id}
                              disabled={testActivityId.status === 2}
                            >
                              {`Attempt ${allTestActivitiesForStudent.length - index} ${
                                testActivityId.status === 2 ? " (Absent)" : ""
                              }`}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "10px",
                            alignItems: "center"
                          }}
                        >
                          <ScoreHeader>TOTAL SCORE</ScoreHeader>
                          <ScoreWrapper data-cy="totalScore">{round(score, 2) || 0}</ScoreWrapper>
                          <div style={{ border: "solid 1px black", width: "50px" }} />
                          <ScoreWrapper data-cy="totalMaxScore">{round(maxScore, 2) || 0}</ScoreWrapper>
                        </div>
                        {allTestActivitiesForStudent.length > 1 && showScoreImporvement ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              padding: "10px",
                              alignItems: "center"
                            }}
                          >
                            <ScoreHeader>SCORE</ScoreHeader>
                            <ScoreChangeWrapper data-cy="scoreChange" scoreChange={studentTestActivity.scoreChange}>
                              {`${studentTestActivity.scoreChange > 0 ? "+" : ""}${round(
                                studentTestActivity.scoreChange,
                                2
                              ) || 0}`}
                            </ScoreChangeWrapper>
                            <ScoreHeader style={{ fontSize: "10px", display: "flex" }}>
                              <span>Improvement </span>
                              <span
                                style={{ marginLeft: "2px" }}
                                title="Score increase from previous student attempt. Select an attempt from the dropdown above to view prior student responses"
                              >
                                <IconInfo />
                              </span>
                            </ScoreHeader>
                          </div>
                        ) : null}
                      </div>
                      <ScoreHeader style={{ fontSize: "12px" }}>
                        {" "}
                        {`TIME (min) : `}{" "}
                        <span style={{ color: black, textTransform: "capitalize" }}>
                          {`${Math.floor(studentTestActivity.timeSpent / 60)}:${studentTestActivity.timeSpent % 60}` ||
                            ""}
                        </span>
                      </ScoreHeader>
                      <ScoreHeader style={{ fontSize: "12px" }}>
                        {" "}
                        {`STATUS : `}{" "}
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
                        SUBMITTED ON :
                        <span style={{ color: black }}>
                          {moment(studentTestActivity.endDate).format("MMM DD, YYYY")}
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
          {selectedTab === "questionView" &&
            !isEmpty(testActivity) &&
            !isEmpty(classResponse) &&
            (selectedQuestion || selectedQuestion === 0) && (
              <React.Fragment>
                <QuestionContainer
                  isQuestionView
                  classResponse={classResponse}
                  testActivity={testActivity}
                  qIndex={selectedQuestion}
                  itemId={itemId}
                  question={{ id: selectedQid }}
                  isPresentationMode={isPresentationMode}
                >
                  <GenSelect
                    classid="DI"
                    classname={firstQuestionEntities
                      .map((x, index) => ({
                        value: index,
                        disabled: x.disabled || x.scoringDisabled,
                        id: x._id,
                        qLabel: `Question ${x.barLabel.slice(1)}`
                      }))
                      .filter(x => !x.disabled)
                      .map(({ value, qLabel }) => ({ value, name: qLabel }))}
                    selected={selectedQuestion}
                    justifyContent="flex-end"
                    handleChange={value => {
                      const { assignmentId, classId } = match.params;

                      const { _id: qid, testItemId } = testActivity[0].questionActivities[value];
                      history.push(`/author/classboard/${assignmentId}/${classId}/question-activity/${qid}`);
                      this.setState({
                        selectedQuestion: value,
                        selectedQid: qid,
                        itemId: testItemId
                      });
                    }}
                  />
                </QuestionContainer>
              </React.Fragment>
            )}
        </MainContentWrapper>
      </div>
    );
  }
}

const enhance = compose(
  withNamespaces("classBoard"),
  connect(
    state => ({
      gradebook: getGradeBookSelector(state),
      testActivity: getSortedTestActivitySelector(state),
      classResponse: getClassResponseSelector(state),
      additionalData: getAdditionalDataSelector(state),
      testQuestionActivities: getTestQuestionActivitiesSelector(state),
      selectedStudents: get(state, ["author_classboard_gradebook", "selectedStudents"], {}),
      allStudents: get(state, ["author_classboard_testActivity", "data", "students"], []),
      testItemsData: get(state, ["author_classboard_testActivity", "data", "testItemsData"], []),
      studentResponse: getStudentResponseSelector(state),
      qActivityByStudent: stateStudentResponseSelector(state),
      showScore: showScoreSelector(state),
      currentTestActivityId: getCurrentTestActivityIdSelector(state),
      allTestActivitiesForStudent: getAllTestActivitiesForStudentSelector(state),
      disableMarkSubmitted: getDisableMarkAsSubmittedSelector(state),
      assignmentStatus: getAssignmentStatusSelector(state),
      enrollmentStatus: get(state, "author_classboard_testActivity.data.enrollmentStatus", {}),
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false),
      isItemsVisible: isItemVisibiltySelector(state),
      removedStudents: removedStudentsSelector(state),
      studentViewFilter: state?.author_classboard_testActivity?.studentViewFilter,
      hasRandomQuestions: getHasRandomQuestionselector(state),
      isLoading: testActivtyLoadingSelector(state)
    }),
    {
      loadTestActivity: receiveTestActivitydAction,
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
      markSubmitted: markSubmittedAction,
      downloadGradesResponse: downloadGradesResponseAction
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
  studentSelect: PropTypes.func.isRequired,
  studentUnselectAll: PropTypes.func.isRequired,
  allStudents: PropTypes.array,
  selectedStudents: PropTypes.object,
  studentUnselect: PropTypes.func,
  setSelected: PropTypes.func,
  setReleaseScore: PropTypes.func,
  showScore: PropTypes.func,
  setMarkAsDone: PropTypes.func,
  isPresentationMode: PropTypes.bool,
  testQuestionActivities: PropTypes.array,
  qActivityByStudent: PropTypes.any
};
