import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Button, Input } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { withWindowSizes } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';

import { getUserSelector } from '../../author/src/selectors/user';
import { receiveFeedbackResponseAction } from '../../author/src/actions/classBoard';

const { TextArea } = Input;

class FeedbackRight extends Component {
  constructor(props) {
    super(props);
    const { widget: { activity } } = this.props;
    let feedback = ''; let score = 0; let maxScore = 0;
    if (activity) {
      const { feedback: { text: _feedback }, score: _score, maxScore: _maxScore } = activity;
      feedback = _feedback; score = _score; maxScore = _maxScore;
    }
    this.state = {
      score,
      maxScore,
      feedback
    };
  }

  onFeedbackSubmit = () => {
    const { score, feedback } = this.state;
    const { user, loadFeedbackResponses, widget: { id, activity } } = this.props;
    const { testActivityId } = activity;
    if (!id || !user || !user.user || !testActivityId) {
      return;
    }
    loadFeedbackResponses({
      body: {
        score,
        feedback: {
          teacherId: user.user._id,
          teacherName: user.user.firstName,
          text: feedback
        }
      },
      testActivityId,
      questionId: id
    });
  }

  onChangeScore = (e) => {
    this.setState({ score: e.target.value });
  }

  onChangeFeedback = (e) => {
    this.setState({ feedback: e.target.value });
  }

  render() {
    const { score, maxScore, feedback } = this.state;
    const { t } = this.props;
    return (
      <StyledCardTwo bordered={false}>
        <StyledDivSec>
          <ScoreInput
            onChange={this.onChangeScore}
            onBlur={this.onFeedbackSubmit}
            value={score}
          />
          <TextPara> / {maxScore}</TextPara>
        </StyledDivSec>
        <LeaveDiv>
          Leave a Feedback!
        </LeaveDiv>
        <FeedbackInput
          onChange={this.onChangeFeedback}
          onBlur={this.onFeedbackSubmit}
          value={feedback}
          style={{ height: 240 }}
        />
        <SolutionButton onClick={this.onFeedbackSubmit}>{t('author:component.feedback.viewSolution')}</SolutionButton>
      </StyledCardTwo>
    );
  }
}

FeedbackRight.propTypes = {
  widget: PropTypes.shape({
    evaluation: PropTypes.object
  }).isRequired,
  testItemId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  loadFeedbackResponses: PropTypes.func.isRequired
};

const enhance = compose(
  withWindowSizes,
  withNamespaces('header'),
  connect(
    state => ({
      user: getUserSelector(state)
    }),
    {
      loadFeedbackResponses: receiveFeedbackResponseAction
    }
  )
);
export default enhance(FeedbackRight);

const StyledCardTwo = styled(Card)`
  border-radius: 10px;
  box-shadow: 3px 2px 7px lightgray;
  display: inline-block;
  margin: 0px 0 auto 32px
  width: 27%;
`;

const StyledDivSec = styled.div`
  height:50px;
  border-bottom:1.4px solid #f7f7f7;
  margin:auto;
  display: flex;
  justify-content: center;
`;

const ScoreInput = styled(Input)`
  width:130px;
  height:40px;
  border:1px solid #eaeaea;
  border-radius:5px;
  font-size:1.8em;
  font-weight:bold;
  display:inline-block;
`;

const TextPara = styled.p`
  margin-left:10px;
  font-size:1.8em;
  font-weight:bold;
  display:inline-block;
`;

const LeaveDiv = styled.div`
  margin:30px 0px 20px 0px;
  font-weight:bold;
  color:#545b6b;
  font-size:0.9em;
`;

const FeedbackInput = styled(TextArea)`
  width:100%;
  height:160px;
  border:1px solid #eaeaea;
  border-radius:5px;
  display:inline-block;
`;

const SolutionButton = styled(Button)`
  font-size:1em;
  margin:10px 0px;
  width:100%;
  padding:13px 5px 20px;
  color:white;
  height:45px;
  background-color:#00b0ff;
  font-weight:bold;
`;
