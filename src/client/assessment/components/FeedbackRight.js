import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { get, isUndefined, toNumber, round, isNaN } from "lodash";
import { Avatar, Card, Button, Input, InputNumber, message } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";

import { withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import {
  mobileWidthMax,
  desktopWidth,
  mediumDesktopWidth,
  themeColor,
  themeColorTagsBg,
  tabGrey
} from "@edulastic/colors";

import { getUserSelector } from "../../author/src/selectors/user";
import { receiveFeedbackResponseAction } from "../../author/src/actions/classBoard";
import { updateStudentQuestionActivityScoreAction } from "../../author/sharedDucks/classResponses";
import { getFeedbackResponseSelector, getStatus, getErrorResponse } from "../../author/src/selectors/feedback";

const { TextArea } = Input;

const adaptiveRound = x => (x && x.endsWith ? (x.endsWith(".") ? x : round(x, 2)) : round(x, 2));

const showNotification = (type, msg) => {
  message.open({ type, content: msg });
  return {
    submitted: false,
    changed: false
  };
};
class FeedbackRight extends Component {
  constructor(props) {
    super(props);

    const { score, maxScore } = props?.widget?.activity || {};
    this.state = { score, maxScore };
    this.scoreInput = React.createRef();
  }

  static getDerivedStateFromProps(
    {
      widget: { activity }
    },
    preState
  ) {
    let newState = {};
    const { submitted, feedback, score, maxScore, changed } = preState || {};
    if (submitted) {
      newState = {
        submitted: false,
        changed: false
      };
    }

    if (activity && isUndefined(changed)) {
      const { score: _score, maxScore: _maxScore } = activity;
      const _feedback = get(activity, "feedback.text", "");
      if (_score !== score) {
        newState = { ...newState, score: _score };
      }
      if (_maxScore !== maxScore) {
        newState = { ...newState, maxScore: _maxScore };
      }
      if (_feedback !== feedback) {
        newState = { ...newState, feedback: _feedback };
      }
    }
    return newState;
  }

  onScoreSubmit() {
    const { score, maxScore } = this.state;
    if (isNaN(score)) {
      message.warn("Score should be a valid numerical");
      return;
    }
    const _score = toNumber(score);
    if (_score > maxScore) {
      message.warn("Score given should be less than or equal to maximum score");
      return;
    }

    const {
      user,
      updateQuestionActivityScore,
      widget: { id, activity = {} }
    } = this.props;

    const { testActivityId, groupId, testItemId } = activity;
    if (!id || !user || !user.user || !testActivityId) {
      return;
    }

    updateQuestionActivityScore({
      score: _score,
      testActivityId,
      questionId: id,
      itemId: testItemId,
      groupId
    });
  }

  onFeedbackSubmit() {
    const { feedback } = this.state;
    const {
      user,
      studentId,
      loadFeedbackResponses,
      widget: { id, activity = {} }
    } = this.props;

    const { testActivityId, groupId, testItemId } = activity;
    if (!id || !user || !user.user || !testActivityId) {
      return;
    }
    loadFeedbackResponses({
      body: {
        feedback: {
          teacherId: user.user._id,
          teacherName: user.user.firstName,
          text: feedback
        },
        groupId
      },
      studentId,
      testActivityId,
      questionId: id,
      itemId: testItemId
    });
  }

  preCheckSubmit = () => {
    const { changed } = this.state;
    if (changed) {
      this.setState({ submitted: true }, this.onFeedbackSubmit);
    }
  };

  submitScore = () => {
    const { changed } = this.state;
    if (changed) {
      this.setState({ submitted: true }, this.onScoreSubmit);
    }
  };
  onChangeScore = e => {
    const value = e.target.value;
    if (!window.isNaN(value)) {
      this.setState({ score: value, changed: true });
    }
  };

  onChangeFeedback = e => {
    this.setState({ feedback: e.target.value, changed: true });
  };

  onKeyDownFeedback = e => {
    this.arrowKeyHandler(e.keyCode);
    if (e.key === "Tab") {
      e.stopPropagation();
      e.preventDefault();
      //this.focusScoreInput();
    }
  };

  arrowKeyHandler = ({ keyCode }) => {
    if (keyCode >= 37 && keyCode <= 40) {
      this.preCheckSubmit();
    }
  };

  focusScoreInput() {
    const { match } = this.props;
    const { path } = match;
    const { current } = this.scoreInput;
    if (path.search("expressgrader") !== -1 && current) {
      current.focus();
    }
  }

  render() {
    const {
      studentName,
      widget: { activity },
      isPresentationMode,
      color,
      icon,
      twoColLayout,
      showCollapseBtn
    } = this.props;
    const { score, maxScore, feedback, submitted } = this.state;
    const isError = maxScore < score;
    const isStudentName = studentName !== undefined && studentName.length !== 0;
    let title;

    if (isStudentName) {
      title = (
        <TitleDiv data-cy="studentName">
          {isPresentationMode ? (
            <i className={`fa fa-${icon}`} style={{ color, fontSize: "32px" }} />
          ) : (
            <UserAvatar>{studentName.charAt(0)}</UserAvatar>
          )}
          &nbsp;
          {studentName}
        </TitleDiv>
      );
    } else {
      title = null;
    }

    return (
      <StyledCardTwo
        twoColLayout={twoColLayout}
        bordered={isStudentName}
        disabled={this.props.disabled}
        showCollapseBtn={showCollapseBtn}
        title={title}
      >
        <StyledDivSec>
          <ScoreInputWrapper>
            <ScoreInput
              data-cy="scoreInput"
              onChange={this.onChangeScore}
              onBlur={this.submitScore}
              value={
                activity && activity.graded === false && activity.score === 0 && !score && !this.state.changed
                  ? ""
                  : adaptiveRound(score || 0)
              }
              disabled={isPresentationMode}
              ref={this.scoreInput}
              onKeyDown={this.arrowKeyHandler}
              pattern="[0-9]+([\.,][0-9]+)?"
            />
            <TextPara>{maxScore}</TextPara>
          </ScoreInputWrapper>
        </StyledDivSec>
        <LeaveDiv>{isError ? "Score is too large" : "Leave a feedback!"}</LeaveDiv>
        {!isError && (
          <Fragment>
            <FeedbackInput
              data-cy="feedBackInput"
              onChange={this.onChangeFeedback}
              onBlur={this.preCheckSubmit}
              value={feedback}
              style={{ height: 240, flexGrow: 2 }}
              disabled={!activity || isPresentationMode}
              onKeyDown={this.onKeyDownFeedback}
            />
          </Fragment>
        )}
      </StyledCardTwo>
    );
  }
}

FeedbackRight.propTypes = {
  widget: PropTypes.shape({
    evaluation: PropTypes.object
  }).isRequired,
  user: PropTypes.object.isRequired,
  studentName: PropTypes.string,
  loadFeedbackResponses: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  isPresentationMode: PropTypes.bool,
  color: PropTypes.string,
  icon: PropTypes.string
};

FeedbackRight.defaultProps = {
  studentName: "",
  isPresentationMode: false,
  color: "",
  icon: ""
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces("header"),
  connect(
    state => ({
      user: getUserSelector(state),
      waitingResponse: getStatus(state),
      errorMessage: getErrorResponse(state)
    }),
    {
      loadFeedbackResponses: receiveFeedbackResponseAction,
      updateQuestionActivityScore: updateStudentQuestionActivityScoreAction
    }
  )
);
export default enhance(FeedbackRight);

const StyledCardTwo = styled(Card)`
  display: ${props => (props.disabled ? "none" : "flex")};
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  flex: 3;
  margin: 0px 0px 0px 15px;
  min-height: 100%;
  .ant-card-head {
    height: 60px;
  }
  .ant-card-head-title {
    padding: 13px 0px;
  }
  .ant-card-body {
    display: flex;
    flex-direction: column;
    height: calc(100% - 60px);
    .ant-input-disabled {
      padding: 4px 22px;
    }
  }

  @media screen and (min-width: ${desktopWidth}) {
    width: ${({ twoColLayout, showCollapseBtn }) => (showCollapseBtn ? "auto" : twoColLayout?.second || "25%")};
  }

  @media (max-width: ${mediumDesktopWidth}) {
    max-width: 250px;
  }
  @media (max-width: ${mobileWidthMax}) {
    margin-left: 0px;
    min-width: 100%;
    .ant-card-body {
      height: 200px;
    }
  }
`;

const StyledDivSec = styled.div`
  height: 50px;
  margin: auto;
  display: flex;
  justify-content: center;
`;

const ScoreInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: center;
`;

const ScoreInput = styled(Input)`
  width: 70%;
  height: 47px;
  border: 0px;
  background-color: #f8f8f8;
  border-radius: 2px;
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  display: inline-block;
`;

const TextPara = styled.p`
  padding-left: 10px;
  padding-right: 15px;
  font-size: 25px;
  line-height: 47px;
  background-color: #ececec;
  font-weight: 600;
  height: 47px;
  width: 30%;
  border-radius: 0px 2px 2px 0px;
  display: inline-block;
`;

const LeaveDiv = styled.div`
  margin: 20px 0px 10px;
  font-weight: 600;
  color: ${tabGrey};
  font-size: 13px;
`;

const TitleDiv = styled.div`
  font-weight: 400;
  color: ${tabGrey};
  font-size: 13px;
  display: flex;
  align-items: center;
`;

const FeedbackInput = styled(TextArea)`
  width: 100%;
  height: 160px;
  border: 0;
  border-radius: 2px;
  display: inline-block;
  background: #f8f8f8;
`;

const UpdateButton = styled(Button)`
  font-size: 11px;
  margin: 20px 0px 0px;
  width: 100%;
  height: 32px;
  font-weight: 600;
  color: ${themeColor};
  background-color: #ffffff;
  border: 1px solid ${themeColor};
  text-transform: uppercase;
  &:hover {
    color: #ffffff;
    background-color: ${themeColor};
    border-color: ${themeColor};
  }
`;

const UserAvatar = styled(Avatar)`
  background-color: ${themeColorTagsBg};
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  border-radius: 50%;
  color: ${themeColor};
  font-weight: 600;
  margin-right: 10px;
  font-size: 14px;
  text-transform: uppercase;
`;
