import React from 'react';
import { connect } from 'react-redux';
import MainContent from './MainContent';
import { responsiveSideBar } from '../../actions/responsivetogglemenu';

const AppContainer = () => (
  <React.Fragment>
    <MainContent />
  </React.Fragment>
);

export default React.memo(
  connect(
    ({ ui }) => ({ sidebar: ui.sidebar }),
    { responsiveSideBar },
  )(AppContainer),
);
