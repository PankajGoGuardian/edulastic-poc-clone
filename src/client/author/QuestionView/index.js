import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { produce } from "immer";
import { Bar, ComposedChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line } from "recharts";
import { head, get, isEmpty, round, sumBy } from "lodash";
import { dropZoneTitleColor, greyGraphstroke, incorrect, pCorrect, graded, blue, white } from "@edulastic/colors";
import { getAvatarName } from "../ClassBoard/Transformer";

import {
  StyledFlexContainer,
  StyledCard,
  LegendContainer,
  LegendItems,
  LegendItem,
  LegendIcon,
  LegendLabel,
  TooltipContainer
} from "./styled";
import StudentResponse from "./component/studentResponses/studentResponse";
import ClassQuestions from "../ClassResponses/components/Container/ClassQuestions";

// actions
import { receiveAnswersAction } from "../src/actions/classBoard";
// selectors
import { getAssignmentClassIdSelector, getClassQuestionSelector, getQLabelsSelector } from "../ClassBoard/ducks";
import { scrollTo, AnswerContext } from "@edulastic/common";

/**
 * @param {string} studentId
 */
const _scrollTo = studentId => scrollTo(document.querySelector(`.student-question-container-id-${studentId}`));

const green = "#5eb500";

const CustomTooltip = ({ label = "", payload, ...rest }) => {
  const firstItem = head(payload) || {};
  const timeSpent = get(firstItem, "payload.avgTimeSpent");
  const fullName = get(firstItem, "payload.name");
  const score = get(firstItem, "payload.score");
  return (
    <TooltipContainer title={fullName}>
      {`Time(seconds): ${timeSpent || 0}`} <br /> {`Score: ${score}`}
    </TooltipContainer>
  );
};

CustomTooltip.propTypes = {
  label: PropTypes.string,
  payload: PropTypes.object
};

CustomTooltip.defaultProps = {
  label: "",
  payload: {}
};

class QuestionViewContainer extends Component {
  static getDerivedStateFromProps(nextProps, preState) {
    const { loadClassQuestionResponses, assignmentIdClassId: { assignmentId, classId } = {}, question } = nextProps;
    const { question: _question = {} } = preState || {};
    if (question.id !== _question.id) {
      loadClassQuestionResponses(assignmentId, classId, question.id, nextProps.itemId);
    }
    return {
      question,
      loading: question.id !== _question.id
    };
  }

  isMobile = () => window.innerWidth < 480;

  // calcTimeSpent = (student = {}) => {
  //   const {
  //     question: { id: qId }
  //   } = this.props;
  //   const { timeSpent = 0 } = student.questionActivities.find(({ _id }) => _id === qId);
  //   return round(timeSpent / 1000, 2);
  // };

  calcTimeSpentAsSec = (activities = []) => {
    const totalSpent = sumBy(activities, ({ timeSpent }) => timeSpent || 0);
    return round(totalSpent / activities.length / 1000, 2);
  };

  onClickChart = data => {
    _scrollTo(data.id);
  };

