import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { Row, Col, Button } from "antd";
import { withRouter } from "react-router-dom";
import { get, isEmpty } from "lodash";
import { themes } from "../../themes";

import Confirmation from "./Confirmation";
import { attemptSummarySelector } from "../ducks";
import { getAssignmentsSelector } from "../../Assignments/ducks";
import { receiveTestActivitydAction } from "../../../author/src/actions/classBoard";

class SummaryTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonIdx: null,
      isShowConfirmationModal: false
    };
  }

  componentDidMount() {
    const {
      loadTestActivity,
      assignments,
      test: { testId }
    } = this.props;
    if (!testId || isEmpty(assignments)) return;
    const [assignment] = assignments.filter(item => item.testId === testId);

    loadTestActivity(assignment._id, assignment.class[0]._id);
  }

  handlerButton = buttonIdx => {
    this.setState({ buttonIdx });
  };

  handlerConfirmationModal = () => {
    this.setState(prevState => ({
      isShowConfirmationModal: !prevState.isShowConfirmationModal
    }));
  };

  closeConfirmationModal = () => {
    this.setState({ isShowConfirmationModal: false });
  };

  goToQuestion = (testId, testActivityId, q) => () => {
    const { history, assignments, items, assignmentId } = this.props;

    const [assignmentItem] = assignments.filter(item => item._id === assignmentId);
    const targetItemIndex = items.reduce((acc, item, index) => {
      if (item.data.questions.some(({ id }) => id === q)) acc = index;
      return acc;
    }, null);

    history.push(`/student/${assignmentItem.testType}/${testId}/uta/${testActivityId}/qid/${targetItemIndex}`);
  };

  render() {
    const { questionList, t, test } = this.props;
    const questions = Object.keys(questionList);
    const { finishTest } = this.props;
    const { buttonIdx, isShowConfirmationModal } = this.state;
    return (
      <ThemeProvider theme={themes.default}>
        <AssignmentContentWrapperSummary>
          <Confirmation
            isVisible={isShowConfirmationModal}
            onClose={this.closeConfirmationModal}
            finishTest={finishTest}
          />
          <Container>
            <Header>
              <Title>{t("common.headingText")}</Title>
              <TitleDescription>{t("common.message")}</TitleDescription>
            </Header>
            <MainContent>
              <ColorDescription>
                <ColorDescriptionRow gutter={32}>
                  <FlexCol lg={8} md={24}>
                    <MarkedAnswered />
                    <SpaceLeft>
                      <Description>{t("common.markedQuestionLineOne")}</Description>
                    </SpaceLeft>
                  </FlexCol>
                  <FlexCol lg={8} md={24}>
                    <MarkedSkipped />
                    <SpaceLeft>
                      <Description>{t("common.skippedQues")}</Description>
                    </SpaceLeft>
                  </FlexCol>
                  <FlexCol lg={8} md={24}>
                    <MarkedForReview />
                    <SpaceLeft>
                      <Description>{t("common.markedForReview")}</Description>
                      <Description style={{ marginTop: -2 }}>{t("common.markedQuestionLineTwo")}</Description>
                    </SpaceLeft>
                  </FlexCol>
                </ColorDescriptionRow>
              </ColorDescription>
              <Questions>
                <Row>
                  <QuestionText lg={8} md={24}>
                    {t("common.questionsLabel")}
                  </QuestionText>
                  <Col lg={16} md={24}>
                    <AnsweredTypeButtonContainer>
                      <StyledButton onClick={() => this.handlerButton(null)} enabled={buttonIdx === null}>
                        {t("default:all")}
                      </StyledButton>
                      <StyledButton onClick={() => this.handlerButton(2)} enabled={buttonIdx === 2}>
                        {t("default:bookmarked")}
                      </StyledButton>
                      <StyledButton onClick={() => this.handlerButton(0)} enabled={buttonIdx === 0}>
                        {t("default:skipped")}
                      </StyledButton>
                    </AnsweredTypeButtonContainer>
                  </Col>
                </Row>
                <QuestionBlock>
                  {questions.map((q, index) => (
                    <QuestionColorBlock
                      type={questionList[q]}
                      isVisible={buttonIdx === null || buttonIdx === questionList[q]}
                      onClick={this.goToQuestion(test.testId, test.testActivityId, q)}
                    >
                      <span> {index + 1} </span>
                    </QuestionColorBlock>
                  ))}
                </QuestionBlock>
              </Questions>
            </MainContent>
            <Footer>
              <ShortDescription>{t("common.nextStep")}</ShortDescription>
              <SubmitButton type="primary" onClick={this.handlerConfirmationModal}>
                {t("default:submit")}
              </SubmitButton>
            </Footer>
          </Container>
        </AssignmentContentWrapperSummary>
      </ThemeProvider>
    );
  }
}

