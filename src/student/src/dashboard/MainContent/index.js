import React from 'react';
import Header from './header';
import AssignmentsContent from './content';
import MainContainer from '../common/mainContainer';

class MainContent extends React.Component {
  render() {
    return (
      <MainContainer>
        <Header />
        <AssignmentsContent />
      </MainContainer>
    );
  }
}

export default MainContent;
