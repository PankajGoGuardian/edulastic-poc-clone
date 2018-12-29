import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AssignmentsContent from '../../commonStyle/assignmentContent';
import AssignmentContentWrapper from '../../commonStyle/assignmentContentWrapper';

const ReportListContent = ({ flag, testActivityId }) => (
  <AssignmentsContent flag={flag}>
    <AssignmentContentWrapper>
      <Wrapper>
        <Content>
          <Header>
            <Title>MATH MCAS-CALCULATOR{testActivityId}</Title>
            <BackBtn>BACK TO REPORT LIST</BackBtn>
          </Header>
          <ReportListWrapper>
            <div style={{ width: '70%' }}>
              <QuestionWrapper>
                <Question>ahsfdhfsd ashgdjshdshgs</Question>
              </QuestionWrapper>
              <SolutionWrapper>
                <FeedbackText>Solution</FeedbackText>
                <AnswerText>Answer: </AnswerText>
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
                <FeedbackText>Teacher Feedback</FeedbackText>
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

export default React.memo(ReportListContent);

ReportListContent.propTypes = {
  flag: PropTypes.bool.isRequired
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
  color: #12a6e8;
  font-weight: 600;
  font-size: 16px;
`;

const BackBtn = styled.div`
  color: #00b0ff;
  border: 1px solid #00b0ff;
  padding: 0.4rem 1.4rem;
  font-size: 0.7rem;
  cursor: pointer;
`;

const QuestionWrapper = styled.div``;

const Question = styled.div`
  border: 0.1rem solid #e61e54;
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
  font-size: 1.5rem;
  text-align: center;
  color: #434b5d;
`;
const Score = styled(Total)`
  border-bottom: 0.2rem solid #434b5d;
`;
const Feedback = styled.div``;

const ScoreWrapper = styled.div``;
const FeedbackText = styled.div`
  color: #444444;
  font-weight: 700;
  font-size: 0.8rem;
  padding-bottom: 1rem;
`;
const FeedbackGiven = styled.div`
  padding: 0.5rem 1rem 1rem 1rem;
  color: #878282;
  font-size: 0.8rem;
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
  color: #444444;
`;
