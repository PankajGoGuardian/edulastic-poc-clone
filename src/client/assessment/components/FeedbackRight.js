import { desktopWidth, mobileWidthMax, tabGrey, themeColor, themeColorTagsBg, white } from "@edulastic/colors";
import { AnswerContext, withWindowSizes, notification, EduButton } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { Avatar, Card, Input } from "antd";
import { get, isEqual, isUndefined, maxBy, round, sumBy, toNumber } from "lodash";
import PropTypes from "prop-types";
import React, { Component, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import styled from "styled-components";
import { setTeacherEditedScore } from "../../author/ExpressGrader/ducks";
import PreviewRubricModal from "../../author/GradingRubric/Components/common/PreviewRubricModal";
import { updateStudentQuestionActivityScoreAction } from "../../author/sharedDucks/classResponses";
import { receiveFeedbackResponseAction } from "../../author/src/actions/classBoard";
import { getErrorResponse, getStatus } from "../../author/src/selectors/feedback";
import { getUserSelector, getUserThumbnail } from "../../author/src/selectors/user";
import { getAvatarName } from '../../author/ClassBoard/Transformer';

const { TextArea } = Input;

const adaptiveRound = x => (x && x.endsWith ? (x.endsWith(".") ? x : round(x, 2)) : round(x, 2));

function ScoreInputFocusEffectComponent({ scoreInputRef, responseLoading, feedbackInputHasFocus }) {
  useEffect(() => {
    if (scoreInputRef.current && !responseLoading && !feedbackInputHasFocus) {
      scoreInputRef.current.focus();
    }
  }, [responseLoading]);

  return null;
}

class FeedbackRight extends Component {
  constructor(props) {
    super(props);

    let { maxScore } = props?.widget?.activity || {};
    const { score } = props?.widget?.activity || {};

    if (!maxScore) {
      maxScore = props?.widget?.validation?.validResponse?.score || 0;
    }

    this.state = { score, maxScore, showPreviewRubric: false, showFeedbackSaveBtn: false, feedbackInputHasFocus: false };

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
    const { submitted, feedback, maxScore, changed } = preState || {};
    if (submitted) {
      newState = {
        submitted: false,
        changed: false
      };
    }

    if (activity && isUndefined(changed)) {
      const { score: _score } = activity;
      let { maxScore: _maxScore } = activity;
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

  getTestActivityId() {
    const { studentId, classBoardData } = this.props;
    const testActivity = classBoardData?.testActivities?.find(x => x?.userId === studentId) || {};
    return testActivity._id;
  }

  onScoreSubmit(rubricResponse) {
    const { score, maxScore } = this.state;
    const { currentScreen } = this.context;
    const {
      user,
      updateQuestionActivityScore,
      widget: { id, activity = {} },
      studentId,
      itemId,
      allAnswers = {}
    } = this.props;

    if ((!score || isNaN(score)) && score != 0) {
      notification({ type: "warn", messageKey: "scoreShouldNumber" });
      return;
    }
    const _score = toNumber(score);
    if (_score > maxScore) {
      notification({ type: "warn", messageKey: "scoreShouldLess" });
      return;
    }

    const { testActivityId, groupId = this.props?.match?.params?.classId, testItemId } = activity;

    if (!id || !user || !user.user) {
      return;
    }

    this.props.setTeacherEditedScore({ [id]: rubricResponse ? rubricResponse.score : _score });

    const payload = {
      score: rubricResponse || { score: _score },
      testActivityId: testActivityId || this.getTestActivityId(),
      questionId: id,
      itemId: testItemId || itemId,
      groupId,
      studentId
    };

    if (currentScreen === "live_class_board") {
      payload.shouldReceiveStudentResponse = true;
    }

    if (payload.testActivityId && payload.itemId) {
      if (allAnswers[id]) {
        payload.userResponse = { [id]: allAnswers[id] };
      }
      updateQuestionActivityScore(payload);
    }
  }

  onFeedbackSubmit() {
    const { feedback } = this.state;
    const {
      user,
      studentId,
      loadFeedbackResponses,
      widget: { id, activity = {} },
      match,
      userThumbnail
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
          text: feedback,
          ...(userThumbnail ? { thumbnail: userThumbnail } : {})
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
    this.setState({ showFeedbackSaveBtn: false });
  };

  submitScore = () => {
    const { changed } = this.state;
    if (changed) {
      this.setState({ submitted: true }, this.onScoreSubmit);
    }
  };

  onChangeScore = e => {
    const value = e.target.value;
    if (!isNaN(value) || value === ".") {
      this.setState({ score: value, changed: true });
    }
  };

  onChangeFeedback = e => {
    this.setState({ feedback: e.target.value, changed: true });
  };

  onKeyDownFeedback = e => {
    this.arrowKeyHandler(e);
    this.setState({ showFeedbackSaveBtn: true })
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
    if (res && this.state.score != res.score) {
      this.setState({ score: res.score || 0, changed: true });
    }
  };

  handleRubricModal = res => {
    const {
      widget: {
        activity: { rubricFeedback, score }
      }
    } = this.props;
    this.setState({ showPreviewRubric: false });
    if (res && (!isEqual(res.rubricFeedback, rubricFeedback) || score !== res.score))
      this.setState({ score: res.score }, () => {
        this.onScoreSubmit(res);
      });
  };

  focusFeedbackInput = () => this.setState({ feedbackInputHasFocus: true });

  blurFeedbackInput = () => this.setState({ feedbackInputHasFocus: false });

  render() {
    const {
      studentName,
      widget: { activity },
      isPresentationMode,
      color,
      icon,
      showCollapseBtn,
      rubricDetails,
      user,
      disabled,
      isPracticeQuestion
    } = this.props;
    const { score, maxScore, feedback, showPreviewRubric, changed, showFeedbackSaveBtn, feedbackInputHasFocus } = this.state;
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
            <UserAvatar>{getAvatarName(studentName)}</UserAvatar>
            )}
          &nbsp;
          {studentName}
        </TitleDiv>
      );
    } else {
      title = null;
    }

    let _score = adaptiveRound(score || 0);
    if (
      isPracticeQuestion ||
      (activity &&
        activity.graded === false &&
        (activity.score === 0 || isUndefined(activity.score)) &&
        !score &&
        !changed &&
        !activity.skipped)
    ) {
      _score = "";
    }

    let _maxScore = rubricMaxScore || maxScore;
    if (isPracticeQuestion) {
      _maxScore = "";
    }

    const { studentResponseLoading, expressGrader } = this.context;
    return (
      <StyledCardTwo bordered={isStudentName} disabled={disabled} showCollapseBtn={showCollapseBtn} title={title}>
        {expressGrader && (
          <ScoreInputFocusEffectComponent
            scoreInputRef={this.scoreInput}
            feedbackInputHasFocus={feedbackInputHasFocus}
            responseLoading={studentResponseLoading}
          />
        )}
        <StyledDivSec>
          <ScoreInputWrapper>
            <ScoreInput
              data-cy="scoreInput"
              onChange={this.onChangeScore}
              onBlur={this.submitScore}
              value={_score}
              disabled={isPresentationMode || isPracticeQuestion || studentResponseLoading}
              ref={this.scoreInput}
              onKeyDown={this.arrowKeyHandler}
              pattern="[0-9]+([\.,][0-9]+)?"
              tabIndex={0}
            />
            <TextPara>{_maxScore}</TextPara>
          </ScoreInputWrapper>
        </StyledDivSec>
        {showGradingRubricButton && (
          <RubricsWrapper>
            <RubricsButton onClick={() => this.handleRubricAction()}>Grading Rubric</RubricsButton>
          </RubricsWrapper>
        )}
        <LeaveDiv>
          <span>{isError ? "Score is too large" : "Student Feedback!"}</span>
          {showFeedbackSaveBtn && <EduButton height="32px" onClick={this.preCheckSubmit}>Save</EduButton>}
        </LeaveDiv>
        {!isError && (
          <Fragment>
            <FeedbackInput
              tabIndex={0}
              data-cy="feedBackInput"
              onChange={this.onChangeFeedback}
              value={feedback}
              onFocus={this.focusFeedbackInput}
              onBlur={this.blurFeedbackInput}
              disabled={!activity || isPresentationMode}
              onKeyDown={this.onKeyDownFeedback}
              autoSize
            />
          </Fragment>
        )}

        {showPreviewRubric && (
          <PreviewRubricModal
            visible={showPreviewRubric}
            currentRubricData={rubricDetails}
            onRubricResponseUpdate={this.handleRubricResponse}
            toggleModal={this.handleRubricModal}
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
      errorMessage: getErrorResponse(state),
      classBoardData: state.author_classboard_testActivity?.data,
      allAnswers: state?.answers,
      userThumbnail: getUserThumbnail(state)
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
  border: 1px solid #dadae4;
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
    position: relative;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
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
  margin: 0px auto;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
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
  border: 0;
  border-radius: 2px;
  display: inline-block;
  background: #f8f8f8;
  min-height: 80px !important;
  max-height: 100% !important;
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
