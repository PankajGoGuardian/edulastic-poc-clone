import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AssignmentContentWrapper from '../../styled/assignmentContentWrapper';
import ItemReport from './ItemReport';
import { getQuestionsSelector } from '../../sharedDucks/TestItem';

const ReportListContent = ({ questions, flag, title }) => {
  return (
    <AssignmentsContent flag={flag}>
      <AssignmentContentWrapper>
        <Wrapper>
          <Header>
            <Title>{title}</Title>
          </Header>
          {questions.map((question, index) => (
            <ItemReport key={index} question={question} index={index} />
          ))}
        </Wrapper>
      </AssignmentContentWrapper>
    </AssignmentsContent>
  );
};
export default connect(
  state => ({
    questions: getQuestionsSelector(state)
  }),
  null
)(ReportListContent);

ReportListContent.propTypes = {
  flag: PropTypes.bool.isRequired,
  questions: PropTypes.array,
  title: PropTypes.string
};

ReportListContent.defaultProps = {
  questions: [],
  title: 'Test'
};

const Wrapper = styled.div`
  padding: 1rem 0rem;
`;

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

const AssignmentsContent = styled.div`
  border-radius: 10px;
  z-index: 0;
  position: relative;
  @media (min-width: 1200px) {
    margin: 30px 30px;
  }
  @media (max-width: 1060px) {
    padding: 1.3rem 2rem 5rem 2rem;
  }
  @media (max-width: 480px) {
    padding: 1rem 1rem 0rem 1rem;
  }
`;
