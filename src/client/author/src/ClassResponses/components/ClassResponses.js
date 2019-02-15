import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { withWindowSizes, FlexContainer } from '@edulastic/common';
import { Link } from 'react-router-dom';
import { Card, Button } from 'antd';
import { withNamespaces } from '@edulastic/localization';
import { ComposedChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

import ClassQuestions from './ClassQuestions';

import { receiveStudentResponseAction } from '../../actions/classBoard';

import {
  getClassResponseSelector,
  getStudentResponseSelector,
  getTestActivitySelector
} from '../../selectors/classBoard';
import ListHeader from './ListHeader';
import SortBar from './SortBar';

class ClassResponses extends Component {
  componentDidMount() {
    const { loadStudentResponses, match } = this.props;
    const { testActivityId } = match.params;
    loadStudentResponses({ testActivityId });
  }

  handleCreate = () => {
    const { history, match } = this.props;
    history.push(`${match.url}/create`);
  };

  onClickChart = ({ name, id }) => {
    console.log(name, id);
  }

  render() {
    const data = [];
    const { studentResponse: { questionActivities, testActivity } } = this.props;
    let totalScore = 0;
    let totalMaxScore = 0;
    if (questionActivities) {
      questionActivities.forEach((item, i) => {
        totalScore += (item.score || 0);
        totalMaxScore += (item.maxScore || 0);
        data.push({
          id: item._id,
          name: `Q${i + 1}`,
          red: (item.maxScore || 0) - (item.score || 0),
          green: item.score || 0,
          all: item.maxScore || 0
        });
      });
    }
    return (
      <div>
        <ListHeader onCreate={this.handleCreate} />
        <StyledFlexContainer justifyContent="space-between">
          <PaginationInfo>
            <a>&lt; <Link to="/author/assignments">RECENTS ASSIGNMENTS</Link></a> / <a>CALIFORNIA VERSION 4</a> / <a>CLASS 1</a>
          </PaginationInfo>
          <SortBar />
        </StyledFlexContainer>
        <StyledCard bordered={false}>
          <GraphContainer>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart
                barGap={1}
                barSize={36}
                data={data}
                margin={{ top: 20, right: 60, bottom: 0, left: 20 }}
              >
                <XAxis dataKey="name" axisLine={false} tickSize={0} />
                <YAxis
                  dataKey="all"
                  yAxisId={0}
                  tickCount={4}
                  allowDecimals={false}
                  tick={{ strokeWidth: 0, fill: '#999' }}
                  tickSize={6}
                  label={{ value: 'ATTEMPTS', angle: -90, fill: '#999' }}
                  stroke="#999"
                />
                <YAxis
                  dataKey="all"
                  yAxisId={1}
                  tickCount={4}
                  allowDecimals={false}
                  tick={{ strokeWidth: 0, fill: '#999' }}
                  tickSize={6}
                  label={{ value: 'AVG TIME (SECONDS)', angle: -90, fill: '#999' }}
                  orientation="right"
                  stroke="#999"
                />
                <Bar stackId="a" dataKey="green" fill="#1fe3a0" onClick={this.onClickChart} />
                <Bar stackId="a" dataKey="red" fill="#ee1b82" onClick={this.onClickChart} />
              </ComposedChart>
            </ResponsiveContainer>
          </GraphContainer>
          <GraphInfo>
            <ScoreContainer>
              <ScoreLabel>TOTAL SCORE</ScoreLabel>
              <TotalScore>{totalScore}</TotalScore>
              <FractionLine />
              <TotalScore>{totalMaxScore}</TotalScore>
            </ScoreContainer>
            <TimeContainer>
              <TimeItem><Color>Time:</Color> 1:54</TimeItem>
              <TimeItem><Color>Status:</Color> Graded</TimeItem>
              <TimeItem><Color>Submitted on:</Color> 19 October,2018</TimeItem>
              <TimeItem><Color>Hour:</Color> 03:13</TimeItem>
            </TimeContainer>
          </GraphInfo>
        </StyledCard>
        <StyledFlexContainer justifyContent="space-between">
          <PaginationButtonGroup>
            <FeedbackActiveButton>6 ALL</FeedbackActiveButton>
            <FeedbackButton>6 NOT STARTED</FeedbackButton>
            <FeedbackButton>0 IN PROGRESS</FeedbackButton>
            <FeedbackButton>0 SUBMITTED</FeedbackButton>
            <FeedbackButton>0 GRADED</FeedbackButton>
          </PaginationButtonGroup>
          <PaginationButtonGroup>
            <OverallButton>OVERALL FEEDBACK</OverallButton>
          </PaginationButtonGroup>
        </StyledFlexContainer>
        {
          testActivity &&
          <ClassQuestions testActivity={testActivity} />
        }
      </div>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  withNamespaces('header'),
  connect(
    state => ({
      classResponse: getClassResponseSelector(state),
      studentResponse: getStudentResponseSelector(state),
      testActivity: getTestActivitySelector(state)
    }),
    {
      loadStudentResponses: receiveStudentResponseAction
    }
  )
);

export default enhance(ClassResponses);

ClassResponses.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,

  classResponse: PropTypes.shape({}).isRequired,
  studentResponse: PropTypes.shape({}).isRequired,
  loadStudentResponses: PropTypes.func.isRequired
};

const PaginationInfo = styled.div`
  font-weight: bold;
  font-size: 10px;
  word-spacing:5px;
  display:inline-block
  margin-left:30px;
  color:#1890ffd9;
`;

const TimeContainer = styled.div`
  margin-top:20px;
`;

const Color = styled.span`
 color:#58b294;
`;

const TimeItem = styled.p`
  font-size:0.9em;
  font-weight:bold;
  padding-left:20px;
`;

const ScoreContainer = styled.div`
  text-align:center;
  margin-top:20px;
`;

const ScoreLabel = styled.p`
  color:#C0C0C0;
  font-size:0.8em;
`;

const TotalScore = styled.p`
  font-weight:bold;
  font-size:2em;
`;

const FractionLine = styled.p`
  width:40px;
  height:2px;
  background-color:#59595a;
  margin:auto;
`;

const PaginationButtonGroup = styled.span`
  display:inline-block;
`;

const GraphInfo = styled.div`
  display:inline-block;
  width:20%;
  height:200px;
  position:absolute;
`;

const GraphContainer = styled.div`
  display:inline-block;
  width:75%;
`;

const StyledFlexContainer = styled(FlexContainer)`
  margin:20px 13px;
`;

const StyledCard = styled(Card)`
  margin:auto;
  width:95%;
  display:flex:
  justify-content:spance-between;
  height:270px;
  border-radius:10px;
  box-shadow:3px 2px 7px lightgray;
`;

const FeedbackButton = styled(Button)`
  font-size:0.64em;
  background-color:transparent;
  margin:0px 23px 0px -5px;
  width:100px;
  padding:2px 5px;
  height:25px;
  color:#00b0ff;
  border:1px solid #00b0ff;
  font-weight:bold;
`;

const OverallButton = styled(FeedbackButton)`
  font-size:0.8em;
  background-color:white;
  width:170px;
  height:40px;
  border:1px solid white;
`;

const FeedbackActiveButton = styled(FeedbackButton)`
  color:white;
  background-color:#00b0ff;
  border:0px solid transparent;
`;