  render() {
    const {
      testActivity,
      classResponse: { testItems, ...others },
      question,
      classQuestion,
      children,
      qIndex,
      isQuestionView = false,
      isPresentationMode
    } = this.props;
    const { loading } = this.state;

    let filteredItems = testItems.filter(item => item.data.questions.some(q => q.id === question.id));

    filteredItems = produce(filteredItems, draft => {
      draft.forEach(item => {
        if (item.itemLevelScoring) return;
        item.data.questions = item.data.questions.filter(({ id }) => id === question.id);
        item.rows = item.rows.map(row => ({
          ...row,
          widgets: row.widgets.filter(({ reference }) => reference === question.id)
        }));
      });
      return draft;
    });
    const isMobile = this.isMobile();
    let data = [];
    // if (testActivity.length > 0) {
    //   testActivity.map(student => {
    //     if (student.status === "submitted") {
    //       data.push({
    //         name: student.studentName,
    //         score: student.score ? student.score : 0,
    //         time: 0,
    //         maxscore: student.maxScore,
    //         avgTimeSpent: this.calcTimeSpent(student),
    //         attempts: student.questionActivities.length
    //       });
    //     }
    //     return "";
    //   });
    // }

    if (!isEmpty(testActivity)) {
      data = testActivity
        .filter(student => (student.status != "notStarted" || student.redirect) && student.status != "absent")
        .map(st => {
          const name = isPresentationMode ? st.fakeName : st.studentName;
          const stData = {
            name,
            id: st.studentId,
            avatarName: getAvatarName(name),

            avgTimeSpent: this.calcTimeSpentAsSec(st.questionActivities.filter(x => x._id === question.id)),
            attempts: st.questionActivities.length,
            correct: 0,
            wrong: 0,
            pCorrect: 0,
            skipped: 0,
            manuallyGraded: 0,
            score: 0
          };
          st.questionActivities
            .filter(({ notStarted, _id }) => !notStarted && _id === question.id)
            .forEach(
              ({ correct, partialCorrect, skipped, manuallyGraded, graded, score, maxScore, evaluation, ...rest }) => {
                if (skipped) {
                  stData.skipped += 1;
                } else if (graded === false) {
                  stData.manuallyGraded += 1;
                } else if (score === maxScore && score > 0) {
                  stData.correct += 1;
                } else if (score > 0 && score < maxScore) {
                  stData.pCorrect += 1;
                } else if (score === 0) {
                  stData.wrong += 1;
                }
                stData.score = score;

                return null;
              }
            );
          return stData;
        });
    }

    if (isMobile) {
      data = data.slice(0, 2);
    }

    return (
      <React.Fragment>
        <StyledFlexContainer>
          <StyledCard bordered={false}>
            <LegendContainer>
              <LegendItems>
                <LegendItem>
                  <LegendIcon color={green} />
                  <LegendLabel>CORRECT</LegendLabel>
                </LegendItem>
                <LegendItem>
                  <LegendIcon color={incorrect} />
                  <LegendLabel>INCORRECT</LegendLabel>
                </LegendItem>
                <LegendItem>
                  <LegendIcon color={pCorrect} />
                  <LegendLabel>PARTIALLY CORRECT</LegendLabel>
                </LegendItem>
                <LegendItem>
                  <LegendIcon color={dropZoneTitleColor} />
                  <LegendLabel>SKIPPED</LegendLabel>
                </LegendItem>
                <LegendItem>
                  <LegendIcon color="rgb(56, 150, 190)" />
                  <LegendLabel>MANUALLY GRADED</LegendLabel>
                </LegendItem>
              </LegendItems>
              {children}
            </LegendContainer>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart barGap={1} barSize={36} data={data}>
                <XAxis
                  dataKey="avatarName"
                  tickSize={0}
                  cursor="pointer"
                  dy={10}
                  onClick={({ index }) => {
                    const id = data[index].id;
                    _scrollTo(id);
                  }}
                />
                <YAxis
                  dataKey="attempts"
                  yAxisId={0}
                  allowDecimals={false}
                  tick={{ strokeWidth: 0, fill: greyGraphstroke }}
                  tickSize={6}
                  label={{
                    value: "Scoring points",
                    angle: -90,
                    fill: greyGraphstroke,
                    dx: -10
                  }}
                  stroke={greyGraphstroke}
                />
                <YAxis
                  dataKey="avgTimeSpent"
                  yAxisId={1}
                  allowDecimals={false}
                  tick={{ strokeWidth: 0, fill: greyGraphstroke }}
                  tickSize={6}
                  label={{
                    value: "AVG TIME (SECONDS)",
                    angle: -90,
                    fill: greyGraphstroke,
                    dx: 10,
                    fontSize: "10px"
                  }}
                  orientation="right"
                  stroke={greyGraphstroke}
                />
                <Bar
                  className="correct"
                  style={{ cursor: "pointer" }}
                  stackId="a"
                  dataKey="correct"
                  fill={green}
                  onClick={this.onClickChart}
                />
                <Bar
                  className="wrong"
                  style={{ cursor: "pointer" }}
                  stackId="a"
                  dataKey="wrong"
                  fill={incorrect}
                  onClick={this.onClickChart}
                />
                <Bar
                  className="pCorrect"
                  style={{ cursor: "pointer" }}
                  stackId="a"
                  dataKey="pCorrect"
                  fill={pCorrect}
                  onClick={this.onClickChart}
                />
                <Bar
                  className="skipped"
                  style={{ cursor: "pointer" }}
                  stackId="a"
                  dataKey="skipped"
                  fill={dropZoneTitleColor}
                  onClick={this.onClickChart}
                />
                <Bar
                  className="manuallyGraded"
                  style={{ cursor: "pointer" }}
                  stackId="a"
                  dataKey="manuallyGraded"
                  fill="rgb(56, 150, 190)"
                  onClick={this.onClickChart}
                />
                <Line
                  dataKey="avgTimeSpent"
                  stroke={blue}
                  strokeWidth="3"
                  type="monotone"
                  yAxisId={1}
                  dot={{ stroke: white, strokeWidth: 6, fill: white }}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </StyledCard>
        </StyledFlexContainer>
        <StudentResponse
          testActivity={testActivity}
          onClick={studentId => _scrollTo(studentId)}
          isPresentationMode={isPresentationMode}
        />
        {testActivity &&
          !loading &&
          testActivity.map((student, index) => {
            if (!student.testActivityId) {
              return null;
            }
            return (
              <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
                <ClassQuestions
                  key={index}
                  isQuestionView={isQuestionView}
                  qIndex={qIndex}
                  currentStudent={student}
                  classResponse={{ testItems: filteredItems, ...others }}
                  questionActivities={classQuestion.filter(({ userId }) => userId === student.studentId)}
                  isPresentationMode={isPresentationMode}
                  labels={this.props.labels}
                />
              </AnswerContext.Provider>
            );
          })}
      </React.Fragment>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      classQuestion: getClassQuestionSelector(state),
      assignmentIdClassId: getAssignmentClassIdSelector(state),
      labels: getQLabelsSelector(state)
    }),
    {
      loadClassQuestionResponses: receiveAnswersAction
    }
  )
);
export default enhance(QuestionViewContainer);

QuestionViewContainer.propTypes = {
  classResponse: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  testActivity: PropTypes.array.isRequired,
  classQuestion: PropTypes.array,
  isQuestionView: PropTypes.bool,
  children: PropTypes.node,
  qIndex: PropTypes.number
};
QuestionViewContainer.defaultProps = {
  classQuestion: [],
  children: null,
  qIndex: null
};
