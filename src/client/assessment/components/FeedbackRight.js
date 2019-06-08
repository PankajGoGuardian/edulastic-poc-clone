import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { get, isUndefined, toNumber, isNaN } from "lodash";
import { Avatar, Card, Button, Input, InputNumber, message } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";

import { withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { mobileWidth } from "@edulastic/colors";

import { getUserSelector } from "../../author/src/selectors/user";
import { receiveFeedbackResponseAction } from "../../author/src/actions/classBoard";
import { getFeedbackResponseSelector, getStatus, getErrorResponse } from "../../author/src/selectors/feedback";

const { TextArea } = Input;

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
    this.state = {};
    this.scoreInput = React.createRef();
  }

  static getDerivedStateFromProps(
    {
      successFullMessage,
      waitingResponse,
      errorMessage,
      widget: { activity }
    },
    preState
  ) {
    let newState = {};
    const { submitted, feedback, score, maxScore, changed } = preState || {};

    if (!waitingResponse && successFullMessage && submitted) {
      const [type, content] = successFullMessage ? ["success", successFullMessage] : ["error", errorMessage];
      newState = showNotification(type, content);
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

  componentDidUpdate() {
    //this.focusScoreInput();
  }

  onFeedbackSubmit() {
    const { score, feedback, maxScore } = this.state;
    console.log("score", { score }, "isNan", isNaN(score));
    if (isNaN(score)) {
      message.warn("Score should be a valid numerical");
      return;
    }
    const _score = toNumber(score);
    if (_score > maxScore) {
      return;
    }

    const {
      user,
      loadFeedbackResponses,
      widget: { id, activity = {} }
    } = this.props;

    const { testActivityId, groupId } = activity;
    if (!id || !user || !user.user || !testActivityId) {
      return;
    }
    loadFeedbackResponses({
      body: {
        score: isNaN(_score) ? 0 : _score,
        feedback: {
          teacherId: user.user._id,
          teacherName: user.user.firstName,
          text: feedback
        },
        groupId
      },
      testActivityId,
      questionId: id
    });
  }

  preCheckSubmit = () => {
    const { changed } = this.state;
    if (changed) {
      this.setState({ submitted: true }, this.onFeedbackSubmit);
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
      widget: { activity }
    } = this.props;
    const { score, maxScore, feedback, submitted } = this.state;
    const isError = maxScore < score;
    const isStudentName = studentName !== undefined && studentName.length !== 0;
    let title;

    if (isStudentName) {
      title = (
        <TitleDiv data-cy="studentName" style={{ marginTop: 0, fontWeight: "bold" }}>
          <Avatar style={{ verticalAlign: "middle", background: "#E7F1FD", color: "#1774F0" }} size={34}>
            {studentName.charAt(0)}
          </Avatar>
          &nbsp;
          {studentName}
        </TitleDiv>
      );
    } else {
      title = null;
    }

    return (
      <StyledCardTwo bordered={isStudentName} disabled={this.props.disabled || !activity} title={title}>
        <StyledDivSec>
          <ScoreInputWrapper>
            <ScoreInput
              data-cy="scoreInput"
              onChange={this.onChangeScore}
              onBlur={this.preCheckSubmit}
              value={score}
              disabled={!activity}
              innerRef={this.scoreInput}
              onKeyDown={this.arrowKeyHandler}
              pattern="[0-9]+([\.,][0-9]+)?"
            />
            <TextPara>{maxScore}</TextPara>
          </ScoreInputWrapper>
        </StyledDivSec>
        <LeaveDiv>{isError ? "Score is to large" : "Leave a feedback!"}</LeaveDiv>
        {!isError && (
          <Fragment>
            <FeedbackInput
              onChange={this.onChangeFeedback}
              onBlur={this.preCheckSubmit}
              value={feedback}
              style={{ height: 240, flexGrow: 2 }}
              disabled={!activity}
              onKeyDown={this.onKeyDownFeedback}
            />
          </Fragment>
        )}
        <UpdateButton data-cy="updateButton" disabled={!activity || submitted} onClick={this.preCheckSubmit}>
          UPDATE
        </UpdateButton>
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
  match: PropTypes.object.isRequired
};

FeedbackRight.defaultProps = {
  studentName: ""
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces("header"),
  connect(
    state => ({
      user: getUserSelector(state),
      successFullMessage: getFeedbackResponseSelector(state),
      waitingResponse: getStatus(state),
      errorMessage: getErrorResponse(state)
    }),
    {
      loadFeedbackResponses: receiveFeedbackResponseAction
    }
  )
);
export default enhance(FeedbackRight);

const StyledCardTwo = styled(Card)`
  visibility: ${props => (props.disabled ? "hidden" : "visible")};
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin: 0px 0px 0px 15px;
  min-width: 250px;
  min-height: 100%;
  .ant-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
    .ant-input-disabled {
      padding: 4px 22px;
    }
  }
  @media (max-width: ${mobileWidth}) {
    margin-left: 0px;
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
  font-size: 32px;
  background-color: #ececec;
  font-weight: 600;
  height: 47px;
  width: 30%;
  border-radius: 0px 2px 2px 0px;
  display: inline-block;
`;

const LeaveDiv = styled.div`
  margin: 20px 0px;
  font-weight: 600;
  color: #7c848e;
  font-size: 13px;
`;

const TitleDiv = styled.div`
  font-weight: 600;
  color: #7c848e;
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
  color: #1774f0;
  background-color: #ffffff;
  border: 1px #1774f0 solid;
  text-transform: uppercase;
  &:hover {
    color: #ffffff;
    background-color: #1774f0;
  }
`;