SummaryTest.propTypes = {
  finishTest: PropTypes.func.isRequired,
  questionList: PropTypes.array,
  assignments: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loadTestActivity: PropTypes.func.isRequired,
  assignmentId: PropTypes.string,
  classId: PropTypes.string,
  test: PropTypes.object
};

SummaryTest.defaultProps = {
  questionList: []
};

const enhance = compose(
  withNamespaces(["summary", "default"]),
  withRouter,
  connect(
    state => ({
      questionList: attemptSummarySelector(state),
      assignments: getAssignmentsSelector(state),
      test: state.test,
      items: state.test.items,
      assignmentId: get(state, "author_classboard_testActivity.assignmentId", ""),
      classId: get(state, "author_classboard_testActivity.classId", "")
    }),
    {
      loadTestActivity: receiveTestActivitydAction
    }
  )
);

export default enhance(SummaryTest);

const AssignmentContentWrapper = styled.div`
  border-radius: 10px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  padding: 5px 30px;
  background: ${props => props.theme.assignment.cardContainerBgColor};
  margin-bottom: 1rem;
  @media screen and (max-width: 767px) {
    padding: 0px 15px;
  }
`;

const AssignmentContentWrapperSummary = styled(AssignmentContentWrapper)`
  margin: 24px 95px;
  @media screen and (max-width: 992px) {
    margin: 15px 26px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled(Container)`
  max-width: 531px;
  margin-top: 52px;
  @media screen and (max-width: 768px) {
    margin-top: 20px;
  }
`;

const Title = styled.div`
  font-size: ${props => props.theme.attemptReview.headingTextSize};
  color: ${props => props.theme.attemptReview.headingColor};
  font-weight: bold;
  letter-spacing: -1px;
  text-align: center;
`;

const TitleDescription = styled.div`
  font-size: ${props => props.theme.attemptReview.titleDescriptionTextSize};
  color: ${props => props.theme.attemptReview.titleDescriptionTextColor};
  margin-top: 13px;
  font-weight: 600;
  text-align: center;
`;

const MainContent = styled.div`
  margin-top: 22.5px;
  width: 100%;
  border-top: 1px solid #f2f2f2;
  padding-top: 38px;
  @media screen and (max-width: 768px) {
    padding-top: 20px;
  }
`;

const ColorDescription = styled.div`
  display: flex;
  justify-content: center;
`;

const Markers = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 2px;
  flex-shrink: 0;
`;
const MarkedAnswered = styled(Markers)`
  background-color: ${props => props.theme.attemptReview.markedAnswerBoxColor};
`;

const MarkedSkipped = styled(Markers)`
  background-color: ${props => props.theme.attemptReview.markedSkippedBoxColor};
`;

const MarkedForReview = styled(Markers)`
  background-color: ${props => props.theme.attemptReview.markedForReviewBoxColor};
`;

const Description = styled.div`
  font-size: ${props => props.theme.attemptReview.descriptionTextSize};
  color: ${props => props.theme.attemptReview.descriptionTextColor};
  font-weight: 600;
`;

