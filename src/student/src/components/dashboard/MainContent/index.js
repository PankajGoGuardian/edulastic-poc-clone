import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Header from './header';
import AssignmentsContent from './content';
// import MainContainer from '../common/mainContainer';
const MainContent = ({ flag }) => (
  <MainContainer flag={flag}>
    <Header flag={flag} />
    <AssignmentsContent />
  </MainContainer>
);

export default connect(({ ui }) => ({
  flag: ui.flag
}))(MainContent);

const MainContainer = styled.div`
  @media (min-width: 1200px) {
    display: flex;
    flex-direction: column;
    margin-left: ${props => (props.flag ? '7rem' : '16.5rem')};
    padding-left: 4.6rem;
    padding-right: 4.6rem;
  }
  @media (min-width: 1200px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;
