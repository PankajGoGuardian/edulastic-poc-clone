import React, { Component } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get } from "lodash";
import { message } from "antd";
import { withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
// actions
import {
  receiveTestActivitydAction,
  receiveGradeBookdAction,
  receiveClassResponseAction
} from "../../../src/actions/classBoard";
import QuestionContainer from "../../../QuestionView";
import StudentContainer from "../../../StudentView";
// ducks
import {
  getTestActivitySelector,
  getGradeBookSelector,
  getAdditionalDataSelector,
  getClassResponseSelector
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
import ClassSelect from "../../../Shared/Components/ClassSelect/ClassSelect";
import StudentSelect from "../../../Shared/Components/StudentSelect/StudentSelect";
import ClassHeader from "../../../Shared/Components/ClassHeader/ClassHeader";
import HooksContainer from "../HooksContainer/HooksContainer";
import RedirectPopup from "../RedirectPopUp";
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
      nCountTrue: 0,
      redirectPopup: false,
      selectedStudentId: ""
    };
  }

  componentDidMount() {
    const { loadGradebook, loadTestActivity, match, studentUnselectAll } = this.props;
    const { assignmentId, classId } = match.params;
    loadGradebook(assignmentId, classId);
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

  onClickBarGraph = selectedQuestion => {
    this.setState({ selectedQuestion, selectedTab: "questionView" });
  };

  isMobile = () => window.innerWidth < 480;

  render() {
    const {
      gradebook,
      testActivity,
      creating,
      match,
      classResponse,
      additionalData = {
        classes: []
      },
      testActivity: studentItems,
      selectedStudents,
      setSelected,
      allStudents,
      history
    } = this.props;
    const { selectedTab, flag, selectedQuestion, selectAll, nCountTrue, redirectPopup, selectedStudentId } = this.state;
    const { assignmentId, classId } = match.params;
    const testActivityId = this.getTestActivity(testActivity);
    const classname = additionalData ? additionalData.classes : [];
    const questions = this.getQuestions();
    const questionsIds = questions.map((q, i) => ({ name: `Question ${i + 1}` }));
    const isMobile = this.isMobile();

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
        />
        <StyledFlexContainer justifyContent="space-between">
          <PaginationInfo>
            &lt; <AnchorLink to="/author/assignments">RECENTS ASSIGNMENTS</AnchorLink> /{" "}
            <AnchorLink to="/author/assignments">{additionalData.testName}</AnchorLink> /{" "}
            <Anchor>{additionalData.className}</Anchor>
          </PaginationInfo>
          <StudentButtonDiv>
            <BothButton active={selectedTab === "Both"} onClick={e => this.onTabChange(e, "Both")}>
              BOTH
            </BothButton>
            <StudentButton active={selectedTab === "Student"} onClick={e => this.onTabChange(e, "Student")}>
              STUDENT
            </StudentButton>
            <QuestionButton active={selectedTab === "questionView"} onClick={e => this.onTabChange(e, "questionView")}>
              QUESTION
            </QuestionButton>
          </StudentButtonDiv>
        </StyledFlexContainer>
        {selectedTab === "Both" && (
          <React.Fragment>
            <GraphContainer>
              <StyledCard bordered={false}>
                <Graph gradebook={gradebook} testActivity={testActivity} onClickHandler={this.onClickBarGraph} />
              </StyledCard>
            </GraphContainer>
            {nCountTrue > 0 && (
              <StyledFlexContainer
                justifyContent="space-between"
                marginBottom="0px"
                paddingRight={isMobile ? "5px" : "20px"}
              >
                <CheckContainer>
                  <StyledCheckbox checked={selectAll} onChange={this.onSelectAllChange}>
                    {selectAll ? "UNSELECT ALL" : "SELECT ALL"}
                  </StyledCheckbox>
                </CheckContainer>
                <PrintButton onClick={() => history.push(`/author/printpreview/${additionalData.testId}`)}>
                  <img src={Ptools} alt="" />
                  PRINT
                </PrintButton>
                <RedirectButton onClick={this.handleRedirect}>
                  <img src={Elinks} alt="" />
                  REDIRECT
                </RedirectButton>
              </StyledFlexContainer>
            )}
            {flag ? (
              <DisneyCardContainer
                selectedStudents={selectedStudents}
                testActivity={testActivity}
                assignmentId={assignmentId}
                classId={classId}
                studentSelect={this.onSelectCardOne}
                studentUnselect={this.onUnselectCardOne}
                viewResponses={(e, selected) => this.onTabChange(e, "Student", selected)}
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
                <BarGraph gradebook={gradebook}>
                  <StudentSelect
                    students={studentItems}
                    selectedStudent={selectedStudentId}
                    handleChange={value => {
                      this.setState({ selectedStudentId: value });
                    }}
                  />
                </BarGraph>
              </StyledCard>
            </StudentGrapContainer>
            <StudentContainer
              classResponse={classResponse}
              testActivity={testActivity}
              studentItems={studentItems}
              selectedStudent={selectedStudentId}
            />
          </React.Fragment>
        )}

        {selectedTab === "questionView" && questions[selectedQuestion] && (
          <React.Fragment>
            <QuestionContainer
              classResponse={classResponse}
              testActivity={testActivity}
              question={questions[selectedQuestion]}
            >
              <ClassSelect
                classid="DI"
                classname={selectedTab === "Student" ? classname : questionsIds}
                selected={selectedQuestion}
                justifyContent="flex-end"
                handleChange={value => {
                  this.setState({ selectedQuestion: value });
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
      selectedStudents: get(state, ["author_classboard_gradebook", "selectedStudents"], {}),
      allStudents: get(state, ["author_classboard_testActivity", "data", "students"], [])
    }),
    {
      loadGradebook: receiveGradeBookdAction,
      loadTestActivity: receiveTestActivitydAction,
      loadClassResponses: receiveClassResponseAction,
      studentSelect: gradebookSelectStudentAction,
      studentUnselect: gradebookUnSelectStudentAction,
      studentUnselectAll: gradebookUnSelectAllAction,
      setSelected: gradebookSetSelectedAction
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
  loadGradebook: PropTypes.func,
  loadClassResponses: PropTypes.func,
  studentSelect: PropTypes.func.isRequired,
  studentUnselectAll: PropTypes.func.isRequired,
  allStudents: PropTypes.array,
  selectedStudents: PropTypes.object,
  studentUnselect: PropTypes.func,
  setSelected: PropTypes.func
};
