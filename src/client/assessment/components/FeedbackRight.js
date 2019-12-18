import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { get, isUndefined, toNumber, round, maxBy, sumBy, isEqual } from "lodash";
import { Avatar, Card, Button, Input, InputNumber, message } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import PreviewRubricModal from "../../author/GradingRubric/Components/common/PreviewRubricModal";

import { withWindowSizes, AnswerContext } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import {
  mobileWidthMax,
  desktopWidth,
  mediumDesktopWidth,
  themeColor,
  themeColorTagsBg,
  tabGrey,
  white
} from "@edulastic/colors";

import { getUserSelector } from "../../author/src/selectors/user";
import { receiveFeedbackResponseAction } from "../../author/src/actions/classBoard";
import { updateStudentQuestionActivityScoreAction } from "../../author/sharedDucks/classResponses";
import { getFeedbackResponseSelector, getStatus, getErrorResponse } from "../../author/src/selectors/feedback";
import { setTeacherEditedScore } from "../../author/ExpressGrader/ducks";

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

    let { score, maxScore } = props?.widget?.activity || {};

    if (!maxScore) {
      maxScore = props?.widget?.validation?.validResponse?.score || 0;
    }

    this.state = { score, maxScore, showPreviewRubric: false };

    this.scoreInput = React.createRef();
  }
  static contextType = AnswerContext;

  componentDidMount() {
    if (this.context?.expressGrader === true) {
      this.scoreInput?.current?.focus();
    }
  }

  static getDerivedStateFromProps(
    {
      widget: { activity, validation }
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
      let { score: _score, maxScore: _maxScore } = activity;
      const _feedback = get(activity, "feedback.text", "");
      newState = { ...newState, score: _score };

      if (!_maxScore) {
        _maxScore = validation?.validResponse?.score || 0;
      }

      if (_maxScore !== maxScore) {
        newState = { ...newState, maxScore: _maxScore };
      }

      if (_feedback !== feedback) {
        newState = { ...newState, feedback: _feedback };
      }
      return newState;
    }

    return newState;
  }

  onScoreSubmit(rubricResponse) {
    const { score, maxScore } = this.state;
    const { currentScreen } = this.context;
    const {
      user,
      updateQuestionActivityScore,
      widget: { id, activity = {} },
      studentId
    } = this.props;

    if (!score || isNaN(score)) {
      message.warn("Score should be a valid numerical");
      return;
    }
    const _score = toNumber(score);
    if (_score > maxScore) {
      message.warn("Score given should be less than or equal to maximum score");
      return;
    }

    const { testActivityId, groupId = this.props?.match?.params?.classId, testItemId } = activity;
    if (!id || !user || !user.user || !testActivityId) {
      return;
    }

    this.props.setTeacherEditedScore({ [id]: _score });

    const payload = {
      score: rubricResponse ? rubricResponse : { score: _score },
      testActivityId,
      questionId: id,
      itemId: testItemId,
      groupId,
      studentId
    };

    if (currentScreen === "live_class_board") {
      payload.shouldReceiveStudentResponse = true;
    }

    updateQuestionActivityScore(payload);
  }

  onFeedbackSubmit() {
    const { feedback } = this.state;
    const {
      user,
      studentId,
      loadFeedbackResponses,
      widget: { id, activity = {} },
      match
    } = this.props;
    const { testActivityId, groupId = match?.params?.classId, testItemId } = activity;
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
    if (!window.isNaN(value) || value === ".") {
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
    /**
     * arrow keys or escape key
     */
    if (this.context?.expressGrader && this.context?.studentResponseLoading) {
      return;
    }
    if ((keyCode >= 37 && keyCode <= 40) || keyCode === 27) {
      this.preCheckSubmit();
      this.submitScore();
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

  handleRubricAction = async () => {
    const { rubricDetails } = this.props;
    if (rubricDetails) this.setState({ showPreviewRubric: true });
  };

  handleRubricResponse = res => {
    const {
      widget: {
        activity: { rubricFeedback, score }
      }
    } = this.props;
    this.setState({ showPreviewRubric: false });
    if ((res && !isEqual(res.rubricFeedback, rubricFeedback)) || score !== res.score)
      this.setState({ score: res.score }, this.onScoreSubmit(res));
  };

  render() {
    const {
      studentName,
      widget: { activity },
      isPresentationMode,
      color,
      icon,
      twoColLayout,
      showCollapseBtn,
      rubricDetails,
      user
    } = this.props;
    const { score, maxScore, feedback, submitted, showPreviewRubric } = this.state;
    let rubricMaxScore = 0;
    if (rubricDetails) rubricMaxScore = sumBy(rubricDetails.criteria, c => maxBy(c.ratings, "points").points);
    const { rubricFeedback } = activity || {};
    const isError = rubricDetails ? rubricMaxScore < score : maxScore < score;
    const isStudentName = studentName !== undefined && studentName.length !== 0;
    let title;
    const showGradingRubricButton = user.user?.features?.gradingrubrics && !!rubricDetails;

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
                activity &&
                activity.graded === false &&
                activity.score === 0 &&
                !score &&
                !this.state.changed &&
                !activity.skipped
                  ? ""
                  : adaptiveRound(score || 0)
              }
              disabled={isPresentationMode}
              ref={this.scoreInput}
              onKeyDown={this.arrowKeyHandler}
              pattern="[0-9]+([\.,][0-9]+)?"
            />
            <TextPara>{rubricMaxScore || maxScore}</TextPara>
          </ScoreInputWrapper>
        </StyledDivSec>
        {showGradingRubricButton && (
          <RubricsWrapper>
            <RubricsButton onClick={() => this.handleRubricAction()}>Grading Rubric</RubricsButton>
          </RubricsWrapper>
        )}
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

        {showPreviewRubric && (
          <PreviewRubricModal
            visible={showPreviewRubric}
            currentRubricData={rubricDetails}
            toggleModal={this.handleRubricResponse}
            maxScore={rubricMaxScore}
            rubricFeedback={rubricFeedback}
          />
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
      updateQuestionActivityScore: updateStudentQuestionActivityScoreAction,
      setTeacherEditedScore
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
  max-width: 250px;
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
    width: ${({ twoColLayout, showCollapseBtn }) => (showCollapseBtn ? "auto" : twoColLayout?.second || "250px")};
    min-width: 250px;
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

const RubricsWrapper = styled.div`
  margin-top: 15px;
`;

const RubricsButton = styled.span`
  display: block;
  text-align: center;
  padding: 10px;
  color: ${white};
  background: ${themeColor};
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.semiBold};
`;
