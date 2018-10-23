import React from 'react';
import { translate, Trans } from 'react-i18next';
// components
import styled from 'styled-components';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

class AppContainer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <AssignmentHammburger>Assignments</AssignmentHammburger>
        <Sidebar />
        <MainContent />
      </React.Fragment>
    );
  }
}

export default translate('common')(AppContainer);

const AssignmentHammburger = styled.div`
  padding: 2rem;
  background: #0eb08d;
  color: #fff;
  font-weight: 700;
  font-size: 1.5rem;
  @media (min-width: 1200px) {
    display: none;
  }
`;
