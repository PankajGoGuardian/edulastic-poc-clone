import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Header from './header';
import AssignmentsContent from './content';

const MainContent = ({ flag }) => (
  <MainContainer flag={flag}>
    <Header flag={flag} />
    <AssignmentsContent />
  </MainContainer>
);

export default React.memo(
  connect(({ ui }) => ({
    flag: ui.flag,
  }))(MainContent),
);

MainContent.propTypes = {
  flag: PropTypes.bool.isRequired,
};

const MainContainer = styled.div`
  width: 100%;
  @media (min-width: 1200px) {
    display: flex;
    flex-direction: column;
    padding-left: 4.6rem;
    padding-right: 4.6rem;
  }
  @media (min-width: 1200px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;