const ColorDescriptionRow = styled(Row)`
  width: 100%;
`;

const FlexCol = styled(Col)`
  display: flex;
  align-items: center;
`;

const SpaceLeft = styled.div`
  margin-left: 22px;
`;

const Questions = styled.div`
  margin-top: 60px;
  @media screen and (max-width: 768px) {
    margin-top: 20px;
  }
`;

const QuestionText = styled(Col)`
  font-size: ${props => props.theme.attemptReview.questiontextSize};
  color: ${props => props.theme.attemptReview.questiontextColor};
  font-weight: bold;
`;

const AnsweredTypeButtonContainer = styled.div`
  @media screen and (min-width: 992px) {
    float: right;
    padding-left: 20px;
  }
  @media screen and (max-width: 768px) {
    display: flex;
    justify-content: center;
    padding-left: 10px;
  }
`;

const StyledButton = styled(Button)`
  height: 24px;
  float: left;
  color: ${props => (props.enabled ? props.theme.filterButtonActiveColor : props.theme.filterButtonColor)};
  background: ${props => (props.enabled ? props.theme.filterButtonBgActiveColor : props.theme.filterButtonBgColor)};
  border: 1px solid ${props => props.theme.filterButtonBorderColor};
  border-radius: 4px;
  margin-right: 20px;
  min-width: 85px;
  &:focus,
  &:active,
  &:hover {
    color: ${props => (props.enabled ? props.theme.filterButtonActiveColor : props.theme.filterButtonColor)};
    background: ${props => (props.enabled ? props.theme.filterButtonBgActiveColor : props.theme.filterButtonBgColor)};
    border-color: ${props => props.theme.filterButtonBorderActiveColor};
  }
  span {
    font-size: 10px;
    font-weight: 600;
  }
  @media screen and (max-width: 992px) {
    margin-top: 20px;
  }
  @media screen and (max-width: 768px) {
    margin-right: 10px;
  }
`;

const QuestionBlock = styled.div`
  display: flex;
  flex-flow: wrap;
  margin-top: 30px;
  @media screen and (max-width: 768px) {
    margin-top: 20px;
    justify-content: center;
    padding-left: 20px;
  }
`;

const QuestionColorBlock = styled.div`
  width: 60px;
  height: 40px;
  border-radius: 4px;
  background-color: ${props =>
    props.type === 2
      ? props.theme.attemptReview.markedForReviewBoxColor
      : props.type === 1
      ? props.theme.attemptReview.markedAnswerBoxColor
      : props.theme.attemptReview.markedSkippedBoxColor};
  margin-right: 23px;
  display: ${props => (props.isVisible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  cursor: pointer;
  &:hover {
    box-shadow: 4px 6px 11px 0px rgba(0, 0, 0, 0.2);
  }

  span {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.3px;
  }
  @media screen and (max-width: 768px) {
    margin-right: 20px;
  }
`;

const Footer = styled(Container)`
  margin-top: 186px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 768px) {
    margin-top: 20px;
    text-align: center;
  }
`;

const ShortDescription = styled.div`
  font-size: 12px;
  color: #1e1e1e;
`;

const SubmitButton = styled(Button)`
  margin: 62px 0px;
  width: 200px;
  height: 40px;
  border-radius: 4px;
  background-color: ${props => props.theme.attemptReview.submitButtonBgColor};
  border-color: ${props => props.theme.attemptReview.submitButtonBgColor};
  span {
    font-size: ${props => props.theme.attemptReview.submitButtonTextSize};
    color: ${props => props.theme.attemptReview.submitButtonTextColor};
    font-weight: 600;
    letter-spacing: 0.2px;
  }
  &:hover,
  &:focus {
    border-color: ${props => props.theme.attemptReview.submitButtonBgColor};
    background-color: ${props => props.theme.attemptReview.submitButtonBgColor};
  }
  @media screen and (max-width: 768px) {
    margin: 20px 0px;
  }
`;
