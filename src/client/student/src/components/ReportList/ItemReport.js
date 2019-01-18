import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import QuestionWrapper from '../../../../assessment/src/components/QuestionWrapper';

const itemReport = ({ question, index }) => (
  <ReportListWrapper>
    <div style={{ width: '100%' }}>
      <QuestionWrapper
        testItem
        type={question.type}
        view="preview"
        data={question}
      />
      <FeedbackWrapper>
        <FeedbackText>
          <QuestionText>Q{index + 1}</QuestionText> - Teacher Feedback
        </FeedbackText>
        <FeedbackContainer>
          <ScoreWrapper>
            <Score>0</Score>
            <Total>2</Total>
          </ScoreWrapper>
          <Feedback>
            <FeedbackGiven>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ac ex magna.
              Etiam viverra dui tellus, vel auctor urna cursus eget. Donec tristique pharetra nisl at fringilla.
              Vivamus faucibus vitae tellus eget pellentesque. Praesent in turpis in ex sodales dignissim.
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
              Sed vel mauris tellus. Pellentesque eget vestibulum quam. Nullam ac tortor luctus,
              consequat velit sit amet, consequat ligula. Etiam dolor lacus, tristique ut tincidunt sed, ornare nec magna.
            </FeedbackGiven>
          </Feedback>
        </FeedbackContainer>
      </FeedbackWrapper>
      <SolutionWrapper>
        <FeedbackText>
          <QuestionText>Q{index + 1}</QuestionText> - Solution
        </FeedbackText>
        <Answer>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin commodo
          nec est sed placerat. Donec accumsan mauris sem, eu sollicitudin nulla
          pharetra nec. Quisque vel nunc quis nunc rhoncus feugiat dapibus eu
          nisi. Phasellus maximus orci nunc. Integer feugiat odio vitae auctor
          placerat. Mauris lobortis tortor sed felis convallis mattis. Nulla
          facilisi. Donec cursus ultricies fringilla.
        </Answer>
      </SolutionWrapper>
    </div>
  </ReportListWrapper>
);

itemReport.propTypes = {
  question: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

export default itemReport;

const FeedbackWrapper = styled.div`
  margin-top: 55px;
  width: 850px;
  border-radius: 0.5rem;
  max-height: 250px;
`;

const Total = styled.div`
  font-weight: 600;
  font-size: 30px;
  text-align: center;
  color: #434b5d;
`;

const Score = styled(Total)`
  border-bottom: 0.2rem solid #434b5d;
`;

const Feedback = styled.div`
  flex: 1;
`;

const ScoreWrapper = styled.div`
  width: 62px;
`;

const FeedbackContainer = styled.div`
  display: flex;
  margin-top: 14px;
  background: #f8f8f8;
  padding: 26px 21px;
`;

const FeedbackText = styled.div`
  color: #444444;
  font-weight: 700;
  font-size: 16px;
  padding-bottom: 1rem;
  padding-left: 11px;
  border-bottom: 0.05rem solid #f2f2f2;
`;

const QuestionText = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: #4aac8b;
`;

const FeedbackGiven = styled.div`
  line-height: 2.5;
  padding: 0px 0px 0px 28px;
  color: #878282;
  font-size: 0.8rem;
`;

const ReportListWrapper = styled.div`
  display: flex;
  padding: 1rem 0rem;
  justify-content: space-between;
`;

const SolutionWrapper = styled.div`
  width: 850px;
  margin-top: 50px;
`;

const Answer = styled.div`
  margin-top: 18px;
  margin-left: 20px;
  font-size: 14px;
  line-height: 1.86;
  color: #444444;
`;
