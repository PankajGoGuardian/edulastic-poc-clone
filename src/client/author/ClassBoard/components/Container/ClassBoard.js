import React, { Component } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get } from "lodash";
import { message, Dropdown, Menu } from "antd";
import { withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
// actions
import {
  receiveTestActivitydAction,
  receiveClassResponseAction,
  openAssignmentAction,
  closeAssignmentAction
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
import ClassSelect, { GenSelect } from "../../../Shared/Components/ClassSelect/ClassSelect";
import StudentSelect from "../../../Shared/Components/StudentSelect/StudentSelect";
import ClassHeader from "../../../Shared/Components/ClassHeader/ClassHeader";
import HooksContainer from "../HooksContainer/HooksContainer";
import RedirectPopup from "../RedirectPopUp";
import { StudentReportCardMenuModal } from "../../../Shared/Components/ClassHeader/components/studentReportCardMenuModal";
import { StudentReportCardModal } from "../../../Shared/Components/ClassHeader/components/studentReportCardModal";

import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

import { releaseScoreAction, markAsDoneAction } from "../../../src/actions/classBoard";
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
  PrintButton,
  StudentGrapContainer
} from "./styled";

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
      x => selectedStudents[x.studentId] && (x.status === "notStarted" || x.status === "inProgress")
    );

    if (notStartedStudents.length > 0) {
      message.warn("Only absent and submitted students can be redirected");
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

  onClickBarGraph = (data, selectedQuestion) => {
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

  handleOpenAssignment = () => {
    const { openAssignment, match } = this.props;
    const { assignmentId, classId } = match.params;
    openAssignment(assignmentId, classId);
  };

  handleCloseAssignment = () => {
    const { closeAssignment, match } = this.props;
    const { assignmentId, classId } = match.params;
    closeAssignment(assignmentId, classId);
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
      isPresentationMode
    } = this.props;
    const gradeSubject = {
      grade: classResponse.metadata ? classResponse.metadata.grades : [],
      subject: classResponse.metadata ? classResponse.metadata.subjects : []
    };
    const { selectedTab, flag, selectedQuestion, selectAll, nCountTrue, redirectPopup, selectedStudentId } = this.state;
    const { assignmentId, classId } = match.params;
    const testActivityId = this.getTestActivity(testActivity);
    const classname = additionalData ? additionalData.classes : [];
    const isMobile = this.isMobile();

    const selectedStudentsKeys = Object.keys(selectedStudents);
    const firstStudentId = get(
      this.props.entities.filter(x => x.status != "notStarted" && x.present && x.status != "redirected"),
      [0, "studentId"],
      false
    );
    const firstQuestionEntities = get(this.props.entities, [0, "questionActivities"], []);
    const unselectedStudents = this.props.entities.filter(x => !selectedStudents[x.studentId]);
    const { canOpenClass = [], canCloseClass = [] } = additionalData || {};
    const canOpen = canOpenClass.includes(classId);
    const canClose = canCloseClass.includes(classId);
    return (
      <div>
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
            <BothButton active={selectedTab === "Both"} onClick={e => this.onTabChange(e, "Both")}>
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
              onClick={e => {
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
                    indeterminate={
                      unselectedStudents.length > 0 && unselectedStudents.length < this.props.entities.length
                    }
                    onChange={this.onSelectAllChange}
                  >
                    {unselectedStudents.length > 0 ? "SELECT ALL" : "UNSELECT ALL"}
                  </StyledCheckbox>
                </CheckContainer>

                <PrintButton
                  data-cy="printButton"
                  onClick={() => history.push(`/author/printpreview/${additionalData.testId}`)}
                >
                  <img src={Ptools} alt="" />
                  PRINT
                </PrintButton>
                <RedirectButton data-cy="rediectButton" onClick={this.handleRedirect}>
                  <img src={Elinks} alt="" />
                  REDIRECT
                </RedirectButton>
                <RedirectButton
                  onClick={this.handleReleaseScore}
                  style={{ textDecoration: showScore ? "line-through" : "none" }}
                >
                  Release Score
                </RedirectButton>
                <RedirectButton onClick={this.onStudentReportCardsClick}>Student Report Cards</RedirectButton>
                <FeaturesSwitch
                  inputFeatures="assessmentSuperPowersMarkAsDone"
                  actionOnInaccessible="hidden"
                  gradeSubject={gradeSubject}
                >
                  <RedirectButton
                    onClick={this.handleMarkAsDone}
                    disabled={!enableMarkAsDone || status.toLowerCase() === "done"}
                  >
                    Mark as Done
                  </RedirectButton>
                  <Dropdown
                    overlay={
                      <Menu>
                        {!canOpen && !canClose && <span>&nbsp; --------</span>}
                        {canOpen && (
                          <Menu.Item onClick={this.handleOpenAssignment}>
                            <RedirectButton>Open</RedirectButton>
                          </Menu.Item>
                        )}
                        {canClose && (
                          <Menu.Item onClick={this.handleCloseAssignment}>
                            <RedirectButton>Close</RedirectButton>
                          </Menu.Item>
                        )}
                      </Menu>
                    }
                    placement="bottomLeft"
                  >
                    <RedirectButton>
                      <i class="fa fa-bars" aria-hidden="true" />
                      &nbsp; More
                    </RedirectButton>
                  </Dropdown>
                </FeaturesSwitch>
              </StyledFlexContainer>
            }

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

            {flag ? (
              <DisneyCardContainer
                selectedStudents={selectedStudents}
                testActivity={testActivity}
                assignmentId={assignmentId}
                classId={classId}
                studentSelect={this.onSelectCardOne}
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

        {selectedTab === "questionView" && (selectedQuestion || selectedQuestion == 0) && (
          <React.Fragment>
            <QuestionContainer
              classResponse={classResponse}
              testActivity={testActivity}
              qIndex={selectedQuestion}
              itemId={this.state.itemId}
              question={{ id: this.state.selectedQid }}
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
                        .map(({ value, id }, index) => ({ value, name: this.props.labels[id].barLabel }))
                }
                selected={selectedQuestion}
                justifyContent="flex-end"
                handleChange={value => {
                  const { _id: qid, testItemId: itemId } = this.props.entities[0].questionActivities[value];
                  this.setState({ selectedQuestion: value, selectedQid: qid, itemId });
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
      status: get(state, ["author_classboard_testActivity", "data", "status"], ""),
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
      openAssignment: openAssignmentAction,
      closeAssignment: closeAssignmentAction
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
  setSelected: PropTypes.func
};
