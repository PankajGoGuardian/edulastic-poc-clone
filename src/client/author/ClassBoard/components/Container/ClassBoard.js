import React, { Component } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get, keyBy } from "lodash";
import moment from "moment";
import { message, Dropdown, Menu } from "antd";
import { withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
// actions
import {
  receiveTestActivitydAction,
  receiveClassResponseAction,
  releaseScoreAction,
  markAsDoneAction,
  markAbsentAction
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
  getQLabelsSelector
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

// icon images
// import Stats from "../../assets/stats.svg";
// import Ghat from "../../assets/graduation-hat.svg";
import Ptools from "../../assets/printing-tool.svg";
import Elinks from "../../assets/external-link.svg";
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
  DropMenu
} from "./styled";
import ConfirmationModal from "../../../../common/components/ConfirmationModal";

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
      showModal: false,
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
    const { loadClassResponses, additionalData = {} } = this.props;
    const { testId } = additionalData;
    const { testId: prevTestId } = prevState;
    if (testId !== prevTestId) {
      loadClassResponses({ testId });
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
    const { studentSelect, studentUnselectAll, allStudents } = this.props;
    testActivity.map(student => {
      student.check = checked;
      return null;
    });
    this.setState({
      selectAll: checked,
      nCountTrue: checked ? testActivity.length : 0
    });
    if (checked) {
      studentSelect(allStudents.map(x => x._id));
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

  getTestActivity = data => {
    let id = null;
    data.forEach(item => {
      if (item.testActivityId) {
        id = item.testActivityId;
      }
    });
    return id;
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
    const { selectedStudents, testActivity } = this.props;
    const notStartedStudents = testActivity.filter(
      x =>
        selectedStudents[x.studentId] &&
        (x.status === "notStarted" || x.status === "inProgress" || x.status === "redirected")
    );

    if (notStartedStudents.length > 0) {
      message.warn("You can redirect only Submitted and Absent student(s).");
      return;
    }
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
    const { match, setReleaseScore, showScore } = this.props;
    const { assignmentId, classId } = match.params;
    const isReleaseScore = !showScore;
    setReleaseScore(assignmentId, classId, isReleaseScore);
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

  handleShowMarkAsAbsentModal = () => {
    const { selectedStudents, testActivity, assignmentStatus, additionalData = {} } = this.props;
    if (assignmentStatus.toLowerCase() === "not open" && additionalData.startDate > Date.now())
      return message.warn("Assignment is not opened yet");
    const selectedStudentKeys = Object.keys(selectedStudents);
    if (!selectedStudentKeys.length)
      return message.warn("At least one student should be selected to be Marked as Absent.");
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
    this.setState({ showModal: true, selectedNotStartedStudents, modalInputVal: "" });
  };

  handleMarkAbsent = () => {
    const { selectedNotStartedStudents } = this.state;
    const { markAbsent, match, studentUnselectAll } = this.props;
    const { assignmentId, classId } = match.params;
    if (!selectedNotStartedStudents.length) return message.warn("No students selected");
    markAbsent(assignmentId, classId, selectedNotStartedStudents);
    studentUnselectAll();
    this.setState({ showModal: false });
  };

  handleCancelMarkAbsent = () => {
    this.setState({ showModal: false });
  };

  handleValidateInput = e => {
    this.setState({ modalInputVal: e.target.value });
  };

  updateDisabledList = (studId, status) => {
    const { disabledList, absentList } = this.state;
    if (status === "NOT STARTED" || status === "IN PROGRESS" || status === "REDIRECTED") {
      if (!disabledList.includes(studId)) {
        this.setState({ disabledList: [...disabledList, studId] });
      }
    } else {
      const index = disabledList.indexOf(studId);
      if (index >= 0) {
        this.setState({ disabledList: [...disabledList.slice(0, index), ...disabledList.slice(index + 1)] });
      }
    }
    if (status === "ABSENT") {
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
      testActivity: studentItems,
      selectedStudents,
      setSelected,
      allStudents,
      history,
      testQuestionActivities,
      qActivityByStudent,
      enableMarkAsDone,
      showScore,
      isPresentationMode,
      entities,
      labels,
      assignmentStatus
    } = this.props;
    const gradeSubject = {
      grade: classResponse.metadata ? classResponse.metadata.grades : [],
      subject: classResponse.metadata ? classResponse.metadata.subjects : []
    };
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
      showModal
    } = this.state;
    const { assignmentId, classId } = match.params;
    const testActivityId = this.getTestActivity(testActivity);
    const classname = additionalData ? additionalData.classes : [];
    const isMobile = this.isMobile();

    const selectedStudentsKeys = Object.keys(selectedStudents);
    const firstStudentId = get(
      entities.filter(x => x.status !== "notStarted" && x.present && x.status !== "redirected"),
      [0, "studentId"],
      false
    );
    const firstQuestionEntities = get(entities, [0, "questionActivities"], []);
    const unselectedStudents = entities.filter(x => !selectedStudents[x.studentId]);
    const disableMarkAbsent =
      (assignmentStatus.toLowerCase() == "not open" && additionalData.startDate > Date.now()) ||
      assignmentStatus.toLowerCase() === "graded";
    return (
      <div>
        {showModal ? (
          <ConfirmationModal
            title="Absent"
            show={showModal}
            onOk={this.handleMarkAbsent}
            onCancel={this.handleCancelMarkAbsent}
            inputVal={modalInputVal}
            onInputChange={this.handleValidateInput}
            expectedVal={"ABSENT"}
            bodyText={
              "You are about to Mark the selecte studen(s) as Absent. Student's response if present will be deleted. Do you still want to proceed?"
            }
            okText={"Yes,Absent"}
          />
        ) : (
          ""
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
        <StyledFlexContainer justifyContent="space-between">
          <PaginationInfo>
            &lt; <AnchorLink to="/author/assignments">RECENTS ASSIGNMENTS</AnchorLink> /{" "}
            <AnchorLink to="/author/assignments">{additionalData.testName}</AnchorLink> /{" "}
            <Anchor>{additionalData.className}</Anchor>
          </PaginationInfo>

          <StudentButtonDiv data-cy="studentnQuestionTab">
            <PresentationToggleSwitch />
            <BothButton
              style={{ marginLeft: "10px" }}
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
                const firstQuestion = get(this.props, ["entities", 0, "questionActivities", 0]);
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
                  testActivity={testActivity}
                  testQuestionActivities={testQuestionActivities}
                  onClickHandler={this.onClickBarGraph}
                />
              </StyledCard>
            </GraphContainer>
            {
              <StyledFlexContainer
                justifyContent="space-between"
                marginBottom="0px"
                paddingRight={isMobile ? "5px" : "20px"}
              >
                <CheckContainer>
                  <StyledCheckbox
                    checked={unselectedStudents.length === 0}
                    indeterminate={unselectedStudents.length > 0 && unselectedStudents.length < entities.length}
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
                      <img src={Ptools} alt="" />
                    </ButtonIconWrap>
                    PRINT
                  </RedirectButton>
                  <RedirectButton data-cy="rediectButton" onClick={this.handleRedirect}>
                    <ButtonIconWrap>
                      <img src={Elinks} alt="" />
                    </ButtonIconWrap>
                    REDIRECT
                  </RedirectButton>
                  <FeaturesSwitch
                    inputFeatures="assessmentSuperPowersMarkAsDone"
                    actionOnInaccessible="hidden"
                    gradeSubject={gradeSubject}
                  >
                    <Dropdown
                      overlay={
                        <DropMenu>
                          <CaretUp className="fa fa-caret-up" />
                          <MenuItems disabled={disableMarkAbsent} onClick={this.handleShowMarkAsAbsentModal}>
                            Mark as Absent
                          </MenuItems>
                          <MenuItems onClick={this.onStudentReportCardsClick}>Student Report Cards</MenuItems>
                        </DropMenu>
                      }
                      placement="bottomRight"
                    >
                      <RedirectButton last={true}>
                        <ButtonIconWrap>
                          <i class="fa fa-ellipsis-h" />{" "}
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
                  this.onTabChange(e, "Student", selected);
                }}
                isPresentationMode={isPresentationMode}
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
              closePopup={() => {
                this.setState({ redirectPopup: false });
              }}
              setSelected={setSelected}
              assignmentId={assignmentId}
              groupId={classId}
            />
          </React.Fragment>
        )}

        {selectedTab === "Student" && studentItems && (
          <React.Fragment>
            <StudentGrapContainer>
              <StyledCard bordered={false} paddingTop={15}>
                <BarGraph
                  gradebook={gradebook}
                  testActivity={testActivity}
                  studentId={selectedStudentId}
                  studentview
                  studentResponse={qActivityByStudent}
                >
                  <StudentSelect
                    students={studentItems}
                    selectedStudent={selectedStudentId}
                    studentResponse={qActivityByStudent}
                    handleChange={value => {
                      this.setState({ selectedStudentId: value });
                    }}
                    isPresentationMode={isPresentationMode}
                  />
                </BarGraph>
              </StyledCard>
            </StudentGrapContainer>
            <StudentContainer
              classResponse={classResponse}
              testActivity={testActivity}
              studentItems={studentItems}
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
                  const { _id: qid, testItemId } = entities[0].questionActivities[value];
                  this.setState({ selectedQuestion: value, selectedQid: qid, testItemId });
                }}
              />
            </QuestionContainer>
          </React.Fragment>
        )}
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

      testQuestionActivities: getTestQuestionActivitiesSelector(state),
      selectedStudents: get(state, ["author_classboard_gradebook", "selectedStudents"], {}),
      allStudents: get(state, ["author_classboard_testActivity", "data", "students"], []),
      testItemsData: get(state, ["author_classboard_testActivity", "data", "testItemsData"], []),
      entities: get(state, ["author_classboard_testActivity", "entities"], []),
      qActivityByStudent: stateStudentResponseSelector(state),
      showScore: showScoreSelector(state),
      enableMarkAsDone: getMarkAsDoneEnableSelector(state),
      assignmentStatus: get(state, ["author_classboard_testActivity", "data", "status"], ""),
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false),
      labels: getQLabelsSelector(state)
    }),
    {
      loadTestActivity: receiveTestActivitydAction,
      loadClassResponses: receiveClassResponseAction,
      studentSelect: gradebookSelectStudentAction,
      studentUnselect: gradebookUnSelectStudentAction,
      studentUnselectAll: gradebookUnSelectAllAction,
      setSelected: gradebookSetSelectedAction,
      setReleaseScore: releaseScoreAction,
      setMarkAsDone: markAsDoneAction,
      markAbsent: markAbsentAction
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
  entities: PropTypes.array,
  labels: PropTypes.array
};
