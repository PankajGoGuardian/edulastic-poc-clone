import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { Bar, ComposedChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { head, get } from "lodash";
import {
  green,
  dropZoneTitleColor,
  greyGraphstroke,
  barGrapColor1,
  barGrapColor2,
  incorrect,
  pCorrect,
  graded
} from "@edulastic/colors";

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
import { getAssignmentClassIdSelector, getClassQuestionSelector } from "../ClassBoard/ducks";

const CustomTooltip = ({ label = "", payload }) => {
  const firstItem = head(payload) || {};
  const timeSpent = get(firstItem, "payload.avgTimeSpent");
  return <TooltipContainer title={label}>{`Time(seconds): ${(timeSpent / 1000).toFixed(1) || 0}`}</TooltipContainer>;
};

class QuestionViewContainer extends Component {
  static getDerivedStateFromProps(nextProps, preState) {
    const { loadClassQuestionResponses, assignmentIdClassId: { assignmentId, classId } = {}, question } = nextProps;
    const { question: _question = {} } = preState || {};
    if (question.id !== _question.id) {
      loadClassQuestionResponses(assignmentId, classId, question.id);
    }
    return {
      question,
      loading: question.id !== _question.id
    };
  }

  isMobile = () => window.innerWidth < 480;
  calcTimeSpent = (student = {}) => {
    const {
      question: { id: qId }
    } = this.props;
    const { timeSpent = 0 } = student.questionActivities.find(({ _id }) => _id === qId);
    return timeSpent;
  };

  render() {
    const {
      testActivity,
      classResponse: { testItems, ...others },
      question,
      classQuestion,
      children
    } = this.props;
    const { loading } = this.state;

    const filterdItems = testItems.filter(item => item.data.questions.filter(q => q.id === question.id).length > 0);

    filterdItems.forEach(item => {
      item.data.questions = item.data.questions.filter(({ id }) => id === question.id);
      item.rows = item.rows.map(row => ({
        ...row,
        widgets: row.widgets.filter(({ reference }) => reference === question.id)
      }));
    });
    const isMobile = this.isMobile();
    let data = [];
    if (testActivity.length > 0) {
      testActivity.map(student => {
        if (student.status === "submitted") {
          data.push({
            name: student.studentName,
            score: student.score ? student.score : 0,
            time: 0,
            maxscore: student.maxScore,
            avgTimeSpent: this.calcTimeSpent(student)
          });
        }
        return "";
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
                  <LegendIcon color={graded} />
                  <LegendLabel>MANUALLY GRADED</LegendLabel>
                </LegendItem>
              </LegendItems>
              {children}
            </LegendContainer>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart barGap={1} barSize={36} data={data}>
                <XAxis dataKey="name" axisLine={false} tickSize={0} />
                <YAxis
                  dataKey="score"
                  yAxisId={0}
                  tickCount={4}
                  allowDecimals={false}
                  tick={{ strokeWidth: 0, fill: greyGraphstroke }}
                  tickSize={6}
                  label={{ value: "PERFORMANCE", angle: -90, fill: greyGraphstroke }}
                  stroke={greyGraphstroke}
                />
                <YAxis
                  dataKey="time"
                  yAxisId={1}
                  tickCount={4}
                  allowDecimals={false}
                  tick={{ strokeWidth: 0, fill: greyGraphstroke }}
                  tickSize={6}
                  label={{
                    value: "AVG TIME (SECONDS)",
                    angle: -90,
                    fill: greyGraphstroke
                  }}
                  orientation="right"
                  stroke={greyGraphstroke}
                />
                <Bar stackId="a" dataKey="score" fill={barGrapColor1} onClick={this.onClickChart} />
                <Bar stackId="a" dataKey="time" fill={barGrapColor2} onClick={this.onClickChart} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </StyledCard>
        </StyledFlexContainer>
        <StudentResponse testActivity={testActivity} />
        {testActivity &&
          !loading &&
          testActivity.map((student, index) => {
            if (!student.testActivityId || classQuestion.length === 0) {
              return null;
            }
            return (
              <ClassQuestions
                key={index}
                currentStudent={student}
                classResponse={{ testItems: filterdItems, ...others }}
                questionActivities={classQuestion.filter(({ userId }) => userId === student.studentId)}
              />
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
      assignmentIdClassId: getAssignmentClassIdSelector(state)
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
  children: PropTypes.node
};
QuestionViewContainer.defaultProps = {
  classQuestion: [],
  children: null
};
