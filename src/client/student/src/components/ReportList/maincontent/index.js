import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import AssignmentsContent from '../../commonStyle/assignmentContent';
import AssignmentContentWrapper from '../../commonStyle/assignmentContentWrapper';

const ReportListContent = ({ flag, testActivityId, t }) => (
  <AssignmentsContent flag={flag}>
    <AssignmentContentWrapper>
      <Wrapper>
        <Content>
          <Header>
            <Title>MATH MCAS-CALCULATOR{testActivityId}</Title>
            <BackBtn>{t('common.backButton')}</BackBtn>
          </Header>
          <ReportListWrapper>
            <div style={{ width: '70%' }}>
              <QuestionWrapper>
                <Question>ahsfdhfsd ashgdjshdshgs</Question>
              </QuestionWrapper>
              <SolutionWrapper>
                <FeedbackText>{t('common.solutionLabel')}</FeedbackText>
                <AnswerText>{t('common.answerLabel')}: </AnswerText>
                <Answer>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  commodo nec est sed placerat. Donec accumsan mauris sem, eu
                  sollicitudin nulla pharetra nec. Quisque vel nunc quis nunc
                  rhoncus feugiat dapibus eu nisi. Phasellus maximus orci nunc.
                  Integer feugiat odio vitae auctor placerat. Mauris lobortis
                  tortor sed felis convallis mattis. Nulla facilisi. Donec
                  cursus ultricies fringilla.
                </Answer>
              </SolutionWrapper>
              <QuestionWrapper>
                <Question>ahsfdhfsd</Question>
              </QuestionWrapper>
            </div>
            <FeedbackWrapper>
              <ScoreWrapper>
                <Score>0</Score>
                <Total>2</Total>
              </ScoreWrapper>
              <Feedback>
                <FeedbackText>{t('common.teacherFeedbackLabel')}</FeedbackText>
                <hr />
                <FeedbackGiven>shgfg</FeedbackGiven>
              </Feedback>
            </FeedbackWrapper>
          </ReportListWrapper>
        </Content>
      </Wrapper>
    </AssignmentContentWrapper>
  </AssignmentsContent>
);

const enhance = compose(
  withNamespaces('reports'),
  React.memo
);

export default enhance(ReportListContent);

ReportListContent.propTypes = {
  flag: PropTypes.bool.isRequired,
  testActivityId: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

const Wrapper = styled.div`
  padding: 1rem 0rem;
`;

const Content = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0rem;
  border-bottom: 0.05rem solid #f2f2f2;
`;

const Title = styled.div`
  color: ${props => props.theme.reportList.reportListTitleColor};
  font-weight: 600;
  font-size: ${props => props.theme.reportList.reportListTitleTextSize};
`;

const BackBtn = styled.div`
  background: ${props => props.theme.reportList.reportListBackButtonBgColor};
  color: ${props => props.theme.reportList.reportListBackButtonTextColor};
  border: 1px solid ${props => props.theme.reportList.reportListBackButtonBgBorderColor};
  padding: 0.4rem 1.4rem;
  font-size: ${props => props.theme.reportList.reportListBackButtonTextSize};
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.reportList.reportListBackButtonBgHoverColor};
    color: ${props => props.theme.reportList.reportListBackButtonTextHoverColor};
    border: 1px solid ${props => props.theme.reportList.reportListBackButtonBgBorderHoverColor};
  }
`;

const QuestionWrapper = styled.div``;

const Question = styled.div`
  border: 0.1rem solid ${props => props.theme.reportList.reportListQuestionBorderColor};
  color: ${props => props.theme.reportList.reportListQuestionTextColor};
  font-size: ${props => props.theme.reportList.reportListQuestionTextSize};
  padding: 1rem;
  border-radius: 0.5rem;
  word-break: break-all;
`;

const FeedbackWrapper = styled.div`
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  padding: 0rem 1rem;
  width: 25%;
  border-radius: 0.5rem;
  max-height: 250px;
`;

const Total = styled.div`
  font-weight: 600;
  font-size: ${props => props.theme.reportList.reportListTotalScoreTextSize};
  text-align: center;
  color: ${props => props.theme.reportList.reportListTotalScoreTextColor};
`;
const Score = styled(Total)`
  border-bottom: 0.2rem solid ${props => props.theme.reportList.scoreBoxBorderBottomColor};
`;
const Feedback = styled.div``;

const ScoreWrapper = styled.div``;
const FeedbackText = styled.div`
  color: ${props => props.theme.reportList.teacherFeedbarLabelColor};
  font-weight: 700;
  font-size: ${props => props.theme.reportList.teacherFeedbarLabelFontSize};
  padding-bottom: 1rem;
`;
const FeedbackGiven = styled.div`
  padding: 0.5rem 1rem 1rem 1rem;
  color: ${props => props.theme.reportList.teacherFeedbarTextColor};
  font-size: ${props => props.theme.reportList.teacherFeedbarTextSize};
`;
const ReportListWrapper = styled.div`
  display: flex;
  padding: 1rem 0rem;
  justify-content: space-between;
`;

const SolutionWrapper = styled.div`
  padding: 1.5rem;
`;
const Answer = styled.span``;
const AnswerText = styled(Answer)`
  font-weight: 700;
  color: ${props => props.theme.reportList.reportListAnswerLabelColor};
  font-size: ${props => props.theme.reportList.reportListAnswerLabelFontSize};
`;
