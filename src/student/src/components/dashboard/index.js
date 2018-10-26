import React from 'react';
import { translate, Trans } from 'react-i18next';
import { IconMenuOpenClose } from '@edulastic/icons';
import { connect } from 'react-redux';
// components
import styled from 'styled-components';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
// y capital bruh? v . change? and better names?
import { responsiveSideBar } from '../../actions/responsivetogglemenu';

class AppContainer extends React.Component {
  render() {
    const { responsiveSideBar: desktopSideBar } = this.props;
    // "hammerger"? :O
    return (
      <React.Fragment>
        <AssignmentHammerger>
          <IconMenu onClick={() => desktopSideBar()} />
          Assignments
        </AssignmentHammerger>
        <Sidebar />
        <MainContent />
      </React.Fragment>
    );
  }
}

export default connect(
  ({ ui }) => ({ sidebar: ui.sidebar }),
  { responsiveSideBar }
)(AppContainer);

// export default translate('common')(AppContainer);

const AssignmentHammerger = styled.div`
   {
    padding: 1.7rem 2rem;
    background: #0eb08d;
    color: #fff;
    font-weight: 700;
    font-size: 1.5rem;
    @media (min-width: 1200px) {
      display: none;
    }
  }
`;

const IconMenu = styled(IconMenuOpenClose)`
  fill: #fff;
  margin-right: 2rem;
  width: 20px !important;
  height: 20px !important;
  cursor: pointer;
  &:hover {
    fill: #fff;
  }
`;

IconMenuOpenClose;
