import React from 'react';
import { IconMenuOpenClose } from '@edulastic/icons';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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

AppContainer.propTypes = {
  responsiveSideBar: PropTypes.any.isRequired,
};

export default connect(
  ({ ui }) => ({ sidebar: ui.sidebar }),
  { responsiveSideBar },
)(AppContainer);

// export default translate('common')(AppContainer);

const AssignmentHammerger = styled.div`
  padding: 1.7rem 2rem;
  background: #0eb08d;
  color: #fff;
  font-weight: 700;
  font-size: 1.5rem;
  @media (min-width: 1200px) {
    display: none;
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
